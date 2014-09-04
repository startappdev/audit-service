'use strict';

require('./model/audit.model');

var memory = require('./memory/memory'),
    inMemory = require('./memory/modules/in.memory'),
    logger = require('winston');

memory.use(inMemory);
logger.info('Using in-memory module : [OK] ');