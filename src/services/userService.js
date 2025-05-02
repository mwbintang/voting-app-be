const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const adminService = require('./adminService');

const submitVote = async (userId, candidateName, io) => {
    try {
        // Check if the user has already voted
        const existingVote = await Vote.findOne({ userId });
        if (existingVote) {
            throw new Error('You have already voted.');
        }

        // Find or create the candidate by name
        let candidate = await Candidate.findOne({ name: candidateName });

        if (!candidate) {
            candidate = await Candidate.create({ name: candidateName, isCustom: true });
        }

        // Create the vote
        await Vote.create({
            userId,
            candidateId: candidate._id,
        });

        // Increment candidate vote count
        await Candidate.findByIdAndUpdate(candidate._id, {
            $inc: { votes: 1 },
        });

        // Emit to all connected clients via socket.io
        const candidateData = await adminService.getCandidates()
        io.emit('voteUpdated', { message: 'A new vote has been submitted', candidate: candidateData });

        return { message: 'Vote submitted successfully' };
    } catch (err) {
        throw new Error(err.message || 'Error submitting vote');
    }
};

const getCandidates = async (userId) => {
    try {
        const candidates = await Candidate.find({}).select("_id name isCustom").lean();

        // Get the vote for this user (assuming one vote per user)
        const vote = await Vote.findOne({ userId: userId });

        // Add `isPick: true` if the candidate matches the voted candidate
        const enrichedCandidates = candidates.map(candidate => ({
            ...candidate,
            isPick: vote && vote.candidateId.toString() === candidate._id.toString()
        }));

        return enrichedCandidates;
    } catch (err) {
        throw new Error('Error fetching candidates');
    }
};

module.exports = {
    submitVote,
    getCandidates
};
