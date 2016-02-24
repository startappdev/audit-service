var logger;
try {
    logger = require('@portalConfig/log')('auditService');
}
catch (e) {
    logger = require('winston');
}
module.exports = logger;
