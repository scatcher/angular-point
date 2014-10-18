'use strict';

describe('Factory: apQueryFactory', function () {

    beforeEach(module('angularPoint'));

    var factory, mockModel, mockQuery, $rootScope, $q, apDataService;

    beforeEach(inject(function (_mockModel_, _apQueryFactory_, _$rootScope_, _$q_, _apDataService_) {

        mockModel = _mockModel_;
        factory = _apQueryFactory_;
        $q = _$q_;
        apDataService = _apDataService_;
        mockQuery = mockModel.getQuery();
        $rootScope = _$rootScope_;
    }));

    describe('Method: getModel', function () {
        it('returns the model', function () {
            expect(mockQuery.getModel()).toBe(mockModel);
        });
    });

    describe('Method: getCache', function () {
        it('returns the cache', function () {
            expect(mockQuery.getCache()).toBe(mockModel.queries.primary.indexedCache);
        });
    });

    describe('Method: searchLocalCache', function () {
        it('should return the cached entity with matching id', function () {
            expect(mockQuery.searchLocalCache(2)).toBe(mockQuery.getCache()[2]);
        });
    });

    describe('Method: execute', function () {
        var firstPromise, secondPromise, thirdPromise;
        beforeEach(function () {
            spyOn(apDataService, 'executeQuery').and.callFake(mockExecuteQuery);
            firstPromise = mockModel.executeQuery('primary');
            secondPromise = mockModel.executeQuery('primary');
            thirdPromise = mockModel.executeQuery('secondary');
        });
        it('returns the same promise if the query is requested twice before it is resolved', function () {
            expect(firstPromise).toBe(secondPromise);
        });
        it('returns a different promise if the two different queries are called', function () {
            expect(firstPromise).not.toBe(thirdPromise);
        });
        it('sets the negotiating with server flag prior to completion', function () {
            expect(mockQuery.negotiatingWithServer).toBe(true);
        });
        it('resets the negotiating with server flag once complete', function () {
            $rootScope.$digest();
            expect(mockQuery.negotiatingWithServer).toBe(false);
        });

    });

    function mockExecuteQuery() {
        var deferred = $q.defer();
        deferred.resolve(mockModel.getCache());
        return deferred.promise;
    }

});
