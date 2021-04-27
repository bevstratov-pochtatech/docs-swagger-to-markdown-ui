const markdownlint = require("markdownlint");
const markdownlintRuleHelpers = require("markdownlint-rule-helpers");

const transformTag = require("./transformers/tag");
const transformPath = require("./transformers/path");
const transformSecurityDefinitions = require("./transformers/securityDefinitions");
const transformExternalDocs = require("./transformers/externalDocs");
const transformDefinition = require("./transformers/definitions");
const markdownlintConfig = require("../../../.markdownlint.json");

function transformSwagger(inputDoc) {
  const document = [];

  // Collect parameters
  const parameters = "parameters" in inputDoc ? inputDoc.parameters : {};

  if ("externalDocs" in inputDoc) {
    document.push(transformExternalDocs(inputDoc.externalDocs));
  }

  // Security definitions
  if ("securityDefinitions" in inputDoc) {
    document.push(transformSecurityDefinitions(inputDoc.securityDefinitions));
  } else if (inputDoc.components && inputDoc.components.securitySchemas) {
    document.push(
      transformSecurityDefinitions(inputDoc.components.securityDefinitions)
    );
  }

  // Tags
  if ("tags" in inputDoc && "paths" in inputDoc) {
    Object.keys(inputDoc.tags).forEach((tag) => {
      const tagObject = inputDoc.tags[tag];

      document.push(transformTag(tagObject));

      Object.keys(inputDoc.paths).forEach((path) => {
        Object.keys(inputDoc.paths[path]).forEach((method) => {
          const methodObject = inputDoc.paths[path][method];
          if (methodObject.tags.includes(tagObject.name)) {
            document.push(
              transformPath(path, inputDoc.paths[path], parameters)
            );
          }
        });
      });
    });
  }

  // Models (definitions)
  if ("definitions" in inputDoc) {
    document.push(transformDefinition(inputDoc.definitions));
  } else if (inputDoc.components && inputDoc.components.schemas) {
    document.push(transformDefinition(inputDoc.components.schemas));
  }

  // Glue all pieces down
  const plainDocument = document.join("\n");

  // Fix markdown issues
  const fixOptions = {
    resultVersion: 3,
    strings: {
      plainDocument,
    },
    config: markdownlintConfig,
  };
  const fixResults = markdownlint.sync(fixOptions);
  const fixes = fixResults.plainDocument.filter((error) => error.fixInfo);
  if (fixes.length > 0) {
    return markdownlintRuleHelpers.applyFixes(plainDocument, fixes);
  }

  return plainDocument;
}

module.exports = {
  transformSwagger
};
