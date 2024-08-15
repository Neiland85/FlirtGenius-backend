const request = require('supertest');
const app = require('../server');

describe('GET /products', () => {
    it('should return paginated products', async () => {
        const res = await request(app)
            .get('/products?page=1&limit=2')
            .expect(200);
        
        expect(res.body.products).toHaveLength(2);
        expect(res.body).toHaveProperty('totalItems');
        expect(res.body).toHaveProperty('totalPages');
        expect(res.body).toHaveProperty('currentPage');
    });
});
