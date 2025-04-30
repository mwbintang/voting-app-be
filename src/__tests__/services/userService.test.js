const userService = require('../../services/userService');
const Vote = require('../../models/Vote');
const Candidate = require('../../models/Candidate');

// Mock Mongoose Models
jest.mock('../../models/Vote');
jest.mock('../../models/Candidate');

describe('userService.submitVote', () => {
  const userId = 'user123';
  const candidateName = 'Alice';
  const candidateId = 'cand123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if user has already voted', async () => {
    Vote.findOne.mockResolvedValue({ _id: 'vote123', userId });

    await expect(userService.submitVote(userId, candidateName))
      .rejects
      .toThrow('You have already voted.');
  });

  it('should create a new candidate if not found and cast a vote', async () => {
    Vote.findOne.mockResolvedValue(null);
    Candidate.findOne.mockResolvedValue(null);
    Candidate.create.mockResolvedValue({ _id: candidateId, name: candidateName });
    Vote.create.mockResolvedValue({ _id: 'voteId', userId, candidateId });
    Candidate.findByIdAndUpdate.mockResolvedValue(true);

    const result = await userService.submitVote(userId, candidateName);

    expect(Candidate.create).toHaveBeenCalledWith({ name: candidateName });
    expect(Vote.create).toHaveBeenCalledWith({ userId, candidateId });
    expect(Candidate.findByIdAndUpdate).toHaveBeenCalledWith(candidateId, { $inc: { votes: 1 } });
    expect(result).toHaveProperty('_id', 'voteId');
  });

  it('should use existing candidate if found', async () => {
    Vote.findOne.mockResolvedValue(null);
    Candidate.findOne.mockResolvedValue({ _id: candidateId, name: candidateName });
    Vote.create.mockResolvedValue({ _id: 'voteId2', userId, candidateId });
    Candidate.findByIdAndUpdate.mockResolvedValue(true);

    const result = await userService.submitVote(userId, candidateName);

    expect(Candidate.create).not.toHaveBeenCalled();
    expect(Vote.create).toHaveBeenCalledWith({ userId, candidateId });
    expect(result._id).toBe('voteId2');
  });
});

describe('userService.getVoteStats', () => {
  it('should return a sorted list of candidates', async () => {
    const mockCandidates = [
      { name: 'Alice', votes: 10 },
      { name: 'Bob', votes: 5 },
    ];

    Candidate.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockCandidates)
    });

    const result = await userService.getVoteStats();

    expect(result).toEqual(mockCandidates);
    expect(Candidate.find).toHaveBeenCalled();
  });
});
