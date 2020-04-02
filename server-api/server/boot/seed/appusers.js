'use strict';
const logger = require("../logger");

module.exports = (app, cb) => {       
   
    let appusers = [];
    appusers = require('./data/demo/appusers');        
    if(appusers.length <= 0) {
        return cb();
    }  


    deleteExisting(app)
    .then(() => {
        seedFresh(app, appusers)
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
    const appuser = app.models.appuser;
    
    return new Promise((resolve, reject) => {
        appuser.destroyAll()
            .then((results) => {
                logger.info(`Deleted ${results.count} existing appusers.`);
                resolve(results);
            })
            .catch((err) => {
                logger.error(err.message);
                reject(err);
            });
    });
};

const seedFresh = (app, appusers) => {
    return new Promise((resolve, reject) => {
        app.models.appuser.create(appusers)
            .then((results) => {
                logger.info(`Seeded ${results.length} appusers.`);
                resolve(results);
            })
            .catch((err) => {
                logger.error(err.message);
                reject(err);
            });
    });
};