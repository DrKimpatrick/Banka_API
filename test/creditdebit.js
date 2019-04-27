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

describe('CRDIT USER ACCOUNT BY STAFF', () => {
  before(async () => {
    try {
      await chai
        .request(app)
        .post(SIGNUP_URL)
        .send({ email: 'staff123@crest.com', password: 'Kp15712Kp', firstName: 'patrick' });
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
        res.should.have.status(201);
        res.body.should.be.a('object');
        chai.request(app)
          .put('/api/v1/user/type')
          .set('x-access-token', res.body.data.token)
          .send({ type: 'staff', isAdmin: 'false', email: 'staff123@crest.com' })
          .end((error, resp) => {
            if (error) done();
            resp.should.have.status(201);
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
      .send({ email: 'client68Cb96@crest.com', password: 'Kp15712Kp', firstName: 'name' })
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
              .send({ email: 'staff123@crest.com', password: 'Kp15712Kp' })
              .end((err2, resp2) => {
                if (err2) done();

                chai.request(app)
                  .post(`/api/v1/transactions/${resp.body.data.accountNumber}/credit`) // credit bank account
                  .set('x-access-token', resp2.body.data.token)
                  .send({ amount: 10000 })
                  .end((err3, resp3) => {
                    if (err3) done();
                    resp3.should.have.status(201);
                    resp3.body.should.be.a('object');
                    resp3.body.should.have.property('data');
                    done();
                  });
              });
          });
      });
  });

  // Creaate an account and perform a credit transaction
  it('should raise 400 when staff tries to credit account but provides an invalid amount format', (done) => {
    chai.request(app)
      .post(SIGNUP_URL) // user signs up
      .send({ email: 'client68cCb96@crest.com', password: 'Kp15712Kp', firstName: 'name' })
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
              .send({ email: 'staff123@crest.com', password: 'Kp15712Kp' })
              .end((err2, resp2) => {
                if (err2) done();

                chai.request(app)
                  .post(`/api/v1/transactions/${resp.body.data.accountNumber}/credit`) // credit bank account
                  .set('x-access-token', resp2.body.data.token)
                  .send({ amount: '8ewj44' })
                  .end((err3, resp3) => {
                    if (err3) done();
                    resp3.should.have.status(400);
                    resp3.body.should.be.a('object');
                    resp3.body.should.have.property('error');
                    done();
                  });
              });
          });
      });
  });

  // Creaate an account and perform a credit transaction
  it('should raise 404 when a staff tries to credit an account when an account does not exist', (done) => {
    chai.request(app)
      .post(SIGNUP_URL) // user signs up
      .send({ email: 'clientbb68cbCb96@crest.com', password: 'Kp15712Kp', firstName: 'name' })
      .end((err, res) => {
        if (err) done();

        chai.request(app)
          .post('/api/v1/accounts') // user creates bank account
          .set('x-access-token', res.body.data.token)
          .send({ type: 'current' })
          .end((error) => {
            if (error) done();
            chai.request(app)
              .post(LOGIN_URL) // login staff
              .send({ email: 'staff123@crest.com', password: 'Kp15712Kp' })
              .end((err2, resp2) => {
                if (err2) done();

                chai.request(app)
                  .post('/api/v1/transactions/673883838/credit') // credit bank account
                  .set('x-access-token', resp2.body.data.token)
                  .send({ amount: 38388 })
                  .end((err3, resp3) => {
                    if (err3) done();
                    resp3.should.have.status(404);
                    resp3.body.should.be.a('object');
                    resp3.body.should.have.property('error');
                    done();
                  });
              });
          });
      });
  });
});


// ********************************

describe('DEBIT USER ACCOUNT BY STAFF', () => {
  before(async () => {
    try {
      await chai
        .request(app)
        .post(SIGNUP_URL)
        .send({ email: 'staff533@crest.com', password: 'Kp15712Kp', firstName: 'patrick' });
    } catch (error) {
      console.log(error);
    }
  });

  it('should promote user from client to staff to perfor Debit', (done) => {
    chai.request(app)
      .post(LOGIN_URL)
      .send({ email: 'admin@crest.com', password: 'Kp15712Kp' })
      .end((err, res) => {
        if (err) done();
        res.should.have.status(201);
        res.body.should.be.a('object');
        chai.request(app)
          .put('/api/v1/user/type')
          .set('x-access-token', res.body.data.token)
          .send({ type: 'staff', isAdmin: 'false', email: 'staff533@crest.com' })
          .end((error, resp) => {
            if (error) done();
            resp.should.have.status(201);
            resp.body.should.be.a('object');
            resp.body.should.have.property('data');
            done();
          });
      });
  });

  // Creaate an account and perform a debit transaction
  it('should raise 201 when a staff debits a bank account', (done) => {
    chai.request(app)
      .post(SIGNUP_URL) // user signs up
      .send({ email: 'cliet2dj@crest.com', password: 'Kp15712Kp', firstName: 'name' })
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
              .send({ email: 'staff533@crest.com', password: 'Kp15712Kp' })
              .end((err2, resp2) => {
                if (err2) done();

                chai.request(app)
                  .post(`/api/v1/transactions/${resp.body.data.accountNumber}/credit`) // credit bank account
                  .set('x-access-token', resp2.body.data.token)
                  .send({ amount: 10000 })
                  .end((err3) => {
                    if (err3) done();

                    chai.request(app)
                      .post(`/api/v1/transactions/${resp.body.data.accountNumber}/debit`) // credit bank account
                      .set('x-access-token', resp2.body.data.token)
                      .send({ amount: 1000 })
                      .end((err4, resp4) => {
                        if (err4) done();
                        resp4.should.have.status(201);
                        resp4.body.should.be.a('object');
                        resp4.body.should.have.property('data');
                        done();
                      });
                  });
              });
          });
      });
  });

  // Creaate an account and perform a debit transaction
  it('should raise 400 when staff tries to credit account but provides an invalid amount format', (done) => {
    chai.request(app)
      .post(SIGNUP_URL) // user signs up
      .send({ email: 'client68nhcCb96@crest.com', password: 'Kp15712Kp', firstName: 'name' })
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
              .send({ email: 'staff123@crest.com', password: 'Kp15712Kp' })
              .end((err2, resp2) => {
                if (err2) done();

                chai.request(app)
                  .post(`/api/v1/transactions/${resp.body.data.accountNumber}/debit`) // credit bank account
                  .set('x-access-token', resp2.body.data.token)
                  .send({ amount: '8ewj44' })
                  .end((err3, resp3) => {
                    if (err3) done();
                    resp3.should.have.status(400);
                    resp3.body.should.be.a('object');
                    resp3.body.should.have.property('error');
                    done();
                  });
              });
          });
      });
  });

  // Creaate an account and perform a debit transaction
  it('should raise 404 when a staff tries to debit an account when an account does not exist', (done) => {
    chai.request(app)
      .post(SIGNUP_URL) // user signs up
      .send({ email: 'clientbdeb68cbCb96@crest.com', password: 'Kp15712Kp', firstName: 'name' })
      .end((err, res) => {
        if (err) done();

        chai.request(app)
          .post('/api/v1/accounts') // user creates bank account
          .set('x-access-token', res.body.data.token)
          .send({ type: 'current' })
          .end((error) => {
            if (error) done();
            chai.request(app)
              .post(LOGIN_URL) // login staff
              .send({ email: 'staff123@crest.com', password: 'Kp15712Kp' })
              .end((err2, resp2) => {
                if (err2) done();

                chai.request(app)
                  .post('/api/v1/transactions/6738683838/debit') // credit bank account
                  .set('x-access-token', resp2.body.data.token)
                  .send({ amount: 38388 })
                  .end((err3, resp3) => {
                    if (err3) done();
                    resp3.should.have.status(404);
                    resp3.body.should.be.a('object');
                    resp3.body.should.have.property('error');
                    done();
                  });
              });
          });
      });
  });
});
