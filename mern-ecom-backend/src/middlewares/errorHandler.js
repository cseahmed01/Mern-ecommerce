// src/middlewares/errorHandler.js
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.stack || err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Server Error'
  });
};
