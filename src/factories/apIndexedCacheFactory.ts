/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    export interface IIndexedCache<T> {
        addEntity: (listItem: ListItem<T>) => void;
        clear: () => void;
        count: () => number;
        first: () => ListItem<T>;
        keys: () => string[];
        last: () => ListItem<T>;
        nthEntity: (index: number) => ListItem<T>;
        removeEntity(listItem: ListItem<T>): void;
        removeEntity(listItem: number): void;
        toArray: () => ListItem<T>[];

        //Object with keys equaling ID and values being the individual list item
        [key: number]: ListItem<T>;

        //(value: number): ListItem<T>;
        //        [key: string]: ListItem<T>;
    }

    
    interface IUninstantiatedIndexCache<T>{
        [key: number]: ListItem<T>;
    }

    /**
     * @ngdoc object
     * @name IndexedCache
     * @description
     * Cache constructor that is extended to make it easier to work with via prototype methods.  Located in
     * apIndexedCacheFactory.
     * @param {object} [object] Optionally extend new cache with provided object.
     * @requires angularPoint.apIndexedCacheFactory
     * @constructor
     */
    export class IndexedCache<T> implements IIndexedCache<T>{
        constructor(object?: IUninstantiatedIndexCache<T>) {
            if (object) {
                _.assign(this, object);
            }
        }

        /**
         * @ngdoc function
         * @name IndexedCache.addEntity
         * @methodOf IndexedCache
         * @description
         * Adds a new key to the cache if not already there with a value of the new listItem.
         * @param {object} listItem Entity to add to the cache.
         */
        addEntity(listItem: ListItem<T>): void {
            if (_.isObject(listItem) && !!listItem.id) {
                /** Only add the listItem to the cache if it's not already there */
                if (!this[listItem.id]) {
                    this[listItem.id.toString()] = listItem;
                }
            } else {
                throw new Error('A valid listItem wasn\'t found: ' + JSON.stringify(listItem));
            }
        }

        /**
         * @ngdoc function
         * @name IndexedCache.clear
         * @methodOf IndexedCache
         * @description
         * Clears all cached elements from the containing cache object.
         */
        clear(): void {
            _.each(this, (listItem, key) => delete this[key]);
        }

        /**
         * @ngdoc function
         * @name IndexedCache.count
         * @methodOf IndexedCache
         * @description
         * Returns the number of entities in the cache.
         * @returns {number} Number of entities in the cache.
         */
        count(): number {
            return this.keys().length;
        }

        /**
         * @ngdoc function
         * @name IndexedCache.first
         * @methodOf IndexedCache
         * @description
         * Returns the first listItem in the index (smallest ID).
         * @returns {object} First listItem in cache.
         */
        first(): ListItem<T> {
            return this.nthEntity(0);
        }

        /**
         * @ngdoc function
         * @name IndexedCache.keys
         * @methodOf IndexedCache
         * @description
         * Returns the array of keys (listItem ID's) for the cache.
         * @returns {string[]} Array of listItem id's as strings.
         */
        keys(): string[] {
            return _.keys(this);
        }

        /**
         * @ngdoc function
         * @name IndexedCache.last
         * @methodOf IndexedCache
         * @description
         * Returns the last listItem in the index (largest ID).
         * @returns {object} Last listItem in cache.
         */
        last(): ListItem<T> {
            var keys = this.keys();
            return this[keys[keys.length - 1]];
        }

        /**
         * @ngdoc function
         * @name IndexedCache.nthEntity
         * @methodOf IndexedCache
         * @description
         * Based on the
         * @param {number} index The index of the item requested.
         * @returns {object} First listItem in cache.
         */
        nthEntity(index: number): ListItem<T> {
            var keys = this.keys();
            return this[keys[index]];
        }

        /**
         * @ngdoc function
         * @name IndexedCache.removeEntity
         * @methodOf IndexedCache
         * @description
         * Removes a listItem from the cache.
         * @param {object|number} listItem Entity to remove or ID of listItem to be removed.
         */
        removeEntity(listItem: ListItem<T> | number): void {
            if (_.isObject && listItem.id && this[listItem.id]) {
                delete this[listItem.id];
            } else if (_.isNumber(listItem)) {
                /** Allow listItem ID to be used instead of then listItem */
                delete this[listItem];
            }
        }

        /**
         * @ngdoc function
         * @name IndexedCache.toArray
         * @methodOf IndexedCache
         * @description
         * Turns the cache object into an array of entities.
         * @returns {object[]} Returns the array of entities currently in the cache.
         */
        toArray(): ListItem<T>[] {
            return _.toArray(this);
        }

    }


    /**
     * @ngdoc object
     * @name angularPoint.apIndexedCacheFactory
     * @description
     * Exposes the EntityFactory prototype and a constructor to instantiate a new Entity Factory in apCacheService.
     *
     */

    export class IndexedCacheFactory {
        /**
         * @ngdoc function
         * @name angularPoint.apIndexedCacheFactory:create
         * @methodOf angularPoint.apIndexedCacheFactory
         * @description
         * Instantiates and returns a new Indexed Cache.grunt
         */
        create<T>(overrides?: IUninstantiatedIndexCache<T>): IndexedCache<T> {
            return new IndexedCache<T>(overrides);
        }
        IndexedCache = IndexedCache;

    }

    angular.module('angularPoint')
        .service('apIndexedCacheFactory', IndexedCacheFactory);
}
