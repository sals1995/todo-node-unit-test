const request = require("supertest");

const app = require("..");
const { clearDatabase } = require("../db.connection");

describe("todo routes:", () => {
  const testAgent = request(app);
  afterEach(async () => {
    await clearDatabase();
  });
  it("(GET /api/todo) should respond with todos=[]", async () => {
    let res = await testAgent.get("/api/todo");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveSize(0);
  });
  it("(POST /api/todo) with no auth should respond with 'login first'", async () => {
    let res = await testAgent.post("/api/todo").send({title:"eat breakfast"})
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/login first/i);
  });
  it("(POST /api/todo) should respond with the new todo", async () => {
     let newUser = { name: "ali", email: "ali@test.com", password: "123456" };
     await testAgent.post("/api/user/signup").send(newUser);
    let resLogin= await testAgent.post("/api/user/login").send(newUser);
    let token=resLogin.body.data

    let res = await testAgent.post("/api/todo").send({title:"eat breakfast"}).set({authorization:token})
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("eat breakfast");
  });
  
});
