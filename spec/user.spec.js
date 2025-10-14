const request = require("supertest");
const app = require("..");
const { clearDatabase } = require("../db.connection");

let testAgent = request(app);

describe("user routes", () => {
    beforeAll(async ()=>{
       await clearDatabase()
    })
  it("GET /user :should respond with [] , status =200", async () => {
    let res = await testAgent.get("/user");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
  it("POST /user/signup :should respond with the new user , status =201", async () => {
    let user = { name: "Heba", email: "heba@test.com", password: "1234" };
    let res = await testAgent.post("/user/signup").send(user);
    expect(res.status).toBe(201);
    expect(res.body.data.email).toEqual(user.email);
  });
  it("POST /user/login :should respond with token , status =200", async () => {
    let user = { name: "Heba", email: "heba@test.com", password: "1234" };
    let res = await testAgent.post("/user/login").send(user);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data).toBeInstanceOf(String);
  });

});
