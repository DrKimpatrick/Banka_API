// /* eslint-disable no-undef */
// // Import dependencies for testing
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// require('../index');
// // import out user collection(database)
// const database = require('../models');
// const base = require('./base');

// // Base URL
// const BASE_URL = 'http://localhost:8080/api/v1';
// const LOGIN_URL = '/auth/login';
// const SIGNUP_URL = '/auth/signup';

// // Configure chai
// chai.use(chaiHttp);
// chai.should();
// describe.only('Debit user account by staff', () => {
//   // create user account and get token
//   // create bank account
// // let staff credit bank account
//   before(() => {
//     database.users.length = 0; // empty user collection
//     chai.request(BASE_URL)
//       .post(SIGNUP_URL)
//       .send(base.signup_user_7)
//       .end();
//   });
//   describe('POST', () => {
//     it('should raise 202 on debitting a bank account', (done) => {
//       chai.request(BASE_URL)
//         .post(LOGIN_URL)
//         .send(base.signup_user_7) // staff
//         .end((err, res) => {
//           chai.request(BASE_URL)
//             .post('/accounts') // create account
//             .set('x-access-token', res.body.data.token)
//             .send(base.bank_account_1)
//             .end((err, resp) => {
//               chai.request(BASE_URL)
//                 .post(`/transactions/${resp.body.data.accountNumber}/credit`) // change account status
//                 .set('x-access-token', res.body.data.token)
//                 .send({ amount: 10000 })
//                 .end(() => {
//                   chai.request(BASE_URL)
//                     .post(`/transactions/${resp.body.data.accountNumber}/debit`) // change account status
//                     .set('x-access-token', res.body.data.token)
//                     .send({ amount: 10000 })
//                     .end((err, response) => {
//                       response.should.have.status(202);
//                       response.body.should.be.a('object');
//                       response.body.should.have.property('status');
//                       response.body.should.have.property('data');
//                       done();
//                     });
//                 });
//             });
//         });
//     });

//     it('should raise 400 if amount is not provided', (done) => {
//       chai.request(BASE_URL)
//         .post(LOGIN_URL)
//         .send(base.signup_user_7) // staff
//         .end((err, res) => {
//           chai.request(BASE_URL)
//             .post('/accounts') // create account
//             .set('x-access-token', res.body.data.token)
//             .send(base.bank_account_1)
//             .end((err, resp) => {
//               chai.request(BASE_URL)
//                 .post(`/transactions/${resp.body.data.accountNumber}/debit`) // change account status
//                 .set('x-access-token', res.body.data.token)
//                 .send({})
//                 .end((err, response) => {
//                   response.should.have.status(400);
//                   response.body.should.be.a('object');
//                   response.body.should.have.property('status');
//                   response.body.should.have.property('error');
//                   done();
//                 });
//             });
//         });
//     });

//     it('should raise 400 when requested amount is more than the available balance', (done) => {
//       chai.request(BASE_URL)
//         .post(LOGIN_URL)
//         .send(base.signup_user_7) // staff
//         .end((err, res) => {
//           chai.request(BASE_URL)
//             .post('/accounts') // create account
//             .set('x-access-token', res.body.data.token)
//             .send(base.bank_account_1)
//             .end((err, resp) => {
//               chai.request(BASE_URL)
//                 .post(`/transactions/${resp.body.data.accountNumber}/debit`) // change account status
//                 .set('x-access-token', res.body.data.token)
//                 .send({ amount: 23456 })
//                 .end((err, response) => {
//                   response.should.have.status(400);
//                   response.body.should.be.a('object');
//                   response.body.should.have.property('status');
//                   response.body.should.have.property('error');
//                   done();
//                 });
//             });
//         });
//     });

//     it('should raise 400 if amount is NaN', (done) => {
//       chai.request(BASE_URL)
//         .post(LOGIN_URL)
//         .send(base.signup_user_7) // staff
//         .end((err, res) => {
//           chai.request(BASE_URL)
//             .post('/accounts') // create account
//             .set('x-access-token', res.body.data.token)
//             .send(base.bank_account_1)
//             .end((err, resp) => {
//               chai.request(BASE_URL)
//                 .post(`/transactions/${resp.body.data.accountNumber}/debit`) // change account status
//                 .set('x-access-token', res.body.data.token)
//                 .send({ amount: '3v33' })
//                 .end((err, response) => {
//                   response.should.have.status(400);
//                   response.body.should.be.a('object');
//                   response.body.should.have.property('status');
//                   response.body.should.have.property('error');
//                   done();
//                 });
//             });
//         });
//     });

//     it('should raise 400 if amount Negative', (done) => {
//       chai.request(BASE_URL)
//         .post(LOGIN_URL)
//         .send(base.signup_user_7) // staff
//         .end((err, res) => {
//           chai.request(BASE_URL)
//             .post('/accounts') // create account
//             .set('x-access-token', res.body.data.token)
//             .send(base.bank_account_1)
//             .end((err, resp) => {
//               chai.request(BASE_URL)
//                 .post(`/transactions/${resp.body.data.accountNumber}/debit`) // change account status
//                 .set('x-access-token', res.body.data.token)
//                 .send({ amount: -12 })
//                 .end((err, response) => {
//                   response.should.have.status(400);
//                   response.body.should.be.a('object');
//                   response.body.should.have.property('status');
//                   response.body.should.have.property('error');
//                   done();
//                 });
//             });
//         });
//     });

//     it('should raise 404 if accountNumber does not exist', (done) => {
//       chai.request(BASE_URL)
//         .post(LOGIN_URL)
//         .send(base.signup_user_7) // staff
//         .end((err, res) => {
//           chai.request(BASE_URL)
//             .post('/accounts') // create account
//             .set('x-access-token', res.body.data.token)
//             .send(base.bank_account_1)
//             .end((err, resp) => {
//               chai.request(BASE_URL)
//                 .post('/transactions/23456543/debit') // change account status
//                 .set('x-access-token', res.body.data.token)
//                 .send({ amount: 1200 })
//                 .end((err, response) => {
//                   response.should.have.status(404);
//                   response.body.should.be.a('object');
//                   response.body.should.have.property('status');
//                   response.body.should.have.property('error');
//                   done();
//                 });
//             });
//         });
//     });
//   });
// });

// // *********************************
// describe.only('Client can not credit bank account ', () => {
//   before(() => {
//     database.users.length = 0; // empty user collection
//     chai.request(BASE_URL)
//       .post(SIGNUP_URL)
//       .send(base.signup_user_1)
//       .end();
//   });
//   describe('POST', () => {
//     it('should raise 401 if client tries to debit an account', (done) => {
//       chai.request(BASE_URL)
//         .post(LOGIN_URL)
//         .send(base.signup_user_1) // client
//         .end((err, res) => {
//           chai.request(BASE_URL)
//             .post('/accounts') // create account
//             .set('x-access-token', res.body.data.token)
//             .send(base.bank_account_1)
//             .end((err, resp) => {
//               chai.request(BASE_URL)
//                 .post(`/transactions/${resp.body.data.accountNumber}/debit`) // change account status
//                 .set('x-access-token', res.body.data.token)
//                 .send({ amount: 10000 })
//                 .end((err, response) => {
//                   response.should.have.status(401);
//                   response.body.should.be.a('object');
//                   response.body.should.have.property('status');
//                   response.body.should.have.property('error');
//                   done();
//                 });
//             });
//         });
//     });
//   });
// });
