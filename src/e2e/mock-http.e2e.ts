import {MockBackend} from '@angular/http/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockConnection} from '@angular/http/testing';
import {ReflectiveInjector, provide} from '@angular/core';
import {generateMockResponse} from './mock-backend.e2e';

export {mockHttp};

/**
 * Allows us to intercept and return mock responses when working 
 * offline.  When online we use the real Http service.
 * @param {Http} http The real Http service.
 * @returns {Http} Http Service
 */
function mockHttp() {

    /** Code that uses mock backend when working offline, this is stripped
     * out of production build */

    let injector = ReflectiveInjector.resolveAndCreate([
        MockBackend,
        BaseRequestOptions,
        provide(Http, {
            useFactory: (backend: MockBackend, options: BaseRequestOptions) => {

                backend.connections.subscribe((mockConnection: MockConnection) =>
                    generateMockResponse(mockConnection));

                return new Http(backend, options);

            }, deps: [ MockBackend, BaseRequestOptions ]
        })
    ]);

    return injector.get(Http);

}
