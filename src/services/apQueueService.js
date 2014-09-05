'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apQueueService
 * @description
 * Simple service to monitor the number of active requests we have open with SharePoint
 * Typical use is to display a loading animation of some sort
 */
angular.module('angularPoint')
    .service('apQueueService', function () {

        var observerCallbacks = [],
            apQueueService = {
                count: 0,
                decrease: decrease,
                increase: increase,
                notifyObservers: notifyObservers,
                registerObserverCallback: registerObserverCallback,
                reset: reset
            };

        return apQueueService;


        /*********************** Private ****************************/


        /**
         * @ngdoc function
         * @name angularPoint.apQueueService:increase
         * @methodOf angularPoint.apQueueService
         * @description
         * Increase the apQueueService.count by 1.
         */
        function increase() {
            apQueueService.count++;
            notifyObservers();
            return apQueueService.count;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apQueueService:decrease
         * @methodOf angularPoint.apQueueService
         * @description
         * Decrease the apQueueService.count by 1.
         * @returns {number} Current count after decrementing.
         */
        function decrease() {
            if (apQueueService.count > 0) {
                apQueueService.count--;
                notifyObservers();
                return apQueueService.count;
            }
        }

        /**
         * @ngdoc function
         * @name angularPoint.apQueueService:reset
         * @methodOf angularPoint.apQueueService
         * @description
         * Reset apQueueService.count to 0.
         * @returns {number} Current count after incrementing.
         */
        function reset() {
            apQueueService.count = 0;
            notifyObservers();
            return apQueueService.count;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apQueueService:registerObserverCallback
         * @methodOf angularPoint.apQueueService
         * @description
         * Register an observer
         * @param {function} callback Function to call when a change is made.
         */
        function registerObserverCallback(callback) {
            observerCallbacks.push(callback);
        }

        /** call this when queue changes */
        function notifyObservers() {
            _.each(observerCallbacks, function(callback) {
                callback(apQueueService.count);
            });
        }

    });