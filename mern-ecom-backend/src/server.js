// src/server.js
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

const server = http.createServer(app);

const start = async () => {
  await connectDB(MONGO_URI);
  server.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
  });
};

start();

// handle unhandled rejections and uncaught exceptions
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection', err);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', err);
  process.exit(1);
});
