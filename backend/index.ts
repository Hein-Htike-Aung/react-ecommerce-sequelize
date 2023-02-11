// const http2 = require("node:http2");
// import http2 from "node:http2";
import cluster from "node:cluster";
import * as _ from "node:os";
import process from "node:process";
// import fs from "node:fs";

import app from "./app";
import redis from "./config/redis";
import db from "./models";
import logger from "./utils/logger";

const numCPUs = _.cpus();

if (cluster.isPrimary) {
  logger.info(`Primary ${process.pid} is running`);

  // Fork workers.
  numCPUs.forEach(() => cluster.fork());

  cluster.on("exit", (worker, code, signal) => {
    cluster.fork();
    logger.info(`worker ${worker.process.pid} died`);
    if (signal) {
      logger.info(`worker was killed by signal: ${signal}`);
    } else if (code !== 0) {
      logger.info(`worker exited with error code: ${code}`);
    } else {
      logger.info("worker success!");
    }
  });
} else {
  // Workers can share any TCP connection
  const port = process.env.PORT || 8081;

  (async () => {
    try {
      // await await db.sequelize.sync({ alter: true });

      // await redis.connect();

      app.listen(port, () => {
        logger.info(`Listening: http://localhost:${port}`);
      });
    } catch (error) {
      console.log(error)
      logger.error("Unable to connect to the database:", error);
    }
  })();

  logger.info(`Worker ${process.pid} started`);

  cluster.on("listening", (worker) => {
    logger.info(`Worker ${worker.process.pid} killed`);
  });
}

/* 

// generate keys
openssl req -x509 -newkey rsa:4096 -nodes -sha256 -subj '/CN=localhost' -keyout localhost-private.pem -out localhost-cert.pem

//cert bot
sudo certbot certonly --standalone

// http2 server
      const server = http2.createSecureServer(
        {
          key: fs.readFileSync("localhost-private.pem"),
          cert: fs.readFileSync("localhost-cert.pem"),
          allowHTTP1: true,
          // key: "",
          // cert: "",
        },
        app
      );

      // TCP connection
      server.on("stream", (stream: any, headers: any) => {
        logger.info(`Stream ${stream.id}`);

        // stream.respond({
        //   "content-type": "application/json",
        //   status: 200,
        // });

        // stream.end();
      });

      server.listen(port, () => {
        logger.info(`Listening: http://localhost:${port}`);
      });

*/
