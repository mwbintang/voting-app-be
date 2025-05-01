const { hashPassword, comparePassword } = require('../helpers/bcrypt');
const { generateToken, verifyToken } = require('../helpers/jwt');
const User = require('../models/User');
const Role = require('../models/Role');

const register = async (userData) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password before saving
  const hashedPassword = await hashPassword(password);

  const role = await Role.findOne({ name: "user" })

  const newUser = new User({
    username: name,
    email,
    password: hashedPassword,
    role: role._id
  });

  // Populate role before sending to client
  const populatedUser = await User.findById(newUser._id).populate("role", "name");

  const token = generateToken(populatedUser._id, populatedUser.role);
  return {
    message: 'User registered successfully',
    user: {
      _id: populatedUser._id,
      username: populatedUser.username,
      email: populatedUser.email,
      role: populatedUser.role.name
    },
    token
  };
};

const login = async (userData) => {
  const { email, password } = userData;

  // Find the user by email
  const user = await User.findOne({ email, isDeleted: false }).populate("role", "name");
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
  return {
    message: 'Login successful',
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role.name
    }
  };
};

module.exports = { register, login };