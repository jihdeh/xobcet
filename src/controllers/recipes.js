const getRecipe = (req, res) => {
  res.json(req.params);
};

const getRecipes = (req, res) => {
  res.json(['recipes']);
};

const createRecipe = (req, res) => {
  res.json(['req.params']);
};

const updateRecipe = (req, res) => {
  res.send('hey');
};

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
