import bcrypt from 'bcryptjs';
import { query as _query } from '../../db';


// Insert a super user in the database
const createSuperUser = async () => {
  // Email should be unique. 1st check if user with the above email already exists
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await _query(query, ['admin@crest.com']);
  // hashpassword
  const hashedPassword = bcrypt.hashSync('Kp15712Kp', 8);

  const sql = `INSERT INTO users(
        email, 
        password,
        type,
        isAdmin, firstName) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = ['admin@crest.com', hashedPassword, 'staff', true, 'admin'];

  if (rows.length === 0) {
    await _query(sql, values);
    // eslint-disable-next-line no-console
    console.log('created a super user');
  }
};

export default createSuperUser;
require('make-runnable');
