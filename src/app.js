const server = require('server');

const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
} = require('./controllers/recipes.js');
const {
  createRecipeValidation,
  updateRecipeValidation,
  rateRecipeValidation,
} = require('./validations/recipe.validation');

const app = server();

app.get('/recipes', getRecipes);

app.get('/recipes/:id', getRecipe);

app.post('/recipes', createRecipeValidation, createRecipe);

app.put('/recipes/:id', updateRecipeValidation, updateRecipe);

app.delete('/recipes/:id', deleteRecipe);

app.post('/recipes/:id/rating', rateRecipeValidation, rateRecipe);

module.exports = app;
