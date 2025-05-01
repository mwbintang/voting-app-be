const adminService = require('../services/adminService');

const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
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
    const candidatesStat = await adminService.getCandidates();
    res.status(200).json(candidatesStat);
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

const addCandidate = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await adminService.addCandidate(name);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await adminService.deleteCandidate(id);
    res.status(200).json({ message: 'Candidate deleted', candidate: deleted });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const changeUserRole = async (req, res) => {
  try {
    const { userId, roleName } = req.body;
    const updatedUser = await adminService.changeUserRole(userId, roleName);
    res.status(200).json({ message: 'User role updated', user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
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
