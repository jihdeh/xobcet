const { pathToRegexp } = require('path-to-regexp');

const parse = require("./url-to-regex");
const response = require('./response');
const request = require('./request');
const queryParse = require("./query-params");
const {readBody, processMiddleware} = require('./utils');


const serverConfig = {};
serverConfig.routeTable = {};

serverConfig.init = async (serverRequest, serverRespone) => {
  
  this.req = response(serverRequest);
  this.res = request(serverRespone);
  this.pathMatch = undefined;
  this.regexPathUrl = undefined;
  this.route = undefined;
  const routes = Object.keys(serverConfig.routeTable);

  let match = false;
  for(var i = 0; i < routes.length; i++) {
     this.route = routes[i];
     this.parsedRoute = parse(this.route);
     this.regexPathUrl = new RegExp(this.parsedRoute);
     const urlNoQueryParam = this.req.url.split("?")[0];

     const regexp = pathToRegexp(this.route);
     this.pathMatch = regexp.exec(urlNoQueryParam);
    const requestProcessed = await processCallback();


    match = requestProcessed;
    break;
  }
  if (!match) {
    this.res.statusCode = 404;
    this.res.end("Not found");
  }
}

const processCallback = async () => {

  let parseMethod = "json";
  const route = serverConfig.routeTable[this.route];
  const methodToLower = this.req.method.toLowerCase();
  const callback = serverConfig.routeTable[this.route][methodToLower]

  if (this.pathMatch && callback) {
    let middlewares = Object.keys(route).map(methodName => {
      if(methodName.includes(`${methodToLower}-middleware`)) {
       return route[methodName]
      }
    }).filter(Boolean);
  
    const urlMatch = this.req.url.match(this.regexPathUrl);
    
    this.req.params = urlMatch.groups;
    this.req.query = queryParse(this.req.url);
    
    let body = await readBody(this.req);
  
    if (parseMethod === "json") {
      body = body ? JSON.parse(body) : {};
    }
    this.req.body = body;

    const result = await processMiddleware(middlewares, this.req, response(this.res));
    if (result.length) {
      callback(this.req, this.res);
    }
    return true
  }
}

module.exports = serverConfig;