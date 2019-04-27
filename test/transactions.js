/* eslint-disable no-console */
/* eslint-disable no-undef */
// Import dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const SIGNUP_URL = '/api/v1/auth/signup';
const LOGIN_URL = '/api/v1/auth/login';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('TRANSACTION HISTORY', () => {
  // Creaate an account and perform a credit transaction and view the transaction history
  it('should raise 200 when use views account transaction history', (done) => {
    chai.request(app)
      .post(SIGNUP_URL) // user signs up
      .send({ email: 'client68Cbc96@crest.com', password: 'Kp15712Kp', firstName: 'name' })
      .end((err, res) => {
        if (err) done();

        chai.request(app)
          .post('/api/v1/accounts') // user creates bank account
          .set('x-access-token', res.body.data.token)
          .send({ type: 'current' })
          .end((error, resp) => {
            if (error) done();
            chai.request(app)
              .get(`/api/v1/accounts/${resp.body.data.accountNumber}/transactions`) // view account transaction history
              .set('x-access-token', res.body.data.token)
              .end((error2, response) => {
                if (error2) done();
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('data');
                done();
              });
          });
      });
  });
});

describe('TRANSACTION DETAILS', () => {
  before(async () => {
    try {
      await chai
        .request(app)
        .post(SIGNUP_URL)
        .send({ email: 'staff19023@crest.com', password: 'Kp15712Kp', firstName: 'patrick' });
    } catch (error) {
      console.log(error);
    }
  });

  it('should promote user from client to staff to perfor credit and debit', (done) => {
    chai.request(app)
      .post(LOGIN_URL)
      .send({ email: 'admin@crest.com', password: 'Kp15712Kp' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .put('/api/v1/user/type')
          .set('x-access-token', res.body.data.token)
          .send({ type: 'staff', isAdmin: 'false', email: 'staff19023@crest.com' })
          .end((error, resp) => {
            if (error) done();
            resp.should.have.status(200);
            resp.body.should.be.a('object');
            resp.body.should.have.property('data');
            done();
          });
      });
  });

  // Creaate an account and perform a credit transaction
  it('should raise 201 when a staff credits a bank account', (done) => {
    chai.request(app)
      .post(SIGNUP_URL) // user signs up
      .send({ email: 'client6448Cb96@crest.com', password: 'Kp15712Kp', firstName: 'name' })
      .end((err, res) => {
        if (err) done();

        chai.request(app)
          .post('/api/v1/accounts') // user creates bank account
          .set('x-access-token', res.body.data.token)
          .send({ type: 'current' })
          .end((error, resp) => {
            if (error) done();
            chai.request(app)
              .post(LOGIN_URL) // login staff
              .send({ email: 'staff19023@crest.com', password: 'Kp15712Kp' })
              .end((err2, resp2) => {
                if (err2) done();

                chai.request(app)
                  .post(`/api/v1/transactions/${resp.body.data.accountNumber}/credit`) // credit bank account
                  .set('x-access-token', resp2.body.data.token)
                  .send({ amount: 10000 })
                  .end((err3, resp3) => {
                    if (err3) done();
                    chai.request(app)
                      .get(`/api/v1/transactions/${resp3.body.data.transactionId}`) // Transaction detail
                      .set('x-access-token', res.body.data.token)
                      .end((err4, resp4) => {
                        if (err4) done();
                        resp4.should.have.status(200);
                        resp4.body.should.be.a('object');
                        resp4.body.should.have.property('data');
                        done();
                      });
                  });
              });
          });
      });
  });
});
