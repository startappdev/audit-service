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

module.exports = function (mongooseConnection) {
    let connection = mongooseConnection ? mongooseConnection : mongoose;
    return connection.model('audit', AuditSchema);
};
