'use strict';

describe('Memory Interface Unit-Test', function(){
    var memory,
        currentModule,
        inMemory = require('../../lib/memory/modules/in.memory'),
        sinon = require('sinon');

    require('../../lib/index');

    beforeEach(function(){
        memory = require('../../lib/memory/memory');
    });

    it ('should verify interface exists', function(){
        expect(typeof memory.get).toEqual('function');
        expect(typeof memory.set).toEqual('function');
        expect(typeof memory.use).toEqual('function');
    });

    describe('Methods Test', function(){

        beforeEach(function(){
            // Mock currentModule
            currentModule = sinon.stub({
                get : function(){},
                set : function(){}
            });

            memory.use(currentModule);
        });

        it ('should verify get method', function(){
            var callback = function(){};

            memory.get('key', callback);

            expect(currentModule.get.calledWith('key', callback)).toBeTruthy();
        });

        it ('should verify set method', function(){
            var done = function(){};

            memory.set('key', 'value', done);

            expect(currentModule.set.calledWith('key', 'value', done)).toBeTruthy();
        });

        it ('should verify optional done method', function(){
            memory.set('key', 'value');

            expect(currentModule.set.calledWith('key', 'value', sinon.match.func)).toBeTruthy();
        });

        afterEach(function(){
            memory.use(inMemory);
        });
    });
});