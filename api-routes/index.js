
import { verifyToken } from '../middleware';
import { signup } from '../controllers/auth/signup';
import { login } from '../controllers/auth/login';
import { creditTransaction, debitTransaction } from '../controllers/bank-account/creditdebit';
import deleteAccount from '../controllers/bank-account/deleteAccount';
import accountStatus from '../controllers/bank-account/accountStatus';
import createBankAccount from '../controllers/bank-account/createAccount';
import users from '../controllers/auth/users';
import userType from '../controllers/auth/userType';
import userAccountList from '../controllers/bank-account/userAccounts';
import { accountList, accountCategories, specificUserAccounts } from '../controllers/bank-account/bankAccounts';
import accountDetails from '../controllers/bank-account/accountDetails';
import { transactionsHistory, transactionsDetail } from '../controllers/bank-account/transactions';

const router = require('express').Router();

// auth routes
router.route('/auth/signup')
  .post(signup);

router.route('/auth/login')
  .post(login);

router.route('/accounts')
  .post(verifyToken, createBankAccount);

router.route('/account/:accountNumber')
  .patch(verifyToken, accountStatus)
  .delete(verifyToken, deleteAccount);

router.route('/transactions/:accountNumber/credit')
  .post(verifyToken, creditTransaction);
router.route('/transactions/:accountNumber/debit')
  .post(verifyToken, debitTransaction);
router.route('/users')
  .get(verifyToken, users);
router.route('/user/type')
  .put(verifyToken, userType);
router.route('/user/accounts')
  .get(verifyToken, userAccountList);
router.route('/accounts/:accountNumber')
  .get(verifyToken, accountDetails);
router.route('/accounts')
  .get(verifyToken, accountList);
router.route('/accounts')
  .get(verifyToken, accountList);
router.route('/accounts/status')
  .get(verifyToken, accountCategories);
router.route('/user/:email/accounts')
  .get(verifyToken, specificUserAccounts);
router.route('/accounts/:accountNumber/transactions')
  .get(verifyToken, transactionsHistory);
router.route('/transactions/:transactionId')
  .get(verifyToken, transactionsDetail);


// Export API routes
export default router;
