const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { getAvailableAchievements } = require('../services/achievement.service');
const { userService } = require('../services');
const { getAllAchievements } = require('../services/achievement.service');

const getAvailableAchievement = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const availableAchievements = await getAvailableAchievements(userId);
  res.status(httpStatus.OK).send(availableAchievements);
});

const getUserAchievements = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const [userAchievements, allAchievements] = await Promise.all([
    userService.getUserAchievements(userId),
    getAllAchievements(),
  ]);

  const claimedAchievementIds = new Set(userAchievements.map((ua) => ua.achievementId));

  const result = {
    claimed: userAchievements,
    locked: allAchievements.filter((achievement) => !claimedAchievementIds.has(achievement.id)),
  };

  res.status(httpStatus.OK).send(result);
});

module.exports = {
  getAvailableAchievement,
  getUserAchievements,
};
