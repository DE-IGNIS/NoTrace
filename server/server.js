import express from 'express';
import cors from 'cors';
import transactionRoutes from './routes/transactionRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/transactions', transactionRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});