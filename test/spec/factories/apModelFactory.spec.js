'use strict';

ddescribe('Factory: apModelFactory', function () {

    beforeEach(module('angularPoint'));

    var mockModel, apModelFactory, deepArray;

    beforeEach(module("ui.bootstrap"));
    beforeEach(inject(function (_mockModel_, _apModelFactory_) {
        mockModel = _mockModel_;
        apModelFactory = _apModelFactory_;
    }));


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

    deepArray = {
        1: {
            level1: {
                value: 'value 1_1',
                level2: {
                    value: 'value 2_1',
                    level3: {
                        value: 'value 3_1'
                    }
                }
            },
            id: 1
        },
        2: {
            level1: {
                value: 'value 1_2',
                matchingValue: 'iMatch',
                level2: {
                    value: 'value 2_2',
                    level3: {
                        value: 'value 3_2'
                    }
                }
            },
            id: 2
        },
        3: {
            level1: {
                value: 'value 1_3',
                matchingValue: 'iMatch',
                level2: {
                    value: 'value 2_3',
                    level3: {
                        value: 'value 3_3'
                    }
                }
            },
            id: 3
        },
        4: {
            level1: {
                level2: {
                    level3: { }
                }
            },
            id: 4
        }
    };

    describe('searchLocalCache', function () {

        it('should return the correct object when using an attribute directly on the object', function () {
            var searchResults = mockModel.searchLocalCache(1, {
                propertyPath: 'id',
                localCache: deepArray,
                cacheName: 'mock'
            });
            expect(searchResults).toEqual(deepArray[0]);
        });

        it('should return the correct object when a nested property path is used', function () {
            var searchResults = mockModel.searchLocalCache('value 3_3', {
                propertyPath: 'level1.level2.level3.value',
                localCache: deepArray,
                cacheName: 'mock'
            });
            expect(searchResults).toEqual(deepArray[2]);
        });

        it('should return the first match', function () {
            var searchResults = mockModel.searchLocalCache('iMatch', {
                propertyPath: 'level1.matchingValue',
                localCache: deepArray,
                cacheName: 'mock'
            });
            expect(searchResults).toEqual(deepArray[1]);
        });

        it('should return undefined if no match is found', function () {
            var searchResults = mockModel.searchLocalCache('iDontMatch', {
                propertyPath: 'level1.level2.level3',
                localCache: deepArray,
                cacheName: 'mock'
            });
            expect(searchResults).toBeUndefined();
        });

    });
});