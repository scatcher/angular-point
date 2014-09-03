'use strict';

describe('Factory: apModelFactory', function () {

    beforeEach(module('angularPoint', function ($provide) {
        //$provide.value("apDataService", {
        //    getList: simpleGetList
        //});
    }));



    var mockModel, apModelFactory, mockEntityCache, mockXMLService, $rootScope, $q, apDataService;

    beforeEach(module("ui.bootstrap"));
    beforeEach(inject(function (_mockModel_, _apModelFactory_, _mockXMLService_, _$rootScope_, _$q_, _apDataService_) {
        mockModel = _mockModel_;
        apModelFactory = _apModelFactory_;
        mockXMLService = _mockXMLService_;
        apDataService = _apDataService_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        mockModel.importMocks();
        mockEntityCache = mockModel.getCache('primary');
    }));

    describe('addNewItem', function () {
        it('adds the new entity to the cacheService', function () {
            mockModel.addNewItem({titleText: 'I\'m a new item!'});
            var newEntity = mockModel.getCachedEntity(3);
            $rootScope.$digest();
            expect(newEntity).toBeDefined();
            expect(newEntity.titleText).toEqual('I\'m a new item!');
        });
    });


    describe('createEmptyItem', function () {

        it('should return an object', function () {
            var emptyItem = mockModel.createEmptyItem();
            expect(emptyItem).toBeTruthy();
        });

        it('should have an attribute for each of the mocked fields except for "ReadOnly"', function () {
            var emptyItem = mockModel.createEmptyItem();
            var fieldsOnModel = mockModel.list.customFields.length;
            var attributesOnEmptyItem = _.keys(emptyItem).length;
            expect(fieldsOnModel - 1).toBe(attributesOnEmptyItem);
        });
    });

    describe('searchLocalCache', function () {

        it('returns the correct object when using an attribute directly on the object', function () {
            var searchResults = mockModel.searchLocalCache(1);
            expect(searchResults).toEqual(mockEntityCache[1]);
        });

        it('should return the correct object when a nested property path is used', function () {
            var searchResults = mockModel.searchLocalCache(2, {
                propertyPath: 'lookup.lookupId'
            });
            expect(searchResults).toEqual(mockEntityCache[2]);
        });

        it('should return undefined if no match is found', function () {
            var searchResults = mockModel.searchLocalCache('fake id', {
                propertyPath: 'lookup.lookupId'
            });
            expect(searchResults).toBeUndefined();
        });

        describe('count the number of times the cache is rebuilt', function () {

            it('doesn\'t use the cache when searching by id', function () {
                mockModel.searchLocalCache(1);
                mockModel.searchLocalCache(2);

                expect(mockModel._cachedIndexes).toBeUndefined();
            });

            it('uses the cached results instead of building a new cache', function () {
                mockModel.searchLocalCache(1, {
                    propertyPath: 'lookup.lookupId'
                });
                var initialBuildCount = getBuildCount();
                mockModel.searchLocalCache(1, {
                    propertyPath: 'lookup.lookupId'
                });
                expect(initialBuildCount).toEqual(getBuildCount());
            });

            it('rebuilds the cache when a change is made', function () {
                mockModel.searchLocalCache(1, {
                    propertyPath: 'lookup.lookupId'
                });

                var initialBuildCount = getBuildCount();

                /** Add another entity to the cache */
                mockModel.getCache()[3] = new mockModel.factory({
                    lookup: {lookupId: 3},
                    id: 3
                });

                mockModel.searchLocalCache(2, {
                    propertyPath: 'lookup.lookupId'
                });

                expect(initialBuildCount).not.toEqual(getBuildCount());
            });
        });

        it('returns an array of items if an array is specified', function () {

            expect(mockModel.searchLocalCache([1, 2]).length).toEqual(2);
        });

        function getBuildCount() {
            return mockModel._cachedIndexes.main.lookup.lookupId.buildCount;
        }


    });

    describe('Method: getQuery', function () {
        it('returns the query by name', function () {
            expect(mockModel.getQuery('primary')).toBe(mockModel.queries.primary);
        });
        it('returns undefined if a query is requested that hasn\'t been registered', function () {
            expect(mockModel.getQuery('never registered')).toBeUndefined();
        });
    });

    describe('Method: getFieldDefinition', function () {
        it('correctly looks up the field definition given the field name', function () {
            expect(mockModel.getFieldDefinition('id')).toBe(mockModel.list.fields[0]);
        });
    });

    describe('Method: extendListMetadata', function () {
        beforeEach(function () {
            spyOn(apDataService, 'getList').and.callFake(getResponseXML);
        });
        it('extends the list information from xml', function () {
            mockModel.fieldDefinitionsExtended = false;
            mockModel.extendListMetadata();
            $rootScope.$digest();
            expect(mockModel.fieldDefinitionsExtended).toBe(true);
        });

        it('only fetches the list definition once although it\'s requested multiple times', function () {
            mockModel.fieldDefinitionsExtended = false;
            mockModel.extendListMetadata();
            $rootScope.$digest();
            mockModel.extendListMetadata();
            $rootScope.$digest();
            expect(apDataService.getList.calls.count()).toEqual(1);
        });

    });

    describe('Method: isInitialized', function () {
        beforeEach(function () {
            spyOn(apDataService, 'executeQuery').and.callFake(mockExecuteQuery);
            mockModel.executeQuery('primary');
        });
        it('should return true if an initial query has been made', function () {
            $rootScope.$digest();
            expect(mockModel.isInitialised()).toBe(true);
        });
    });

    describe('Method: generateMockData', function () {
        it('creates n mock records', function () {
            expect(mockModel.generateMockData({quantity: 12}).length)
                .toEqual(12);
        });
    });

    describe('Method: validateEntity', function () {
        it('validates a valid entity', function () {
            expect(mockModel.validateEntity(mockEntityCache[1])).toBe(true);
        });

        it('rejects a null value', function () {
            mockEntityCache[1].boolean = null;
            expect(mockModel.validateEntity(mockEntityCache[1])).toBe(false);
        });
    });


    //describe('Method: executeQuery', function () {
    //    beforeEach(function () {
    //        spyOn(apDataService, 'executeQuery').and.callFake(mockExecuteQuery);
    //
    //    });
    //
    //    it('should return the cache for a given query', function () {
    //        expect(mockModel.executeQuery('primary')).toBe();
    //    });
    //});

    function getResponseXML() {
        var deferred = $q.defer();
        deferred.resolve(mockXMLService.listItemsSinceChangeToken);
        return deferred.promise;
    }

    function mockExecuteQuery() {
        var deferred = $q.defer();
        deferred.resolve(mockModel.getCache());
        return deferred.promise;
    }


    //describe('Method: getLocalEntity', function () {
    //    it('finds the correct entity using the list item id', function () {
    //        expect(mockModel.getLocalEntity(2)).toEqual(mockEntityCache[2]);
    //    });
    //});
});