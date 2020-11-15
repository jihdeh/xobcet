const server = require('server');

const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
} = require('./controllers/recipes.js');
const apiQuota = require('./middleware/rateLimiter.js');
const {
  createRecipeValidation,
  updateRecipeValidation,
  rateRecipeValidation,
} = require('./validations/recipe.validation');

const { Servlets: app, Server: Core } = server();

app.get('/recipes', getRecipes);

app.get('/recipes/:id', getRecipe);

app.post('/recipes', apiQuota, createRecipeValidation, createRecipe);

app.put('/recipes/:id', apiQuota, updateRecipeValidation, updateRecipe);

app.delete('/recipes/:id', apiQuota, deleteRecipe);

app.post('/recipes/:id/rating', apiQuota, rateRecipeValidation, rateRecipe);

module.exports = { app, Core };
