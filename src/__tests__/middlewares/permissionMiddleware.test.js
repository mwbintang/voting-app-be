const permissionMiddleware = require('../../middlewares/permissionMiddleware');
const Role = require('../../models/Role');

jest.mock('../../models/Role');

describe('permissionMiddleware middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: {
        role: { _id: 'role123' }
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next() if user has required permissions', async () => {
    const mockRole = {
      permissions: [{ name: 'CAN_VIEW_USERS' }, { name: 'CAN_DELETE_USERS' }]
    };
    Role.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockRole)
    });

    const middleware = permissionMiddleware(['CAN_VIEW_USERS']);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 403 if user lacks required permissions', async () => {
    const mockRole = {
      permissions: [{ name: 'CAN_VIEW_USERS' }]
    };
    Role.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockRole)
    });

    const middleware = permissionMiddleware(['CAN_DELETE_USERS']);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: Insufficient permissions' });
  });

  it('should return 500 on error', async () => {
    Role.findOne.mockImplementation(() => {
      throw new Error('DB error');
    });

    const middleware = permissionMiddleware(['ANY_PERMISSION']);
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});
