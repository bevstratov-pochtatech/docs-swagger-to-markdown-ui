const inArray = require("../../lib/inArray");
const transformResponses = require("./pathResponses");
const transformParameters = require("./pathParameters");
const textEscape = require("../../lib/textEscape");

/**
 * Allowed methods
 * @type {string[]}
 */
const ALLOWED_METHODS = ["get", "post", "put", "patch", "delete", "options"];

module.exports = (path, data, parameters) => {
  const res = [];
  let pathParameters = null;

  if (!path || !data) {
    return null;
  }

  // Make path as a header
  // res.push(`### ${path}\n`);

  // Check if parameter for path are in the place
  if ("parameters" in data) {
    pathParameters = data.parameters;
  }

  // Go further method by methods
  Object.keys(data).forEach((method) => {
    if (inArray(method, ALLOWED_METHODS)) {
      // Set method + endpoint as a header
      res.push(
        `### <span class='req ${method.toUpperCase()}'>${method.toUpperCase()}</span> ${path}`
      );
      const pathInfo = data[method];

      // Set summary
      if ("summary" in pathInfo) {
        res.push(`${textEscape(pathInfo.summary)}\n`);
      }

      // Build security
      // if ("security" in pathInfo) {
      //   res.push(`${security(pathInfo.security)}\n`);
      // }

      // Set description
      // if ("description" in pathInfo) {
      //   res.push(`##### Описание:\n\n${textEscape(pathInfo.description)}\n`);
      // }

      // Set url
      const urlTemplate = `\`${process.env.API_URL}${path}\``;
      res.push(`##### URL для отправки запроса`);
      res.push(urlTemplate);

      // Set headers
      res.push(`##### HTTP-заголовки`);
      const headersTemplate = `
\`\`\`
Authorization: Basic <authToken>  
Content-type: application/json
\`\`\`
      `;
      res.push(headersTemplate);

      // Build parameters
      if ("parameters" in pathInfo || pathParameters) {
        res.push(
          `${transformParameters(
            pathInfo.parameters,
            pathParameters,
            parameters
          )}\n`
        );
      }

      // Query example

      res.push(`##### Пример запроса`);
      let reqTemplate = `
\`\`\`bash  
curl --  
\`\`\`
      `;
      res.push(reqTemplate);

      // Build responses
      if ("responses" in pathInfo) {
        res.push(`${transformResponses(pathInfo.responses)}\n`);
      }

      // Response example
      res.push(`##### Пример ответа сервера`);
      let resTemplate = `
\`\`\`javascript  
{
  "body": {},
  "statusCode": "100",
  "statusCodeValue": 0
} 
\`\`\`
      `;
      res.push(resTemplate);
      res.push("<hr />\n");
    }
  });

  return res.length ? res.join("\n") : null;
};
