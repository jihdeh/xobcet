const server = require('server');
const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
} = require('./controllers/recipes.js');

const app = server();

app.get('/recipes', getRecipes);

app.get('/recipes/:id', getRecipe);

app.post('/recipes', createRecipe);

app.put('/recipes/:id', updateRecipe);

app.delete('/recipes', deleteRecipe);

app.post('/recipes/:id/rating', rateRecipe);

module.exports = app;
