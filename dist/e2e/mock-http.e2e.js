"use strict";
var testing_1 = require('@angular/http/testing');
var http_1 = require('@angular/http');
var core_1 = require('@angular/core');
var mock_backend_e2e_1 = require('./mock-backend.e2e');
/**
 * Allows us to intercept and return mock responses when working
 * offline.  When online we use the real Http service.
 * @param {Http} http The real Http service.
 * @returns {Http} Http Service
 */
function mockHttp() {
    /** Code that uses mock backend when working offline, this is stripped
     * out of production build */
    var injector = core_1.ReflectiveInjector.resolveAndCreate([
        testing_1.MockBackend,
        http_1.BaseRequestOptions,
        core_1.provide(http_1.Http, {
            useFactory: function (backend, options) {
                backend.connections.subscribe(function (mockConnection) {
                    return mock_backend_e2e_1.generateMockResponse(mockConnection);
                });
                return new http_1.Http(backend, options);
            }, deps: [testing_1.MockBackend, http_1.BaseRequestOptions]
        })
    ]);
    return injector.get(http_1.Http);
}
exports.mockHttp = mockHttp;
//# sourceMappingURL=mock-http.e2e.js.map