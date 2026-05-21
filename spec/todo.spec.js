const request = require("supertest");
const app = require("..");
const { clearDatabase } = require("../db.connection");

let testAgent = request(app);
describe("todo routes", () => {
  let newUser, token;
  afterEach(async () => {
    await clearDatabase();
  });
  beforeEach(async () => {
    //arrange
    newUser = { name: "ALi", email: "ali@example.com", password: "12345" };
    await testAgent.post("/api/user/signup").send(newUser);

    let resLogin = await testAgent.post("/api/user/login").send(newUser);
    token = resLogin.body.data;
  });
  it("(Get /api/todo) should respond with todos=[]", async () => {
    let res = await testAgent.get("/api/todo");

    expect(res.status).toEqual(200);
    expect(res.body.data).toEqual([]);
  });
  it("(Post /api/todo) without auth should respond 'you can't access'", async () => {
    let newTodo = { title: "read a book" };
    let res = await testAgent.post("/api/todo").send(newTodo);

    expect(res.status).toEqual(401);
    expect(res.body.message).toContain("you can't access");
  });
  it("(Post /api/todo) with auth should respond the new todo", async () => {
   

    //act
    let newTodo = { title: "read a book" };
    let res = await testAgent
      .post("/api/todo")
      .send(newTodo)
      .set({ authorization: `Bearer ${token}` });

    expect(res.status).toEqual(201);
    expect(res.body.data.title).toEqual(newTodo.title);
  });
  it("(Get /api/todo/id) with id should respond with the todo", async () => {
    let newTodo = { title: "read a book" };
    let resTodo = await testAgent
      .post("/api/todo")
      .send(newTodo)
      .set({ authorization: `Bearer ${token}` });
    let id = resTodo.body.data._id;

    //act
    let res = await testAgent
      .get("/api/todo/" + id)
      .set({ authorization: `Bearer ${token}` });

    expect(res.status).toEqual(200);
    expect(res.body.data.title).toEqual(newTodo.title);
  });
  it("(Get /api/todo/id) with not exists id should respond with the todo", async () => {
    let id = "000000000000000000000000";

    //act
    let res = await testAgent
      .get("/api/todo/" + id)
      .set({ authorization: `Bearer ${token}` });

    expect(res.status).toEqual(404);
    expect(res.body.message).toMatch(/no todo/i);
  });
  it("(Delete /api/todo/) should respond 'todos have been deleted successfully'", async () => {
   let newTodo = { title: "read a book" };
    let resTodo = await testAgent
      .post("/api/todo")
      .send(newTodo)
      .set({ authorization: `Bearer ${token}` });

    //act
    let res = await testAgent
      .delete("/api/todo/")
      .set({ authorization: `Bearer ${token}` });

    expect(res.status).toEqual(200);
    expect(res.body.message).toMatch(/todos have been deleted successfully/i);
  });
});
