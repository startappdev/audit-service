'use strict';

describe('Context Manipulator Service Unit-Test', function() {
    var contextManipulatorService,
        contextService,
        sinon = require('sinon');

    require('../../lib/index');

    beforeEach(function () {
        contextManipulatorService = require('../../lib/service/context.manipulator.service');
    });

    it ('should test correct contextId', function(){
        contextService = {
            addContextManipulator : function(callback){
                return 1234;
            }
        };

        contextManipulatorService.addContextManipulator(contextService);

        expect(contextManipulatorService.getContextId()).toEqual(1234);
    });

    it ('should test that data being added to context manipulator', function(done){
        contextService = {
            _callback : null,
            addContextManipulator : function(callback){
                contextService._callback = callback;
                return 1234;
            }
        };

        var contextManipulator = {
            getRequest : function(){
                return {
                    user : {
                        userId : 1234
                    },
                    headers: {}
                };
            },
            addData : sinon.stub()
        };

        contextManipulatorService.addContextManipulator(contextService);

        contextService._callback(contextManipulator, function(){
            expect(contextManipulator.addData.calledWith({
                userId : 1234
            })).toBeTruthy();

            done();
        });
    });

    it ('should test that additional data from header being added to context manipulator', function(done){
        contextService = {
            _callback : null,
            addContextManipulator : function(callback){
                contextService._callback = callback;
                return 1234;
            }
        };

        var contextManipulator = {
            getRequest : function(){
                return {
                    user : {
                        userId : 1234
                    },
                    headers: {
                        isconnectedas: 'true',
                        ismanaged: 'false'
                    }
                };
            },
            addData : sinon.stub()
        };

        contextManipulatorService.addContextManipulator(contextService);

        contextService._callback(contextManipulator, function(){
            expect(contextManipulator.addData.calledWith({
                userId : 1234,
                isConnectedAs: true
            })).toBeTruthy();

            done();
        });
    });
});