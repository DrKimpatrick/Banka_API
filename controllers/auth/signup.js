/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const bcrypt = require('bcryptjs');
// import token generator
const middleware = require('../../middleware');

const db = require('../../db');


const checkName = (name, res) => {
  /*
  Regular expression for name with spaces allowed in
  between the text and avoid spaces when there is no text
  Check the format in fisrtName and lastName are presented
  Numbers and special characters are not allowed

   */
  if (!name.match(/^(?![\s.]+$)[a-zA-Z\s.]*$/)) {
    return res.status(400).json({
      status: 400,
      error: 'Names should not contain special characters',
    });
  }
};

const checkEmail = (email, res) => {
  // Validate email
  if (!email.match(/^[A-Za-z0-9.+_-]+@[A-Za-z0-9._-]+\.[a-zA-Z]{2,}$/)) {
    return res.status(400).json({
      status: 400,
      error: 'Invalid email format ',
    });
  }
};

const checkPassword = (password, res) => {
  if (!password.match(/^(?=.*\d)[0-9a-zA-Z]{8,}$/)) {
    return res.status(400).json({
      status: 400,
      error: 'Weak password, must be at least 8 characters and have at least 1 letter and number',
    });
  }
};

// create user account
exports.signup = async (req, res) => {
  const {
    email, firstName, lastName, password,
  } = req.body;

  // Email and Password are required
  if (!email || !password || !firstName) {
    return res.status(400).json({
      status: 400,
      error: 'Email, Password and firstName are required !',
    });
  }
  // format firstName and lastName
  const fisrtN = firstName ? firstName.trim() : '';
  const lastN = lastName ? lastName.trim() : '';

  // Check firstName
  if (checkName(fisrtN, res)) {
    return checkName(fisrtN, res);
  }

  // Check lastName....since lastName is not required we 1st check if it is present
  if (lastN) {
    if (checkName(lastN, res)) {
      return checkName(lastN, res);
    }
  }

  // Validate email
  if (checkEmail(email, res)) {
    return checkEmail(email, res);
  }

  // Validate password
  if (checkPassword(password, res)) {
    return checkPassword(password, res);
  }

  // hashpassword
  const hashedPassword = bcrypt.hashSync(password, 8);

  // capture data
  const data = {
    email,
    firstName: fisrtN,
    lastName: lastN,
    password: hashedPassword,
  };

  // Email should be unique. 1st check if user with the above email already exists
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await db.query(query, [email]);
  if (rows.length > 0) {
    return res.status(404).send({
      status: '400',
      message: 'Email already exists, please try another',
    });
  }

  // Insert new user in the database
  const query2 = `INSERT INTO users(
  email, 
  firstName, 
  lastName, 
  password) 
  VALUES ($1, $2, $3, $4) RETURNING *`;
  const values = [data.email, data.firstName,
    data.lastName, data.password];

  const result = await db.query(query2, values);
  const row = result.rows[0];

  return res.status(201).send({
    status: 201,
    data: {
      token: middleware.token(data.id),
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
