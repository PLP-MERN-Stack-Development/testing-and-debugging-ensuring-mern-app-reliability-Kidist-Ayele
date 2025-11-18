const mongoose = require('mongoose');
const Post = require('../models/Post');
const asyncHandler = require('../middleware/asyncHandler');

const buildPostQuery = (filters) => {
  const query = {};

  if (filters.category) {
    if (mongoose.Types.ObjectId.isValid(filters.category)) {
      query.category = filters.category;
    }
  }

  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  if (filters.isPublished !== undefined) {
    query.isPublished = filters.isPublished;
  }

  return query;
};

exports.getPosts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
  const skip = (page - 1) * limit;

  const query = buildPostQuery({
    category: req.query.category,
    search: req.query.q || req.query.search,
    isPublished:
      typeof req.query.isPublished === 'undefined'
        ? undefined
        : req.query.isPublished === 'true',
  });

  const [posts, total] = await Promise.all([
    Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email')
      .populate('category', 'name slug'),
    Post.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: posts,
    pagination: {
      total,
      page,
      pages: Math.max(Math.ceil(total / limit), 1),
      limit,
    },
  });
});

exports.getPost = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  let post = null;

  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    post = await Post.findById(idOrSlug)
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .populate('comments.user', 'name email');
  }

  if (!post) {
    post = await Post.findOne({ slug: idOrSlug })
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .populate('comments.user', 'name email');
  }

  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }

  res.json({ success: true, data: post });
});

exports.createPost = asyncHandler(async (req, res) => {
  const post = await Post.create(req.body);
  const populatedPost = await post.populate([
    { path: 'author', select: 'name email' },
    { path: 'category', select: 'name slug' },
  ]);

  res.status(201).json({ success: true, data: populatedPost });
});

exports.updatePost = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const identifier = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const post = await Post.findOne(identifier);

  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }

  // Check if user is the author
  if (req.user && post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, error: 'Not authorized to update this post' });
  }

  Object.assign(post, req.body);
  const updatedPost = await post.save();
  const populatedPost = await updatedPost.populate([
    { path: 'author', select: 'name email' },
    { path: 'category', select: 'name slug' },
  ]);

  res.json({ success: true, data: populatedPost });
});

exports.deletePost = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const identifier = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const post = await Post.findOne(identifier);

  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }

  // Check if user is the author
  if (req.user && post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, error: 'Not authorized to delete this post' });
  }

  await post.deleteOne();

  res.json({ success: true, data: null, message: 'Post deleted successfully' });
});

exports.addComment = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const identifier = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const post = await Post.findOne(identifier);

  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }

  const { content, userId } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, error: 'Comment content is required' });
  }

  post.comments.push({
    user: userId || req.user?._id || null,
    content: content.trim(),
  });

  await post.save();
  const populatedPost = await post.populate([
    { path: 'author', select: 'name email' },
    { path: 'category', select: 'name slug' },
    { path: 'comments.user', select: 'name email' },
  ]);

  res.json({
    success: true,
    data: populatedPost,
    message: 'Comment added successfully',
  });
});

