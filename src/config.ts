/// <reference path="../typings/ap.d.ts" />

module ap {
    'use strict';

    angular.module('angularPoint')
        .config(Config);

    function Config(apConfig) {

        /** Add a convenience flag, inverse of offline */
        apConfig.online = !apConfig.offline;
    }
}
