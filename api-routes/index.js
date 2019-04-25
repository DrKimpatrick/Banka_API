// Initialize express router
const router = require('express').Router();

// import signup
const signupController = require('../controllers/auth/signup');
const loginController = require('../controllers/auth/login');
const bankTransactions = require('../controllers/bank-account/transactions');
const deleteAccount = require('../controllers/bank-account/deleteAccount');
const accountStatus = require('../controllers/bank-account/accountStatus');
const createBankAccount = require('../controllers/bank-account/createAccount');
const transationHistory = require('../controllers/bank-account/accountHistory');
const users = require('../controllers/auth/users');
const userType = require('../controllers/auth/userType');

// import VerifyToken middleware function
const middleware = require('../middleware');

// auth routes
router.route('/auth/signup')
  .post(signupController.signup);
router.route('/auth/login')
  .post(loginController.login);
router.route('/accounts')
  .post(middleware.verifyToken, createBankAccount);
router.route('/account/:accountNumber')
  .patch(middleware.verifyToken, accountStatus)
  .delete(middleware.verifyToken, deleteAccount);
router.route('/transactions/:accountNumber/credit')
  .post(middleware.verifyToken, bankTransactions.creditTransaction);
router.route('/transactions/:accountNumber/debit')
  .post(middleware.verifyToken, bankTransactions.debitTransaction);
router.route('/account/history')
  .get(middleware.verifyToken, transationHistory);
router.route('/users')
  .get(middleware.verifyToken, users);
router.route('/user/type')
  .put(middleware.verifyToken, userType);


// Export API routes
module.exports = router;
