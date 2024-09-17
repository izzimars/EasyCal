const app = require("/root/EasyCal/app");
const config = require("/root/EasyCal/utils/config");
const logger = require("/root/EasyCal/utils/logger");

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
