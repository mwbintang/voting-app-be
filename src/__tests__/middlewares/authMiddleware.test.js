const authMiddleware = require('../../middlewares/authMiddleware');
const jwtHelper = require('../../helpers/jwt');
const User = require('../../models/User');

jest.mock('../../helpers/jwt');
jest.mock('../../models/User');

describe('authMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer validToken'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next() with valid token and user', async () => {
    const fakeUser = {
      _id: '123',
      username: 'Test User',
      role: {
        _id: 'role123',
        name: 'user',
        permissions: [{ name: 'CAN_VIEW' }]
      },
      isDeleted: false
    };

    // Mock JWT decode
    jwtHelper.verifyToken.mockReturnValue({ userId: '123' });

    // Mock Mongoose chain: findById().populate().populate()
    const populatePermissions = jest.fn().mockResolvedValue(fakeUser);
    const populateRole = jest.fn(() => ({ populate: populatePermissions }));

    User.findById.mockReturnValue({ populate: populateRole });

    await authMiddleware(req, res, next);

    expect(jwtHelper.verifyToken).toHaveBeenCalledWith('validToken');
    expect(User.findById).toHaveBeenCalledWith('123');
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if no token provided', async () => {
    req.headers.authorization = null;

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authorization header missing or invalid' });
  });

  it('should return 401 if token is invalid', async () => {
    jwtHelper.verifyToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
  });
});
