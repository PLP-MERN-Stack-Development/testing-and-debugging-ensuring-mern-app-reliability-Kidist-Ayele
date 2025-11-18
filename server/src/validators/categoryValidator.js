const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().max(50).required(),
  description: Joi.string().trim().max(200).allow('', null),
  isActive: Joi.boolean().default(true),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().max(50),
  description: Joi.string().trim().max(200).allow('', null),
  isActive: Joi.boolean(),
}).min(1);

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};

