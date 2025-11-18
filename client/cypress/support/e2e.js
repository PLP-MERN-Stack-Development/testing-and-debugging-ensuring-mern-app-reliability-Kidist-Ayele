// cypress/support/e2e.js - Cypress support file

// Import commands
import './commands';

// Hide fetch/XHR requests from command log
Cypress.on('fail', (error, runnable) => {
  // Prevent Cypress from failing the test on uncaught exceptions
  if (error.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  throw error;
});

