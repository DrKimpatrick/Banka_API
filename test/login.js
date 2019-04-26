/* eslint-disable no-undef */
// Import dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

// import out user collection(database)
import base from './base';

// import { tearDown, createTables } from '../models';

const SIGNUP_URL = '/api/v1/auth/signup';
const LOGIN_URL = '/api/v1/auth/login';
// Configure chai
chai.use(chaiHttp);
chai.should();

describe.only('Login Authentication ', () => {
  // Signup and login
  it('should be able to login', (done) => {
    chai.request(app)
      .post(SIGNUP_URL)
      .send(base.signup_user_1)
      .end((err, res) => {
        if (err) done();
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        chai.request(app)
          .post(LOGIN_URL)
          .send(base.login_user_1)
          .end((error, resp) => {
            if (error) done();
            resp.should.have.status(201);
            resp.body.should.be.a('object');
            resp.body.should.have.property('status');
            resp.body.should.have.property('data');
            done();
          });
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
