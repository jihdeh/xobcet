const { auth } = require('../config/config');

const authenticate = ({ username, password }) => {
  const authorized = username === auth.username && password === auth.password;
  return authorized;
};

const basicAuth = (req, res, next) => {
  // check for basic auth header
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    res.statusCode = 401;
    return res.json({ message: 'Missing Authorization Header' });
  }

  // verify auth credentials
  const base64Credentials = req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');

  const [username, password] = credentials.split(':');
  const authorized = authenticate({ username, password });

  if (!authorized) {
    res.statusCode = 401;
    return res.json({ message: 'Invalid Authentication Credentials' });
  }

  next();
};

module.exports = basicAuth;
