"use strict";

describe("Factory: apIndexedCacheFactory", function () {

    beforeEach(module("angularPoint"));

    var apIndexedCacheFactory, mockCache,
        entityOne = {id: 1, title: 'test'},
        entityTwo = {id: 2, title: 'test2'};

    beforeEach(module("ui.bootstrap"));
    beforeEach(inject(function (_apIndexedCacheFactory_) {
        apIndexedCacheFactory = _apIndexedCacheFactory_;
        mockCache = apIndexedCacheFactory.create();
        mockCache.addEntity(entityOne);
        mockCache.addEntity(entityTwo);
    }));



    describe('IndexCache', function () {
        it('the cache to have the correct constructor', function () {
            expect(mockCache instanceof apIndexedCacheFactory.IndexedCache).toBe(true);
        });
    });

    describe('addEntity', function () {
        it('will add the new entity to the cache', function () {
            expect(mockCache[1].title).toEqual('test');
        });

        it('throws an error if a valid entity isn\'t provided', function () {
            expect(function() {mockCache.addEntity('Not an Entity')}).toThrow();
        });
    });

    describe('clear', function () {
        beforeEach(function () {
            mockCache.clear();
        });
        it('empties all items in the cache', function () {
            expect(mockCache.count()).toEqual(0);
        });
    });

    describe('keys', function () {
        it('will return the keys', function () {
            expect(mockCache.keys()).toEqual(['1', '2']);
        });
    });

    describe('first', function () {
        it('will return the first item in the cache based on id', function () {
            expect(mockCache.first()).toBe(entityOne);
        });
    });

    describe('last', function () {
        it('will return the last item in the cache based on id', function () {
            expect(mockCache.last()).toBe(entityTwo);
        });
    });

    describe('removeEntity', function () {
        beforeEach(function () {
            mockCache.removeEntity(mockCache[1]);
        });
        it('removes the first cached value', function () {
            expect(mockCache.first().title).toEqual('test2');
        });
    });

    describe('toArray', function () {
        it('will convert the object into an array', function () {
            expect(mockCache.toArray().length).toBe(2);
        });
    });

    describe('length', function () {
        it('will return the number of entities in the cache', function () {
            expect(mockCache.count()).toBe(2);
        });
    });
});