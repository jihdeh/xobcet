import { pathToRegexp } from 'path-to-regexp';

import parse from './modify-url-to-pattern';
import response from './response';
import request from './request';
import queryParse from './query-params';
import { readBody, processMiddleware } from './utils';
import { RequestHandler, ResponseHandler, ServerConfigInterface } from './types';

const serverConfig: ServerConfigInterface = {
  routeTable: {},
  pathMatch: null,
  parsedRoute: undefined,
  regexPathUrl: '',
  route: '',

  set req(serverRequest: RequestHandler) {
    this.req = request(serverRequest);
  },

  get req(): RequestHandler {
    return this.req;
  },

  set res(serverRespone) {
    this.res = response(serverRespone);
  },

  get res() {
    return this.res;
  },

  init: async function (serverRequest: RequestHandler, serverRespone: ResponseHandler) {
    this.req = request(serverRequest);
    this.res = response(serverRespone);

    const routes = Object.keys(serverConfig.routeTable);
    let match: boolean | undefined = false;

    for (let i = 0; i < routes.length; i++) {
      this.route = routes[i];
      this.parsedRoute = parse(this.route);
      this.regexPathUrl = new RegExp(this.parsedRoute);

      const urlNoQueryParam = this.req.url?.split('?')[0] || '';
      const regexp = pathToRegexp(this.route);
      this.pathMatch = regexp.exec(urlNoQueryParam);

      const requestProcessed = await processCallback.apply(this);

      match = requestProcessed;
      if (match) {
        break;
      }
    }
    if (!match) {
      this.res.statusCode = 404;
      this.res.end('Not found');
    }
  },
};

/**
 * Process callback processes the request body, and then runs the callbacks
 * and middlewares if any then sends a response back.
 * @param this
 * @this serverConfig
 */
const processCallback = async function (this: typeof serverConfig) {
  const route = serverConfig.routeTable[this.route];
  const methodToLower = this.req.method.toLowerCase();
  const callback = route[methodToLower];

  if (this.pathMatch && callback) {
    const middlewares = Object.keys(route)
      .map((methodName) => {
        if (methodName.includes(`${methodToLower}-middleware`)) {
          return route[methodName];
        }
      })
      .filter(Boolean);

    const urlMatch = this.req.url?.match(this.regexPathUrl);

    this.req.params = urlMatch?.groups;
    this.req.query = this.req.url && queryParse(this.req.url);

    let body = await readBody(this.req);

    /** @todo fix: for other request types */
    body = body ? JSON.parse(body) : {};

    this.req.body = body;

    const result = await processMiddleware(middlewares, this.req, response(this.res));
    if (result.length) {
      callback(this.req, this.res);
    }
    return true;
  }
};

export default serverConfig;
