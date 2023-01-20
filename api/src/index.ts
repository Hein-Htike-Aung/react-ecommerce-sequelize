import app from "./app";
import model_config from "./models";
import logger from "./utils/logger";

const port = process.env.PORT || 8080;

(async () => {
  try {
    // create table automatically
    await model_config.sequelize.authenticate();
    await model_config.sequelize.sync({ alter: true });
    app.listen(port, () => {
      logger.info(`Listening: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
