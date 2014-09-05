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
        resolvedEntityCache,
        $rootScope;

    beforeEach(inject(function (_apCacheService_, _mockXMLService_, _mockModel_, _$rootScope_) {
        apCacheService = _apCacheService_;
        mockXMLService = _mockXMLService_;
        $rootScope = _$rootScope_;
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

    describe('getEntityTypeByName', function () {
        it('returns undefined when requesting a model name that doesn\'t exist', function () {
            expect(apCacheService.getEntityTypeByName('Invalid Model')).toBeUndefined();
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

    describe('Function: getCachedEntities', function () {
        it('returns all entities for a given model', function () {
            var entity = apCacheService.getCachedEntities(mockModel.list.guid, 1);
            expect(entity.count()).toEqual(2);
        });
    });


    describe('getEntityContainer', function () {
        beforeEach(function () {
            emptyEntityCache = apCacheService.getEntityContainer(mockModel.list.guid, 100);
            resolvedEntityCache = apCacheService.getEntityContainer(mockModel.list.guid, 1);
        });
        it('shouldn\'t have a valid entity for a new cache', function () {
            expect(emptyEntityCache.entity).toBeUndefined();
        });

        it('should have a valid entity for an existing entity', function () {
            expect(resolvedEntityCache.entity).toBeDefined();
        });
    });

    describe('Method: EntityContainer.getEntity', function () {

        it('should return a promise for the entity which on next tick if already present', function () {
            apCacheService.getEntityContainer(mockModel.list.guid, 1).getEntity()
                .then(function (entity) {
                    expect(entity.id).toEqual(1);
                });
            $rootScope.$digest();
        });

        it('should return a promise for the entity which resolves with the entity once registered', function () {
            //Remove entity 1 from the cache
            var cache = apCacheService.getEntityContainer(mockModel.list.guid, 1);
            cache.removeEntity();
            //Create request for entity
            apCacheService.getEntityContainer(mockModel.list.guid, 1).getEntity()
                .then(function (entity) {
                    expect(entity.id).toEqual(1);
                });
            //Add entity back in and resolve promise at next tick
            mockModel.importMocks();
            $rootScope.$digest();
        });
    });

    describe('Function: getEntity', function () {
        it('should return a promise which resolves with the requested entity', function () {
            apCacheService.getEntity(mockModel.list.guid, 1)
                .then(function (entity) {
                    expect(entity.id).toEqual(1);
                });
            $rootScope.$digest();
        });
    });

    describe('removeEntity', function () {
        it('should remove 1 of the 2 cache\'s', function () {
            resolvedEntityCache = apCacheService.getEntityContainer(mockModel.list.guid, 1);
            //Remove entity 1
            resolvedEntityCache.removeEntity();
            //Reinstantiate entity 1 without adding an entity
            resolvedEntityCache = apCacheService.getEntityContainer(mockModel.list.guid, 1);
            expect(resolvedEntityCache.entity).toBeUndefined();
        });
    });

});