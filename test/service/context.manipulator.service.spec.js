'use strict';

describe('Audit Service Unit-Test', function() {
    var contextManipulatorService;

    require('../../lib/index');

    beforeEach(function () {
        contextManipulatorService = rewire('../../lib/service/audit.service');
    });
});