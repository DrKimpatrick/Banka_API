[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8f95f225d4c94ab0b7f4d922dcdd4871)](https://www.codacy.com/app/DrKimpatrick/Banka_API?utm_source=github.com&utm_medium=referral&utm_content=DrKimpatrick/Banka_API&utm_campaign=Badge_Grade) [![Maintainability](https://api.codeclimate.com/v1/badges/7785b47cc7abf23bf8c2/maintainability)](https://codeclimate.com/github/DrKimpatrick/Banka_API/maintainability) [![BCH compliance](https://bettercodehub.com/edge/badge/DrKimpatrick/Banka_API?branch=develop)](https://bettercodehub.com/)

| Service          | Master                                                                                                                                                                   | Develop                                                                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Travis CI status | [![Build Status](https://travis-ci.org/DrKimpatrick/Banka_API.svg?branch=master)](https://travis-ci.org/DrKimpatrick/Banka_API)                                          | [![Build Status](https://travis-ci.org/DrKimpatrick/Banka_API.svg?branch=develop)](https://travis-ci.org/DrKimpatrick/Banka_API)                                           |
| Coveralls        | [![Coverage Status](https://coveralls.io/repos/github/DrKimpatrick/Banka_API/badge.svg?branch=master)](https://coveralls.io/github/DrKimpatrick/Banka_API?branch=master) | [![Coverage Status](https://coveralls.io/repos/github/DrKimpatrick/Banka_API/badge.svg?branch=develop)](https://coveralls.io/github/DrKimpatrick/Banka_API?branch=develop) |

# Banka_API

API for the Banka app. A light-weight core banking application that powers banking operations. It is built in Node/Express and uses data structures to store data in memory (No use of a database).

![demo image](demo.gif "Demo")

### Hosted Apps

- Banka [UI](https://drkimpatrick.github.io/Banka/UI/)
- Banka [API](https://bankaapi.herokuapp.com/)

### Documentation (swagger)

- Banka [DOC](https://bankaapi.herokuapp.com/docs/)

#### Requirements

- [Node](https://nodejs.org/en/) Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.

# Getting Started

In your terminal

1. Clone the repo locally to your machine by running `git clone https://github.com/DrKimpatrick/Banka_API.git`
2. change your current directory (`cd`) to wherever you cloned the app in 1 above.

#### Development setup

- Install dependencies
  ```bash
  npm install
  ```

#### Run the application

```bash
node index
```

#### Running tests

```bash

npm test

```

#### API REST End Points

| End Point                                    | Verb   | Use                                   |
| -------------------------------------------- | ------ | ------------------------------------- |
| `/api/v1/auth/signup`                        | POST   | Create user account                   |
| `/api/v1/auth/login`                         | POST   | User login                            |
| `/api/v1/account`                            | POST   | Create Bank account                   |
| `/api/v1/status/:accountNumber`              | PATCH  | Updates account status by staff/admin |
| `/api/v1/transactions/:accountNumber/credit` | POST   | Credits a bank account by a staff     |
| `/api/v1/transactions/:accountNumber/debit`  | POST   | Debits a bank account by staff        |
| `/api/v1/status/:accountNumber`              | DELETE | Deletes a bank account                |
| `/api/v1/account/history`                    | GET    | Gets user account transaction history |
| `/api/v1/users`                              | GET    | Retrieves all user accounts           |

#### Built With

- [Express](https://expressjs.com/) A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications

## Acknowledgments

A Special thanks goes to

1. [Andela](https://andela.com/) for having given me an opportunity to participate in the boot camp, without them , this application wouldn't have existed
