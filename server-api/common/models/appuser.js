'use strict';

var disableAllMethods = require('../../utils/disableAllMethods');
const authorizationError = require('../Utils')
// var config = require('../../server/config.json');
var path = require('path');
//Replace this address with your actual address
var senderAddress = 'noreply@blueshieldca.com';

module.exports = function (AppUser) {
    disableAllMethods(AppUser, ['find', 'findById', 'create', 'deleteById', 'exists', 'prototype.patchAttributes', 'prototype.__create__accessTokens', 'login', 'logout', 'prototype.__updateById__accessTokens']);

    AppUser.afterRemote('login', function (context, remoteMethodOutput, next) {
        AppUser.findById(context.result.userId.toString(), async function (err, user) {
            if (err) {
                return next(authorizationError());
            }
            if (!user.termsAccepted) {
                return next(authorizationError());
            }
           
            next();
        });
    });
};
