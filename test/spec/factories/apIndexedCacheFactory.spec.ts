/// <reference path="../../mock/app.module.mock.ts" />
module ap.test {
    'use strict';

    describe("Factory: apIndexedCacheFactory", function() {

        beforeEach(module("angularPoint"));

        var factory: IndexedCacheFactory, mockCache: IndexedCache<any>,
            entityOne = { id: 1, title: 'test' },
            entityTwo = { id: 2, title: 'test2' };

        beforeEach(inject(function(_apIndexedCacheFactory_) {
            factory = _apIndexedCacheFactory_;
            mockCache = factory.create();
            mockCache.addEntity(entityOne);
            mockCache.addEntity(entityTwo);
        }));



        describe('IndexCache', function() {
            it('the cache to have the correct constructor', function() {
                expect(mockCache instanceof factory.IndexedCache).toBe(true);
            });
        });

        describe('addEntity', function() {
            it('will add the new entity to the cache', function() {
                expect(mockCache[1].title).toEqual('test');
            });

            it('throws an error if a valid entity isn\'t provided', function() {
                expect(function() { mockCache.addEntity('Not an Entity') }).toThrow();
            });
        });

        describe('clear', function() {
            beforeEach(function() {
                mockCache.clear();
            });
            it('empties all items in the cache', function() {
                expect(mockCache.count()).toEqual(0);
            });
        });

        describe('keys', function() {
            it('will return the keys', function() {
                expect(mockCache.keys()).toEqual(['1', '2']);
            });
        });

        describe('first', function() {
            it('will return the first item in the cache based on id', function() {
                expect(mockCache.first()).toBe(entityOne);
            });
        });

        describe('last', function() {
            it('will return the last item in the cache based on id', function() {
                expect(mockCache.last()).toBe(entityTwo);
            });
        });

        describe('removeEntity', function() {
            it('removes an entity when an entity is provided', function() {
                expect(mockCache.count()).toEqual(2);
                expect(mockCache[1]).toBeDefined();
                mockCache.removeEntity(mockCache[1]);
                expect(mockCache.count()).toEqual(1);
                expect(mockCache[1]).toBeUndefined();
            });
        });
        describe('removeEntityById', function() {
            it('removes the an entity given an id', function() {
                expect(mockCache.count()).toEqual(2);
                expect(mockCache[1]).toBeDefined();
                mockCache.removeEntityById(1);
                expect(mockCache.count()).toEqual(1);
                expect(mockCache[1]).toBeUndefined();
            });
        });

        describe('toArray', function() {
            it('will convert the object into an array', function() {
                expect(mockCache.toArray().length).toBe(2);
            });
        });

        describe('length', function() {
            it('will return the number of entities in the cache', function() {
                expect(mockCache.count()).toBe(2);
            });
        });
    });
}