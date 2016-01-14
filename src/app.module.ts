/// <reference path="../typings/ap.d.ts" />
/// <reference path="../typings/main.d.ts" />

module ap {
    'use strict';

    /**
     * @ngdoc overview
     * @module
     * @name angularPoint
     * @description
     * This is the primary angularPoint module and needs to be listed in your app.js dependencies to gain use of AngularPoint
     * functionality in your project.
     * @installModule
     */
    angular.module('angularPoint', [])
    /** Bootstrap everything that needs to be immediately instantiated */
    .run((apListItemFactory: ListItemFactory, apModelFactory: ModelFactory) => {

    })
}
