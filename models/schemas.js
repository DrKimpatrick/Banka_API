const tables = `
CREATE TABLE IF NOT EXISTS
            users(
                id SERIAL PRIMARY KEY,
                email VARCHAR(128) NOT NULL UNIQUE,
                firstName VARCHAR(128) NOT NULL,
                lastName VARCHAR(128),
                password TEXT NOT NULL,
                type VARCHAR(6) DEFAULT 'client',
                isAdmin BOOLEAN DEFAULT FALSE,
                createdAt TIMESTAMP DEFAULT NOW(),
                updatedAt TIMESTAMP DEFAULT NOW());

CREATE TABLE IF NOT EXISTS
            accounts(
                id SERIAL PRIMARY KEY,
                accountNumber VARCHAR(9) NOT NULL UNIQUE,
                createdOn TIMESTAMP DEFAULT NOW(),
                updatedOn TIMESTAMP DEFAULT NOW(),
                userId INTEGER NOT NULL ,
                type VARCHAR(7) NOT NULL,
                FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
                status VARCHAR(7) DEFAULT 'active',
                balance FLOAT DEFAULT 0);

CREATE TABLE IF NOT EXISTS
          transactions(
              id SERIAL PRIMARY KEY,
              transactionId VARCHAR(10) NOT NULL UNIQUE,
              createdOn TIMESTAMP DEFAULT NOW(),
              updatedOn TIMESTAMP DEFAULT NOW(),
              cashier INTEGER NOT NULL ,
              type VARCHAR(6) NOT NULL,
              amount FLOAT NOT NULL,
              oldBalance FLOAT NOT NULL,
              newBalance FLOAT NOT NULL,
              FOREIGN KEY(cashier) REFERENCES users(id) ON DELETE CASCADE,
              account_id INTEGER NOT NULL,
              FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE CASCADE);`;

module.exports = {
  tables,
};
