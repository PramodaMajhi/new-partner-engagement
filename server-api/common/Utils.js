'use strict';

const logger = require("../server/boot/logger");

module.exports = function authorizationError() {
    var error = new Error();
    error.status = 401;
    error.message = 'Authorization Required';
    logger.error(error);
    return error
}