'use strict';

/**
 * @name apCacheService
 * @description
 * Tests for apCacheService
 * _Enter the test description._
 * */

describe('Service: apCacheService', function () {

    beforeEach(module("angularPoint"));

    var apCacheService,
        mockEntities,
        mockModel,
        mockXMLService,
        updatedMock = {
            "id": 1,
            "text": "Updated Mock"
        },
        newMock = {
            id: 3,
            text: "New Mock"
        },
        emptyEntityCache,
        resolvedEntityCache;

    beforeEach(module("ui.bootstrap"));
    beforeEach(inject(function (_apCacheService_, _mockXMLService_, _mockModel_) {
        apCacheService = _apCacheService_;
        mockXMLService = _mockXMLService_;
        mockModel = _mockModel_;
        mockEntities = mockModel.importMocks();

    }));
    
    describe('getEntityTypeKey', function () {
        it('returns the key when passed a guid', function () {
            expect(apCacheService.getEntityTypeKey(mockModel.list.guid)).toEqual(mockModel.list.guid.toLowerCase());
        });

        it('returns the key the name of a model is used', function () {
            expect(apCacheService.getEntityTypeKey(mockModel.list.title)).toEqual(mockModel.list.guid.toLowerCase());
        });
    });

    describe('registerEntity', function () {
        beforeEach(function () {
            apCacheService.registerEntity(new mockModel.factory(updatedMock), mockEntities);
            apCacheService.registerEntity(new mockModel.factory(newMock), mockEntities);

        });

        it('extends the existing record', function () {
            expect(mockEntities.first().text).toEqual('Updated Mock');
        });

        it('adds a entity when a new mock is registered', function () {
            expect(mockEntities.count()).toEqual(3);
        });
    });


    describe('getEntityCache', function () {
        beforeEach(function () {
            emptyEntityCache = apCacheService.getEntityCache(mockModel.list.guid.toLowerCase(), 100);
            resolvedEntityCache = apCacheService.getEntityCache(mockModel.list.guid.toLowerCase(), 1);
        });
        it('shouldn\'t have a valid entity for a new cache', function () {
            expect(emptyEntityCache.entity).toBeUndefined();
        });

        it('should have a valid entity for an existing entity', function () {
            expect(resolvedEntityCache.entity).toBeDefined();
        });

    });

    describe('removeEntity', function () {
        beforeEach(function () {
            resolvedEntityCache = apCacheService.getEntityCache(mockModel.list.guid.toLowerCase(), 1);
            resolvedEntityCache.removeEntity();
        });
        it('should remove 1 of the 2 cache\'s', function () {
            expect(resolvedEntityCache.entity).toBeUndefined();
        });

    });

    /**
     * @description
     * Sample test case to check if the service is injected properly
     * */
    it('should be injected and defined', function () {
        expect(apCacheService).toBeDefined();
    });
});