'use strict';

var logger = require('winston'),
    memory = require('../memory/memory'),
    mongoose = require('mongoose'),
    Audit = mongoose.model('audit'),
    String = require('../data/string.data.js'),
    _ = require('lodash');

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
        memory.set(doc.id, doc.toObject());
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
    logger.info('Document [' + doc.id + '] had been modified [' + event + ']');

    auditComparator = auditComparator || defaultComparator;

    logger.info('Getting old object [' + doc.id + ']');
    // Get the old object from memory module
    memory.get(doc.id, function(err, oldObject){
        logger.info('Got old Object with err [' + err + ']');
        var _callback = function(result, operation){
            logger.info('Audit result [' + result + '] for operation [' + operation + ']');
            if (result) {
                // Create audit object
                var audit = new Audit();
                audit.oldObject = oldObject;
                audit.newObject = event === 'remove' ? undefined : doc.toObject();
                audit.operation = operation;
                if (typeof doc.getContext == 'function') {
                    audit.updateBy = doc.getContext();
                }

                // Save it
                audit.save(function(err){
                    if (err) {
                        logger.error(err.message);
                        return;
                    }
                });
            }
        };

        if (err){
            logger.error(err.message);
            return;
        }

        if (event === 'save' && typeof oldObject !== 'undefined') {
            logger.info('Updating object');
            // Check to see if update occurred
            auditComparator(oldObject, doc.toObject(), _callback);
        } else {
            logger.info(event + ' object');
            // We know this is an insert or remove operation - insert it
            _callback(true, event === 'save' ? String.OPERATION_INSERT : String.OPERATION_REMOVE);
        }
    });
}

/**
 * A default comparator function
 * @param oldObject - {Object} old value
 * @param newObject - {Object} new value
 * @param done - {Function} in the form of done(result, operation)
 */
function defaultComparator(oldObject, newObject, done){
    var equal = _.isEqual(oldObject, newObject);

    done(!equal, String.OPERATION_UPDATE);
}