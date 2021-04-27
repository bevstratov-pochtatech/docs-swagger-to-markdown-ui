module.exports = (security) => {
  const res = [];
  let maxLength = 0;
  security.forEach((rules) => {
    Object.keys(rules).forEach((key) => {
      maxLength = rules[key].length > maxLength ? rules[key].length : maxLength;
    });
  });
  maxLength++;
  if (maxLength < 2) {
    maxLength = 2;
  }

  security.forEach((rules) => {
    Object.keys(rules).forEach((key) => {
      const line = [key].concat(rules[key]);
      while (line.length < maxLength) {
        line.push("");
      }
      let lineReduced = line.reduce(
        (prev, curr) => `${prev} ${curr || ""} |`,
        "|"
      );
      lineReduced = lineReduced.replace(/\s{2,}/g, " ");
      res.push(lineReduced);
    });
  });
  if (res.length) {
    let line = Array(maxLength).fill(" --- ");
    res.unshift(`|${line.join("|")}|`);
    line = [];
    line.push(" Тип авторизации ");
    line.push(" Права доступа ");
    while (line.length < maxLength) {
      line.push(" ");
    }
    res.unshift(`|${line.join("|")}|`);
    res.unshift("##### Авторизация\n");
    return res.join("\n");
  }
  return "";
};
