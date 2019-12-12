const async = require('async');
const seed = require('require-all')(`${__dirname}/seed`);
const logger = require("./logger");

module.exports = (app, next) => {
    async.auto({        
        vendors: (cb) => {
            seed.vendors(app, cb);
        },
        appusers: (cb) => {
            seed.appusers(app, cb);
        }
    }, (err, result) => {
        if (err) {
            logger.error(err.message);
            return next(err);
        }
        return next();
    });
}