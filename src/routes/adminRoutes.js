const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const permissionMiddleware = require('../middlewares/permissionMiddleware'); // ensure it uses permission-based middleware

// All routes below require login
router.use(authMiddleware);

// Admin routes with permission checks
router.get('/users', permissionMiddleware(['view_users']), adminController.getAllUsers);
router.get('/votes', permissionMiddleware(['view_all_votes']), adminController.getAllVotes);
router.get('/candidates', permissionMiddleware(['view_candidates']), adminController.getCandidates);
router.delete('/users/:id', permissionMiddleware(['delete_user']), adminController.softDeleteUser);

module.exports = router;
