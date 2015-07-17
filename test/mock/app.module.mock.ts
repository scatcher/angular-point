/// <reference path="../../typings/ap.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="models/mockModel.mock.ts" />
/// <reference path="models/lookupModel.mock.ts" />
/// <reference path="apMockUtils.mock.ts" />

module ap {
    'use strict';

//TODO: Remove dependency on toastr
    /** Check to see if dependent modules exist */
    try {
        angular.module('toastr');
    }
    catch (e) {
        /** Toastr wasn't found so redirect all toastr requests to $log */
        angular.module('toastr', [])
            .factory('toastr', function ($log) {
                return {
                    error: $log.error,
                    info: $log.info,
                    success: $log.info,
                    warning: $log.warn
                };
            });
    }

    /**
     * @ngdoc overview
     * @module
     * @name angularPoint
     * @description
     * This is the primary angularPoint module and needs to be listed in your app.js dependencies to gain use of AngularPoint
     * functionality in your project.
     * @installModule
     */
    angular.module('angularPoint', [
        'toastr',
        'ngMock'
    ])
    .constant('mockUser', {lookupId: 100, lookupValue: 'Joe User'})
    /** Bootstrap everything that needs to be immediately instantiated */
    .run((apListItemFactory: ListItemFactory, apModelFactory: ModelFactory) => {

    })
}
