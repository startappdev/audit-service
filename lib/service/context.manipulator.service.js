'use strict';

var contextId;

/**
 * Adds a manipulation on to the context service
 * @param contextService - {Context Service}
 */
exports.addContextManipulator = function(contextService){
    contextId = contextService.addContextManipulator(function(contextManipulator, next){
        var data = {
            userId : contextManipulator.getRequest().profile.userId
        };

        contextManipulator.addData(data);

        next();
    });
};

/**
 * API to get the context Id
 * @returns {ID}
 */
exports.getContextId = function(){
    return contextId;
};