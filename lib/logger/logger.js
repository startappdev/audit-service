var logger;
try {
    require('@portalRoot/config/log')('auditService');
}
catch (e) {
    logger = require('winston');
}
module.exports = logger;