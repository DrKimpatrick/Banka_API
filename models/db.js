/* eslint-disable no-console */
const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();
// import table queries
const {
  tables,
} = require('./schemas');

// Database configurations
const { DATABASE_URL, DATABASE } = process.env;
let connectionString;
if (DATABASE_URL) {
  connectionString = DATABASE_URL; // Heroku db or test db
  console.log('--------------------------', DATABASE_URL);
} else {
  connectionString = {
    user: 'postgres',
    database: DATABASE || 'banka',
    password: 'Kp15712Kp',
    port: 5432,
    max: 10, // max number of clients in the pool
  };
}

const pool = new pg.Pool(connectionString);

pool.on('connect', () => {
  console.log('connected to the Database');
});

// Create table by running the tables query
const createTables = () => {
  pool.query(tables)
    .then()
    .catch(e => console.log(e));
};

const tearDown = () => {
  const sql = 'TRUNCATE TABLE users CASCADE';

  pool.query(sql)
    .then(() => {
      pool.end();
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
