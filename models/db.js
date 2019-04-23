/* eslint-disable no-console */
const pg = require('pg');
// import table queries
const {
  transactionTable,
  usersTable,
  bankAccountTable,
} = require('./schemas');

// Database configurations
const config = {
  user: 'postgres',
  database: process.env.DATABASE || 'banka',
  password: process.env.PASSWORD || 'Kp15712Kp',
  port: process.env.DB_PORT || 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log('connected to the Database');
});

// Create table by run the above queries
const createTables = () => {
  [usersTable, bankAccountTable, transactionTable].forEach((table) => {
    pool.query(table)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  });
};


pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});


// export pool and createTables to be accessible  from an where within the application
module.exports = {
  createTables,
  pool,
};

require('make-runnable');
