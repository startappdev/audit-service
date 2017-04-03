'use strict';

var _cloneDeep = require('lodash.clonedeep'),
    logger = require('../../logger/logger');

var memory = {};
var config = {
    // Time to clean - 15 min
    TTC : 15 * 60 * 1000,

    // Time to live - 60 min
    TTL : 60 * 60 * 1000
};

/**
 * set method
 * @param key - {Object}
 * @param value - {Object}
 * @param done - {Function} notifier when done in the form of done(err)
 */
exports.set = function(key, value, done){
    // Save in memory
    memory[key] = {
        value: _cloneDeep(value),
        timestamp: Date.now()
    };


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
    var mem = memory[key];

    if (mem) {
        callback(null, mem.value);
    } else {
        callback(null, undefined);
    }
};

/**
 * A Clean memory Service,
 * Runs every TTC time and clean the entire memory from old TTL stuff
 */
function cleanService(){
    var now = Date.now();
    logger.debug('Cleaning Service is in action [' + now + ']');
    for (var i in memory){
        if (now > memory[i].timestamp + config.TTL){
            logger.debug('Object [' + i + '] is over the TTL');
            delete memory[i];
        }
    }

    logger.debug('Done cleaning - running again in [' + config.TTC + '] ms');
    setTimeout(cleanService, config.TTC);
}
setTimeout(cleanService, config.TTC);