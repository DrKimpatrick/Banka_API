const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();
// App environment

if (process.env.NODE_ENV === 'production') {
  module.exports = new Pool({ connectionString: process.env.DATABASE_URL });
} else if (process.env.NODE_ENV === 'testing') {
  module.exports = new Pool({ connectionString: 'postgresql://postgres:Kp15712Kp@localhost:5432/test_db' });
} else {
  // production
  module.exports = new Pool({ connectionString: 'postgresql://postgres:Kp15712Kp@localhost:5432/banka' });
}
