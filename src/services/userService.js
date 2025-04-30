const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');

const submitVote = async (userId, candidateName) => {
    try {
        // Check if the user has already voted
        const existingVote = await Vote.findOne({ userId });
        if (existingVote) {
            throw new Error('You have already voted.');
        }

        // Find or create the candidate by name
        let candidate = await Candidate.findOne({ name: candidateName });

        if (!candidate) {
            candidate = await Candidate.create({ name: candidateName });
        }

        // Create the vote
        const vote = await Vote.create({
            userId,
            candidateId: candidate._id,
        });

        // Increment candidate vote count
        await Candidate.findByIdAndUpdate(candidate._id, {
            $inc: { votes: 1 },
        });

        return vote;
    } catch (err) {
        throw new Error(err.message || 'Error submitting vote');
    }
};

const getVoteStats = async () => {
    try {
        // Get all candidates and their vote counts
        const candidates = await Candidate.find({}).sort({ votes: -1 });
        return candidates;
    } catch (err) {
        throw new Error('Error fetching vote stats');
    }
};

module.exports = {
    submitVote,
    getVoteStats
};
