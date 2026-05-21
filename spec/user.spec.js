const request = require("supertest");
const app = require("..");
const { clearDatabase } = require("../db.connection");

let testAgent = request(app);

describe("user routes", () => {
    afterEach(async()=>{
       await clearDatabase()
    })
  it("(Get /api/user) should respond with users=[]", async () => {
    let res = await testAgent.get("/api/user");

    expect(res.status).toEqual(200);
    expect(res.body.data).toHaveSize(0);
  });
  it("(Post /api/user/signup) should respond with users=[]", async () => {
    let newUser={name:"ALi",email:"ali@example.com",password:"12345"}
    let res = await testAgent.post("/api/user/signup").send(newUser)

    expect(res.status).toEqual(201);
    expect(res.body.data.email).toEqual(newUser.email);
  });
  it("(Post /api/user/signup) with duplicate email: should respond with 'email already exists'", async () => {
    let newUser={name:"ALi",email:"ali@example.com",password:"12345"}
    await testAgent.post("/api/user/signup").send(newUser)
    
    let res = await testAgent.post("/api/user/signup").send(newUser)

    expect(res.status).toEqual(400);
    expect(res.body.message).toMatch(/email is already exists/i);
  });
  it('(POST /api/user/login) should respond with token', async() => {
    let newUser={name:"ALi",email:"ali@example.com",password:"12345"}
    await testAgent.post("/api/user/signup").send(newUser)

    let res= await testAgent.post("/api/user/login").send(newUser)

    expect(res.status).toEqual(200)
    expect(res.body.data.split(".")).toHaveSize(3)
  });
});
