'use strict';

var logger = require('winston'),
    memory = require('../memory/memory'),
    Audit = require('../model/audit.model.js'),
    String = require('../data/string.data.js'),
    contextManipulatorService = require('./context.manipulator.service.js'),
    _ = require('lodash');

/**
 * API to register audit comparators
 * @param schema - {Mongoose Schema}
 * @param auditComparator - Optional {Function} in the form of function(oldValue, newValue, done)
 */
exports.registerAudit = function (schema, auditComparator) {
    if (process.env.NODE_ENV === 'test') return;

    var fieldsNotToAudit = {};

    // Go throughout all the path in the schema
    for (var field in schema.paths) {
        // Check the audit options
        if (schema.paths[field].options && schema.paths[field].options.audit) {
            // If specific decided not to audit
            if (schema.paths[field].options.audit.compare === false) {
                logger.debug('Removing [' + field + '] from the Audit');
                fieldsNotToAudit[field] = true;
            }
        }
    }

    schema.post('init', function (doc) {
        try {
            memory.set(doc.id, doc.toLookupObject ? doc.toLookupObject() : doc.toObject());
        } catch (e) {
            logger.error('Error while trying to save doc [' + doc.id + ']');
        }
    });

    schema.post('remove', function (doc) {
        afterModifyingDocument('remove', doc, fieldsNotToAudit, auditComparator);
    });

    schema.post('save', function (doc) {
        afterModifyingDocument('save', doc, fieldsNotToAudit, auditComparator);
    });

    schema.methods.setContext = function (context) {
        this._context = context;
    };

    schema.methods.getContext = function () {
        return this._context;
    };
};

/**
 * Continuation method after modifying a specific document
 * @param event - {String} remove / save operation
 * @param doc - {Object} which was the operation on
 * @param fieldsNotToAudit - {Object} of fields not to consider within the default comparator
 * @param auditComparator - {Function} the auditComparator for the module
 */
function afterModifyingDocument(event, doc, fieldsNotToAudit, auditComparator) {
    logger.debug('Document [' + doc.id + '] had been modified [' + event + ']');

    auditComparator = auditComparator || defaultComparator;

    logger.debug('Getting old object [' + doc.id + ']');
    // Get the old object from memory module
    memory.get(doc.id, function (err, oldObject) {
        logger.debug('Got old Object with err [' + err + ']');
        var _callback = function (result, operation) {
            logger.debug('Audit result [' + result + '] for operation [' + operation + ']');
            if (result) {
                // Create audit object
                var audit = new Audit();
                audit.oldObject = oldObject;
                audit.newObject = event === 'remove' ? undefined : ( doc.toLookupObject ? doc.toLookupObject() : doc.toObject());
                audit.operation = operation;

                audit.entity = doc.constructor.modelName.toLowerCase();

                logger.debug('got basic details - Trying to acquire userId');
                if (typeof doc.getContext == 'function') {
                    var id = contextManipulatorService.getContextId();
                    var context = doc.getContext();
                    if (!context || typeof context.getData !== 'function') {
                        logger.error('Error is context object');
                        return;
                    }
                    var data = doc.getContext().getData(id);
                    if (data) {
                        audit.updateBy = data.userId;
                        logger.debug('Audit operation for userId [' + data.userId + ']');
                    }
                }

                // Save it
                audit.save(function (err) {
                    if (err) {
                        logger.error(err.message);
                        return;
                    }
                });
            }
        };

        if (err) {
            logger.error(err.message);
            return;
        }

        if (event === 'save' && typeof oldObject !== 'undefined') {
            logger.debug('Updating object');
            // Check to see if update occurred
            auditComparator(oldObject, ( doc.toLookupObject ? doc.toLookupObject() : doc.toObject()), _callback);
        } else {
            logger.debug(event + ' object');
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
function defaultComparator(oldObject, newObject, done) {
    var equal = _.isEqual(oldObject, newObject);

    done(!equal, String.OPERATION_UPDATE);
}
