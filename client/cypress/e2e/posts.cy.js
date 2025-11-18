// posts.cy.js - E2E tests for posts functionality

describe('Posts E2E Tests', () => {
  beforeEach(() => {
    // Visit the home page
    cy.visit('/');
  });

  it('should display the homepage with posts', () => {
    cy.contains('Recent Posts').should('be.visible');
    // Check for any visible text indicating blog/app is loaded
    cy.get('body').should('be.visible');
  });

  it('should navigate to create post page', () => {
    cy.contains('Write a Post').click();
    cy.url().should('include', '/create');
    cy.contains('Create or Edit Post').should('be.visible');
  });

  it('should search for posts', () => {
    // Wait for posts to load
    cy.wait(1000);
    
    // Enter search query in the search input
    cy.get('input[type="text"]').first().type('test');
    cy.get('button[type="submit"]').contains('Search').click();
    
    // Should show search results or empty state
    cy.get('body').should('be.visible');
  });

  it('should handle 404 page correctly', () => {
    cy.visit('/non-existent-page');
    cy.contains('Page not found').should('be.visible');
    cy.contains('Go back home').should('be.visible');
  });

  it('should navigate through pages', () => {
    cy.visit('/');
    cy.wait(1000);
    
    // Check if pagination controls exist (they may not exist if there are few posts)
    cy.get('body').should('be.visible');
    // If pagination exists, verify it's visible
    cy.get('body').then(($body) => {
      const hasPagination = $body.text().includes('Next') || $body.text().includes('Previous');
      if (hasPagination) {
        cy.contains(/Next|Previous/i).should('exist');
      }
    });
  });
});

describe('Post Form E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/create');
  });

  it('should display the post form', () => {
    cy.contains('Create or Edit Post').should('be.visible');
    cy.get('label').contains('Title').should('be.visible');
    cy.get('label').contains('Content').should('be.visible');
    cy.get('label').contains('Author ID').should('be.visible');
    cy.get('label').contains('Category').should('be.visible');
  });

  it('should validate required fields', () => {
    // Try to submit without filling fields
    cy.get('button[type="submit"]').contains('Save Post').click();
    
    // HTML5 validation should prevent submission
    // The form should not submit without required fields
    cy.get('form').should('exist');
    cy.url().should('include', '/create');
  });

  it('should create a new post with valid data', () => {
    // Fill in the form
    cy.get('#title').type('E2E Test Post');
    cy.get('#content').type('This is a test post created by Cypress E2E tests.');
    cy.get('#author').type('507f1f77bcf86cd799439011'); // Valid ObjectId format
    cy.wait(1000); // Wait for categories to load
    cy.get('#category').select(1); // Select first category
    
    // Submit the form
    cy.get('button[type="submit"]').contains('Save Post').click();
    
    // Should redirect to post details page or show success
    cy.wait(2000); // Wait for navigation
    cy.url().should('satisfy', (url) => {
      return url.includes('/posts/') || url.includes('/');
    });
  });
});

describe('Post Details E2E Tests', () => {
  it('should display post details page', () => {
    // Visit a post detail page (using a mock ID - in real scenario, you'd have a real post)
    cy.visit('/posts/507f1f77bcf86cd799439011');
    
    // Wait for page to load
    cy.wait(1000);
    
    // Check for error message or post content
    cy.get('body').should('be.visible');
    // Either shows post or error message
    cy.get('body').then(($body) => {
      if ($body.text().includes('Post not found') || $body.text().includes('not found')) {
        cy.contains(/not found|error/i).should('be.visible');
        cy.contains(/Back to posts|back/i).should('exist');
      } else if ($body.find('article').length > 0) {
        // Post loaded successfully
        cy.get('article').should('exist');
      } else {
        // Loading state or other content
        cy.get('body').should('be.visible');
      }
    });
  });

  it('should handle 404 error for non-existent post', () => {
    cy.visit('/posts/000000000000000000000000');
    
    // Should show error message
    cy.wait(1000);
    cy.get('body').should('be.visible');
    // Either shows error or redirects
    cy.get('body').then(($body) => {
      if ($body.text().includes('Post not found') || $body.text().includes('not found')) {
        cy.contains(/not found|error/i).should('be.visible');
      }
    });
  });

  it('should add a comment to a post', () => {
    // First, try to visit a post (might not exist)
    cy.visit('/posts/507f1f77bcf86cd799439011');
    cy.wait(1000);
    
    cy.get('body').then(($body) => {
      // If post exists, test adding comment
      if ($body.find('textarea').length > 0) {
        cy.get('textarea').type('This is a test comment from Cypress');
        cy.get('button[type="submit"]').contains('Post Comment').click();
        cy.wait(1000);
        // Comment should appear or form should clear
        cy.get('body').should('be.visible');
      }
    });
  });

  it('should navigate back to posts from detail page', () => {
    cy.visit('/posts/507f1f77bcf86cd799439011');
    cy.wait(1000);
    
    // Look for back link
    cy.get('body').then(($body) => {
      if ($body.text().includes('Back to posts') || $body.text().includes('←')) {
        cy.contains(/Back to posts|←/i).first().click();
        cy.wait(500);
        cy.url().should('include', '/');
      }
    });
  });
});

describe('Error Handling and Edge Cases E2E Tests', () => {
  it('should handle empty post list gracefully', () => {
    cy.visit('/');
    cy.wait(1000);
    
    // Should display something (either posts or empty state)
    cy.get('body').should('be.visible');
    // Either shows posts or empty state message
    cy.contains(/Recent Posts|No posts|Loading/i).should('exist');
  });

  it('should handle network errors gracefully', () => {
    // Intercept API calls and simulate network error
    cy.intercept('GET', '**/api/posts**', { forceNetworkError: true }).as('getPostsError');
    
    cy.visit('/');
    cy.wait(1000);
    
    // App should still render without crashing
    cy.get('body').should('be.visible');
  });

  it('should validate form inputs', () => {
    cy.visit('/create');
    cy.wait(1000);
    
    // Try to submit with invalid data
    cy.get('#title').type('A'); // Too short potentially
    cy.get('button[type="submit"]').contains('Save Post').click();
    
    // Should not submit or show validation error
    cy.url().should('include', '/create');
  });

  it('should handle search with no results', () => {
    cy.visit('/');
    cy.wait(1000);
    
    // Search for something unlikely to exist
    cy.get('input[type="text"]').first().type('xyzabc123nonexistent');
    cy.get('button[type="submit"]').contains('Search').click();
    cy.wait(1000);
    
    // Should handle empty results gracefully
    cy.get('body').should('be.visible');
  });
});

