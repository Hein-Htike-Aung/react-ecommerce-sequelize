/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DataTypes, Dialect } from "sequelize";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Sequelize = require("sequelize");
import fs from "fs";
import path from "path";
const basename = path.basename(__filename);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;
const dbOptions = {
  port: +process.env.DB_PORT!,
  host: process.env.DB_HOST,
  dialect: process.env.DB_CONNECTION as Dialect,
  timezone: "+6:30",
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

// fs.readdirSync(__dirname)
//   .filter((file: string) => {
//     return (
//       file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts"
//     );
//   })
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   .forEach((file: any) => {
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//     const model = require(path.join(__dirname, file))(Sequelize.sequelize, DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

export default db;
