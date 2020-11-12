import * as http from 'http';
import serverConfig from './server';

import { configurePath } from './utils';
import { Application } from './types';

/**
 * Application prototype.
 */
const app: Application = {
  /**
   * Get configuration for GET method request
   * example
   *
   * app.get('/', (req, res) => {}) - without additional middleware
   *
   * app.get('/',
   *  (req, res, next) => { next() },
   *  (req, res) => {res.send('')}
   * ) - with added middleware
   *
   * @param {String} path request url path
   * @param  {...Function} fns these are middleware callback funtions
   * @public
   */
  get: function (path, ...fns) {
    configurePath(path, fns, 'get', serverConfig.routeTable);
  },

  /**
   * Post configuration for POST method request
   * example
   *
   * app.post('/', (req, res) => {}) - without additional middleware
   *
   * app.post('/',
   *  (req, res, next) => { next() },
   *  (req, res) => {res.send('')}
   * ) - with added middleware
   *
   * @param {String} path request url path
   * @param  {...Function} fns these are middleware callback funtions
   * @public
   */
  post: function (path, ...fns) {
    configurePath(path, fns, 'post', serverConfig.routeTable);
  },

  /**
   * Put configuration for PUT method request
   * @param {String} path request url path
   * @param  {...Function} fns these are middleware callback funtions
   * @public
   */

  put: (path, ...fns) => {
    configurePath(path, fns, 'put', serverConfig.routeTable);
  },

  /**
   * Delete configuration for DELETE method request
   * @param {String} path request url path
   * @param  {...Function} fns these are middleware callback funtions
   * @public
   */

  delete: (path, ...fns) => {
    configurePath(path, fns, 'delete', serverConfig.routeTable);
  },

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
   *
   * @return {http.Server}
   * @public
   */

  listen: function listen(...params: any) {
    const server = http.createServer(serverConfig.init);
    // eslint-disable-next-line prefer-spread
    const [port, callback] = params;
    return server.listen(port, callback);
  }
};

function Application(): Application {
  return app;
}

/**
 * Expose `Application()`.
 */

export = module.exports = Application;
