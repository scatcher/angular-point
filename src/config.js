angular.module('angularPoint')
    .config(function (apConfig) {

        /** Add a convenience flag, inverse of offline */
        apConfig.online = !apConfig.offline;
    });
