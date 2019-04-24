/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
// import token generator
const middleware = require('../../middleware');
// Database connection
const { pool } = require('../../models/db');
// user login
exports.login = (req, res) => {
  const { password, email } = req.body;
  // Email and Password are required
  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      error: 'Email, Password and type are required !',
    });
  }

  pool.connect((err, client, done) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    client.query(query, [email], (error, result) => {
      done();
      if (error) {
        return res.status(400).json({
          status: 400,
          error,
        });
      }
      if (result.rows.length === 0) {
        return res.status(401).json({
          status: 401,
          error: 'Wrong email or password',
        });
      }

      const { rows } = result;
      const row = rows[0];

      // compare passwords
      const isAuthenticated = bcrypt.compareSync(password, row.password) && row.email === email;

      if (!isAuthenticated) {
        return res.status(401).json({
          status: 401,
          error: 'Wrong email or password',
        });
      }
      return res.status(202).send({
        status: 202,
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
    });
  });
};
