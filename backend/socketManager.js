const userSockets = new Map();
const socketAuthPromises = new Map();

const resolveAuthPromise = (userId, socket) => {
  const authPromiseObj = socketAuthPromises.get(userId);
  if (authPromiseObj && typeof authPromiseObj.resolve === 'function') {
    authPromiseObj.resolve(socket);
    socketAuthPromises.delete(userId);
  }
};

const addUserSocket = (userId, socket) => {
  userSockets.set(userId, socket);
  resolveAuthPromise(userId, socket);
};

const removeUserSocket = (userId) => {
  userSockets.delete(userId);
  socketAuthPromises.delete(userId);
};

const getUserSocket = (userId) => {
  return userSockets.get(userId);
};

const getSocketAuthPromise = (userId) => {
  if (!socketAuthPromises.has(userId)) {
    return new Promise((resolve, reject) => {
      socketAuthPromises.set(userId, { resolve, reject });
    });
  }
  return socketAuthPromises.get(userId);
};

const rejectAuthPromise = (userId, error) => {
  const authPromiseObj = socketAuthPromises.get(userId);
  if (authPromiseObj && typeof authPromiseObj.reject === 'function') {
    authPromiseObj.reject(error);
    socketAuthPromises.delete(userId);
  }
};

module.exports = {
  userSockets,
  addUserSocket,
  removeUserSocket,
  getUserSocket,
  getSocketAuthPromise,
  rejectAuthPromise,
};
