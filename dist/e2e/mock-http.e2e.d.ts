export { mockHttp };
/**
 * Allows us to intercept and return mock responses when working
 * offline.  When online we use the real Http service.
 * @param {Http} http The real Http service.
 * @returns {Http} Http Service
 */
declare function mockHttp(): any;
