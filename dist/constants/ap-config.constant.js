"use strict";
exports.AP_CONFIG = {
    appTitle: 'Angular-Point',
    debug: false,
    debugUser: undefined,
    defaultQueryName: 'primary',
    defaultUrl: '',
    environment: 'production',
    firebaseURL: 'The optional url of your firebase source',
    //expiration in milliseconds - Defaults to a day and if set to 0 doesn't expire
    localStorageExpiration: 86400000,
    //Are we in working offline
    // offline: window.location.href.indexOf('localhost') > -1 ||
    //     window.location.href.indexOf('http://0.') > -1 ||
    //     window.location.href.indexOf('http://10.') > -1 ||
    //     window.location.href.indexOf('http://127.') > -1 ||
    //     window.location.href.indexOf('http://192.') > -1,
    // online: undefined,
    //Any identical query within this amount of time return the same promise
    queryDebounceTime: 100
};
// convenience flag, inverse of offline
// AP_CONFIG.online = !AP_CONFIG.offline; 
//# sourceMappingURL=ap-config.constant.js.map