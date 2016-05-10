'use strict';

var logger = require('../logger/logger'),
    _ = require('lodash');

var contextId;

/**
 * Adds a manipulation on to the context service
 * @param contextService - {Context Service}
 */
exports.addContextManipulator = function(contextService){
    contextId = contextService.addContextManipulator(function(contextManipulator, next){
        var request = contextManipulator.getRequest();
        var userId = getUserId(request);
        var additionalData = {};

        var data = {
            userId : userId
        };

        if (request.headers.isconnectedas === 'true') {
            additionalData.isConnectedAs = true;

            logger.debug('Performing Connect As');
        }
        if (request.headers.ismanaged === 'true') {
            additionalData.isManaged = true;

            logger.debug('Performing Manage As');
        }

        data = _.assign(data, additionalData);

        logger.debug('Adding userId to context [' + data.userId + ']');

        contextManipulator.addData(data);

        next();
    });

    logger.debug('Added Context Manipulator [' + contextId + ']');
};

/**
 * API to get the context Id
 * @returns {ID}
 */
exports.getContextId = function(){
    return contextId;
};
/**
 * Get user id from request
 * @param request
 * @returns {String} userId
 */
function getUserId(request){
    var userId = null;
    if (request.user){
        userId = request.user.userId;
    } else if (request.query && request.query.partner){
        userId = request.query.partner; //for APIs
    }

    return userId;
}