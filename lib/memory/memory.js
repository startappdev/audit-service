'use strict';

/**
 * This layer will give a simple API interface to set and get key-value,
 * Afterwards this layer could be connected into redis / mongoose
 * or any other module that we would like to support
*/

var currentModule;

/**
 * Set API - delegated to current module
 * @param key - {Object}
 * @param value - {Object}
 * @param done - Optional {Function} notifier when done in the form of done(err)
 */
exports.set = function(key, value, done){
    done = done || function(){};

    try {
        currentModule.set(key, value, done);
    } catch(e){
        done(e);
    }
};

/**
 * Get API - delegated to current module
 * @param key - {Object}
 * @param callback - {Function} of the form callback(err, value)
 */
exports.get = function(key, callback){
    try {
        currentModule.get(key, callback);
    }catch(e){
        callback(e, null);
    }
};

/**
 * Use API to use different memory module
 * @param memoryModule - {Object} which Implement Module Interface (set, get methods)
 */
exports.use = function(memoryModule){
    currentModule = memoryModule;
};