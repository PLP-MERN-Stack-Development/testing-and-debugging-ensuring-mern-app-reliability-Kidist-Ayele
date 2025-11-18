const mongoose = require('mongoose');
const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');

exports.getCategories = asyncHandler(async (req, res) => {
  const includeInactive = req.query.includeInactive === 'true';
  const filter = includeInactive ? {} : { isActive: true };

  const categories = await Category.find(filter).sort({ name: 1 });

  res.json({ success: true, data: categories });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

exports.getCategory = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const category = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? await Category.findById(idOrSlug)
    : await Category.findOne({ slug: idOrSlug });

  if (!category) {
    return res.status(404).json({ success: false, error: 'Category not found' });
  }

  res.json({ success: true, data: category });
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const identifier = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const category = await Category.findOne(identifier);

  if (!category) {
    return res.status(404).json({ success: false, error: 'Category not found' });
  }

  Object.assign(category, req.body);
  await category.save();

  res.json({ success: true, data: category });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const identifier = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const category = await Category.findOne(identifier);

  if (!category) {
    return res.status(404).json({ success: false, error: 'Category not found' });
  }

  category.isActive = false;
  await category.save();

  res.json({
    success: true,
    data: category,
    message: 'Category archived successfully',
  });
});

