/* eslint-disable consistent-return */
const db = require('../../db');
// Current user information
const utils = require('./utils');

const accountDetails = async (req, res) => {
  const { accountNumber } = req.params;
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
          u.email AS ownerEmail,
          a.status,
          a.type,
          a.balance
  FROM users as u
  INNER JOIN accounts as a 
  ON u.id = a.userId
  WHERE accountNumber = $1 AND userId = $2`;
  const { rows } = await db.query(query, [accountNumber, user.id]);

  if (rows.length === 0) {
    //
    return res.status(404).json({
      status: 404,
      error: `You don't own any account with number ${accountNumber}`,
    });
  }

  return res.status(200).json({
    status: 200,
    data: rows[0],
  });
};

module.exports = accountDetails;
