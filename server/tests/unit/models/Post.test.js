// Post.test.js - Unit tests for Post model

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Post = require('../../../src/models/Post');
const User = require('../../../src/models/User');
const Category = require('../../../src/models/Category');

let mongoServer;
let userId;
let categoryId;

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });
  userId = user._id;

  const category = await Category.create({
    name: 'Test Category',
    description: 'Test description',
  });
  categoryId = category._id;
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 30000);

afterEach(async () => {
  await Post.deleteMany({});
});

describe('Post Model', () => {
  it('should create a post with valid data', async () => {
    const postData = {
      title: 'Test Post',
      content: 'This is test content',
      author: userId,
      category: categoryId,
    };

    const post = await Post.create(postData);

    expect(post).toBeDefined();
    expect(post._id).toBeDefined();
    expect(post.title).toBe(postData.title);
    expect(post.content).toBe(postData.content);
    expect(post.slug).toBeDefined(); // Slug should be auto-generated
    expect(post.isPublished).toBe(false); // Default value
  });

  it('should auto-generate slug from title', async () => {
    const postData = {
      title: 'Test Post Title',
      content: 'This is test content',
      author: userId,
      category: categoryId,
    };

    const post = await Post.create(postData);

    expect(post.slug).toBe('test-post-title');
  });

  it('should require title field', async () => {
    const postData = {
      content: 'This is test content',
      author: userId,
      category: categoryId,
    };

    await expect(Post.create(postData)).rejects.toThrow();
  });

  it('should require content field', async () => {
    const postData = {
      title: 'Test Post',
      author: userId,
      category: categoryId,
    };

    await expect(Post.create(postData)).rejects.toThrow();
  });

  it('should require author field', async () => {
    const postData = {
      title: 'Test Post',
      content: 'This is test content',
      category: categoryId,
    };

    await expect(Post.create(postData)).rejects.toThrow();
  });

  it('should require category field', async () => {
    const postData = {
      title: 'Test Post',
      content: 'This is test content',
      author: userId,
    };

    await expect(Post.create(postData)).rejects.toThrow();
  });

  it('should auto-generate excerpt from content if not provided', async () => {
    const postData = {
      title: 'Test Post',
      content: 'This is a longer test content that should be truncated to create an excerpt',
      author: userId,
      category: categoryId,
    };

    const post = await Post.create(postData);

    expect(post.excerpt).toBeDefined();
    expect(post.excerpt.length).toBeLessThanOrEqual(153); // 150 chars + '...'
  });

  it('should set publishedAt when isPublished is set to true', async () => {
    const postData = {
      title: 'Published Post',
      content: 'This is a published post',
      author: userId,
      category: categoryId,
      isPublished: true,
    };

    const post = await Post.create(postData);

    expect(post.isPublished).toBe(true);
    expect(post.publishedAt).toBeDefined();
    expect(post.publishedAt).toBeInstanceOf(Date);
  });

  it('should add comment correctly', async () => {
    const postData = {
      title: 'Test Post',
      content: 'This is test content',
      author: userId,
      category: categoryId,
    };

    const post = await Post.create(postData);
    await post.addComment(userId, 'Test comment');

    const updatedPost = await Post.findById(post._id);
    expect(updatedPost.comments).toHaveLength(1);
    expect(updatedPost.comments[0].content).toBe('Test comment');
  });

  it('should increment view count', async () => {
    const postData = {
      title: 'Test Post',
      content: 'This is test content',
      author: userId,
      category: categoryId,
    };

    const post = await Post.create(postData);
    expect(post.viewCount).toBe(0);

    await post.incrementViewCount();
    expect(post.viewCount).toBe(1);

    const updatedPost = await Post.findById(post._id);
    expect(updatedPost.viewCount).toBe(1);
  });
});

