const db = require('../../db');

// Insert a super user in the database
const createSuperUser = async () => {
  // Email should be unique. 1st check if user with the above email already exists
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await db.query(query, ['admin@crest.com']);
  const sql = `INSERT INTO users(
        email, 
        password,
        type,
        isAdmin, firstName) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = ['admin@crest.com', 'Kp15712Kp', 'staff', true, 'admin'];

  if (rows.length === 0) {
    await db.query(sql, values);
    // eslint-disable-next-line no-console
    console.log('created a super user');
  }
};

module.exports = createSuperUser;
require('make-runnable');
