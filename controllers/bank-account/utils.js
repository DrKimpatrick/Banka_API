/* eslint-disable consistent-return */

// Database connection
const db = require('../../db');

// Current user data
exports.currentUser = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

// Restrict access to only staff/admin
// client can not perform debit and credit transactions
exports.checkUserType = (userData, res) => {
  if (userData) {
    if (userData.type === 'client' || userData.isAdmin === false) {
      return res.status(401).json({
        status: 401,
        error: 'Access denied!',
      });
    }
  } else {
    // User does not exist. Deleted when list was cleared
    return res.status(401).json({
      status: 401,
      error: 'Token is expired, please login again!',
    });
  }
};

exports.isNotClient = (userData, res) => {
  if (userData) {
    if (userData.type === 'client') {
      return res.status(401).json({
        status: 401,
        error: 'Access denied!',
      });
    }
  } else {
    // User does not exist. Deleted when list was cleard
    return res.status(401).json({
      status: 401,
      error: 'Token is expired, please login again!',
    });
  }
};


// Transaction details
exports.transactionData = (transaction, accountObj) => (
  {
    transactionId: transaction.transactionId,
    accountNumber: accountObj.accountNumber,
    amount: transaction.amount,
    cashier: transaction.cashier,
    transactionType: transaction.transactionType,
    accountBalance: accountObj.balance,
  }
);

// Save bank transaction
exports.saveTransaction = (accountObj, req, cash, type) => {
  accountObj.transactionHistory.push({
    transactionId: new Date().valueOf(),
    transactionType: type,
    cashier: req.userId,
    accountBalance: accountObj.balance,
    amount: cash,
  });
};

// Check for the account number
exports.checkAccountNumber = (bankAccount, accountNumber) => {
  let Obj = null;
  bankAccount.forEach((account) => {
    if (account.accountNumber.toString() === accountNumber) {
      Obj = account;
    }
  });
  return Obj;
};

// If account with the account number does not exist
exports.ifNoAccount = (accountObj, res) => {
  if (!accountObj) {
    // Account does not exist
    return res.status(404).json({
      status: 404,
      error: 'Invalid account number, please check and try again!',
    });
  }
};

exports.checkAmount = (cash, res) => {
  // Zero and negative values not allowed
  if (cash <= 0) {
    return res.status(400).json({
      status: 400,
      error: 'Amount must greated than zero(0)',
    });
  }
};
