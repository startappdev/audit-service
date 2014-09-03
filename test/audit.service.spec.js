'use strict';

describe('Audit Service Unit-Test', function(){
    var audit,
        schema;

    beforeEach(function(){
        audit = require('../lib/index');

        // Mock the Schema
        schema = {
            paths : {
                field1 : {
                    options : {
                        audit : {
                            compare : false
                        }
                    }
                },
                field2 : {
                    options : {

                    }
                },
                field3 : {

                }
            },
            post : function(){}
        };
    });

    it('should remove a specific field from the audit service', function(){
        console.log(audit);
        audit.registerAudit(schema);
    });
});