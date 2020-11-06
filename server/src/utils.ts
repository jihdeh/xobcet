import { Middleware, RequestHandler, ResponseHandler, ServerConfigInterface } from './types';

/**
 * On app start, register routes to a hash table, including middlewares
 * @param {String} path api path
 * @param {Function} cb path callback
 * @param {String} method GET, POST, PUT, DELETE
 * @param {Function} middleware additional middlewares if any, identified by index,
 * @returns {Object} {path: String, method: String, method-middleware-{0}: null | Function }
 * @private
 */
const registerPath = (
  path: string,
  callback: Middleware,
  method: 'get' | 'post' | 'put' | 'delete',
  middleware?: Middleware,
) => (routeTable: ServerConfigInterface['routeTable'], middlewareIndex = 1) => {
  if (!routeTable[path]) {
    routeTable[path] = {};
  }

  routeTable[path] = {
    ...routeTable[path],
    [method]: callback,
    [`${method}-middleware-${middlewareIndex}`]: middleware,
  };
};

const configurePath = (
  urlPath: string,
  middlewareCb: Middleware[],
  method: 'get' | 'post' | 'put' | 'delete',
  routeTable: ServerConfigInterface['routeTable'],
): void => {
  if (middlewareCb.length === 1) {
    registerPath(urlPath, middlewareCb[0], method)(routeTable);
  } else {
    for (let i = 0; i < middlewareCb.length; i++) {
      let nextIdx = 1; //used to register next middleware callbacks
      if (nextIdx > 0) {
        nextIdx = i;
      }
      registerPath(urlPath, middlewareCb[nextIdx], method, middlewareCb[i])(routeTable, i);
    }
  }
};

type CallbackMiddleware = (req: RequestHandler, res: ResponseHandler, callback: () => void) => void;

/**
 * Function helps to call middleware callbacks passed to application path
 * ex:
 *
 * app.get('/', () => {})
 * @param middlewares
 * @param req
 * @param res
 * @returns {Promise} Promise<boolean[] | Middleware[] | unknown[]>
 * @public
 */
const processMiddleware = (
  middlewares: CallbackMiddleware[],
  req: RequestHandler,
  res: ResponseHandler,
): Promise<boolean[] | CallbackMiddleware[] | unknown[]> => {
  if (!middlewares.length) {
    return new Promise((resolve) => resolve([true]));
  }

  return Promise.all(
    middlewares.map(
      (middleware: CallbackMiddleware) =>
        new Promise((resolve) => {
          middleware(req, res, function () {
            resolve(true);
          });
        }),
    ),
  );
};

/**
 * Reads request data and combines chunks into human format
 * @param req
 * @returns request data
 * @throws {Error} on error
 */
const readBody = (req: RequestHandler): Promise<string> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += '' + chunk;
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
};

export { configurePath, processMiddleware, readBody };
