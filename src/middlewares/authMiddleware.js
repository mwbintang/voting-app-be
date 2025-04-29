const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId).populate({
      path: 'roles',
      populate: { path: 'permissions' }
    });

    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authorize = (requiredPermissions = []) => {
  return (req, res, next) => {
    const userPerms = req.user.roles.flatMap(role => role.permissions.map(p => p.name));
    const hasPermission = requiredPermissions.every(p => userPerms.includes(p));

    if (!hasPermission) return res.status(403).json({ message: 'Forbidden' });

    next();
  };
};

module.exports = { authenticate, authorize };