'use strict';

var logger = require('winston'),
    memory = require('../memory/memory'),
    mongoose = require('mongoose'),
    Audit = mongoose.model('audit');

/**
 * API to register audit comparators
 * @param schema - {Mongoose Schema}
 * @param auditComparator - Optional {Function} in the form of function(oldValue, newValue, done)
 */
exports.registerAudit = function(schema, auditComparator){
    logger.info('Entering register Audit method');

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

    schema.post('init', function(doc){
        memory.set(doc._id, doc);
    });

    schema.post('remove', function(doc){
        afterModifyingDocument('remove', doc, fieldsNotToAudit, auditComparator);
    });

    schema.post('save', function(doc){
        afterModifyingDocument('save', doc, fieldsNotToAudit, auditComparator);
    });
};

/**
 * Continuation method after modifying a specific document
 * @param event - {String} remove / save operation
 * @param doc - {Object} which was the operation on
 * @param fieldsNotToAudit - {Object} of fields not to consider within the default comparator
 * @param auditComparator - {Function} the auditComparator for the module
 */
function afterModifyingDocument(event, doc, fieldsNotToAudit, auditComparator){
    logger.info('Document [' + doc._id + '] had been modified [' + event + ']');

    var _this = this;
    this._callback = function(result, operation){
        logger.info('Audit result [' + result + '] for operation [' + operation + ']');
        if (result) {
            var audit = new Audit();
            audit.oldObject = _this.oldObject;
            audit.newObject = doc;
            audit.operation = operation;
            audit.updateBy = doc.getContext();
        }
    };

    // TODO : Implement default Comparator
    auditComparator = auditComparator || function(){};

    memory.get(doc._id, function(err, oldObject){
        _this.oldObject = oldObject;

        if (err){
            logger.error(err);
            return;
        }

        if (event === 'save' && typeof oldObject !== 'undefined') {
            auditComparator(oldObject, event === 'remove' ? {} : doc, _this._callback);
        } else {
            _this._callback(true, event === 'save' ? 'INSERT' : 'REMOVE');
        }
    });
}