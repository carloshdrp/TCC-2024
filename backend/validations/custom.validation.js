const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('A senha precisa ter no mínimo 8 caracteres.');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('A senha precisa conter pelo menos 1 letra e 1 número');
  }
  return value;
};

module.exports = {
  objectId,
  password,
};
