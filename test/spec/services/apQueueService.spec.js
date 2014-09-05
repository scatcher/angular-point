/**
 * @name apQueueService
 * @description
 * Tests for apQueueService
 * _Enter the test description._
 * */

describe('Service: apQueueService', function () {

    beforeEach(module("angularPoint"));

    var apQueueService,
        $rootScope;

    beforeEach(inject(function (_apQueueService_, _$rootScope_) {
        apQueueService = _apQueueService_;
        $rootScope = _$rootScope_;
    }));

    describe('Function: increase', function () {
        it('should lower queue by 1', function () {
            apQueueService.count = 1;
            expect(apQueueService.count).toEqual(1);
            apQueueService.increase();
            expect(apQueueService.count).toEqual(2);
            apQueueService.reset();
        });
    });

    describe('Function: decrease', function () {
        it('should lower queue by 1', function () {
            apQueueService.count = 5;
            expect(apQueueService.count).toEqual(5);
            apQueueService.decrease();
            expect(apQueueService.count).toEqual(4);
            apQueueService.reset();
        });
    });


    describe('Function: reset', function () {
        it('should reset counter back to 0', function () {
            apQueueService.increase();
            expect(apQueueService.count).toEqual(1);
            apQueueService.reset();
            expect(apQueueService.count).toEqual(0);
        });
    });

    describe('Function: registerObserverCallback', function () {
        it('should callback when the queue changes', function () {
            var callback = function (count) {
                expect(count).toEqual(1);
            };
            expect(apQueueService.count).toEqual(0);
            apQueueService.registerObserverCallback(callback);
            apQueueService.increase();
        });
    });

});