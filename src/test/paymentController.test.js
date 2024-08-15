const request = require('supertest');
const app = require('../server'); 

describe('POST /checkout', () => {
    it('should return a 400 error if items or paymentInfo is missing', async () => {
        const res = await request(app)
            .post('/checkout')
            .send({})  
            .expect(400);
        
        expect(res.body).toHaveProperty('errors');
    });
});

