"use strict";

describe("Service: apDataService", function () {

    beforeEach(module("angularPoint"));

    var apDataService,
        mockEntityCache,
        secondaryMockEntityCache,
        mockModel,
        mockToUpdate,
        mockXML;


    beforeEach(module("ui.bootstrap"));
    beforeEach(inject(function (_apDataService_, _mockModel_, _mockXMLService_) {
        apDataService = _apDataService_;
        mockModel = _mockModel_;
        mockXML = _mockXMLService_.listItemsSinceChangeToken;
        mockModel.importMocks();
        mockEntityCache = mockModel.getCache('primary');
        secondaryMockEntityCache = mockModel.getCache('secondary');

    }));

    describe('Function: addUpdateItemModel', function () {
        describe('add item', function () {
            beforeEach(function () {
                apDataService.addUpdateItemModel(mockModel, {text: 'New Entity'});
            });
            it('the cache to have the new item', function () {
                expect(mockEntityCache.count()).toEqual(3);
            });
        });
        describe('update item', function () {
            beforeEach(function () {
                mockToUpdate = mockModel.getCache('primary')[1];
                mockToUpdate.titleText = 'Updated Text';
                apDataService.addUpdateItemModel(mockModel, mockToUpdate);
            });
            it('has the updated value', function () {
                expect(mockModel.getCache('primary')[1].titleText).toEqual('Updated Text');
            });
            it('the other caches also contain the same data because they should be referencing the same object', function () {
                expect(mockModel.getCache('secondary')[1].titleText).toEqual('Updated Text');
            });
        });
    });

    describe('Function: cleanCache', function () {
        beforeEach(function () {
            apDataService.cleanCache(mockEntityCache[1]);
        });
        it('removes 1 of the entities from the cache', function () {
            expect(mockEntityCache.count()).toEqual(1);
        });
        it('leaves a reference in the secondary cache', function () {
            expect(secondaryMockEntityCache.count()).toEqual(2);
        });

    });

    describe('Function: deleteItemModel', function () {
        describe('delete from single cache', function () {
            beforeEach(function () {
                mockEntityCache = mockModel.getCache('primary');
                secondaryMockEntityCache = mockModel.getCache('secondary');

                apDataService.deleteItemModel(mockModel, mockEntityCache[1]);
            });
            it('removes 1 of the entities from the primary cache', function () {
                expect(mockEntityCache.count()).toEqual(1);
            });
            it('leaves both entities in the secondary cache', function () {
                expect(secondaryMockEntityCache.count()).toEqual(2);
            });
        });
        describe('delete from all query caches', function () {
            beforeEach(function () {
                mockEntityCache = mockModel.getCache('primary');
                secondaryMockEntityCache = mockModel.getCache('secondary');

                apDataService.deleteItemModel(mockModel, mockEntityCache[1], {updateAllCaches: true});
            });
            it('removes 1 of the entities from the primary cache', function () {
                expect(mockEntityCache.count()).toEqual(1);
            });
            it('removes 1 entity from the secondary cache as well', function () {
                expect(secondaryMockEntityCache.count()).toEqual(1);
            });
        });
    });

    describe('Function: retrieveChangeToken', function () {
        it('returns the change token from the XML', function () {
            expect(apDataService.retrieveChangeToken(mockXML)).toEqual('1;3;f5345fe7-2f7c-49f7-87d0-dbfebdd0ce61;635440845255970000;384046');
        })
    });

    describe('Function: retrievePermMask', function () {
        it('returns perm mask for the current user on this lsit', function () {
            expect(apDataService.retrievePermMask(mockXML)).toEqual('FullMask');
        })
    });

    describe('Function: removeEntityFromLocalCache', function () {
        beforeEach(function () {
            apDataService.removeEntityFromLocalCache(mockEntityCache, 1);
        });
        it('removes 1 of the entities from the cache', function () {
            expect(mockEntityCache.count()).toEqual(1);
        });
    });

    describe('addUpdateItemModel', function () {

    });



});