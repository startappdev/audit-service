'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AuditSchema = new Schema({
    entity: {
        type : String,
        required : true
    },
    oldObject : {
        type : Object
    },
    newObject : {
        type : Object
    },
    operation : {
        type : String,
        required : true
    },
    updateBy : {
        type : String
    },
    updateDate : {
        type : Date,
        default : Date.now
    }
});

AuditSchema.index({ "newObject._id": 1, "entity": 1 });

let model;

// If model is already registered - just return it
if(mongoose.models.audit) {
    model = mongoose.model('audit');
} else {
    model = mongoose.model('audit', AuditSchema);
}

module.exports = model;