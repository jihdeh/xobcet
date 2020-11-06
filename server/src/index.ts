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
   * @param  {...Function} rest these are middleware callback funtions
   * @public
   */
  get: function (path, ...rest) {
    configurePath(path, rest, 'get', serverConfig.routeTable);
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
   * @param  {...Function} rest these are middleware callback funtions
   * @public
   */
  post: function (path, ...rest) {
    configurePath(path, rest, 'post', serverConfig.routeTable);
  },

  /**
   * Put configuration for PUT method request
   * @param {String} path request url path
   * @param  {...Function} rest these are middleware callback funtions
   * @public
   */

  put: (path, ...rest) => {
    configurePath(path, rest, 'put', serverConfig.routeTable);
  },

  /**
   * Delete configuration for DELETE method request
   * @param {String} path request url path
   * @param  {...Function} rest these are middleware callback funtions
   * @public
   */

  delete: (path, ...rest) => {
    configurePath(path, rest, 'delete', serverConfig.routeTable);
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
   *    https.createServer({ ... }, app).listen(443);
   *
   * @return {http.Server}
   * @public
   */

  listen: function listen(...params: any) {
    const server = http.createServer(serverConfig.init);
    // eslint-disable-next-line prefer-spread
    const [port, callback] = params;
    return server.listen(port, callback);
  },
};

function Application(): Application {
  return app;
}

/**
 * Expose `Application()`.
 */

exports = module.exports = Application;
