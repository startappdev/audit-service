'use strict';

var logger = require('winston');

/**
 * API to register audit comparators
 * @param schema - {Mongoose Schema}
 * @param auditComparator - Optional {Function} in the form of function(oldValue, newValue, done)
 */
exports.registerAudit = function(schema, auditComparator){
    logger.info('Entering register Audit method');

    // TODO : Implement default Comparator
    auditComparator = auditComparator || function(){};

    var fieldsNotToAudit = {};

    // Go throughout all the path in the schema
    for (var field in schema.paths){
        // Check the audit options
        if (schema.paths[field].options && schema.paths[field].options.audit) {
            // If specific decided not to audit
            if (schema.paths[field].options.audit.compare === false){
                logger.info('Removing [' + field + '] from the Audit');
                fieldsNotToAudit[field] = true;
            }
        }
    }
};