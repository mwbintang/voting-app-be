const express = require('express');
const authRouter = require('./authRoutes');
const userRouter = require('./userRoutes');

const router = express.Router();

// Define routes
router.use('/', authRouter);
router.use('/users', userRouter);

module.exports = router;
