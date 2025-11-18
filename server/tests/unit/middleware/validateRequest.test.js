// validateRequest.test.js - Unit tests for validateRequest middleware

const Joi = require('joi');
const validateRequest = require('../../../src/middleware/validateRequest');

describe('validateRequest Middleware', () => {
  it('should pass valid request body', () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    });

    const middleware = validateRequest(schema);
    const mockReq = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
      },
    };
    const mockRes = {};
    const mockNext = jest.fn();

    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.body.name).toBe('Test User');
    expect(mockReq.body.email).toBe('test@example.com');
  });

  it('should return 400 for invalid request body', () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    });

    const middleware = validateRequest(schema);
    const mockReq = {
      body: {
        name: 'Test User',
        email: 'invalid-email',
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNext = jest.fn();

    middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Validation Error',
        details: expect.any(Array),
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should strip unknown fields', () => {
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    const middleware = validateRequest(schema);
    const mockReq = {
      body: {
        name: 'Test User',
        unknownField: 'should be removed',
      },
    };
    const mockRes = {};
    const mockNext = jest.fn();

    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.body).not.toHaveProperty('unknownField');
    expect(mockReq.body.name).toBe('Test User');
  });
});

