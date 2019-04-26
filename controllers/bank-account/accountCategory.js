/* eslint-disable consistent-return */
import { query as _query } from '../../db';
// Current user information
import { currentUser, isNotClient } from './utils';

const accountCategories = async (req, res) => {
  const { status } = req.query;

  if (!status) {
    return res.status(400).json({
      status: 400,
      error: 'You should specify the account status',
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

  // User must be staff/admin to perform the operation
  if (isNotClient(user, res)) {
    return isNotClient(user, res);
  }

  // TYpe should be current or savings
  const accountTypes = ['active', 'dormant', 'draft'];
  const newStatus = status.toLowerCase();
  const isTrue = accountTypes.indexOf(newStatus);
  if (isTrue < 0) {
    return res.status(400).json({
      status: 400,
      error: 'Status should be active/dormant/draft',
    });
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
          ON u.id = a.userId WHERE a.status=$1`;
  const { rows } = await _query(query, [newStatus]);

  return res.status(200).json({
    status: 200,
    data: rows,
  });
};

export default accountCategories;
