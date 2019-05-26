import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

if (process.env.NODE_ENV === 'production') {
  module.exports = new Pool({ connectionString: process.env.DATABASE_URL });
} else if (process.env.NODE_ENV === 'testing') {
  module.exports = new Pool({ connectionString: process.env.DATABASE_TEST });
} else {
  module.exports = new Pool({ connectionString: process.env.DATABASE_DEV });
}
