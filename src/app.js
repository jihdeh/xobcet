const server = require('server');

const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
} = require('./controllers/recipes.js');
const basicAuth = require('./middleware/basicAuth.js');
const apiQuota = require('./middleware/rateLimiter.js');
const { RECIPES, RECIPES_ID, RECIPES_RATING } = require('./routes.js');
const {
  createRecipeValidation,
  updateRecipeValidation,
  rateRecipeValidation,
} = require('./validations/recipe.validation');

const { Servlets: app, Server: Core } = server();

app.get(RECIPES, getRecipes);
app.post(RECIPES, basicAuth, apiQuota, createRecipeValidation, createRecipe);

app.get(RECIPES_ID, getRecipe);
app.put(RECIPES_ID, basicAuth, apiQuota, updateRecipeValidation, updateRecipe);
app.delete(RECIPES_ID, basicAuth, apiQuota, deleteRecipe);

app.post(RECIPES_RATING, basicAuth, apiQuota, rateRecipeValidation, rateRecipe);

module.exports = { app, Core };
