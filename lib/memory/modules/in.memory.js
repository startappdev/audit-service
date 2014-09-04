'use strict';

var _ = require('lodash');

var memory = {};

/**
 * set method
 * @param key - {Object}
 * @param value - {Object}
 * @param done - {Function} notifier when done in the form of done(err)
 */
exports.set = function(key, value, done){
    // Save in memory
    console.log('InMemory Set');
    memory[key] = _.cloneDeep(value);

    console.log('InMemory Set2');

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
    console.log('InMemory Get');
    var value = memory[key];

    callback(null, value);
};