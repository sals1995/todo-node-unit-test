

const request = require('supertest');
const app = require('..');

let testAgent=request(app)


describe('root routes', () => {
    it('GET / :should respond with [] , status =200', async () => {
       let res=await testAgent.get("/")
       expect(res.status).toBe(200)
       expect(res.body.data).toEqual([])
    });
    it('GET /xxx :should respond with "not found" , status =404', async () => {
       let res=await testAgent.get("/xxx")
       expect(res.status).toBe(404)
       expect(res.body.message).toMatch(/not found/i)
    });
});

