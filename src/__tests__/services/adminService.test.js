const adminService = require('../../services/adminService');
const User = require('../../models/User');
const Vote = require('../../models/Vote');
const Candidate = require('../../models/Candidate');

jest.mock('../../models/User');
jest.mock('../../models/Vote');
jest.mock('../../models/Candidate');

describe('adminService.getAllUsers', () => {
  it('should return all users excluding password and with role populated', async () => {
    const mockUsers = [{ _id: '1', email: 'admin@example.com', role: { name: 'admin' } }];
    User.find.mockReturnValue({ select: jest.fn().mockReturnThis(), populate: jest.fn().mockResolvedValue(mockUsers) });

    const users = await adminService.getAllUsers();
    expect(users).toEqual(mockUsers);
  });

  it('should throw an error if fetching users fails', async () => {
    User.find.mockImplementation(() => { throw new Error(); });
    await expect(adminService.getAllUsers()).rejects.toThrow('Error fetching users');
  });
});

describe('adminService.getAllVotes', () => {
  it('should return all votes with populated user and candidate', async () => {
    const mockVotes = [{ userId: {}, candidateId: {} }];
    Vote.find.mockReturnValue({ populate: jest.fn().mockReturnValue(mockVotes) });

    const votes = await adminService.getAllVotes();
    expect(votes).toEqual(mockVotes);
  });

  it('should throw an error if fetching votes fails', async () => {
    Vote.find.mockImplementation(() => { throw new Error(); });
    await expect(adminService.getAllVotes()).rejects.toThrow('Error fetching votes');
  });
});

describe('adminService.getCandidates', () => {
  it('should return candidates sorted by vote count', async () => {
    const mockCandidates = [{ name: 'Alice', votes: 10 }];
    Candidate.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(mockCandidates) });

    const candidates = await adminService.getCandidates();
    expect(candidates).toEqual(mockCandidates);
  });

  it('should throw an error if fetching candidates fails', async () => {
    Candidate.find.mockImplementation(() => { throw new Error(); });
    await expect(adminService.getCandidates()).rejects.toThrow('Error fetching candidates');
  });
});

describe('adminService.softDeleteUser', () => {
  it('should soft delete a user if found and not deleted', async () => {
    const mockUser = {
      isDeleted: false,
      save: jest.fn(),
    };
    User.findById.mockResolvedValue(mockUser);

    const result = await adminService.softDeleteUser('user-id');
    expect(mockUser.isDeleted).toBe(true);
    expect(mockUser.deletedAt).toBeDefined();
    expect(mockUser.save).toHaveBeenCalled();
    expect(result.message).toBe('User soft-deleted successfully');
  });

  it('should throw if user is not found', async () => {
    User.findById.mockResolvedValue(null);
    await expect(adminService.softDeleteUser('invalid-id')).rejects.toThrow('User not found');
  });

  it('should throw if user is already deleted', async () => {
    User.findById.mockResolvedValue({ isDeleted: true });
    await expect(adminService.softDeleteUser('deleted-id')).rejects.toThrow('User already deleted');
  });

  it('should throw on unexpected error', async () => {
    User.findById.mockImplementation(() => { throw new Error(); });
    await expect(adminService.softDeleteUser('error-id')).rejects.toThrow('Error deleting user');
  });
});
