const adminController = require('../../controllers/adminController');
const adminService = require('../../services/adminService');

jest.mock('../../services/adminService');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe('Admin Controller', () => {
  describe('getAllUsers', () => {
    it('should return users with status 200', async () => {
      const users = [{ id: 1, name: 'User1' }];
      adminService.getAllUsers.mockResolvedValue(users);

      const req = {};
      const res = mockResponse();

      await adminController.getAllUsers(req, res);

      expect(adminService.getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should return 400 on error', async () => {
      adminService.getAllUsers.mockRejectedValue(new Error('Failed'));

      const req = {};
      const res = mockResponse();

      await adminController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed' });
    });
  });

  describe('getAllVotes', () => {
    it('should return votes with status 200', async () => {
      const votes = [{ id: 1, candidate: 'X' }];
      adminService.getAllVotes.mockResolvedValue(votes);

      const req = {};
      const res = mockResponse();

      await adminController.getAllVotes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ votes });
    });

    it('should return 400 on error', async () => {
      adminService.getAllVotes.mockRejectedValue(new Error('Error'));

      const req = {};
      const res = mockResponse();

      await adminController.getAllVotes(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
    });
  });

  describe('getCandidates', () => {
    it('should return candidates with status 200', async () => {
      const candidates = [{ id: 1, name: 'Candidate A' }];
      adminService.getCandidates.mockResolvedValue(candidates);

      const req = {};
      const res = mockResponse();

      await adminController.getCandidates(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(candidates);
    });

    it('should return 400 on error', async () => {
      adminService.getCandidates.mockRejectedValue(new Error('Error'));

      const req = {};
      const res = mockResponse();

      await adminController.getCandidates(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
    });
  });

  describe('softDeleteUser', () => {
    it('should return result with status 200 on success', async () => {
      const result = { success: true };
      adminService.softDeleteUser.mockResolvedValue(result);

      const req = { params: { id: '123' } };
      const res = mockResponse();

      await adminController.softDeleteUser(req, res);

      expect(adminService.softDeleteUser).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(result);
    });

    it('should return 400 on error', async () => {
      adminService.softDeleteUser.mockRejectedValue(new Error('Delete failed'));

      const req = { params: { id: '123' } };
      const res = mockResponse();

      await adminController.softDeleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Delete failed' });
    });
  });

  describe('addCandidate', () => {
    it('should return 201 on success', async () => {
      const result = { message: 'Candidate added' };
      adminService.addCandidate.mockResolvedValue(result);

      const req = { body: { name: 'Alice' } };
      const res = mockResponse();

      await adminController.addCandidate(req, res);

      expect(adminService.addCandidate).toHaveBeenCalledWith('Alice');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(result);
    });

    it('should return 400 on error', async () => {
      adminService.addCandidate.mockRejectedValue(new Error('Duplicate'));

      const req = { body: { name: 'Alice' } };
      const res = mockResponse();

      await adminController.addCandidate(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Duplicate' });
    });
  });

  describe('deleteCandidate', () => {
    it('should return 200 on success', async () => {
      const deleted = { id: '1', name: 'Alice' };
      adminService.deleteCandidate.mockResolvedValue(deleted);

      const req = { params: { id: '1' } };
      const res = mockResponse();

      await adminController.deleteCandidate(req, res);

      expect(adminService.deleteCandidate).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Candidate deleted', candidate: deleted });
    });

    it('should return 404 on error', async () => {
      adminService.deleteCandidate.mockRejectedValue(new Error('Not found'));

      const req = { params: { id: '1' } };
      const res = mockResponse();

      await adminController.deleteCandidate(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('changeUserRole', () => {
    it('should return 200 and updated user on success', async () => {
      const user = { id: '123', role: 'admin' };
      adminService.changeUserRole.mockResolvedValue(user);

      const req = { body: { userId: '123', roleName: 'admin' } };
      const res = mockResponse();

      await adminController.changeUserRole(req, res);

      expect(adminService.changeUserRole).toHaveBeenCalledWith('123', 'admin');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User role updated', user });
    });

    it('should return 400 on error', async () => {
      adminService.changeUserRole.mockRejectedValue(new Error('User not found'));

      const req = { body: { userId: '123', roleName: 'admin' } };
      const res = mockResponse();

      await adminController.changeUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });
});
