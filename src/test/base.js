// GENERAL
const email = 'dr.kimpatrick@gmail.com';
const password = 'Kp15712Kp';

// User signup ***************************************

// User data
exports.signup_user_1 = {
  email,
  firstName: 'Patrick',
  lastName: 'KImanje',
  password,
};

// user with missing fields
exports.signup_user_2 = {
  firstName: 'Patrick',
  lastName: 'KImanje',
  password,
};

// user supplies invalid user type
exports.signup_user_3 = {
  email,
  firstName: 'Patrick',
  lastName: 'KImanje',
  password,
};

// creating user of type staff
exports.signup_user_4 = {
  email,
  firstName: 'Patrick',
  lastName: 'KImanje',
  password,
};

exports.signup_user_5 = {
  email: 'invalid format',
  password,
  type: 'staff',
  firstName: 'Patrick',
};

exports.signup_user_6 = {
  email,
  password: 'invalid',
  type: 'staff',
  firstName: 'Patrick',
};

// user of type staff
exports.signup_user_7 = {
  email: 'staff@g.com',
  firstName: 'Patrick',
  lastName: 'KImanje',
  password,
};

// firstName with special characters
exports.signup_user_8 = {
  email: 'staff@g.com',
  firstName: 'Pat%%%%##',
  lastName: 'KImanje',
  password,
};

// latName with special characters
exports.signup_user_9 = {
  email: 'staff@g.com',
  firstName: 'Patrick',
  lastName: 'KImanje%%',
  password,
};

// Invalid user type
exports.signup_user_10 = {
  email: 'staff@g.com',
  firstName: 'Patrick',
  lastName: 'KImanje',
  password,
};
// User login *************************************

// email and assword exist
exports.login_user_1 = {
  email,
  password,
};

// wrong email or pasword
exports.login_user_2 = {
  email,
  password: 'wrong password',
};


// Banking *****************************************
exports.bank_account_1 = {
  type: 'current',
};

// invalid type
exports.bank_account_2 = {
  type: 'invalid',
};
