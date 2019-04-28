
import express from 'express';
import Cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import apiRoutes from './api-routes';
import swaggerDoc from './swagger.json';

dotenv.config();

// Initialize the app
const app = express();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(Cors());


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// use API routes in the app
app.use('/api/v1', apiRoutes);

// Setup server port
const PORT = process.env.PORT || 3000;

// Launch app to listen to a specific port
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Running Banka on port ${PORT}`);
});

export default app;
