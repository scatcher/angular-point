'use strict';

/**
 * @ngdoc service
 * @name queueService
 * @description
 * Simple service to monitor the number of active requests we have open with SharePoint
 * Typical use is to display a loading animation of some sort
 */
angular.module('angularPoint')
    .service('apQueueService', function () {

        var counter = 0;

        /**
         * @ngdoc function
         * @name queueService.increase
         * @description
         * Increase the counter by 1.
         */
        var increase = function () {
            counter++;
            notifyObservers();
            return counter;
        };

        /**
         * @ngdoc function
         * @name queueService.reset
         * @description
         * Decrease the counter by 1.
         * @returns {number} Current count after decrementing.
         */
        var decrease = function () {
            if (counter > 0) {
                counter--;
                notifyObservers();
                return counter;
            }
        };

        /**
         * @ngdoc function
         * @name queueService.reset
         * @description
         * Reset counter to 0.
         * @returns {number} Current count after incrementing.
         */
        var reset = function () {
            counter = 0;
            notifyObservers();
            return counter;
        };

        var observerCallbacks = [];

        /**
         * @ngdoc function
         * @name queueService.registerObserverCallback
         * @description
         * Register an observer
         * @param {function} callback Function to call when a change is made.
         */
        var registerObserverCallback = function (callback) {
            observerCallbacks.push(callback);
        };

        /** call this when queue changes */
        var notifyObservers = function () {
            angular.forEach(observerCallbacks, function (callback) {
                callback(counter);
            });
        };

        return {
            count: counter,
            decrease: decrease,
            increase: increase,
            registerObserverCallback: registerObserverCallback,
            reset: reset
        };
    });