const userService = require('../../services/userService');
const Vote = require('../../models/Vote');
const Candidate = require('../../models/Candidate');
const adminService = require('../../services/adminService');

jest.mock('../../models/Vote');
jest.mock('../../models/Candidate');
jest.mock('../../services/adminService');

describe('userService.submitVote', () => {
  const userId = 'user123';
  const candidateName = 'Alice';
  const candidateId = 'cand123';
  const io = { emit: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if user has already voted', async () => {
    Vote.findOne.mockResolvedValue({ _id: 'vote123', userId });

    await expect(userService.submitVote(userId, candidateName, io))
      .rejects
      .toThrow('You have already voted.');
  });

  it('should create a new candidate if not found and cast a vote', async () => {
    Vote.findOne.mockResolvedValue(null);
    Candidate.findOne.mockResolvedValue(null);
    Candidate.create.mockResolvedValue({ _id: candidateId, name: candidateName, isCustom: true });
    Vote.create.mockResolvedValue({ _id: 'voteId', userId, candidateId });
    Candidate.findByIdAndUpdate.mockResolvedValue(true);
    adminService.getCandidates.mockResolvedValue([
      { _id: candidateId, name: candidateName, isCustom: true, votes: 1 }
    ]);

    const result = await userService.submitVote(userId, candidateName, io);

    expect(Candidate.create).toHaveBeenCalledWith({ name: candidateName, isCustom: true });
    expect(Vote.create).toHaveBeenCalledWith({ userId, candidateId });
    expect(Candidate.findByIdAndUpdate).toHaveBeenCalledWith(candidateId, { $inc: { votes: 1 } });
    expect(io.emit).toHaveBeenCalledWith('voteUpdated', {
      message: 'A new vote has been submitted',
      candidate: [{ _id: candidateId, name: candidateName, isCustom: true, votes: 1 }]
    });
    expect(result).toEqual({ message: 'Vote submitted successfully' });
  });

  it('should use existing candidate if found and cast a vote', async () => {
    Vote.findOne.mockResolvedValue(null);
    Candidate.findOne.mockResolvedValue({ _id: candidateId, name: candidateName, isCustom: false });
    Vote.create.mockResolvedValue({ _id: 'voteId2', userId, candidateId });
    Candidate.findByIdAndUpdate.mockResolvedValue(true);
    adminService.getCandidates.mockResolvedValue([
      { _id: candidateId, name: candidateName, isCustom: false, votes: 2 }
    ]);

    const result = await userService.submitVote(userId, candidateName, io);

    expect(Candidate.create).not.toHaveBeenCalled();
    expect(Vote.create).toHaveBeenCalledWith({ userId, candidateId });
    expect(io.emit).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Vote submitted successfully' });
  });
});

describe('userService.getCandidates', () => {
  const userId = 'user456';

  it('should return candidates with isPick flag set to true for voted candidate', async () => {
    const mockCandidates = [
      { _id: 'cand1', name: 'Alice', isCustom: false },
      { _id: 'cand2', name: 'Bob', isCustom: false },
    ];

    Candidate.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockCandidates)
      })
    });

    Vote.findOne.mockResolvedValue({ userId, candidateId: 'cand2' });

    const result = await userService.getCandidates(userId);

    expect(result).toEqual([
      { _id: 'cand1', name: 'Alice', isCustom: false, isPick: false },
      { _id: 'cand2', name: 'Bob', isCustom: false, isPick: true },
    ]);
  });

  it('should return candidates with isPick false if user has not voted', async () => {
    const mockCandidates = [
      { _id: 'cand1', name: 'Alice', isCustom: false },
    ];

    Candidate.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockCandidates)
      })
    });

    Vote.findOne.mockResolvedValue(null);

    const result = await userService.getCandidates(userId);

    expect(result).toEqual([
      { _id: 'cand1', name: 'Alice', isCustom: false, isPick: false },
    ]);
  });
});
