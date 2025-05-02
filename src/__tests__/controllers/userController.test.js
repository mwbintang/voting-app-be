const userController = require('../../controllers/userController');
const userService = require('../../services/userService');

jest.mock('../../services/userService');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe('User Controller', () => {
  describe('submitVote', () => {
    it('should return 201 with result when vote is submitted', async () => {
      const mockVote = { candidate: 'Alice', user: 'user123' };
      userService.submitVote.mockResolvedValue(mockVote);

      const req = {
        user: { _id: 'user123' },
        body: { candidateName: 'Alice' },
        app: { get: jest.fn().mockReturnValue({}) } // mock io
      };
      const res = mockResponse();

      await userController.submitVote(req, res);

      expect(userService.submitVote).toHaveBeenCalledWith('user123', 'Alice', {});
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockVote);
    });

    it('should return 400 if vote submission fails', async () => {
      userService.submitVote.mockRejectedValue(new Error('Vote error'));

      const req = {
        user: { _id: 'user123' },
        body: { candidateName: 'Bob' },
        app: { get: jest.fn().mockReturnValue({}) }
      };
      const res = mockResponse();

      await userController.submitVote(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Vote error' });
    });
  });

  describe('getCandidates', () => {
    it('should return 200 with candidates', async () => {
      const mockCandidates = [{ name: 'Alice' }, { name: 'Bob' }];
      userService.getCandidates.mockResolvedValue(mockCandidates);

      const req = {
        user: { _id: 'user123' }
      };
      const res = mockResponse();

      await userController.getCandidates(req, res);

      expect(userService.getCandidates).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCandidates);
    });

    it('should return 400 if fetching candidates fails', async () => {
      userService.getCandidates.mockRejectedValue(new Error('Get candidates error'));

      const req = {
        user: { _id: 'user123' }
      };
      const res = mockResponse();

      await userController.getCandidates(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Get candidates error' });
    });
  });
});
