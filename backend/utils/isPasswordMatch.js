const bcrypt = require('bcryptjs');

async function isPasswordMatch(user, password) {
  return bcrypt.compare(password, user.password);
}

module.exports = isPasswordMatch;
