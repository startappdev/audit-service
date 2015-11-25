'use strict';

var logger = require('./logger/logger'),
    version = require('../package').version;
logger.debug('======= Audit Service v#' + version + ' ====== ');

require('./init');

var auditService = require('./service/audit.service'),
    contextManipulatorService = require('./service/context.manipulator.service');


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