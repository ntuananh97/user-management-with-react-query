require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
  console.log(`Using in-memory database`);
}); 