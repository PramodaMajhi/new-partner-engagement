'use strict';

const logger = require("../boot/logger");

module.exports = function(options) {
    return function logError(err, req, res, next) {
      logger.error(err);
      next(err);
    };
};