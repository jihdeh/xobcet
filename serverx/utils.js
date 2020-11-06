
const processMiddleware = (middlewares, req, res) => {
  if (!middlewares.length) {
    return new Promise((resolve) => resolve([true]));
  }

  return Promise.all(middlewares.map(middleware => new Promise((resolve) => {
    middleware(req, res, function () {
      resolve(true);
    });
  })));
}

const readBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += "" + chunk;
    });
    req.on("end", () => {
      resolve(body);
    });
    req.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = {
  processMiddleware,
  readBody
}