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

describe('USER ACCOUNTS ', () => {
  it('should raise 200  when admin/staff retrieve all user accounts', (done) => {
    chai.request(app)
      .post(LOGIN_URL) // create user
      .send({ email: 'admin@crest.com', password: 'Kp15712Kp' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .get('/api/v1/accounts') // admin/staff retrieves all accounts
          .set('x-access-token', res.body.data.token)
          .send({ type: 'current' })
          .end((error, response) => {
            if (error) done();
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('data');
            done();
          });
      });
  });

  it('should raise 401  when client tries to retrieve all user accounts', (done) => {
    chai.request(app)
      .post(SIGNUP_URL) // create user
      .send({ email: 'client063@crest.com', password: 'Kp15712Kp', firstName: 'name' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .get('/api/v1/accounts') // admin/staff retrieves all accounts
          .set('x-access-token', res.body.data.token)
          .send({ type: 'current' })
          .end((error, response) => {
            if (error) done();
            response.should.have.status(403);
            response.body.should.be.a('object');
            response.body.should.have.property('error');
            done();
          });
      });
  });

  it('should raise 200  when a user retrieves their bank accounts', (done) => {
    chai.request(app)
      .post(SIGNUP_URL) // create user
      .send({ email: 'clientue@crest.com', password: 'Kp15712Kp', firstName: 'kim' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .get('/api/v1/user/accounts') // user retrieves their accounts
          .set('x-access-token', res.body.data.token)
          .send({ type: 'current' })
          .end((error, response) => {
            if (error) done();
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('data');
            done();
          });
      });
  });
});


describe('RETRIEVE SPECIFIC USER ACCOUNTS ', () => {
  it('should raise 200 when admin retrieves all accounts for a specific user', (done) => {
    chai.request(app)
      .post(SIGNUP_URL) // create user
      .send({ email: 'client09389@crest.com', password: 'Kp15712Kp', firstName: 'name' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .post('/api/v1/accounts') // user creates an account
          .set('x-access-token', res.body.data.token)
          .send({ type: 'current' })
          .end((error) => {
            if (error) done();
            chai.request(app)
              .post(LOGIN_URL) // login admin
              .send({ email: 'admin@crest.com', password: 'Kp15712Kp' })
              .end((errors, response) => {
                if (errors) done();
                chai.request(app)
                  .get(`/api/v1/user/${res.body.data.email}/accounts`) // admin changes account status
                  .set('x-access-token', response.body.data.token)
                  .end((errors2, response2) => {
                    if (errors2) done();
                    response2.should.have.status(200);
                    response2.body.should.be.a('object');
                    response2.body.should.have.property('data');
                    done();
                  });
              });
          });
      });
  });

  it('should raise 404 when admin tries to retrieve accounts for a user when email does not exist', (done) => {
    chai.request(app)
      .post(SIGNUP_URL) // create user
      .send({ email: 'client098289@crest.com', password: 'Kp15712Kp', firstName: 'name' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .post('/api/v1/accounts') // user creates an account
          .set('x-access-token', res.body.data.token)
          .send({ type: 'current' })
          .end((error) => {
            if (error) done();
            chai.request(app)
              .post(LOGIN_URL) // login admin
              .send({ email: 'admin@crest.com', password: 'Kp15712Kp' })
              .end((errors, response) => {
                if (errors) done();
                chai.request(app)
                  .get('/api/v1/user/emai@g.com/accounts') // admin changes account status
                  .set('x-access-token', response.body.data.token)
                  .end((errors2, response2) => {
                    if (errors2) done();
                    response2.should.have.status(404);
                    response2.body.should.be.a('object');
                    response2.body.should.have.property('error');
                    done();
                  });
              });
          });
      });
  });
});
