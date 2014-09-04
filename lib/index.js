'use strict';

require('./model/audit.model');

var logger = require('./logger/logger'),
    auditService = require('./service/audit.service'),
    memory = require('./memory/memory'),
    inMemory = require('./memory/modules/in.memory'),
    version = require('../package').version;

logger.info('======= Audit Service v#' + version + ' ====== ');
memory.use(inMemory);
logger.info('Using in-memory module : [OK] ');

/**
 * API to register audit comparators
 * @param schema - {Mongoose Schema}
 * @param auditComparator - Optional {Function} in the form of function(oldValue, newValue, done)
 */
exports.registerAudit = auditService.registerAudit;