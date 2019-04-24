/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
// import token generator
const middleware = require('../../middleware');

const db = require('../../db');


// user login
exports.login = async (req, res) => {
  const { password, email } = req.body;
  // Email and Password are required
  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      error: 'Email, Password and type are required !',
    });
  }
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await db.query(query, [email]);

  // No user with the email
  if (!rows[0]) {
    return res.status(401).json({
      status: 401,
      error: 'Wrong email or password',
    });
  }
  const row = rows[0];
  // compare passwords
  const isAuthenticated = bcrypt.compareSync(password, row.password) && row.email === email;

  if (!isAuthenticated) {
    return res.status(401).json({
      status: 401,
      error: 'Wrong email or password',
    });
  }
  return res.status(201).send({
    status: 201,
    data: {
      token: middleware.token(row.id),
      id: row.id,
      firstName: row.firstname,
      lastName: row.lastname,
      email: row.email,
      type: row.type,
      isAdmin: row.isadmin,
      createdAt: row.createdat,
    },
  });
};
