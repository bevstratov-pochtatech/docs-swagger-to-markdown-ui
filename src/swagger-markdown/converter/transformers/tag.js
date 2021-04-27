const textEscape = require("../../lib/textEscape");

module.exports = tag => {
    if (tag !== null && typeof tag === "object") {
        if ("description" in tag) {
            return `## ${textEscape(tag.description)} :id=${textEscape(tag.name)}`
        }
    }
}