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

  // User must be staff/admin to perform the operation
  if (utils.isNotClient(user, res)) {
    return utils.isNotClient(user, res);
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

module.exports = accountList;
