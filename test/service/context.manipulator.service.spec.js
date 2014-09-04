'use strict';

describe('Context Manipulator Service Unit-Test', function() {
    var contextManipulatorService,
        contextService;

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
});