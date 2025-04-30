const User = require('../models/User');
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');

const getAllUsers = async () => {
  try {
    const users = await User.find().select('-password').populate('role');
    return users;
  } catch (err) {
    throw new Error('Error fetching users');
  }
};

const getAllVotes = async () => {
  try {
    return Vote.find().populate('userId candidateId');
  } catch (err) {
    throw new Error('Error fetching votes');
  }
};

const getCandidates = async () => {
  try {
    return Candidate.find().sort({ votes: -1 });
  } catch (err) {
    throw new Error('Error fetching candidates');
  }
};

const softDeleteUser = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isDeleted) {
      throw new Error('User already deleted');
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    return { message: 'User soft-deleted successfully', user };
  } catch (err) {
    throw new Error(err.message || 'Error deleting user');
  }
};

module.exports = {
  getAllUsers,
  getAllVotes,
  getCandidates,
  softDeleteUser
};
