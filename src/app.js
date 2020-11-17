const server = require('server');

const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  searchRecipe,
} = require('./controllers/recipes.js');
const basicAuth = require('./middleware/basicAuth.js');
const apiQuota = require('./middleware/rateLimiter.js');
const { RECIPES, RECIPES_ID, RECIPES_RATING, RECIPES_SEARCH } = require('./routes.js');
const {
  createRecipeValidation,
  rateRecipeValidation,
  updateRecipeValidation,
  searchRecipeValidation,
} = require('./validations/recipe.validation');

const { Servlets: app, Server: Core } = server();

/**
 * Get recipes
 */
app.get(RECIPES, getRecipes);

/**
 * Create a recipe
 */
app.post(RECIPES, basicAuth, apiQuota, createRecipeValidation, createRecipe);

/**
 * Get a recipe
 */
app.get(RECIPES_ID, getRecipe);

/**
 * Update recipe
 */
app.put(RECIPES_ID, basicAuth, apiQuota, updateRecipeValidation, updateRecipe);

/**
 * Delete recipe
 */
app.delete(RECIPES_ID, basicAuth, apiQuota, deleteRecipe);

/**
 * Rate recipe
 */
app.post(RECIPES_RATING, basicAuth, apiQuota, rateRecipeValidation, rateRecipe);

/**
 * Search recipes
 */
app.get(RECIPES_SEARCH, searchRecipeValidation, searchRecipe);

module.exports = { app, Core };
