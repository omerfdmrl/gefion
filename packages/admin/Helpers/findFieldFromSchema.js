module.exports = function findFieldByName(schemaArray, targetName) {
  function search(childs) {
    for (const child of childs) {
      if (child.name === targetName) {
        return child;
      }

      if (child.childs) {
        const found = search(child.childs);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  for (const schema of schemaArray) {
    if (!schema.childs) continue;
    const found = search(schema.childs);
    if (found) {
      return found;
    }
  }

  return null;
};
