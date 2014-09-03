'use strict';

var memory = {};

/**
 * set method
 * @param key - {Object}
 * @param value - {Object}
 * @param done - {Function} notifier when done in the form of done(err)
 */
exports.set = function(key, value, done){
    // Save in memory
    memory[key] = value;

    // Notify Done
    done(null);
};

/**
 * get method
 * @param key - {Object}
 * @param callback - {Function} of the form callback(err, value)
 */
exports.get = function(key, callback){
    // Get from memory
    var value = memory[key];

    callback(null, value);
};