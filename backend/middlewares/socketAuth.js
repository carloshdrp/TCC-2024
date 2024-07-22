const { getSocketAuthPromise, getUserSocket } = require('../socketManager');

async function waitForSocketAuth(req, res, next) {
  if (!req.user) {
    return next(new Error('Usuário não autenticado'));
  }

  try {
    let userSocket = getUserSocket(req.user.id);
    if (userSocket) {
      req.userSocket = userSocket;
      return next();
    }

    const authPromise = getSocketAuthPromise(req.user.id);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Timeout de autenticação do socket'));
      }, 5000);
    });

    userSocket = await Promise.race([authPromise, timeoutPromise]);
    req.userSocket = userSocket;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = waitForSocketAuth;
