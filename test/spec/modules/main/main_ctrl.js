'use strict';

describe('Controller: Main', function () {

    // load the controller's module
    beforeEach(module('angularPoint'));

    var mainCtrl,
        scope, timeout, rootScope;
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $timeout) {
        scope = $rootScope.$new();
        timeout = $timeout;
        rootScope = $rootScope;
        mainCtrl = $controller('mainCtrl', {
            $scope: scope
        });
        rootScope.$apply();

    }));

//    it('should return projects', function () {
//        window.console.log("TEST");
////        timeout(function() {
//            scope.getProjects.then(function(entities) {
//                window.console.log("TIMEOUT OVER");
//                expect(entities.length).toBe(1);
//                window.console.log(entities.length);
//
//            });
////        },50);
////        timeout.flush();
//
//    });
//
//    it('should return recently modified specification requirements', function () {
//        timeout(function() {
//            scope.getRecentChanges.then(function(entities) {
//                expect(entities.length).toBeGreaterThan(1);
//            });
//        },50);
//    });
//
//    it('should return comments', function () {
//        timeout(function() {
//            scope.getComments.then(function(entities) {
//                expect(entities.length).toBeGreaterThan(1);
//            });
//        },50);
//    });


});