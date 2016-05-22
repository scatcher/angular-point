"use strict";
var environment_1 = require('../app/environment');
/**
 * Allows us to intercept and return mock responses when working
 * offline.  When online we use the real Http service.
 * @param {Http} http The real Http service.
 * @returns {Http} Http Service
 */
function getHttp(http) {
    if (!environment_1.environment.production) {
        // Offline so use mock http
        return require('../e2e').mockHttp();
    }
    else {
        // Online so use standard http
        return http;
    }
}
exports.getHttp = getHttp;
//# sourceMappingURL=http-provider.factory.js.map