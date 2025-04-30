const adminService = require('../services/adminService');

const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({ users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllVotes = async (req, res) => {
  try {
    const votes = await adminService.getAllVotes();
    res.status(200).json({ votes });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getCandidates = async (req, res) => {
  try {
    const candidates = await adminService.getCandidates();
    res.status(200).json({ candidates });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const softDeleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await adminService.softDeleteUser(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getAllVotes,
  getCandidates,
  softDeleteUser
};
