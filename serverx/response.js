/**
 * Response Module exports.
 * @public
 */

module.exports = (res) => {
/**
 * Get value for header `field`.
 *
 * @param {String} field
 * @return {String}
 * @public
 */

res.get = function(field){
  return this.getHeader(field);
};

res.send = function send(body) {
  if(typeof body === 'object') {
    console.warn('res.send deprecated for json response type, please use res.json instead')
    return res.end(JSON.stringify(body));
  }
  this.end(body);
}

res.json = function json(data) {
   // content-type
   if (!this.get('Content-Type')) {
    this.setHeader('Content-Type', 'application/json');
  }
  return this.end(JSON.stringify(data));
}
  return res;
};