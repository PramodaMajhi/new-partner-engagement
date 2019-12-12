'use strict';

const logger = require("../logger");

module.exports = (app, cb) => {
    let vendors = [];
    vendors = require('./data/demo/vendors');

    if (vendors.length <= 0) {
        return cb();
    }

    deleteExisting(app)
        .then(() => {
            seedFresh(app, vendors)
                .then(() => {
                    cb();
                })
                .catch((err) => {
                    logger.error(err.message);
                    cb();
                })
        })
        .catch((err) => {
            logger.error(err.message);
            cb();
        });

};

const deleteExisting = (app) => {
    const vendor = app.models.vendor;

    return new Promise((resolve, reject) => {
        vendor.destroyAll()
            .then((results) => {
                logger.info(`Deleted ${results.count} existing vendors.`);
                resolve(results);
            })
            .catch((err) => {
                logger.error(err.message);
                reject(err);
            });
    });
};

const seedFresh = (app, vendors) => {
    const vendor = app.models.vendor;

    return new Promise((resolve, reject) => {
        vendor.create(vendors)
            .then((results) => {
                logger.info(`Seeded ${results.length} vendors.`);
                resolve(results);
            })
            .catch((err) => {
                logger.error(err.message);
                reject(err);
            });
    });
};