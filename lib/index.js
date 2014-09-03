'use strict';

var logger = require('./logger/logger'),
    auditService = require('./service/audit.service');

logger.info('======= Audit Service v#0.0.0 ====== ');

/**
 * API to register audit comparators
 * @param schema - {Mongoose Schema}
 * @param auditComparator - Optional {Function} in the form of function(oldValue, newValue, done)
 */
exports.registerAudit = auditService.registerAudit;