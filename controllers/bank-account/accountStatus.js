/* eslint-disable consistent-return */
const db = require('../../db');
// Current user information
const utils = require('./utils');

// Deactivate/acivate/draft bank account
const accountStatus = async (req, res) => {
  const { body: { status }, params: { accountNumber } } = req;

  // Getting the current user object
  const user = await utils.currentUser(req.userId);
  if (!user) {
    return res.status(401).json({
      status: 401,
      error: 'Token expired please login again',
    });
  }

  // User must be admin to perform the operation
  if (utils.isAdminUser(user, res)) {
    return utils.isAdminUser(user, res);
  }

  if (!status) {
    return res.status(400).json({
      status: 400,
      error: 'Status is required',
    });
  }
  // Remove trailing spaces
  let newStatus = status.split(' ').join('');
  // convert status to lowerCase
  newStatus = newStatus.toLowerCase();

  // status should dormant / active / draft
  const statusArray = ['dormant', 'active', 'draft'];
  const isPresent = (statusArray.indexOf(newStatus) > -1);
  if (!isPresent) {
    return res.status(400).json({
      status: 400,
      error: 'Status should be active, dormant or draft',
    });
  }

  // Check for bank account with the provided account number
  const accountObj = await utils.checkAccountNumber(accountNumber);

  // Check if account exists
  if (utils.ifNoAccount(accountObj, res)) {
    // Account does not exist
    return utils.ifNoAccount(accountObj, res);
  }

  // Update the account status to active/dormant/draft to deactive
  const sql = 'UPDATE accounts SET status = $1 WHERE accountNumber = $2 returning *';
  const { rows } = await db.query(sql, [newStatus, accountNumber]);


  // Return account details
  return res.status(200).json({
    status: 200,
    data: rows[0],
  });
};

module.exports = accountStatus;
