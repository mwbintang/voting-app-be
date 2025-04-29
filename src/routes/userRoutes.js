const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/profile', authenticate, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      roles: req.user.roles.map(r => r.name)
    }
  });
});

// Example admin-only route
router.get('/admin-only', authenticate, authorize(['manage_users']), (req, res) => {
  res.json({ message: 'Only admin can access this route' });
});

module.exports = router;
