const userService = require('../services/userService');

const submitVote = async (req, res) => {
  const { candidateName } = req.body;

  try {
    const io = req.app.get('io');
    const result = await userService.submitVote(req.user._id, candidateName, io);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getCandidates = async (req, res) => {
  try {
    const result = await userService.getCandidates(req.user._id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  submitVote,
  getCandidates
};
