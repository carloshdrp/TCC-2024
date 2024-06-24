const allRoles = {
  INICIANTE: [],
  ESTUDIOSO: ['manageAnswers'],
  ADMIN: ['getUsers', 'manageUsers', 'manageQuestions', 'manageComments', 'manageTags', 'managePoints', 'manageReports'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
