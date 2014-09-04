'use strict';

require('./model/audit.model');

var logger = require('./logger/logger'),
    auditService = require('./service/audit.service'),
    memory = require('./memory/memory'),
    inMemory = require('./memory/modules/in.memory'),
    contextManipulatorService = require('./service/context.manipulator.service'),
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

/**
 * Adds a manipulation on to the context service
 * @param contextService - {Context Service}
 */
exports.addContextManipulator = contextManipulatorService.addContextManipulator;

/**
 * API to get the context Id
 * @returns {ID}
 */
exports.getContextId = contextManipulatorService.getContextId;