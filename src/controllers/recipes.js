const httpStatus = require('http-status');

const { Recipe, Rating } = require('../models');
const Redis = require('../utils/cache');
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
  const { limit = 10, page = 1 } = req.query;
  const cacheKey = `get-recipes-${limit}-${page}`;

  const getFromCache = await Redis.get(cacheKey);
  if (getFromCache) {
    return res.json(getFromCache);
  }

  const recipes = await Recipe.paginate(
    {},
    {
      limit,
      page,
      lean: true,
    },
  );
  await Redis.set(cacheKey, recipes);
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
 * @param {String} id - The unique id of the recipe
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
 * @param {String} id - The unique id of the recipe
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
 * @param {String} id - The unique id of the recipe
 * @private
 */
const rateRecipe = catchAsync(async (req, res) => {
  try {
    const uniqueId = req.params.id;
    const cacheKey = `rate-recipe-${uniqueId}`;
    const getFromCache = await Redis.get(cacheKey);

    let recipeId = getFromCache || null;

    if (!recipeId) {
      recipeId = await Recipe.findOne({ uniqueId }).select('id');

      if (!recipeId) {
        throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found');
      }

      await Redis.set(cacheKey, recipeId.id);
    }

    const rate = await Rating.create({
      rating: req.body.rating,
      recipe: recipeId,
    });

    res.json(rate);
  } catch (error) {
    throw new AppError(httpStatus.NOT_IMPLEMENTED, error.message);
  }
});

const searchRecipe = catchAsync(async (req, res) => {
  const { name, difficulty, prepTime, vegetarian } = req.query;
  const search = await Recipe.find({
    ...(name && { $text: { $search: name } }),
    ...(difficulty && { difficulty }),
    ...(prepTime && { prepTime }),
    ...(vegetarian && { vegetarian }),
  });
  res.json(search);
});

module.exports = {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  searchRecipe,
};
