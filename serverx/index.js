const http = require("http");
const serverConfig = require("./server");
/**
 * Application prototype.
 */
const app = {};

/**
 * On app start, register routes to a hash table, including middlewares
 * @param {String} path api path
 * @param {Function} cb path callback
 * @param {String} method GET, POST, PUT, DELETE
 * @param {Function} middleware additional middlewares if any, identified by index,
 * @returns {Object} {path: String, method: String, method-middleware-{0}: null | Function }
 * @private
 */
const registerPath = (path, cb, method, middleware) => (routeTable, middlewareIndex = 1) => {
  if (!routeTable[path]) {
    routeTable[path] = {};
  }
  routeTable[path] = { ...routeTable[path], [method]: cb, [`${method}-middleware-${middlewareIndex}`]: middleware };
}

const configurePath = (urlPath, middlewareCb, method, routeTable) => {
  if (middlewareCb.length === 1) {
    registerPath(urlPath, middlewareCb[0] , method)(routeTable);
  } else {
    for(let i = 0; i < middlewareCb.length; i++) {
      let nextIdx = 1; //used to register next middleware callbacks
      if (nextIdx > 0) {
        nextIdx = i
      }
      registerPath(urlPath, middlewareCb[nextIdx], method, middlewareCb[i])(routeTable, i);
    }
  }
}


/**
 * Get configuration for GET method request
 * @param {String} path request url path
 * @param  {...Function} rest these are middleware callback funtions
 * @public
 */
app.get = function (path, ...rest)  {
  configurePath(path, rest, "get", serverConfig.routeTable);
}

/**
 * Post configuration for POST method request
 * @param {String} path request url path
 * @param  {...Function} rest these are middleware callback funtions
 * @public
 */
app.post = function (path, ...rest) {
  configurePath(path, rest, "post", serverConfig.routeTable);
};

/**
 * Put configuration for PUT method request
 * @param {String} path request url path
 * @param  {...Function} rest these are middleware callback funtions
 * @public
 */
app.put = (path, ...rest) => {
  configurePath(path, rest, "put", serverConfig.routeTable);
};

/**
 * Delete configuration for DELETE method request
 * @param {String} path request url path
 * @param  {...Function} rest these are middleware callback funtions 
 * @public
 */
app.delete = (path, ...rest) => {
  configurePath(path, rest, "delete", serverConfig.routeTable);
};

/**
 * Listen for connections.
 *
 * A node `http.Server` is returned, with this
 * application (which is a `Function`) as its
 * callback. If you wish to create both an HTTP
 * and HTTPS server you may do so with the "http"
 * and "https" modules as shown here:
 *
 *    var http = require('http')
 *      , https = require('https')
 *      , server = require('server')
 *      , app = server();
 *
 *    http.createServer(app).listen(80);
 *    https.createServer({ ... }, app).listen(443);
 *
 * @return {http.Server}
 * @public
 */

app.listen = function listen() {
  const server = http.createServer(serverConfig.init);
  return server.listen.apply(server, arguments);
};

function Application() {
  return app
}

module.exports = Application;