'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AuditSchema = new Schema({
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
    updateData : {
        type : Date,
        default : Date.now
    }
});

AuditSchema.index({ "newObject._id": 1 });

module.exports = function (mongooseConnection) {
    let connection = mongooseConnection ? mongooseConnection : mongoose;
    return connection.model('audit', AuditSchema);
};
