'use strict';

describe('In-Memory Memory Module Unit-Test', function(){
    var inMemory,
        memory,
        rewire = require('rewire');

    beforeEach(function(){
        inMemory = rewire('../../../lib/memory/modules/in.memory');

        memory = inMemory.__get__('memory');
    });

    it ('should test set method', function(done){
        inMemory.set('key', 'value', function(err){
            expect(err).toEqual(null);
            expect(memory.key).toEqual('value');

            done();
        });
    });

    it ('should test get method', function(done){
        memory.key = 'value';

        inMemory.get('key', function(err, value){
            expect(err).toEqual(null);
            expect(value).toEqual('value');

            done();
        });
    });
});