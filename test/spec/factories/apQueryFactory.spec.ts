/// <reference path="../../mock/app.module.mock.ts" />
module ap {
    'use strict';


    describe('Factory: apQueryFactory', function() {

        beforeEach(module('angularPoint'));

        var factory: QueryFactory, mockModel: MockModel, mockQuery: Query<MockListItem>, $rootScope, $q, apDataService: DataService,
            LocalStorageQuery: LocalStorageQuery;

        beforeEach(inject(function(_mockModel_, _apQueryFactory_, _$rootScope_, _$q_, _apDataService_) {

            mockModel = _mockModel_;
            factory = _apQueryFactory_;
            $q = _$q_;
            apDataService = _apDataService_;
            mockQuery = mockModel.getQuery();
            $rootScope = _$rootScope_;
        }));

        describe('Method: getModel', function() {
            it('returns the model', function() {
                expect(mockQuery.getModel()).toBe(mockModel);
            });
        });

        describe('Method: getCache', function() {
            it('returns the cache', function() {
                expect(mockQuery.getCache()).toBe(mockQuery.indexedCache);
            });
        });

        describe('Method: hydrateFromLocalStorage', function() {


            // it('removes cache if expired', function() {
            //     let query = new ap.Query<MockListItem>({
            //         name: 'test',
            //         sessionStorage: true
            //     }, mockModel);
            //     let fakeCache = "{lastRun: \"2015-09-02T15:35:26.335Z\"}"
            //     sessionStorage.setItem('fakeCache', fakeCache);
            //     let localStorageQuery = 
                
            //     expect(mockQuery.getCache()).toBe(mockQuery.indexedCache);
            // });
        });

        describe('Method: execute', function() {
            var firstPromise, secondPromise, thirdPromise;
            beforeEach(function() {
                spyOn(apDataService, 'executeQuery').and.callFake(mockExecuteQuery);
                firstPromise = mockModel.executeQuery('primary');
                secondPromise = mockModel.executeQuery('primary');
                thirdPromise = mockModel.executeQuery('secondary');
            });
            it('returns the same promise if the query is requested twice before it is resolved', function() {
                expect(firstPromise).toBe(secondPromise);
            });
            it('returns a different promise if the two different queries are called', function() {
                expect(firstPromise).not.toBe(thirdPromise);
            });
            it('sets the negotiating with server flag prior to completion', function() {
                expect(mockQuery.negotiatingWithServer).toBe(true);
            });
            it('resets the negotiating with server flag once complete', function() {
                $rootScope.$digest();
                expect(mockQuery.negotiatingWithServer).toBe(false);
            });

        });

        // describe('Class: LocalStorageQuery', function() {
        //     it('returns the model', function() {
        //         expect(mockQuery.getModel()).toBe(mockModel);
        //     });
        // });
        
        function mockExecuteQuery() {
            var deferred = $q.defer();
            deferred.resolve(mockModel.getCache());
            return deferred.promise;
        }
        
        function generateLocalStorageQuery() {
            
        }

    });
}