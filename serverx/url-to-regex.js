/**
 * Parse url return url in regex pattern to be able to read value from
 * e.g api/:id/:parameter -> api/:(?<id>\w+)
 * https://javascript.info/regexp-groups#named-groups
 * @param {String} url 
 * @returns {String} e.g api/:(?<id>\w+)
 */

function modifyUrlToRegexPattern(url) {
  let str = "";
  for (let i = 0; i < url.length; i++) {
    const urlChar = url[i];
    if (urlChar === ":") {
      let param = "";
        let breakIndexToStartFrom;
        for (let j = i + 1; j < url.length; j++) {
          /**
           * check if url[j] char is part of the parameter string.
           * e.g check if [i,d] exists in /:id else break out to next
           */
          const hasParamChar = /\w/.test(url[j]);
          if (hasParamChar) {
            param += url[j];
          } else {
            //0 /api/:/:
            breakIndexToStartFrom = j
            break;
          }
        }

        str += `(?<${param}>\\w+)`;
        i = breakIndexToStartFrom - 1;
      } else {
        str += urlChar;
      }
    }
  return str;
}

module.exports = modifyUrlToRegexPattern;