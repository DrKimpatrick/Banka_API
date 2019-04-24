/* eslint-disable no-undef */
// Import dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const base = require('./base');

const LOGIN_URL = '/api/v1/auth/login';
const SIGNUP_URL = '/api/v1/auth/signup';

// Configure chai
chai.use(chaiHttp);
chai.should();

const { tearDown, createTables } = require('../models');

describe.only('Login Authentication ', () => {
  beforeEach((done) => {
    createTables();
    done();
  });

  afterEach((done) => {
    tearDown();
    done();
  });
  describe('POST', () => {
    // Signup and login
    it('should be able to login', (done) => {
      chai.request(app)
        .post(SIGNUP_URL)
        .send(base.signup_user_1)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          chai.request(app)
            .post(LOGIN_URL)
            .send(base.login_user_1)
            .end((err, resp) => {
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
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
  });
});
