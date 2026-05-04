const request = require("supertest");

const app = require("..");
const { clearDatabase } = require("../db.connection");

describe("user routes:", () => {
  const testAgent = request(app);
  afterEach(async () => {
    await clearDatabase();
  });
  it("(GET /api/user) should respond with users=[]", async () => {
    let res = await testAgent.get("/api/user");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveSize(0);
  });
  it("(POST /api/user/signup) should respond with the new user", async () => {
    let newUser = { name: "ali", email: "ali@test.com", password: "123456" };
    let res = await testAgent.post("/api/user/signup").send(newUser);
    expect(res.status).toBe(201);
    expect(res.body.data.email).toEqual(newUser.email);
  });
  it('(POST /api/user/signup) with duplicate email should respond with "email already exists"', async () => {
    let newUser = { name: "ali", email: "ali@test.com", password: "123456" };
     await testAgent.post("/api/user/signup").send(newUser);

    let res = await testAgent.post("/api/user/signup").send(newUser);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/email is already exists/i);
  });
    it('(POST /api/user/login) should respond with token', async () => {

    let newUser = { name: "ali", email: "ali@test.com", password: "123456" };
     await testAgent.post("/api/user/signup").send(newUser);
     
    let res= await testAgent.post("/api/user/login").send(newUser);
        expect(res.status).toBe(200);
        expect(res.body.data.split(".")).toHaveSize(3)
  });
  it("(GET /api/user/id) should respond with the user", async () => {
    let newUser = { name: "ali", email: "ali@test.com", password: "123456" };
    let resUserInDB= await testAgent.post("/api/user/signup").send(newUser);
    let id=resUserInDB.body.data._id

    let res = await testAgent.get("/api/user/"+id);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(id);
    expect(res.body.data.email).toBe(resUserInDB.body.data.email);
  });

});
