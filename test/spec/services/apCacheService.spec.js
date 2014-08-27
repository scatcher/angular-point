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
        mockEntityCache,
        mockModel,
        mockXMLService,
        updatedMock = {
            "id": 1,
            "titleText": "Updated Mock"
        },
        newMock = {
            id: 3,
            titleText: "New Mock"
        },
        emptyEntityCache,
        resolvedEntityCache;

    beforeEach(module("ui.bootstrap"));
    beforeEach(inject(function (_apCacheService_, _mockXMLService_, _mockModel_) {
        apCacheService = _apCacheService_;
        mockXMLService = _mockXMLService_;
        mockModel = _mockModel_;
        mockEntityCache = mockModel.importMocks();

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
            apCacheService.registerEntity(new mockModel.factory(updatedMock), mockEntityCache);
            apCacheService.registerEntity(new mockModel.factory(newMock), mockEntityCache);
        });

        it('extends the existing record', function () {
            expect(mockEntityCache.first().titleText).toEqual('Updated Mock');
        });

        it('adds a entity when a new mock is registered', function () {
            expect(mockEntityCache.count()).toEqual(3);
        });
    });

    describe('Function: getCachedEntity', function () {
        it('finds the correct entity via the cache service istead of the model', function () {
            var entity = apCacheService.getCachedEntity(mockModel.list.guid, 1);
            expect(entity.titleText).toEqual('Mock 1');
        });
    });


    describe('getEntityContainer', function () {
        beforeEach(function () {
            emptyEntityCache = apCacheService.getEntityContainer(mockModel.list.guid.toLowerCase(), 100);
            resolvedEntityCache = apCacheService.getEntityContainer(mockModel.list.guid.toLowerCase(), 1);
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
            resolvedEntityCache = apCacheService.getEntityContainer(mockModel.list.guid.toLowerCase(), 1);
            //Remove entity 1
            resolvedEntityCache.removeEntity();
            //Reinstantiate entity 1 without adding an entity
            resolvedEntityCache = apCacheService.getEntityContainer(mockModel.list.guid.toLowerCase(), 1);

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