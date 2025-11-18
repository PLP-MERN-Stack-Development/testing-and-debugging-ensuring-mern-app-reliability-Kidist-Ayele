// asyncHandler.test.js - Unit tests for asyncHandler middleware

const asyncHandler = require('../../../src/middleware/asyncHandler');

describe('asyncHandler Middleware', () => {
  it('should pass through successful async functions', async () => {
    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNext = jest.fn();

    const asyncFn = async (req, res, next) => {
      res.status(200).json({ success: true });
    };

    const handler = asyncHandler(asyncFn);
    await handler(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true });
  });

  it('should catch errors and pass them to next', async () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();

    const error = new Error('Test error');
    const asyncFn = async (req, res, next) => {
      throw error;
    };

    const handler = asyncHandler(asyncFn);
    await handler(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should handle promise rejections', async () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();

    const error = new Error('Promise rejection');
    const asyncFn = async (req, res, next) => {
      throw error;
    };

    const handler = asyncHandler(asyncFn);
    await handler(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

