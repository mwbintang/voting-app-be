const userService = require('../services/userService');

const submitVote = async (req, res) => {
  const { candidateName } = req.body;

  try {
    const vote = await userService.submitVote(req.user._id, candidateName);
    res.status(201).json({ message: 'Vote submitted successfully', vote });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getVotes = async (req, res) => {
  try {
    const stats = await userService.getVoteStats();
    res.status(200).json({ candidates: stats });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  submitVote,
  getVotes
};
