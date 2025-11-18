const Joi = require('joi');
const mongoose = require('mongoose');

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

const basePostSchema = {
  title: Joi.string().trim().max(100).required(),
  content: Joi.string().trim().required(),
  featuredImage: Joi.string().uri().optional(),
  excerpt: Joi.string().trim().max(200).allow('', null),
  author: Joi.string().custom(objectIdValidator, 'ObjectId validation').required(),
  category: Joi.string()
    .custom(objectIdValidator, 'ObjectId validation')
    .required(),
  tags: Joi.array().items(Joi.string().trim().max(30)).default([]),
  isPublished: Joi.boolean().default(false),
};

const createPostSchema = Joi.object(basePostSchema);

const updatePostSchema = Joi.object({
  title: Joi.string().trim().max(100).optional(),
  content: Joi.string().trim().optional(),
  featuredImage: Joi.string().uri().optional(),
  excerpt: Joi.string().trim().max(200).allow('', null).optional(),
  author: Joi.string().custom(objectIdValidator, 'ObjectId validation').optional(),
  category: Joi.string()
    .custom(objectIdValidator, 'ObjectId validation')
    .optional(),
  tags: Joi.array().items(Joi.string().trim().max(30)).optional(),
  isPublished: Joi.boolean().optional(),
}).min(1);

module.exports = {
  createPostSchema,
  updatePostSchema,
};

