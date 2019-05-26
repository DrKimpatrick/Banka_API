/* eslint-disable consistent-return */
import db from '../../db';
// Current user information
import { currentUser, isNotClient } from './utils';

// Create bank account
exports.accountList = async (req, res) => {
  // Getting the current user object
  const user = await currentUser(req.userId);
  if (!user) {
    return res.status(401).json({
      status: 401,
      error: 'Token expired please login again',
    });
  }

  // User must be staff/admin to perform the operation
  if (isNotClient(user, res)) {
    return isNotClient(user, res);
  }

  const query = `
        SELECT a.accountnumber,
        a.createdon,
        a.status,
        a.balance,
        u.firstname,
        u.lastname,
        u.email
        FROM users AS u
        INNER JOIN accounts AS a
        ON u.id = a.userId `;
  const { rows } = await db.query(query);

  return res.status(200).json({
    status: 200,
    data: rows,
  });
};


exports.specificUserAccounts = async (req, res) => {
  const { email } = req.params;

  // Getting the current user object
  const user = await currentUser(req.userId);
  if (!user) {
    return res.status(401).json({
      status: 401,
      error: 'Token expired please login again',
    });
  }

  // User must be admin to perform the operation
  if (isNotClient(user, res)) {
    return isNotClient(user, res);
  }

  if (!email) {
    return res.status(400).json({
      status: 400,
      error: 'Email is required',
    });
  }

  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await db.query(query, [email]);

  // No user with the email
  if (!rows[0]) {
    return res.status(404).json({
      status: 404,
      error: 'User with that email is not found',
    });
  }

  // Check for bank account with the provided account number and user
  const query2 = `
            SELECT a.accountnumber,
            a.createdon,
            a.status,
            a.balance
            FROM users 
            INNER JOIN accounts AS a
              ON users.id = a.userId 
            WHERE users.email = $1`;
  const result = await db.query(query2, [email]);

  return res.status(200).json({
    status: 200,
    data: {
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      accounts: result.rows,
    },
  });
};
