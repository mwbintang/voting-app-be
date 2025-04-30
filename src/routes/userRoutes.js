const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/permissionMiddleware'); // renamed for clarity

// All routes below require login
router.use(authMiddleware);

// Submit a vote (requires "create_vote" permission)
router.post('/vote', authorize(['create_vote']), userController.submitVote);

// Get vote stats (requires "view_votes" permission)
router.get('/votes', authorize(['view_votes']), userController.getVotes);

module.exports = router;
