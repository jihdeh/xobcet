const queryString = require('qs');
/**
 * Parse url to get all route parameters identified by a colon and identifier
 * e.g api/:id/:parameter
 * @param {String} url 
 * @returns {Object} e.g {id: 1, parameter: string}
 */

function parse(url) {
  const results = url.match(/\?(?<query>.*)/);
  if (!results) {
    return {};
  }
  const stripUrl = url.split('?')[1]
  const parsed = queryString.parse(stripUrl, { ignoreQueryPrefix: true });
  return parsed;
}

module.exports = parse;