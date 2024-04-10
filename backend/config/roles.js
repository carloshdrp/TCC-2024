const allRoles = {
  USER: [],
  VERIFIED: [],
  ADMIN: ['getUsers', 'manageUsers', 'manageQuestions', 'manageComments', 'manageTags'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
