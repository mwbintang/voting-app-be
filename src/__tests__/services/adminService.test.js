const adminService = require('../../services/adminService');
const User = require('../../models/User');
const Vote = require('../../models/Vote');
const Candidate = require('../../models/Candidate');
const Role = require('../../models/Role');

jest.mock('../../models/User');
jest.mock('../../models/Vote');
jest.mock('../../models/Candidate');
jest.mock('../../models/Role');

describe('adminService.getAllUsers', () => {
  it('should return all simplified users excluding password and with role name', async () => {
    const mockUsers = [
      {
        _id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: { name: 'admin' },
      },
    ];
    const mockSelect = jest.fn().mockReturnThis();
    const mockPopulate = jest.fn().mockResolvedValue(mockUsers);

    User.find.mockReturnValue({ select: mockSelect, populate: mockPopulate });

    const users = await adminService.getAllUsers();
    expect(users).toEqual([
      {
        _id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
      },
    ]);
  });

  it('should throw an error if fetching users fails', async () => {
    User.find.mockImplementation(() => {
      throw new Error();
    });
    await expect(adminService.getAllUsers()).rejects.toThrow('Error fetching users');
  });
});

describe('adminService.getAllVotes', () => {
  it('should return all votes with populated user and candidate', async () => {
    const mockVotes = [{ userId: {}, candidateId: {} }];
    const mockPopulate = jest.fn().mockReturnValue(mockVotes);
    Vote.find.mockReturnValue({ populate: mockPopulate });

    const votes = await adminService.getAllVotes();
    expect(votes).toEqual(mockVotes);
    expect(Vote.find).toHaveBeenCalled();
  });

  it('should throw an error if fetching votes fails', async () => {
    Vote.find.mockImplementation(() => {
      throw new Error();
    });
    await expect(adminService.getAllVotes()).rejects.toThrow('Error fetching votes');
  });
});

describe('adminService.getCandidates', () => {
  it('should return candidates sorted by vote count and selected fields', async () => {
    const mockCandidates = [{ name: 'Alice', votes: 10, _id: 'id1', isCustom: false }];
    Candidate.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockCandidates)
      })
    });

    const candidates = await adminService.getCandidates();
    expect(candidates).toEqual(mockCandidates);
  });

  it('should throw an error if fetching candidates fails', async () => {
    Candidate.find.mockImplementation(() => {
      throw new Error();
    });
    await expect(adminService.getCandidates()).rejects.toThrow('Error fetching candidates');
  });
});

describe('adminService.softDeleteUser', () => {
  it('should soft delete a user if found and not already deleted', async () => {
    const mockUser = {
      isDeleted: false,
      save: jest.fn(),
    };
    User.findById.mockResolvedValue(mockUser);

    const result = await adminService.softDeleteUser('user-id');
    expect(mockUser.isDeleted).toBe(true);
    expect(mockUser.deletedAt).toBeInstanceOf(Date);
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
    User.findById.mockImplementation(() => {
      throw new Error();
    });
    await expect(adminService.softDeleteUser('error-id')).rejects.toThrow('Error deleting user');
  });
});

describe('adminService.addCandidate', () => {
  it('should add a new candidate if it does not exist', async () => {
    Candidate.findOne.mockResolvedValue(null);
    const mockSave = jest.fn();
    Candidate.mockImplementation(() => ({ save: mockSave }));

    const result = await adminService.addCandidate('NewCandidate');
    expect(result).toEqual({ message: 'Candidate added' });
    expect(mockSave).toHaveBeenCalled();
  });

  it('should throw if candidate with the name already exists', async () => {
    Candidate.findOne.mockResolvedValue({ _id: 'existing-id' });
    await expect(adminService.addCandidate('Existing')).rejects.toThrow('Candidate with this name already exists');
  });
});

describe('adminService.deleteCandidate', () => {
  it('should delete candidate and its votes', async () => {
    Vote.deleteMany.mockResolvedValue({});
    Candidate.findByIdAndDelete.mockResolvedValue({ _id: 'cand1' });

    const result = await adminService.deleteCandidate('cand1');
    expect(result).toEqual({ _id: 'cand1' });
    expect(Vote.deleteMany).toHaveBeenCalledWith({ candidateId: 'cand1' });
    expect(Candidate.findByIdAndDelete).toHaveBeenCalledWith('cand1');
  });

  it('should throw if candidate not found', async () => {
    Candidate.findByIdAndDelete.mockResolvedValue(null);
    await expect(adminService.deleteCandidate('invalid')).rejects.toThrow('Candidate not found');
  });
});

describe('adminService.changeUserRole', () => {
  it('should change the user role if both user and role exist', async () => {
    const mockUser = { role: null, save: jest.fn() };
    User.findById.mockResolvedValue(mockUser);
    Role.findOne.mockResolvedValue({ _id: 'new-role-id' });

    const result = await adminService.changeUserRole('user123', 'admin');
    expect(mockUser.role).toBe('new-role-id');
    expect(mockUser.save).toHaveBeenCalled();
    expect(result).toBe(mockUser);
  });

  it('should throw if user not found', async () => {
    User.findById.mockResolvedValue(null);
    await expect(adminService.changeUserRole('bad', 'admin')).rejects.toThrow('User not found');
  });

  it('should throw if role not found', async () => {
    User.findById.mockResolvedValue({});
    Role.findOne.mockResolvedValue(null);
    await expect(adminService.changeUserRole('user123', 'invalid')).rejects.toThrow('Role not found');
  });
});
