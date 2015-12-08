/// <reference path="../../mock/app.module.mock.ts" />
module ap.test {
    'use strict';

    describe("Factory: apIndexedCacheFactory", () => {

        beforeEach(module("angularPoint"));

        var factory: IndexedCacheFactory, mockCache: IndexedCache<any>,
            entityOne = { id: 1, title: 'test' },
            entityTwo = { id: 2, title: 'test2' };

        beforeEach(inject(function(_apIndexedCacheFactory_) {
            factory = _apIndexedCacheFactory_;
            mockCache = factory.create();
            mockCache.set(entityOne.id, entityOne);
            mockCache.set(entityTwo.id, entityTwo);
        }));



        describe('Factory: IndexCache', () => {
            it('the cache to have the correct constructor', () => {
                expect(mockCache instanceof factory.IndexedCache).toBe(true);
            });
        });

        describe('Method: clear', () => {
            it('empties all items in the cache', () => {
                mockCache.clear();
                expect(mockCache.size).toEqual(0);
            });
        });

        describe('Method: count', () => {
            it('returns the number of entities in cache', () => {
                expect(mockCache.size).toEqual(2);
                mockCache.delete(2);
                expect(mockCache.size).toEqual(1);
                mockCache.delete(1);
                expect(mockCache.size).toEqual(0);
            });
        });

        describe('Method: delete', () => {
            it('removes the an entity given an id', () => {
                expect(mockCache.size).toEqual(2);
                expect(mockCache[1]).toBeDefined();
                mockCache.delete(1);
                expect(mockCache.size).toEqual(1);
                expect(mockCache[1]).toBeUndefined();
            });

            it('returns true if entity is found in cache', () => {
                let deleted = mockCache.delete(1);
                expect(deleted).toBeTruthy();
            });
            it('returns false if entity is not found in cache', () => {
                let deleted = mockCache.delete(55);
                expect(deleted).toBeFalsy();
            });
        });

        describe('Method: first', () => {
            it('will return the first item in the cache based on id', () => {
                expect(mockCache.first()).toBe(entityOne);
            });
        });

        describe('Method: has', () => {
            it('returns true if entity exists in cache', () => {
                expect(mockCache.has(1)).toBeTruthy();
            });
            it('returns false if entity does not exist in cache', () => {
                expect(mockCache.has(99)).toBeFalsy();
            });
        });

        describe('Method: keys', () => {
            it('will return the keys', () => {
                expect(mockCache.keys()).toEqual(['1', '2']);
            });
        });

        describe('Method: last', () => {
            it('will return the last item in the cache based on id', () => {
                expect(mockCache.last()).toBe(entityTwo);
            });
        });

        describe('Method: set', () => {
            it('will add the new entity to the cache', () => {
                mockCache.set(3, { title: 'test3' });
                expect(mockCache.get(3).title).toEqual('test3');
            });

            it('throws an error if a valid entity isn\'t provided', () => {
                expect(() => { mockCache.set(99, 'Not an Entity') }).toThrow();
            });
        });

        describe('Property: size', () => {
            it('adds a non-enumerable getter to the base prototype which returns the number of key/values stored in cache.', () => {
                expect(mockCache.size).toEqual(2);
                mockCache.delete(1);
                expect(mockCache.size).toEqual(1);
            });
        });

        describe('Method: values', () => {
            it('will convert the object into an array of list item objects', () => {
                expect(mockCache.values()).toEqual([entityOne, entityTwo]);
            });
        });

    });
}