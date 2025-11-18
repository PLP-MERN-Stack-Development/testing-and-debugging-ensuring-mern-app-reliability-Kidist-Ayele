// auth.test.js - Unit tests for auth utilities

const jwt = require('jsonwebtoken');
const { generateToken } = require('../../../src/utils/auth');
const User = require('../../../src/models/User');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  // Disconnect any existing connection
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

describe('generateToken', () => {
  it('should generate a valid JWT token', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const token = generateToken(user);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    // Verify token can be decoded
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    expect(decoded.id).toBe(user._id.toString());
  });

  it('should include user ID in token payload', async () => {
    const user = await User.create({
      name: 'Test User 2',
      email: 'test2@example.com',
      password: 'password123',
    });

    const token = generateToken(user);
    const decoded = jwt.decode(token);

    expect(decoded).toHaveProperty('id');
    expect(decoded.id).toBe(user._id.toString());
  });

  it('should use default expiration if JWT_EXPIRE is not set', async () => {
    const originalExpire = process.env.JWT_EXPIRE;
    delete process.env.JWT_EXPIRE;

    const user = await User.create({
      name: 'Test User 3',
      email: 'test3@example.com',
      password: 'password123',
    });

    const token = generateToken(user);
    const decoded = jwt.decode(token);

    expect(decoded).toHaveProperty('exp');

    if (originalExpire) {
      process.env.JWT_EXPIRE = originalExpire;
    }
  });
});

