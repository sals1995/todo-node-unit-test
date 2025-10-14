const request = require("supertest");
const app = require("..");
const { default: mongoose } = require("mongoose");

let testAgent = request(app);

describe("todo routes", () => {
    let token,id
    beforeAll(async()=>{
        let user = { name: "Ali", email: "Ali@test.com", password: "1234" };
        await testAgent.post("/user/signup").send(user);
        let res = await testAgent.post("/user/login").send(user);
       token= res.body.data
    })
  it("GET /todo :should respond with [] , status =200", async () => {
    let res = await testAgent.get("/todo");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
 
  it("POST /todo (without token) :should respond with msg, status =401", async () => {
      let res = await testAgent.post("/todo").send({title:"eat breakfast"});
      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/login first/i);
    });
    it("POST /todo (with token) :should respond with the new todo, status =201", async () => {
        let res = await testAgent.post("/todo").send({title:"eat breakfast"}).set({authorization:token});
        expect(res.status).toBe(201);
        expect(res.body.data.title).toBe("eat breakfast")
       id= res.body.data._id
    });
    it("GET /todo/id :should respond with the todo with id , status =200", async () => {

      let res = await testAgent.get("/todo/"+id).set({authorization:token});
      expect(res.status).toBe(200);
      expect(res.body.data.title).toEqual("eat breakfast");
    });
    it("GET /todo/id (invalid id) :should respond with the todo with id , status =404", async () => {
        let id="123456789012345678901234"// mongoose.Types.ObjectId
      let res = await testAgent.get("/todo/"+id).set({authorization:token});
      expect(res.status).toBe(404);
      expect(res.body.message).toContain("no todo");
    });
    
});
