const { httpServer } = require('./app');
const logger = require('./config/logger');
const { port } = require('./config');

httpServer.listen(process.env.PORT, () => {
  logger.info(`Server running on port ${port}`);
});
