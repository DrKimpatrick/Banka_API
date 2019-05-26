/* eslint-disable no-console */
/* eslint-disable no-undef */
// Import dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

// import out user collection(database)
import base from './base';

const SIGNUP_URL = '/api/v1/auth/signup';
const LOGIN_URL = '/api/v1/auth/login';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('POST', () => {
  it('should create a user account', (done) => {
    chai
      .request(app)
      .post(SIGNUP_URL)
      .send(base.signup_user_1)
      .end((err, res) => {
        if (err) done();
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        done();
      });
  });

  it('should raise an error if email or password is missing', (done) => {
    chai.request(app)
      .post(SIGNUP_URL)
      .send(base.signup_user_2)
      .end((err, res) => {
        if (err) done();
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should raise an error when email is invalid', (done) => {
    chai.request(app)
      .post(SIGNUP_URL)
      .send({ email: 'invalid', password: 'Kp15712Kp', firstName: 'name' })
      .end((err, res) => {
        if (err) done();
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('error').eql('Invalid email format ');
        done();
      });
  });

  it('should raise an error when password is invalid', (done) => {
    chai.request(app)
      .post(SIGNUP_URL)
      .send({ email: 'email@emai.com', password: 'Kp', firstName: 'name' })
      .end((err, res) => {
        if (err) done();
        const error = 'Weak password, must be at least 8 characters and have at least 1 letter and number';
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('error').eql(error);
        done();
      });
  });

  it('should raise an error if firstName has special characters', (done) => {
    chai.request(app)
      .post(SIGNUP_URL)
      .send(base.signup_user_8)
      .end((err, res) => {
        if (err) done();
        const error = 'Names should not contain special characters';
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('error').eql(error);
        done();
      });
  });

  it('should raise an error if lastName has special characters', (done) => {
    chai.request(app)
      .post(SIGNUP_URL)
      .send(base.signup_user_9)
      .end((err, res) => {
        if (err) done();
        const error = 'Names should not contain special characters';
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('error').eql(error);
        done();
      });
  });
});

describe('Login Authentication ', () => {
  // Signup and login
  it('Should login user', (done) => {
    chai.request(app)
      .post(LOGIN_URL)
      .send(base.login_user_1)
      .end((error, resp) => {
        if (error) done();
        resp.should.have.status(200);
        resp.body.should.be.a('object');
        resp.body.should.have.property('status');
        resp.body.should.have.property('data');
        done();
      });
  });
  it('should raise an error if password or email are missing', (done) => {
    chai.request(app)
      .post(LOGIN_URL)
      .send({ email: '', password: '' })
      .end((err, res) => {
        if (err) done();
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });
});


describe('CHANGE USER TYPE BY ADMIN', () => {
  before(async () => {
    try {
      await chai
        .request(app)
        .post(SIGNUP_URL)
        .send({ email: 'client12@crest.com', password: 'Kp15712Kp', firstName: 'patrick' });
    } catch (error) {
      console.log(error);
    }
  });

  it('Admin should be able to change  the user type 4rm staff/client/admin', (done) => {
    chai.request(app)
      .post(LOGIN_URL)
      .send({ email: 'admin@crest.com', password: 'Kp15712Kp' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .put('/api/v1/user/type')
          .set('x-access-token', res.body.data.token)
          .send({ type: 'staff', isAdmin: 'false', email: 'client12@crest.com' })
          .end((error, resp) => {
            if (error) done();
            resp.should.have.status(200);
            resp.body.should.be.a('object');
            resp.body.should.have.property('data');
            done();
          });
      });
  });

  it('should raise an error if user type is invalid not staff/client/admin', (done) => {
    chai.request(app)
      .post(LOGIN_URL)
      .send({ email: 'admin@crest.com', password: 'Kp15712Kp' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .put('/api/v1/user/type')
          .set('x-access-token', res.body.data.token)
          .send({ type: 'invalid', isAdmin: 'false', email: 'client12@crest.com' })
          .end((error, resp) => {
            if (error) done();
            resp.should.have.status(400);
            resp.body.should.be.a('object');
            resp.body.should.have.property('error').eql('Type should either be client / staff');
            done();
          });
      });
  });
  it('should change user from type staff to client', (done) => {
    chai.request(app)
      .post(LOGIN_URL)
      .send({ email: 'admin@crest.com', password: 'Kp15712Kp' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .put('/api/v1/user/type')
          .set('x-access-token', res.body.data.token)
          .send({ type: 'client', isAdmin: 'false', email: 'client12@crest.com' })
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

describe('RETRIEVE ALL USERS BY ADMIN', () => {
  before(async () => {
    try {
      await chai
        .request(app)
        .post(SIGNUP_URL)
        .send({ email: 'client212@crest.com', password: 'Kp15712Kp', firstName: 'patrick' });
    } catch (error) {
      console.log(error);
    }
  });
  it('Admin should be able to retrieve all user accounts', (done) => {
    chai.request(app)
      .post(LOGIN_URL)
      .send({ email: 'admin@crest.com', password: 'Kp15712Kp' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .get('/api/v1/users')
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

  it('should raise an error when client tries retrieve user accounts', (done) => {
    chai.request(app)
      .post(LOGIN_URL)
      .send({ email: 'client212@crest.com', password: 'Kp15712Kp' })
      .end((err, res) => {
        if (err) done();
        chai.request(app)
          .get('/api/v1/users')
          .set('x-access-token', res.body.data.token)
          .end((error, resp) => {
            if (error) done();
            resp.should.have.status(403);
            resp.body.should.be.a('object');
            resp.body.should.have.property('error').eql('Access denied, contact the system admin');
            done();
          });
      });
  });
});
