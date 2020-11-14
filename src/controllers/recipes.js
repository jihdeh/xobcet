const httpStatus = require('http-status');

const { Recipe } = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const getRecipe = catchAsync(async (req, res) => {
  const recipe = await Recipe.findOne({
    uniqueId: req.params.id,
  });
  if (recipe) {
    res.json(recipe.transform());
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
  }
});

const getRecipes = catchAsync(async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

const createRecipe = catchAsync(async (req, res) => {
  try {
    const newRecipe = await Recipe.create(req.body);
    res.json(newRecipe);
  } catch (error) {
    throw new AppError(httpStatus.NOT_IMPLEMENTED, error.message);
  }
});

const updateRecipe = catchAsync(async (req, res) => {
  try {
    const update = await Recipe.updateOne(
      {
        uniqueId: req.params.id,
      },
      {
        ...req.body,
      },
    );
    if (update.nModified) {
      res.send('Recipe updated');
    } else {
      throw new AppError(httpStatus.NOT_IMPLEMENTED, 'Recipe not updated');
    }
  } catch (error) {
    throw new AppError(httpStatus.NOT_IMPLEMENTED, error.message);
  }
});

const deleteRecipe = (req, res) => {
  res.send(req.body);
};

const rateRecipe = (req, res) => {
  res.send(req.body);
};

module.exports = {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
};
