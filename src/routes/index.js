const express = require('express');
const authRouter = require('./authRoutes');
const userRouter = require('./userRoutes');
const adminRouter = require('./adminRoutes');

const router = express.Router();

// Define routes
router.use('/', authRouter);
router.use('/user', userRouter);
router.use('/admin', adminRouter);

module.exports = router;
