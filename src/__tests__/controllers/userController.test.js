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
    it('should return 201 and success message when vote is submitted', async () => {
      const mockVote = { candidate: 'Alice', user: 'user123' };
      userService.submitVote.mockResolvedValue(mockVote);

      const req = {
        user: { _id: 'user123' },
        body: { candidateName: 'Alice' }
      };
      const res = mockResponse();

      await userController.submitVote(req, res);

      expect(userService.submitVote).toHaveBeenCalledWith('user123', 'Alice');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Vote submitted successfully',
        vote: mockVote
      });
    });

    it('should return 400 if vote submission fails', async () => {
      userService.submitVote.mockRejectedValue(new Error('Vote error'));

      const req = {
        user: { _id: 'user123' },
        body: { candidateName: 'Bob' }
      };
      const res = mockResponse();

      await userController.submitVote(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Vote error' });
    });
  });

  describe('getVotes', () => {
    it('should return 200 with vote statistics', async () => {
      const stats = [
        { candidate: 'Alice', votes: 10 },
        { candidate: 'Bob', votes: 5 }
      ];
      userService.getVoteStats.mockResolvedValue(stats);

      const req = {};
      const res = mockResponse();

      await userController.getVotes(req, res);

      expect(userService.getVoteStats).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ candidates: stats });
    });

    it('should return 400 if getVotes fails', async () => {
      userService.getVoteStats.mockRejectedValue(new Error('Stats error'));

      const req = {};
      const res = mockResponse();

      await userController.getVotes(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Stats error' });
    });
  });
});
