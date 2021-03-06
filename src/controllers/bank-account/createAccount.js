/* eslint-disable consistent-return */
import { currentUser } from './utils';
import db from '../../db';
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
  const newType = type.toLowerCase();
  const isTrue = accountTypes.indexOf(newType);
  if (isTrue < 0) {
    return res.status(400).json({
      status: 400,
      error: 'Type should either be savings, current / loan',
    });
  }

  // Getting the current user object
  const user = await currentUser(req.userId);
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
  const values = [newType, accountGenerator(), user.id];

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

export default createBankAccount;
