const app = require('./app');
const logger = require('./config/logger');
const { port } = require('./config');

app.listen(process.env.PORT, () => {
  logger.info(`Server running on port ${port}`);
});
