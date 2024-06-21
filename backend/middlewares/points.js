const httpStatus = require('http-status');
const { pointsService } = require('../services');
const { ApiError } = require('../utils');
const pointsConfig = require('../config/points');

const pointsMiddleware = {
  setPoints: (action) => {
    return async (req, res, next) => {
      try {
        const { user } = req;

        if (user.role === 'ADMIN') {
          return next();
        }

        let amount;
        let actionType;

        const incrementEntry = Object.entries(pointsConfig.increment).find(([key, actions]) => actions.includes(action));
        if (incrementEntry) {
          amount = parseInt(incrementEntry[0], 10);
          actionType = 'increment';
        }

        if (!amount) {
          const decrementEntry = Object.entries(pointsConfig.decrement).find(([key, actions]) => actions.includes(action));
          if (decrementEntry) {
            amount = parseInt(decrementEntry[0], 10);
            actionType = 'decrement';
          }
        }

        if (!amount) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid action');
        }

        if (actionType === 'increment') {
          await pointsService.incrementPoints(user.id, amount);
        } else if (actionType === 'decrement') {
          if (user.points < amount || user.points === 0) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Usuário não tem pontos suficientes');
          }

          await pointsService.decrementPoints(user.id, amount);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  },
};

module.exports = pointsMiddleware;
