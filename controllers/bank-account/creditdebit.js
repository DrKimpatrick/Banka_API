/* eslint-disable consistent-return */
// Current user information
import {
  checkAmount, currentUser, isStaff, checkAccountNumber,
  ifNoAccount, saveTransaction, transactionData,
} from './utils';
import db from '../../db';
// Credit user account
exports.creditTransaction = async (req, res) => {
  const { params: { accountNumber }, body: { amount } } = req;
  // Amount required
  if (!amount) {
    return res.status(400).json({
      status: 400,
      error: 'Amount is required !',
    });
  }

  // Ensure amount is float / integer
  const cash = Number(amount);

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(amount)) {
    return res.status(400).json({
      status: 400,
      error: 'Invalid amount format !!!',
    });
  }
  // Zero and negative values not allowed
  if (checkAmount(cash, res)) {
    return checkAmount(cash, res);
  }
  // Getting the current user object
  const user = await currentUser(req.userId);
  if (!user) {
    return res.status(401).json({
      status: 401,
      error: 'Token expired please login again',
    });
  }

  // User must be staff/admin to perform the operation
  if (isStaff(user, res)) {
    return isStaff(user, res);
  }

  // Check for bank account with the provided account number
  const accountObj = await checkAccountNumber(accountNumber);

  // Check if account exists
  if (ifNoAccount(accountObj, res)) {
    // Account does not exist
    return ifNoAccount(accountObj, res);
  }

  // Credit bank account
  const newBalance = (Number(accountObj.balance) + cash);

  // Update the account Balance
  const sql = 'UPDATE accounts SET balance = $1 WHERE accountNumber = $2 returning *';
  await db.query(sql, [newBalance, accountNumber]);

  const cashier = await currentUser(req.userId);
  // save Credit transaction
  const transObj = await saveTransaction(newBalance, cashier.id, cash, 'Credit', accountObj.balance, accountObj.id);

  // Return account details
  return res.status(201).json({
    status: 201,
    data: transactionData(transObj, accountObj),
  });
};

// Debit user account
exports.debitTransaction = async (req, res) => {
  const { params: { accountNumber }, body: { amount } } = req;

  // Amount required
  if (!amount) {
    return res.status(400).json({
      status: 400,
      error: 'Amount is required !',
    });
  }
  // Ensure amount is float / integer
  const cash = Number(amount);

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(amount)) {
    return res.status(400).json({
      status: 400,
      error: 'Invalid amount format !!!',
    });
  }

  // Zero and negative values not allowed
  if (checkAmount(cash, res)) {
    return checkAmount(cash, res);
  }

  // Getting the current user object
  const user = await currentUser(req.userId);
  if (!user) {
    return res.status(401).json({
      status: 401,
      error: 'Token expired please login again',
    });
  }

  // User must be staff/admin to perform the operation
  if (isStaff(user, res)) {
    return isStaff(user, res);
  }

  // Check for bank account with the provided account number
  const accountObj = await checkAccountNumber(accountNumber);

  // Check if account exists
  if (ifNoAccount(accountObj, res)) {
    // Account does not exist
    return ifNoAccount(accountObj, res);
  }

  // Debit bank account
  // User should not request more than the available balance
  if (cash > Number(accountObj.balance)) {
    return res.status(403).json({
      status: 403,
      error: 'You can not withdraw more than the available balance',
    });
  }
  // Otherwise continue
  const newBalance = (Number(accountObj.balance) - cash);

  // Update the account Balance
  const sql = 'UPDATE accounts SET balance = $1 WHERE accountNumber = $2 returning *';
  await db.query(sql, [newBalance, accountNumber]);

  const cashier = await currentUser(req.userId);
  // save Credit transaction
  const transObj = await saveTransaction(newBalance, cashier.id, cash, 'Debit', accountObj.balance, accountObj.id);

  // Return account details
  return res.status(201).json({
    status: 201,
    data: transactionData(transObj, accountObj),
  });
};
