/* eslint-disable no-console */
/* eslint-disable no-undef */
// Import dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

// import out user collection(database)
const LOGIN_URL = '/api/v1/auth/login';
const SIGNUP_URL = '/api/v1/auth/signup';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('CREATE BANK ACCOUNT ', () => {
  it('User should be able to create a bank account', (done) => {
    chai.request(app)
      .post(SIGNUP_URL)
      .send({ email: 'client@crest.com', password: 'Kp15712Kp', firstName: 'name' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .post('/api/v1/accounts')
          .set('x-access-token', res.body.data.token)
          .send({ type: 'current' })
          .end((error, resp) => {
            if (error) done();
            resp.should.have.status(201);
            resp.body.should.be.a('object');
            resp.body.should.have.property('data');
            done();
          });
      });
  });
  it('should raise 400 if account type is not provided', (done) => {
    chai.request(app)
      .post(LOGIN_URL)
      .send({ email: 'client@crest.com', password: 'Kp15712Kp', firstName: 'name' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .post('/api/v1/accounts')
          .set('x-access-token', res.body.data.token)
          .send({ })
          .end((error, resp) => {
            if (error) done();
            resp.should.have.status(400);
            resp.body.should.be.a('object');
            resp.body.should.have.property('status');
            resp.body.should.have.property('error').eql('Account type is required !');
            done();
          });
      });
  });
});

describe('RETRIEVE ACCOUNTS OF A CERTAIN CATEGORY ', () => {
  it('should raise 200 when admin/staff retrievs accounts of a particular cartegory', (done) => {
    chai.request(app)
      .post(LOGIN_URL)
      .send({ email: 'admin@crest.com', password: 'Kp15712Kp' })
      .end((err, res) => {
        chai.request(app)
          .get('/api/v1/category?status=active')
          .set('x-access-token', res.body.data.token)
          .end((error, resp) => {
            if (error) done();
            resp.should.have.status(200);
            resp.body.should.be.a('object');
            resp.body.should.have.property('data');
            done();
          });
      });
  });
});

describe('RETRIEVE BANK ACCOUNT DETAILS ', () => {
  it('should raise 200 when user retrieves account detals', (done) => {
    chai.request(app)
      .post(SIGNUP_URL)
      .send({ email: 'client09@crest.com', password: 'Kp15712Kp', firstName: 'name' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .post('/api/v1/accounts')
          .set('x-access-token', res.body.data.token)
          .send({ type: 'current' })
          .end((error, resp) => {
            if (error) done();
            chai.request(app)
              .get(`/api/v1/accounts/${resp.body.data.accountNumber}`)
              .set('x-access-token', res.body.data.token)
              .end((errors, response) => {
                if (errors) done();
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('data');
                done();
              });
          });
      });
  });
  it('should raise 404 when user tries to retrieve an account that  does not exist', (done) => {
    chai.request(app)
      .post(SIGNUP_URL)
      .send({ email: 'client099@crest.com', password: 'Kp15712Kp', firstName: 'name' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .get('/api/v1/accounts/22344444')
          .set('x-access-token', res.body.data.token)
          .end((errors, response) => {
            if (errors) done();
            response.should.have.status(404);
            response.body.should.be.a('object');
            response.body.should.have.property('error');
            done();
          });
      });
  });
});
