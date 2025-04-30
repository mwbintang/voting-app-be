const authService = require('../../services/authService');
const User = require('../../models/User');
const Role = require('../../models/Role');
const { hashPassword, comparePassword } = require('../../helpers/bcrypt');
const { generateToken } = require('../../helpers/jwt');

jest.mock('../../models/User');
jest.mock('../../models/Role');
jest.mock('../../helpers/bcrypt');
jest.mock('../../helpers/jwt');

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUserData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockRole = { _id: 'roleId123', name: 'user' };

      // Mock behavior
      User.findOne.mockResolvedValue(null);
      Role.findOne.mockResolvedValue(mockRole);
      hashPassword.mockResolvedValue('hashedPassword123');
      const mockSave = jest.fn().mockResolvedValue();
      User.mockImplementation(() => ({ save: mockSave, _id: 'userId123', role: mockRole._id }));
      generateToken.mockReturnValue('mocked-jwt-token');

      const result = await authService.register(mockUserData);

      expect(User.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
      expect(Role.findOne).toHaveBeenCalledWith({ name: 'user' });
      expect(hashPassword).toHaveBeenCalledWith(mockUserData.password);
      expect(mockSave).toHaveBeenCalled();
      expect(generateToken).toHaveBeenCalledWith('userId123', mockRole._id);
      expect(result).toEqual({
        message: 'User registered successfully',
        token: 'mocked-jwt-token',
      });
    });

    it('should throw error if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      await expect(authService.register({
        name: 'Test',
        email: 'test@example.com',
        password: 'password',
      })).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const mockUser = {
        _id: 'userId123',
        email: 'test@example.com',
        password: 'hashedPassword123',
        role: 'roleId123',
        isDeleted: false,
      };

      User.findOne.mockResolvedValue(mockUser);
      comparePassword.mockResolvedValue(true);
      generateToken.mockReturnValue('mocked-jwt-token');

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com', isDeleted: false });
      expect(comparePassword).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(generateToken).toHaveBeenCalledWith('userId123', 'roleId123');
      expect(result).toEqual({
        message: 'Login successful',
        token: 'mocked-jwt-token',
      });
    });

    it('should throw error if user is not found', async () => {
      User.findOne.mockResolvedValue(null);

      await expect(authService.login({
        email: 'test@example.com',
        password: 'password123',
      })).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if password does not match', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword123',
        isDeleted: false,
      };

      User.findOne.mockResolvedValue(mockUser);
      comparePassword.mockResolvedValue(false);

      await expect(authService.login({
        email: 'test@example.com',
        password: 'wrongPassword',
      })).rejects.toThrow('Invalid credentials');
    });
  });
});
