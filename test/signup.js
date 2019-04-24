/* eslint-disable no-undef */
// Import dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
require('../index');
// import out user collection(database)
const base = require('./base');

// import database connection
const { createTables, tearDown } = require('../models/db');

const SIGNUP_URL = '/api/v1/auth/signup';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('Authentication', () => {
  beforeEach((done) => {
    // Create database tables
    createTables();
    done();
  });

  afterEach((done) => {
    // Drop the database
    tearDown();
    done();
  });
  describe('POST', () => {
    it('should create a user account', (done) => {
      chai.request(app)
        .post(SIGNUP_URL)
        .send(base.signup_user_1)
        .end((err, res) => {
          // console.log('nowowwo____nownw-----nwoww', res);
          res.should.have.status(202);
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
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });

    it('should raise an error is user type is invalid', () => {
      chai.request(app)
        .post(SIGNUP_URL)
        .send(base.signup_user_3)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error').eql('Type should either be client / staff');
        });
    });


    it('should raise an error when email is invalid', (done) => {
      chai.request(app)
        .post(SIGNUP_URL)
        .send(base.signup_user_5)
        .end((err, res) => {
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
        .send(base.signup_user_6)
        .end((err, res) => {
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
          const error = 'Names should not contain special characters';
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('error').eql(error);
          done();
        });
    });

    it('should raise an error isAdmin is not false/true', (done) => {
      chai.request(app)
        .post(SIGNUP_URL)
        .send(base.signup_user_10)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('error');
          done();
        });
    });
  });
});
