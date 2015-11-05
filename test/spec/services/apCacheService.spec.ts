/// <reference path="../../mock/app.module.mock.ts" />
module ap.test {
    'use strict';

    /**
     * @name apCacheService
     * @description
     * Tests for apCacheService
     * _Enter the test description._
     * */

    describe('Service: apCacheService', function() {

        beforeEach(module("angularPoint"));

        var service:CacheService,
            mockEntityCache,
            mockModel: MockModel,
            updatedMock = {
                id: 1,
                title: "Updated Mock"
            },
            newMock = {
                id: 3,
                title: "New Mock"
            },
            emptyEntityCache,
            resolvedEntityCache,
            $rootScope: ng.IRootScopeService;

        beforeEach(inject(function($injector, _apCacheService_, _mockModel_, _$rootScope_) {
            service = $injector.get('apCacheService');
            $rootScope = $injector.get('$rootScope');
            mockModel = $injector.get('mockModel');
            mockEntityCache = mockModel.getCache();

            updatedMock.getModel = function() { return mockModel };
            newMock.getModel = function() { return mockModel };
        }));

        describe('getEntityTypeKey', function() {
            it('returns the key when passed a guid', function() {
                expect(service.getListId(mockModel.list.guid)).toEqual(mockModel.list.guid.toLowerCase());
            });

            it('returns the key the name of a model is used', function() {
                expect(service.getListId(mockModel.list.title)).toEqual(mockModel.list.guid.toLowerCase());
            });
        });

        describe('getEntityTypeByName', function() {
            it('returns undefined when requesting a model name that doesn\'t exist', function() {
                expect(service.getListIdFromListName('Invalid Model')).toBeUndefined();
            });
        });

        describe('registerEntity', function() {
            beforeEach(function() {
                mockModel.importMocks();
            });

            it('extends the existing record', function() {
                service.registerEntity(new mockModel.factory(updatedMock), mockEntityCache);
                expect(mockEntityCache.first().title).toEqual('Updated Mock');
            });

            it('adds a entity when a new mock is registered', function() {
                service.registerEntity(new mockModel.factory(newMock), mockEntityCache);
                expect(mockEntityCache.count()).toEqual(3);
            });
        });

        describe('Function: getCachedEntity', function() {
            it('finds the correct entity via the cache service instead of the model', function() {
                mockModel.importMocks();
                var entity = service.getCachedEntity<MockListItem>(mockModel.list.guid, 1);
                expect(entity.title).toEqual('Mock 1');
            });
        });

        describe('Function: getCachedEntities', function() {
            it('returns all entities for a given model', function() {
                mockModel.importMocks();
                var indexedCache = service.getCachedEntities(mockModel.list.guid, 1);
                expect(indexedCache.count()).toEqual(2);
            });
        });


        describe('getEntityContainer', function() {
            beforeEach(function() {
                mockModel.importMocks();
                emptyEntityCache = service.getEntityContainer(mockModel.list.guid, 100);
                resolvedEntityCache = service.getEntityContainer(mockModel.list.guid, 1);
            });
            it('shouldn\'t have a valid entity for a new cache', function() {
                expect(emptyEntityCache.entity).toBeUndefined();
            });

            it('should have a valid entity for an existing entity', function() {
                expect(resolvedEntityCache.entity).toBeDefined();
            });
        });

        describe('Method: EntityContainer.getEntity', function() {

            it('should return a promise for the entity which on next tick if already present', function() {
                service.getEntityContainer(mockModel.list.guid, 1).getEntity()
                    .then(function(entity: MockListItem) {
                        expect(entity.id).toEqual(1);
                    });
                $rootScope.$digest();
            });

            it('should return a promise for the entity which resolves with the entity once registered', function() {
                //Remove entity 1 from the cache
                var cache = service.getEntityContainer(mockModel.list.guid, 1);
                cache.removeEntity();
                //Create request for entity
                service.getEntityContainer(mockModel.list.guid, 1).getEntity()
                    .then(function(entity: MockListItem) {
                        expect(entity.id).toEqual(1);
                    });
                //Add entity back in and resolve promise at next tick
                mockModel.importMocks();
                $rootScope.$digest();
            });
        });

        describe('Function: getEntity', function() {
            it('should return a promise which resolves with the requested entity', function() {
                service.getEntity(mockModel.list.guid, 1)
                    .then(function(entity) {
                        expect(entity.id).toEqual(1);
                    });
                $rootScope.$digest();
            });
        });

        describe('Function: removeEntity', function() {
            it('should remove 1 of the 2 cache\'s', function() {
                resolvedEntityCache = service.getEntityContainer(mockModel.list.guid, 1);
                //Remove entity 1
                resolvedEntityCache.removeEntity();
                //Reinstantiate entity 1 without adding an entity
                resolvedEntityCache = service.getEntityContainer(mockModel.list.guid, 1);
                expect(resolvedEntityCache.entity).toBeUndefined();
            });
        });

        describe('Function: deleteEntity', function() {
            it('should remove 2 of the 2 cache\'s', function() {
                var primaryCache = mockModel.getCache('primary');
                var secondaryCache = mockModel.getCache('secondary');

                service.deleteEntity(mockModel.list.getListId(), 1);

                expect(primaryCache[1]).toBeUndefined();
                expect(secondaryCache[1]).toBeUndefined();
            });
        });

    });
}