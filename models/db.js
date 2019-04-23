/* eslint-disable no-console */
const dotenv = require('dotenv');
const pool = require('../config');

dotenv.config();
// import table queries
const {
  tables,
} = require('./schemas');


// Create table by running the tables query
const createTables = () => {
  pool.query(tables)
    .then()
    .catch(e => console.log(e));
};

const tearDown = () => {
  const sql = 'DROP TABLE users, accounts, transactions CASCADE';

  pool.query(sql)
    .then(() => {
    })
    .catch(e => console.log(e));
};

// export pool and createTables to be accessible  from an where within the application
module.exports = {
  createTables,
  pool,
  tearDown,
};

require('make-runnable');
