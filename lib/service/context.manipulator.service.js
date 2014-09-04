'use strict';

var logger = require('winston');

var contextId;

/**
 * Adds a manipulation on to the context service
 * @param contextService - {Context Service}
 */
exports.addContextManipulator = function(contextService){
    contextId = contextService.addContextManipulator(function(contextManipulator, next){
        var data = {
            userId : contextManipulator.getRequest().user.userId
        };
        logger.info('Adding userId to context [' + data.userId + ']');

        contextManipulator.addData(data);

        next();
    });

    logger.info('Added Context Manipulator [' + contextId + ']');
};

/**
 * API to get the context Id
 * @returns {ID}
 */
exports.getContextId = function(){
    return contextId;
};