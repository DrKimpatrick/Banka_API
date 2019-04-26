/* eslint-disable no-undef */
// Import dependencies for testing
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

// import out user collection(database)
import base from './base';


const SIGNUP_URL = '/api/v1/auth/signup';
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

  it('should raise an error is user type is invalid', () => {
    chai.request(app)
      .post(SIGNUP_URL)
      .send(base.signup_user_3)
      .end((err, res) => {
        if (err) done();
        res.should.have.status(400);
        res.body.should.have.property('error').eql('Type should either be client / staff');
      });
  });


  it('should raise an error when email is invalid', (done) => {
    chai.request(app)
      .post(SIGNUP_URL)
      .send(base.signup_user_5)
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
      .send(base.signup_user_6)
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
