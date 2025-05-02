const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { generateToken, verifyToken } = require('../../helpers/jwt'); // Path to your helpers

jest.mock('jsonwebtoken'); // Mock jsonwebtoken library
dotenv.config = jest.fn(); // Mock dotenv config function

describe('JWT Helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'secret_key'; // Mock the environment variable for the secret
    process.env.JWT_EXPIRES_IN = '1h'; // Mock token expiration time
  });

  describe('generateToken', () => {
    it('should generate a token with correct payload and secret', () => {
      const userId = 'user123';
      const role = 'admin';

      const token = 'mockToken';
      jwt.sign.mockReturnValue(token); // Mock jwt.sign to return a mocked token

      const result = generateToken(userId, role);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      expect(result).toBe(token);
    });
  });

  describe('verifyToken', () => {
    it('should return decoded token when token is valid', () => {
      const token = 'validToken';
      const decodedToken = { userId: 'user123', role: 'admin' };
      
      jwt.verify.mockReturnValue(decodedToken); // Mock jwt.verify to return decoded token

      const result = verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(result).toBe(decodedToken);
    });

    it('should throw error if token is invalid or expired', () => {
      const token = 'invalidToken';
      const errorMessage = 'Invalid or expired token';

      jwt.verify.mockImplementation(() => {
        throw new Error(errorMessage);
      }); // Mock jwt.verify to throw error

      expect(() => verifyToken(token)).toThrowError(errorMessage);
    });
  });
});
