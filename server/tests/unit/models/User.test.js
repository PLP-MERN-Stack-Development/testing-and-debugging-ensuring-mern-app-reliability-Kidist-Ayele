// User.test.js - Unit tests for User model

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../../src/models/User');

let mongoServer;

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 30000);

afterEach(async () => {
  await User.deleteMany({});
});

describe('User Model', () => {
  it('should create a user with valid data', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);

    expect(user).toBeDefined();
    expect(user._id).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password); // Should be hashed
    expect(user.role).toBe('user'); // Default role
  });

  it('should hash password before saving', async () => {
    const userData = {
      name: 'Test User',
      email: 'test2@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);

    expect(user.password).not.toBe(userData.password);
    expect(user.password.length).toBeGreaterThan(10); // Hashed password is longer
  });

  it('should validate email format', async () => {
    const userData = {
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123',
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it('should require name field', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it('should require email field', async () => {
    const userData = {
      name: 'Test User',
      password: 'password123',
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it('should require password field', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  it('should have unique email', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    await User.create(userData);
    await expect(User.create(userData)).rejects.toThrow();
  });

  it('should match password correctly', async () => {
    const userData = {
      name: 'Test User',
      email: 'test3@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);

    const isMatch = await user.matchPassword('password123');
    expect(isMatch).toBe(true);

    const isNotMatch = await user.matchPassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });

  it('should not rehash password if not modified', async () => {
    const userData = {
      name: 'Test User',
      email: 'test4@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);
    const originalPassword = user.password;

    user.name = 'Updated Name';
    await user.save();

    expect(user.password).toBe(originalPassword);
  });
});

