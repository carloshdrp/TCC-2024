const allRoles = {
  INICIANTE: [],
  ESTUDIOSO: ['createAnswer', 'createQuiz'],
  ADMIN: [
    'getUsers',
    'createQuiz',
    'createAnswer',
    'manageUsers',
    'manageQuizzes',
    'manageQuestions',
    'manageComments',
    'manageAnswers',
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
