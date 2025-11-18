# Testing and Debugging MERN Applications

A MERN stack application with comprehensive testing strategies including unit, integration, and end-to-end testing.

## Setup

1. Install dependencies:

   ```bash
   npm run install-all
   ```

2. Set up environment variables (in server directory):
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

## Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# End-to-end tests (make sure server and client are running)
npm run test:e2e

# Test coverage
npm run test:coverage
```

## Testing Strategy

- **Unit Tests**: React components, hooks, middleware, models, and utilities (70%+ coverage)
- **Integration Tests**: API endpoints with database operations using Supertest
- **E2E Tests**: Complete user flows with Cypress (CRUD operations, navigation, error handling)

## Debugging Features

- **Server**: Custom logger, global error handler, request logging
- **Client**: Error boundaries, centralized API error handling
- **Tools**: Browser DevTools integration, React DevTools support

## Submission Checklist

- [x] Complete test suite (unit, integration, E2E)
- [x] 70%+ code coverage
- [x] Error boundaries and global error handler
- [x] Logging strategies
- [x] Testing documentation
