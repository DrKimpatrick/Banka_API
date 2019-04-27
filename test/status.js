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

describe('CHANGE ACCOUNT STATUS ', () => {
  it('should raise 200 when admin changes the account status', (done) => {
    chai.request(app)
      .post(SIGNUP_URL) // create user
      .send({ email: 'client09x89@crest.com', password: 'Kp15712Kp', firstName: 'name' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .post('/api/v1/accounts') // user creates an account
          .set('x-access-token', res.body.data.token)
          .send({ type: 'current' })
          .end((error, resp) => {
            if (error) done();
            chai.request(app)
              .post(LOGIN_URL) // login admin
              .send({ email: 'admin@crest.com', password: 'Kp15712Kp' })
              .end((errors, response) => {
                if (errors) done();
                chai.request(app)
                  .patch(`/api/v1/account/${resp.body.data.accountNumber}`) // admin changes account status
                  .set('x-access-token', response.body.data.token)
                  .send({ status: 'dormant' })
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

  it('should raise 400 when admin tries to change the status of an account without providing status', (done) => {
    chai.request(app)
      .post(SIGNUP_URL) // create user
      .send({ email: 'client0989nb9@crest.com', password: 'Kp15712Kp', firstName: 'name' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .post('/api/v1/accounts') // user creates an account
          .set('x-access-token', res.body.data.token)
          .send({ type: 'current' })
          .end((error, resp) => {
            if (error) done();
            chai.request(app)
              .post(LOGIN_URL) // login admin
              .send({ email: 'admin@crest.com', password: 'Kp15712Kp' })
              .end((errors, response) => {
                if (errors) done();
                chai.request(app)
                  .patch(`/api/v1/account/${resp.body.data.accountNumber}`) // admin changes account status
                  .set('x-access-token', response.body.data.token)
                  .send()
                  .end((errors2, response2) => {
                    if (errors2) done();
                    response2.should.have.status(400);
                    response2.body.should.be.a('object');
                    response2.body.should.have.property('error');
                    done();
                  });
              });
          });
      });
  });

  it('should raise 400 when admin tries to change the status of an account with invalid status', (done) => {
    chai.request(app)
      .post(SIGNUP_URL) // create user
      .send({ email: 'client09m45899@crest.com', password: 'Kp15712Kp', firstName: 'name' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .post('/api/v1/accounts') // user creates an account
          .set('x-access-token', res.body.data.token)
          .send({ type: 'current' })
          .end((error, resp) => {
            if (error) done();
            chai.request(app)
              .post(LOGIN_URL) // login admin
              .send({ email: 'admin@crest.com', password: 'Kp15712Kp' })
              .end((errors, response) => {
                if (errors) done();
                chai.request(app)
                  .patch(`/api/v1/account/${resp.body.data.accountNumber}`) // admin changes account status
                  .set('x-access-token', response.body.data.token)
                  .send({ status: 'invalid' })
                  .end((errors2, response2) => {
                    if (errors2) done();
                    response2.should.have.status(400);
                    response2.body.should.be.a('object');
                    response2.body.should.have.property('error');
                    done();
                  });
              });
          });
      });
  });
});
