// posts.test.js - Integration tests for posts API endpoints

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const Post = require('../../src/models/Post');
const User = require('../../src/models/User');
const Category = require('../../src/models/Category');
const { generateToken } = require('../../src/utils/auth');

let token;
let userId;
let postId;
let categoryId;

// Setup test data before all tests
// Note: MongoDB connection is handled by setup.js via setupFilesAfterEnv
beforeAll(async () => {
  await createTestData();
}, 30000);

// Recreate test data after each test since setup.js cleans everything
afterEach(async () => {
  // Reset test data IDs so they get recreated
  userId = null;
  postId = null;
  categoryId = null;
  token = null;
  await createTestData();
});

// Helper function to create test data
async function createTestData() {
  // Always recreate to ensure fresh data
  // Create a test user
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });
  userId = user._id;
  token = generateToken(user);

  // Create a test category
  const category = await Category.create({
    name: 'Test Category',
    description: 'Test category description',
  });
  categoryId = category._id;

  // Create a test post
  const post = await Post.create({
    title: 'Test Post',
    content: 'This is a test post content',
    author: userId,
    category: categoryId,
    slug: 'test-post',
  });
  postId = post._id;
}

describe('POST /api/posts', () => {
  it('should create a new post when authenticated', async () => {
    const newPost = {
      title: 'New Test Post',
      content: 'This is a new test post content',
      author: userId.toString(),
      category: categoryId.toString(),
    };

    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe(newPost.title);
    expect(res.body.data.content).toBe(newPost.content);
  });

  it('should return 401 if not authenticated', async () => {
    const newPost = {
      title: 'Unauthorized Post',
      content: 'This should not be created',
      category: new mongoose.Types.ObjectId().toString(),
    };

    const res = await request(app)
      .post('/api/posts')
      .send(newPost);

    expect(res.status).toBe(401);
  });

  it('should return 400 if validation fails', async () => {
    const invalidPost = {
      // Missing title
      content: 'This post is missing a title',
      author: userId.toString(),
      category: categoryId.toString(),
    };

    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidPost);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/posts', () => {
  it('should return all posts', async () => {
    const res = await request(app).get('/api/posts');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should filter posts by category', async () => {
    // Create a post with specific category
    await Post.create({
      title: 'Filtered Post',
      content: 'This post should be filtered by category',
      author: userId,
      category: categoryId,
      slug: 'filtered-post',
    });

    const res = await request(app)
      .get(`/api/posts?category=${categoryId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].category._id || res.body.data[0].category).toBe(categoryId.toString());
  });

  it('should paginate results', async () => {
    // Create multiple posts
    const posts = [];
    for (let i = 0; i < 15; i++) {
      posts.push({
        title: `Pagination Post ${i}`,
        content: `Content for pagination test ${i}`,
        author: userId,
        category: categoryId,
        slug: `pagination-post-${i}`,
      });
    }
    await Post.insertMany(posts);

    const page1 = await request(app)
      .get('/api/posts?page=1&limit=10');
    
    const page2 = await request(app)
      .get('/api/posts?page=2&limit=10');

    expect(page1.status).toBe(200);
    expect(page2.status).toBe(200);
    expect(page1.body.success).toBe(true);
    expect(page2.body.success).toBe(true);
    expect(page1.body.data.length).toBe(10);
    expect(page2.body.data.length).toBeGreaterThan(0);
    expect(page1.body.data[0]._id).not.toBe(page2.body.data[0]._id);
  });
});

describe('GET /api/posts/:id', () => {
  it('should return a post by ID', async () => {
    const res = await request(app)
      .get(`/api/posts/${postId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(postId.toString());
    expect(res.body.data.title).toBe('Test Post');
  });

  it('should return 404 for non-existent post', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/posts/${nonExistentId}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('PUT /api/posts/:id', () => {
  it('should update a post when authenticated as author', async () => {
    const updates = {
      title: 'Updated Test Post',
      content: 'This content has been updated',
      author: userId.toString(),
      category: categoryId.toString(),
    };

    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updates);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(updates.title);
    expect(res.body.data.content).toBe(updates.content);
  });

  it('should return 401 if not authenticated', async () => {
    const updates = {
      title: 'Unauthorized Update',
    };

    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .send(updates);

    expect(res.status).toBe(401);
  });

  it('should return 403 if not the author', async () => {
    // Create another user
    const anotherUser = await User.create({
      name: 'Another User',
      email: 'another@example.com',
      password: 'password123',
    });
    const anotherToken = generateToken(anotherUser);

    const updates = {
      title: 'Forbidden Update',
      content: 'This should not be allowed',
    };

    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${anotherToken}`)
      .send(updates);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});

describe('DELETE /api/posts/:id', () => {
  it('should delete a post when authenticated as author', async () => {
    // Create a new post to delete (since we need to keep the original for other tests)
    const postToDelete = await Post.create({
      title: 'Post to Delete',
      content: 'This post will be deleted',
      author: userId,
      category: categoryId,
      slug: 'post-to-delete',
    });

    const res = await request(app)
      .delete(`/api/posts/${postToDelete._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    
    // Verify post is deleted
    const deletedPost = await Post.findById(postToDelete._id);
    expect(deletedPost).toBeNull();
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
}); 