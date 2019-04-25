/* eslint-disable consistent-return */
const db = require('../../db');
// Current user information
const utils = require('./utils');

exports.transactionsHistory = async (req, res) => {
  const { accountNumber } = req.params;
  // Getting the current user object
  const user = await utils.currentUser(req.userId);
  if (!user) {
    return res.status(401).json({
      status: 401,
      error: 'Token expired please login again',
    });
  }

  // check if user has account with this accountNumber
  const query = 'SELECT * FROM accounts WHERE accountNumber = $1 AND userId = $2';
  const { rows } = await db.query(query, [accountNumber, user.id]);

  if (rows.length === 0) {
    return res.status(404).json({
      status: 404,
      error: `You don't own any account with number ${accountNumber}`,
    });
  }

  // Check for bank account with the provided account number and user
  const sql = `
  SELECT a.accountnumber,
          t.transactionid,
          t.amount,
          t.oldbalance,
          t.newbalance,
          t.type,
          t.createdon
  FROM users as u
  INNER JOIN accounts as a 
  ON u.id = a.userId
  INNER JOIN transactions as t
  ON a.id = t.account_id
  WHERE accountNumber = $1 AND userId = $2`;
  const result = await db.query(sql, [accountNumber, user.id]);

  return res.status(200).json({
    status: 200,
    data: result.rows,
  });
};

exports.transactionsDetail = async (req, res) => {
  const { transactionId } = req.params;
  // Getting the current user object
  const user = await utils.currentUser(req.userId);
  if (!user) {
    return res.status(401).json({
      status: 401,
      error: 'Token expired please login again',
    });
  }

  // Check for transaction with the provided transactionId and user
  const sql = `
    SELECT a.accountnumber,
            t.transactionid,
            t.amount,
            t.oldbalance,
            t.newbalance,
            t.type,
            t.createdon
    FROM users as u
    INNER JOIN accounts as a 
    ON u.id = a.userId
    INNER JOIN transactions as t
    ON a.id = t.account_id
    WHERE transactionId = $1 AND userId = $2`;
  const { rows } = await db.query(sql, [transactionId, user.id]);
  if (rows.length === 0) {
    //
    return res.status(404).json({
      status: 404,
      error: `You don't own any transaction with ID ${transactionId}`,
    });
  }

  return res.status(200).json({
    status: 200,
    data: rows[0],
  });
};
