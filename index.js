// import export
const express = require('express');
// Import Body parser
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
// import router
const apiRoutes = require('./api-routes');

dotenv.config();

// Initialize the app
const app = express();

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
  extended: true,
}));
apiRoutes.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.text());

// use API routes in the app
app.use('/api/v1', apiRoutes);
// Setup server port
const PORT = process.env.PORT || 8080;

// Launch app to listen to a specific port
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Running Banka on port ${PORT}`);
});

module.exports = app; // for testing
