const request = require('supertest');
const app = require('..');

describe('root routes', () => {
   const testAgent= request(app)
    it('(GET /) should respond with todos=[]', async() => {
      let res= await testAgent.get("/")
      expect(res.status).toBe(200)
      expect(res.body.data).toHaveSize(0)
    });
    it('(GET /xx) should respond with not found', async() => {
      let res= await testAgent.get("/xx")
      expect(res.status).toBe(404)
      expect(res.body.message).toMatch(/not found/i)
    });
});