/**
 * @name apQueueService
 * @description
 * Tests for apQueueService
 * _Enter the test description._
 * */

describe('Service: apQueueService', function () {

    beforeEach(module("angularPoint"));

    var service,
        $rootScope;

    beforeEach(inject(function (_apQueueService_, _$rootScope_) {
        service = _apQueueService_;
        $rootScope = _$rootScope_;
    }));

    describe('Function: increase', function () {
        it('should lower queue by 1', function () {
            service.count = 1;
            expect(service.count).toEqual(1);
            service.increase();
            expect(service.count).toEqual(2);
            service.reset();
        });
    });

    describe('Function: decrease', function () {
        it('should lower queue by 1', function () {
            service.count = 5;
            expect(service.count).toEqual(5);
            service.decrease();
            expect(service.count).toEqual(4);
            service.reset();
        });
    });


    describe('Function: reset', function () {
        it('should reset counter back to 0', function () {
            service.increase();
            expect(service.count).toEqual(1);
            service.reset();
            expect(service.count).toEqual(0);
        });
    });

    describe('Function: registerObserverCallback', function () {
        it('should callback when the queue changes', function () {
            var callback = function (count) {
                expect(count).toEqual(1);
            };
            expect(service.count).toEqual(0);
            service.registerObserverCallback(callback);
            service.increase();
        });
    });

});
