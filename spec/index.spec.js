const request = require('supertest');
const app = require('..');

let testAgent=request(app)

describe('root routes', () => {
    it('(Get /) should respond with todos=[]', async() => {
       let res= await testAgent.get("/")

       expect(res.status).toEqual(200)
       expect(res.body.data).toEqual([])
    });
    it('(Get /xx) should respond with not found', async() => {
       let res= await testAgent.get("/xx")

       expect(res.status).toEqual(404)
       expect(res.body.message).toMatch(/not found/i)
    });
});