import 'dotenv/config';
import express from 'express';
import connectDatabase from './config/database';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });