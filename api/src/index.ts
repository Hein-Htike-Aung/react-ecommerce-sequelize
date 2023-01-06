import app from "./app";
import logger from "./utils/logger";

const port = process.env.PORT || 8080;
app.listen(port, () => {
  logger.info(`Listening: http://localhost:${port}`);
});
