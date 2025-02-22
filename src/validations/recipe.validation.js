const Joi = require('joi');

const createRecipeValidation = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    difficulty: Joi.number().min(1).max(3).required(),
    prepTime: Joi.string().required(),
    vegetarian: Joi.boolean(),
  });
  const validation = schema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    next(validation.error.details);
  }
  next();
};

const updateRecipeValidation = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string(),
    difficulty: Joi.number().min(1).max(3),
    prepTime: Joi.string(),
    vegetarian: Joi.boolean(),
  });
  const validation = schema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    next(validation.error.details);
  }
  next();
};

const rateRecipeValidation = (req, res, next) => {
  const schema = Joi.object().keys({
    rating: Joi.number().min(1).max(5),
  });
  const validation = schema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    next(validation.error.details);
  }
  next();
};

const searchRecipeValidation = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string(),
    difficulty: Joi.number().min(1).max(3),
    prepTime: Joi.string(),
    vegetarian: Joi.boolean(),
    page: Joi.number(),
    limit: Joi.number(),
  });
  const validation = schema.validate(req.query, { abortEarly: false });
  if (validation.error) {
    next(validation.error.details);
  }
  next();
};

module.exports = {
  createRecipeValidation,
  updateRecipeValidation,
  rateRecipeValidation,
  searchRecipeValidation,
};
