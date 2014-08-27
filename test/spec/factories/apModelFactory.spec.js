'use strict';

describe('Factory: apModelFactory', function () {

    beforeEach(module('angularPoint'));

    var mockModel, apModelFactory, mockEntityCache, spy;

    beforeEach(module("ui.bootstrap"));
    beforeEach(inject(function (_mockModel_, _apModelFactory_) {
        mockModel = _mockModel_;
        apModelFactory = _apModelFactory_;

        mockModel.importMocks();
        mockEntityCache = mockModel.getCache('primary');
    }));

    describe('addNewItem', function () {
        it('adds the new entity to the cacheService', function () {
            mockModel.addNewItem({titleText: 'I\'m a new item!'});
            mockModel.getCache()[3].titleText = 'I\'m a new item!';
        });
        it('adds a new item to the primary cache', function () {
            mockModel.addNewItem({titleText: 'I\'m a new item!'});
            mockModel.getCache()[3].titleText = 'I\'m a new item!';
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

        function getBuildCount() {
            return mockModel._cachedIndexes.main.lookup.lookupId.buildCount;
        }


    });
});