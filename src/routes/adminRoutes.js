const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const permissionMiddleware = require('../middlewares/permissionMiddleware'); // ensure it uses permission-based middleware

// All routes below require login
router.use(authMiddleware);

// Vote
router.get('/votes', permissionMiddleware(['view_all_votes']), adminController.getAllVotes);

// User
router.get('/users', permissionMiddleware(['view_users']), adminController.getAllUsers);
router.put('/users/role', permissionMiddleware(['change_role_user']), adminController.changeUserRole);
router.delete('/users/:id', permissionMiddleware(['delete_user']), adminController.softDeleteUser);

// Candidate
router.get('/candidates', permissionMiddleware(['view_candidates']), adminController.getCandidates);
router.post('/candidates', permissionMiddleware(['add_candidate']), adminController.addCandidate);
router.delete('/candidates/:id', permissionMiddleware(['delete_candidate']), adminController.deleteCandidate);

module.exports = router;
