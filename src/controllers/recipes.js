const httpStatus = require('http-status');

const { Recipe, Rating } = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

/**
 * Controller to get a single recipe
 * @public
 * @returns {Recipe} Recipe object
 */
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

/**
 * Contoller to get all recipes
 * @public
 * @returns {Array(Recipe)} An array of Recipes
 */
const getRecipes = catchAsync(async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

/**
 * Controller to create a recipe
 * @private
 * @return Newly created recipe object
 */
const createRecipe = catchAsync(async (req, res) => {
  try {
    const newRecipe = await Recipe.create(req.body);
    res.json(newRecipe);
  } catch (error) {
    throw new AppError(httpStatus.NOT_IMPLEMENTED, error.message);
  }
});

/**
 * Controller to update a single recipe
 * @private
 */
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

/**
 * Controller to delete a recipe
 * @private
 */
const deleteRecipe = catchAsync(async (req, res) => {
  try {
    const deleteAction = await Recipe.deleteOne({
      uniqueId: req.params.id,
    });

    if (deleteAction.n) {
      res.send('Recipe deleted');
    } else {
      throw new AppError(httpStatus.NOT_IMPLEMENTED, 'Recipe not deleted');
    }
  } catch (error) {
    throw new AppError(httpStatus.NOT_IMPLEMENTED, error.message);
  }
});

/**
 * Controller to rate a Recipe
 * @private
 */
const rateRecipe = catchAsync(async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ uniqueId: req.params.id }).select('id');

    if (!recipe) {
      throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
    }

    const rate = await Rating.create({
      rating: req.body.rating,
      recipe: recipe.id,
    });

    res.json(rate);
  } catch (error) {
    throw new AppError(httpStatus.NOT_IMPLEMENTED, error.message);
  }
});

module.exports = {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
};
