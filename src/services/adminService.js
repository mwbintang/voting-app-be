const User = require('../models/User');
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const Role = require('../models/Role');

const getAllUsers = async () => {
  try {
    const users = await User.find({isDeleted: false}).select('-password').populate('role');

    const simplifiedUsers = users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role?.name || null,
    }));

    return simplifiedUsers;
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
    return Candidate.find().sort({ votes: -1 }).select("_id name votes isCustom");
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

const addCandidate = async (name) => {
  try {
    const existing = await Candidate.findOne({ name });
    if (existing) {
      throw new Error('Candidate with this name already exists');
    }

    const candidate = new Candidate({ name });
    await candidate.save();
    return { message: 'Candidate added' };
  } catch (err) {
    throw err;
  }
};

const deleteCandidate = async (id) => {
  try {
    // Delete all votes associated with the candidate
    await Vote.deleteMany({ candidateId: id });

    const deleted = await Candidate.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error('Candidate not found');
    }
    return deleted;
  } catch (err) {
    throw err;
  }
};

const changeUserRole = async (userId, roleName) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const role = await Role.findOne({name: roleName});
    if (!role) throw new Error('Role not found');

    user.role = role._id;
    await user.save();
    return user;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllUsers,
  getAllVotes,
  getCandidates,
  softDeleteUser,
  addCandidate,
  deleteCandidate,
  changeUserRole
};
