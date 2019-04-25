/* eslint-disable consistent-return */
const db = require('../../db');
// Current user information
const utils = require('./utils');

// Delete bank account
const deleteAccount = async (req, res) => {
  const { params: { accountNumber } } = req;

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

  // Check for bank account with the provided account number
  const accountObj = await utils.checkAccountNumber(accountNumber);

  // Check if account exists
  if (utils.ifNoAccount(accountObj, res)) {
    // Account does not exist
    return utils.ifNoAccount(accountObj, res);
  }

  // Update the account status to active/dormant/draft to deactive
  const sql = 'DELETE FROM accounts WHERE accountNumber = $1 returning *';
  await db.query(sql, [accountNumber]);

  // Return account details
  return res.status(200).json({
    status: 200,
    data: {
      message: `Account with accountNumber: ${accountNumber} has been successfuly deleted`,
    },
  });
};

module.exports = deleteAccount;
