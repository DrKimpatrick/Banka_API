/* eslint-disable consistent-return */
const utils = require('./utils');
const db = require('../../db');
// Generate a bank account number, a nine character number
const accountGenerator = () => Math.floor(Math.random() * 1000000000);

// Create bank account
const createBankAccount = async (req, res) => {
  const { type } = req.body;
  // Email and Password are required
  if (!type) {
    return res.status(400).json({
      status: 400,
      error: 'Account type is required !',
    });
  }

  // TYpe should be current or savings
  const accountTypes = ['savings', 'current', 'loan'];
  type.toLowerCase();
  const isTrue = accountTypes.indexOf(type);
  if (isTrue < 0) {
    return res.status(400).json({
      status: 400,
      error: 'Type should either be savings, current / loan',
    });
  }

  // Getting the current user object
  const user = await utils.currentUser(req.userId);
  if (!user) {
    return res.status(401).json({
      status: 401,
      error: 'Token expired please login again',
    });
  }
  // Create bank account
  const query = `INSERT INTO accounts(
    type,
    accountNumber,
    userId) 
    VALUES ($1, $2, $3) RETURNING *`;
  const values = [type, accountGenerator(), user.id];

  const { rows } = await db.query(query, values);


  // account response
  return res.status(201).json({
    status: 201,
    data: {
      accountNumber: rows[0].accountnumber,
      createdOn: rows[0].createdon,
      status: rows[0].status,
      type: rows[0].type,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      openingBalance: rows[0].balance,
    },
  });
};

module.exports = createBankAccount;
