const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Generate JWT Token
const generateToken = (userId, roles) => {
  const payload = { userId, roles };
  const secret = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use dotenv for secret key

  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  return token;
};

// Verify JWT Token
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use dotenv secret

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = { generateToken, verifyToken };
