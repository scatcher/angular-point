(function () {
    'use strict';

    angular
        .module('angularPoint')
        .factory('apChangeService', apChangeService);

    /**
     * @ngdoc service
     * @name apChangeService
     * @description
     * Primarily used for apMockBackend so we can know what to expect before an attempt to update a list
     * item is intercepted.
     */
    function apChangeService(_) {
        var callbackQueue = [];
        var service = {
            registerListItemUpdate: registerListItemUpdate,
            subscribeToUpdates: subscribeToUpdates
        };

        return service;

        /**==================PRIVATE==================*/



        function registerListItemUpdate(entity, options, promise) {
            _.each(callbackQueue, function(callback) {
                callback(entity, options, promise);
            });
        }

        function subscribeToUpdates(callback) {
            callbackQueue.push(callback);
        }

    }
})();
