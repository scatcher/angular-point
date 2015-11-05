/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    interface IUninstantiatedIndexCache<T> {
        [key: number]: T;
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
    export class IndexedCache<T extends ListItem<any>> {
        //Object with keys equaling ID and values being the individual list item
        [key: number]: T;
        
        /**
         * @ngdoc property
         * @name IndexedCache.length
         * @methodOf IndexedCache
         * @description
         * Uses IndexedCache.count() and allows an IndexedCache to be used with functionality
         * which requires array like objects.
         */
        // get length(): number {
        //     return this.count();
        // }
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
        addEntity(listItem: T): void {
            if (_.isObject(listItem) && !!listItem.id) {
                /** Only add the listItem to the cache if it's not already there */
                if (!this[listItem.id]) {
                    this[listItem.id] = listItem;
                }
            } else {
                throw new Error('A valid listItem wasn\'t provided: ' + JSON.stringify(listItem, null, 2));
            }
        }

        /**
         * @ngdoc function
         * @name IndexedCache.clear
         * @methodOf IndexedCache
         * @description
         * Clears all cached (enumerable) elements from the containing cache object.
         */
        clear(): void {
            _.each(this.keys(), (key) => delete this[key]);
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
         * @returns {object} First listItem in cache or undefined if empty.
         */
        first(): T {
            return this.nthEntity(0);
        }

        /**
         * @ngdoc function
         * @name IndexedCache.get
         * @methodOf IndexedCache
         * @returns {T} Returns the value associated to the key, or undefined if there is none.
         */        
        get(id: number): T {
            return this[id];
        }
 
        /**
         * @ngdoc function
         * @name IndexedCache.has
         * @methodOf IndexedCache
         * @description
         * Determines if an entity exists in the cache.
         * @param {number} id The id of the requested list item.
         * @returns {boolean} Returns a Boolean asserting whether a value has been associated to the key cache.
         */        
        has(id: number): boolean {
            return !!this[id];
        }

        /**
         * @ngdoc function
         * @name IndexedCache.keys
         * @methodOf IndexedCache
         * @description
         * Returns the array of enumerable keys (listItem ID's) for the cache.
         * @returns {string[]} Array of listItem id's as strings.
         */
        keys(): string[] {
            return Object.keys(this);
        }

        /**
         * @ngdoc function
         * @name IndexedCache.last
         * @methodOf IndexedCache
         * @description
         * Returns the last listItem in the index (largest ID).
         * @returns {object} Last listItem in cache.
         */
        last(): T {
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
        nthEntity(index: number): T {
            var keys = this.keys();
            return this[keys[index]];
        }

        /**
         * @ngdoc function
         * @name IndexedCache.removeEntity
         * @methodOf IndexedCache
         * @description
         * Removes a listItem from the cache.
         * @param {object} listItem Entity to remove from cache.
         */
        removeEntity(listItem: T): void {
            if (listItem.id && this[listItem.id]) {
                delete this[listItem.id];
            }
        }
        
        /**
         * @ngdoc function
         * @name IndexedCache.removeEntityById
         * @methodOf IndexedCache
         * @description
         * Removes a listItem from the cache.
         * @param {number} id ID of listItem to be removed.
         */
        removeEntityById(id: number): void {
            if (id && this[id]) {
                delete this[id];
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
        toArray(): T[] {
            return _.toArray<IndexedCache<T>, T>(this);
        }

    }


    /**
     * @ngdoc object
     * @name angularPoint.apIndexedCacheFactory
     * @description
     * Exposes the EntityFactory prototype and a constructor to instantiate a new Entity Factory in apCacheService.
     */
    export class IndexedCacheFactory {
        /**
         * @ngdoc function
         * @name angularPoint.apIndexedCacheFactory:create
         * @methodOf angularPoint.apIndexedCacheFactory
         * @description
         * Instantiates and returns a new Indexed Cache.grunt
         */
        create<T extends ListItem<any>>(overrides?: IUninstantiatedIndexCache<T>): IndexedCache<T> {
            return new IndexedCache<T>(overrides);
        }
        IndexedCache = IndexedCache;

    }

    angular.module('angularPoint')
        .service('apIndexedCacheFactory', IndexedCacheFactory);
}
