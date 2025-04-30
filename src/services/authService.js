const { hashPassword, comparePassword } = require('../helpers/bcrypt');
const { generateToken, verifyToken } = require('../helpers/jwt');
const User = require('../models/User');

const register = async (userData) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password before saving
  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  const token = generateToken(newUser._id, newUser.role);
  return { message: 'User registered successfully', token };
};

const login = async (userData) => {
  const { email, password } = userData;

  // Find the user by email
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare password with hashed password in DB
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token on successful login
  const token = generateToken(user._id, user.role);
  return { message: 'Login successful', token };
};

module.exports = { register, login };