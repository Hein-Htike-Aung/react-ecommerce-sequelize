/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Dialect, Sequelize } from "sequelize";

const dbOptions = {
  port: +process.env.DB_PORT!,
  host: process.env.DB_HOST,
  dialect: process.env.DB_CONNECTION as Dialect,
  // timezone: "+6:30",
  pool: {
    max: 15,
    min: 5,
    idle: 20000,
    evict: 15000,
    acquire: 30000,
  },
};

const sequelize = new Sequelize(
  process.env.DB_DATABASE!,
  process.env.DB_USERNAME!,
  process.env.DB_PASSWORD!,
  dbOptions
);

(async () => {
  try {
    // create table automatically
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export default sequelize;
