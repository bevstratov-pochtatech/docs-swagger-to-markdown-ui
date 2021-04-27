const transformContact = require("./contact");
const transformLicense = require("./license");
const textEscape = require("../../lib/textEscape");

/**
 * http://swagger.io/specification/#infoObject
 * Prepare page header
 * Leave description with no changes
 * @param {Object} info
 * @returns {String}
 */
module.exports = (info) => {
  const res = [];
  if (info !== null && typeof info === "object") {
    if ("title" in info) {
      res.push(`# ${info.title}`);
    }

    if ("description" in info) {
      res.push(`${textEscape(info.description)}\n`);
    }

    if ("version" in info) {
      res.push(`## Версия: ${info.version}\n`);
    }

    if ("termsOfService" in info) {
      res.push(
        `### Условия использования\n${textEscape(info.termsOfService)}\n`
      );
    }

    if ("contact" in info) {
      res.push(transformContact(info.contact));
    }

    if ("license" in info) {
      res.push(transformLicense(info.license));
    }
  }
  return res.length ? res.join("\n") : null;
};
