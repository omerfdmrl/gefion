module.exports = (data) => {
  data.methods &&
    Object.keys(data.methods).forEach((key) => {
      const functionString = data.methods[key].toString();

      const functionBody = functionString
        .replace(/^[^{]+{/, "")
        .replace(/}[^}]*$/, "");
      const functionParams = functionString
        .match(/\(([^)]*)\)/)[1]
        .split(/\s*,\s*/);
      data.methods[key] = {
        body: functionBody,
        params: functionParams,
      };
    });
  return data;
};
