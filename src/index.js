require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./models'); // MongoDB connection

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the Voting App API');
});

// Connect to MongoDB
connectDB(); // this runs immediately, no need to await here

module.exports = app;
