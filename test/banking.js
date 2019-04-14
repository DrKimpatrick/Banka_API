/* eslint-disable no-undef */
// Import dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('request');
const app = require('../index');
// import out user collection(database)
const database = require('../models');
const base = require('./base');

// Base URL
const BASE_URL = 'http://localhost:8080/api/v1';
const LOGIN_URL = '/login';
const SIGNUP_URL = '/signup';
const CREATE_ACCOUNT_URL = '/accounts';
const ALTER_ACCOUNT_URL = '/account/:accountNumber'; // delete/ edit account
const Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTU1MTcwODQ2LCJleHAiOjE1NTUyNTcyNDZ9.SsjU8_hMoj2FwOkIcYzya_bZMGP0wQ_5WrHoDAvsTTw';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('Banking ', () => {
  let authToken = null;
  // login user
  beforeEach((done) => {
    // create a user and login
    request.post(`${BASE_URL}${SIGNUP_URL}`, {
      json: base.signup_user_1,
    }, (error, res, body) => {
      // Getting token
      authToken = body.data.token;
      console.log(authToken);
    });
    done();
  });

  it('Should be able to create bank account', (done) => {
    database.users.push(base.signup_user_1);
    console.log(authToken, '*******************************');
    chai.request(app)
      .post(CREATE_ACCOUNT_URL)
      .set('Authorization', Token)
      .send({ type: 'current' })
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        done();
      });
  });
});
