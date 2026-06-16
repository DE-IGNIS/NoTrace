const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

require('dotenv').config();

app.use(helmet());                // security headers – first
app.use(cors());                  // CORS
app.use(express.json());

app.use(morgan('combined'));

app.get('/api/health', (req, res) => {
  res.json({ message: 'Health of backend server is good' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
