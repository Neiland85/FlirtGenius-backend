const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('/Users/estudio/Projects/GitHub/Python/Kazen/FlirtGenius/FlirtGenius-backend/server'); 
const expect = chai.expect;

chai.use(chaiHttp);

describe('API Routes', () => {
    describe('GET /api/hello', () => {
        it('should return a hello message', (done) => {
            chai.request(app)
                .get('/api/hello')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('Hello KAZEM team!!');
                    done();
                });
        });
    });

    describe('GET /users', () => {
        it('should return a list of users', (done) => {
            chai.request(app)
                .get('/users')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('POST /users', () => {
        it('should create a new user', (done) => {
            const newUser = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };
            chai.request(app)
                .post('/users')
                .send(newUser)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.include(newUser);
                    done();
                });
        });
    });

    // Puedes añadir más pruebas para otras rutas aquí
});

