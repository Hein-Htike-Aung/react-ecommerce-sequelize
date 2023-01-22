import app from "./app";
import db from "./models";
import logger from "./utils/logger";

const port = process.env.PORT || 8080;

(async () => {
  try {
    // await await db.sequelize.sync({ alter: true });
    await await db.sequelize.sync();

    app.listen(port, () => {
      logger.info(`Listening: http://localhost:${port}`);
    });
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
  }
})();
