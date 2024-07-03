const allRoles = {
  INICIANTE: [],
  ESTUDIOSO: ['manageAnswers'],
  ADMIN: [
    'getUsers',
    'manageUsers',
    'manageQuizzes',
    'manageQuestions',
    'manageComments',
    'manageTags',
    'managePoints',
    'manageReports',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
