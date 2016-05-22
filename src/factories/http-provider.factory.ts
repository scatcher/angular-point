import {Http} from '@angular/http';
import {environment} from '../app/environment';

export {getHttp};

// Conditionally allow importing of mock responses when working offline
declare let require;

/**
 * Allows us to intercept and return mock responses when working 
 * offline.  When online we use the real Http service.
 * @param {Http} http The real Http service.
 * @returns {Http} Http Service
 */
function getHttp(http: Http) {
    if (!environment.production) {
        // Offline so use mock http
        return require('../e2e').mockHttp();
    } else {
        // Online so use standard http
        return http;
    }
}
