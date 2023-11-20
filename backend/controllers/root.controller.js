const httpStatus = require('http-status');

const helloWorld = (req, res) => {
  res.status(httpStatus.OK).json({ message: 'Hello World' });
};

module.exports = {
  helloWorld,
};
