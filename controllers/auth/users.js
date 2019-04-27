/* eslint-disable consistent-return */
import db from '../../db';
import { currentUser } from '../bank-account/utils';


// user login
const users = async (req, res) => {
  // Getting the current user object
  const user = await currentUser(req.userId);
  if (!user) {
    return res.status(401).json({
      status: 401,
      error: 'Access denied, contact the system admin',
    });
  }
  // User should be admin to view user accounts
  if (!user.isadmin) {
    return res.status(401).json({
      status: 401,
      error: 'Access denied, contact the system admin',
    });
  }

  const query = 'SELECT * FROM users';
  const { rows } = await db.query(query);
  const userList = [];
  rows.forEach((row) => {
    const data = {
      firstName: row.firstname,
      lastName: row.lastname,
      email: row.email,
      type: row.type,
      isAdmin: row.isadmin,
      createdAt: row.createdat,
    };
    userList.push(data);
  });
  return res.status(200).json({
    status: 200,
    data: userList,
  });
};

export default users;
