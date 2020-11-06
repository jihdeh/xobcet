import * as http from 'http';
import QueryString = require('qs');

export type ResponseValueType = string | number | Array<number | string> | Record<string, unknown> | Buffer;

export interface RequestHandler extends http.IncomingMessage {
  params: { [key: string]: string } | undefined;
  query: QueryString.ParsedQs | '' | undefined;
  body: ResponseValueType;
  method: string;
}

export interface ResponseHandler extends http.ServerResponse {
  get: (field: string) => string | number | string[] | undefined;
  send: (field: string) => void;
  json: (field: Record<string, unknown>) => void;
}

export interface ServerConfigInterface {
  /**
   * Used to check if the url accessed exists in the lists of routes
   */
  pathMatch: RegExpExecArray | null;

  /**
   * Contains a hash of all routes with their methods
   * @example
   * {'/recipes': {
   *    get: [Function],
   *    'get-middleware-1': undefined,
   *    post: [Function],
   *    'post-middleware-1': undefined
   * },
   *
   * '/recipes/:id': {
   *    get: [Function],
   *    'get-middleware-1': undefined,
   *    put: [Function],
   *    'put-middleware-1': undefined
   *  }
   */
  routeTable: Record<string, any>;

  /**
   * Gets the regex format for the REST API url
   * @example
   * /recipes -> /\/recipes/
   */
  regexPathUrl: RegExp | '';

  /**
   * Converts url path params to regex string with pattern
   *
   * e.g app.get('/hello/:id/', () => {})
   *
   * The url is converted to 'hello/:(?<id>\w+)
   *
   * This is used to get the groups in Regexp
   */
  parsedRoute: string | undefined;

  /**
   * Rest API Path url
   *
   */
  route: string;

  /**
   * Exposes Http Incoming Message
   */
  req: RequestHandler;

  /**
   * Exposes Http Server Response
   */
  res: ResponseHandler;

  /**
   * Initializes server configuration
   */
  init: (req: any, res: any) => undefined | Promise<void>;
}

export type Middleware = (req: RequestHandler, res: ResponseHandler) => void;

export interface Application {
  delete: (path: string, callback: Middleware) => void;

  get: (path: string, callback: Middleware) => void;

  listen(port: number, hostname: string, callback?: (...args: any[]) => void): http.Server;
  listen(port: number, callback?: (...args: any[]) => void): http.Server;

  post: (path: string, callback: Middleware) => void;

  put: (path: string, callback: Middleware) => void;
}
