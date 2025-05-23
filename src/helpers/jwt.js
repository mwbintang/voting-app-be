const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Generate JWT Token
const generateToken = (userId, role) => {
  const payload = { userId, role };
  const secret = process.env.JWT_SECRET; // Use dotenv for secret key

  const token = jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRES_IN });
  return token;
};

// Verify JWT Token
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET; // Use dotenv secret

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = { generateToken, verifyToken };
