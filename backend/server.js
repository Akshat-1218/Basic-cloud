const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'OK', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: 'disconnected' });
  }
});

app.use('/api/employees', employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
