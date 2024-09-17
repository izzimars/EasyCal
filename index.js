const app = require("/root/EasyCalapp");
const config = require("/root/EasyCalutils/config");
const logger = require("/root/EasyCalutils/logger");

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
