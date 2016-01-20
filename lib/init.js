'use strict';

require('./model/audit.model.js');

var memory = require('./memory/memory'),
    inMemory = require('./memory/modules/in.memory.js'),
    logger = require('./logger/logger');

memory.use(inMemory);
logger.debug('Using in-memory module : [OK] ');