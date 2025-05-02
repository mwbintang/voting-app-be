const bcrypt = require('bcryptjs');
const { hashPassword, comparePassword } = require('../../helpers/bcrypt'); // Path to your helpers

jest.mock('bcryptjs'); // Mock bcrypt library

describe('Password Helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash the password correctly', async () => {
      const password = 'password123';
      const salt = 'mockSalt';
      const hashedPassword = 'mockHashedPassword';

      // Mock bcrypt functions
      bcrypt.genSalt.mockResolvedValue(salt);
      bcrypt.hash.mockResolvedValue(hashedPassword);

      const result = await hashPassword(password);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('comparePassword', () => {
    it('should return true if passwords match', async () => {
      const password = 'password123';
      const hashedPassword = 'mockHashedPassword';

      // Mock bcrypt compare function
      bcrypt.compare.mockResolvedValue(true);

      const result = await comparePassword(password, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false if passwords do not match', async () => {
      const password = 'password123';
      const hashedPassword = 'mockHashedPassword';

      // Mock bcrypt compare function
      bcrypt.compare.mockResolvedValue(false);

      const result = await comparePassword(password, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(false);
    });
  });
});
