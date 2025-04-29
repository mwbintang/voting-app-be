require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./models');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Voting App API');
});

app.use('/api', routes);

connectDB();

module.exports = app;
