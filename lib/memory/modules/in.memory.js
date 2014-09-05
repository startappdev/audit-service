'use strict';

var _ = require('lodash'),
    logger = require('logger');

var memory = {};
var config = {
    // Time to clean - 60 sec
    TTC : 60 * 1000,

    // Time to live - 15 min
    TTL : 15 * 60 * 1000
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
        value: _.cloneDeep(value),
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
    var value = memory[key].value;

    callback(null, value);
};

/**
 * A Clean memory Service,
 * Runs every TTC time and clean the entire memory from old TTL stuff
 */
function cleanService(){
    var now = Date.now();
    logger.info('Cleaning Service is in action [' + now + ']');
    for (var i in memory){
        if (now > memory[i].timestamp + config.TTL){
            logger.info('Object [' + i + '] is over the TTL');
            delete memory[i];
        }
    }

    logger.info('Done cleaning - running again in [' + config.TTC + '] ms');
    setTimeout(cleanService, config.TTC);
}
setTimeout(cleanService, config.TTC);