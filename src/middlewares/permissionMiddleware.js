const Role = require('../models/Role');  // Import Role model

// Middleware to check if user has required permissions
const authorize = (requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      // Assuming req.user contains the user information after authentication
      const role = await Role.findOne({ _id: req.user.role._id })
        .populate('permissions', 'name')  // Populating permissions for each role

      // Flatten all permissions from the role
      const userPermissions = role.permissions.map(p => p.name);

      // Check if the user has all the required permissions
      const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));

      if (!hasPermission) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      next();  // User has required permissions, proceed to the next middleware or route handler
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

module.exports = authorize;
