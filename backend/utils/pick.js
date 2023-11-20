const pick = (object, keys) => {
  return keys.reduce((accumulator, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      return { ...accumulator, [key]: object[key] };
    }
    return accumulator;
  }, {});
};

module.exports = pick;
