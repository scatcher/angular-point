/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    /**
     * @ngdoc service
     * @name apChangeService
     * @description
     * Primarily used for apMockBackend so we can know what to expect before an attempt to update a list
     * item is intercepted.
     */
    export class ChangeService {
        callbackQueue = [];
        registerListItemUpdate(entity, options, promise) {
            _.each(this.callbackQueue, (callback) => {
                callback(entity, options, promise);
            });
        }
        subscribeToUpdates(callback) {
            this.callbackQueue.push(callback);
        }
    }

    angular
        .module('angularPoint')
        .service('apChangeService', ChangeService);

}
