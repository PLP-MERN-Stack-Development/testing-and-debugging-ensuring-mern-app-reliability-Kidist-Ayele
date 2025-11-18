// cypress/support/commands.js - Custom Cypress commands

Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/auth/login',
    body: {
      email,
      password,
    },
  }).then((response) => {
    if (response.body.token) {
      window.localStorage.setItem('token', response.body.token);
    }
  });
});

Cypress.Commands.add('createPost', (postData) => {
  const token = window.localStorage.getItem('token');
  return cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/posts',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: postData,
  });
});

