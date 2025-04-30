const jwtHelper = require('../helpers/jwt');
const User = require('../models/User');
require('../models/Permission')

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwtHelper.verifyToken(token);

    // Ensure userId exists in the decoded token
    if (!decoded.userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // Fetch the user with their role and permissions populated
    const user = await User.findById(decoded.userId).populate({
      path: 'role',
      populate: {
        path: 'permissions',
        model: 'Permission', // Explicitly mention model name to avoid MissingSchemaError
      },
    });

    if (!user || user?.isDeleted) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;