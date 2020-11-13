const server = require('../server/lib/index.js');

const app = server();

app.get('/recipes', (req, res) => {
  res.json(['recipes']);
});

app.get('/recipes/:id', (req, res) => {
  res.json(req.params);
});

app.post('/recipes', (req, res) => {
  res.json(['req.params']);
});

app.put('/recipes/:id', (req, res) => {
  res.send('hey');
});

app.delete('/recipes', (req, res) => {
  res.send(req.body);
});

app.post('/recipes/:id/rating', (req, res) => {
  res.send(req.body);
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server running on 3000');
});
