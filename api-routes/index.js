
import { verifyToken } from '../middleware';
import signup from '../controllers/auth/signup';
import login from '../controllers/auth/login';
import creditdebit from '../controllers/bank-account/creditdebit';
import deleteAccount from '../controllers/bank-account/deleteAccount';
import accountStatus from '../controllers/bank-account/accountStatus';
import createBankAccount from '../controllers/bank-account/createAccount';
import users from '../controllers/auth/users';
import userType from '../controllers/auth/userType';
import userAccountList from '../controllers/bank-account/userAccounts';
import bankaccounts from '../controllers/bank-account/bankAccounts';
import accountDetails from '../controllers/bank-account/accountDetails';
import transaction from '../controllers/bank-account/transactions';
import accountCategories from '../controllers/bank-account/accountCategory';

const router = require('express').Router();

router.route('/auth/signup')
  .post(signup.signup);

router.route('/auth/login')
  .post(login.login);

router.route('/accounts')
  .post(verifyToken, createBankAccount)
  .get(verifyToken, bankaccounts.accountList);

router.route('/account/:accountNumber')
  .patch(verifyToken, accountStatus)
  .delete(verifyToken, deleteAccount);

router.route('/transactions/:accountNumber/credit')
  .post(verifyToken, creditdebit.creditTransaction);

router.route('/transactions/:accountNumber/debit')
  .post(verifyToken, creditdebit.debitTransaction);

router.route('/users')
  .get(verifyToken, users);

router.route('/user/type')
  .put(verifyToken, userType);

router.route('/user/accounts')
  .get(verifyToken, userAccountList);

router.route('/accounts/:accountNumber')
  .get(verifyToken, accountDetails);

router.route('/category')
  .get(verifyToken, accountCategories);

router.route('/user/:email/accounts')
  .get(verifyToken, bankaccounts.specificUserAccounts);

router.route('/accounts/:accountNumber/transactions')
  .get(verifyToken, transaction.transactionsHistory);

router.route('/transactions/:transactionId')
  .get(verifyToken, transaction.transactionsDetail);


export default router;
