const typeResolver = {
  basic: "Basic",
  apiKey: "API Key",
  oauth2: "OAuth 2.0",
};
const nameResolver = {
  description: "Описание",
  name: "Наименование",
  in: "In",
  flow: "Flow",
  authorizationUrl: "Authorization URL",
  tokenUrl: "Token URL",
};

module.exports = (securityDefinitions) => {
  // Base block
  const res = [];
  Object.keys(securityDefinitions).forEach((type) => {
    if (type === "basicAuth") {
      const authTemplate = `
Авторизация передаётся в HTTP-заголовке запроса "Authorization", например,  
\`Authorization: Basic <authToken>\`  
Где \`authToken\` — закодированная в base64 пара Идентификатор отправителя (id) и Токен отправителя (token), разделенная двоеточием" \`(id:token)\`
      `;
      res.push(authTemplate);
      return;
    }
    res.push(`**${type}**  \n`);
    res.push(
      `|${securityDefinitions[type].type}|*${
        typeResolver[securityDefinitions[type].type]
      }*|`
    );
    res.push("|---|---|");
    Object.keys(securityDefinitions[type]).forEach((value) => {
      if (value === "scopes") {
        res.push("|**Scopes**||");
        Object.keys(securityDefinitions[type][value]).forEach((scope) => {
          res.push(
            `|${scope}|` +
              `${securityDefinitions[type][value][scope].replace(
                /[\r\n]/g,
                " "
              )}|`
          );
        });
        return;
      }
      if (value !== "type" && securityDefinitions[type][value].replace) {
        let key = nameResolver[value];
        if (key === undefined) {
          if (!value.match(/^x-/i)) {
            return;
          }
          key = value;
        }
        res.push(
          `|${key}|${securityDefinitions[type][value].replace(/[\r\n]/g, " ")}|`
        );
      }
    });
    res.push("");
  });

  // Create header
  // Only in case if there is any data
  if (res.length > 0) {
    res.unshift("### Авторизация");
  }

  return res.length ? res.join("\n") : null;
};
module.exports.nameResolver = nameResolver;
module.exports.typeResolver = typeResolver;
