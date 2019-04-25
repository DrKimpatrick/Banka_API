/* eslint-disable consistent-return */
const db = require('../../db');
// Current user information
const utils = require('./utils');

// Create bank account
const accountList = async (req, res) => {
  // Getting the current user object
  const user = await utils.currentUser(req.userId);
  if (!user) {
    return res.status(401).json({
      status: 401,
      error: 'Token expired please login again',
    });
  }

  // Check for bank account with the provided account number and user
  const query = `
          SELECT a.accountnumber,
          a.createdon,
          a.status,
          a.balance
          FROM users 
          INNER JOIN accounts AS a
            ON users.id = a.userId 
          WHERE users.id = $1`;
  const { rows } = await db.query(query, [user.id]);


  return res.status(200).json({
    status: 200,
    data: {
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      accounts: rows,
    },
  });
};

module.exports = accountList;
