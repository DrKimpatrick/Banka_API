/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
import { query as _query } from '../../db';
import { currentUser } from '../bank-account/utils';
// Type should be client / staff
const checkUserType = (userType, res) => {
  const userTypes = ['client', 'staff'];

  const isTrue = userTypes.indexOf(userType);
  if (isTrue < 0) {
    return res.status(400).json({
      status: 400,
      error: 'Type should either be client / staff',
    });
  }
};


// change user type by the admin
const changeUserType = async (req, res) => {
  const { type, isAdmin, email } = req.body;

  // Email and Password are required
  if (!email || !isAdmin || !type) {
    return res.status(400).json({
      status: 400,
      error: 'Email, isAdmin and type are required !',
    });
  }

  // Getting the current user object
  const user = await currentUser(req.userId);
  if (!user) {
    return res.status(401).json({
      status: 401,
      error: 'Access denied, contact the system admin',
    });
  }
  // User should be admin to change user type
  if (!user.isadmin) {
    return res.status(401).json({
      status: 401,
      error: 'Access denied, contact the system admin',
    });
  }


  // Type should be client / staff
  const userType = type.toLowerCase();
  if (checkUserType(userType, res)) {
    return checkUserType(type, res);
  }

  // isAdmin should be [false/true]
  const booln = ['false', 'true'];
  const admin = isAdmin ? isAdmin.toLowerCase() : 'false';
  const result = booln.indexOf(admin);
  if (result < 0) {
    return res.status(400).json({
      status: 400,
      error: 'isAdmin should be set to true/false',
    });
  }

  let isAdminTrue = admin;
  if (type === 'client') {
    isAdminTrue = false;
  }

  // Update the type && isAdmin fields
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await _query(query, [email]);
  if (rows.length === 0) {
    return res.status(404).send({
      status: 404,
      message: 'User with that email is not found!',
    });
  }

  const sql = 'UPDATE users SET type = $1, isAdmin = $2 WHERE email = $3 returning *';
  const response = await _query(sql, [type, isAdminTrue, email]);
  const row = response.rows[0];
  return res.status(201).send({
    status: 201,
    data: {
      firstName: row.firstname,
      lastName: row.lastname,
      email: row.email,
      type: row.type,
      isAdmin: row.isadmin,
      createdAt: row.createdat,
    },
  });
};

export default changeUserType;
