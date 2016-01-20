var logger;
try {
    require('@portalRoot/config/logger')('auditService');
}
catch (e) {
    logger = require('winston');
}
var logger = require('@portalRoot/config/logger')();
module.exports = logger;