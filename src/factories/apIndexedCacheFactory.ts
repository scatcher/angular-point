/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    interface IUninstantiatedIndexCache<T> {
        [key: string]: T;
    }

    /**
     * @ngdoc object
     * @name IndexedCache
     * @description
     * Attempts to be very similar to the ES6 Map instance.  Cache constructor that is extended to make it easier to work with
     * via prototype methods.  Located in apIndexedCacheFactory.
     * @param {object} [object] Optionally extend new cache with provided object.
     * @requires angularPoint.apIndexedCacheFactory
     * @constructor
     */
    export class IndexedCache<T extends ListItem<any>> {
        //Object with keys equaling ID and values being the individual list item
        [key: string]: any;

        /**
        * @ngdoc property
        * @name IndexedCache.size
        * @description
        * Returns the number of key/value pairs in the Map object.  Similar to functionality in ES6 Map instance.
        */
        size: number;

        constructor(object?: IUninstantiatedIndexCache<T>) {
            if (object) {
                _.assign(this, object);
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
            _.each(this.keys(), (key: string) => this.delete(key));
        }

        /**
         * @ngdoc function
         * @name IndexedCache.delete
         * @methodOf IndexedCache
         * @description
         * Removes any value associated to the key and returns the value that IndexedCache.has(value).
         * @param {number} id ID of listItem to be removed.
         */
        delete(id: number | string): boolean {
            let hasValue = this.has(id);
            if (id && hasValue) {
                delete this[id];
            } else if (!_.isNumber(id) && !_.isString(id)) {
                console.warn('A valid ID was not provided.');
            }
            return hasValue;
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
        has(id: number | string): boolean {
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
         * @name IndexedCache.set
         * @methodOf IndexedCache
         * @description
         * Adds a new key to the cache if not already there with a value of the new listItem.
         * @param {number} key Entity to add to the cache.
         * @param {object} listItem Entity to add to the cache.
         */
        set(key: number, listItem: T): IndexedCache<T> {
            if (_.isNumber(key) && _.isObject(listItem)) {
                /** Only add the listItem to the cache if it's not already there */
                if (!this.has(listItem.id)) {
                    this[key] = listItem;
                } else {
                    let cachedObjectDiffersFromListItem = this.get(key) !== listItem;
                    if (cachedObjectDiffersFromListItem) {
                        console.warn('List item already exists in cache and differs from this list item.', listItem, this.get(key), this);
                    }
                }
            } else {
                throw new Error('A valid listItem wasn\'t provided: ' + JSON.stringify(listItem, null, 2));
            }
            return this;
        }

        /**
         * @ngdoc function
         * @methodOf IndexedCache
         * @name IndexedCache.toArray
         * @description
         * Turns the cache object into an array of entities.  Uses IndexedCache.values() and is a temp fix to get
         * an array of objects until Map is fully supported.
         * @returns {object[]} Returns the array of entities currently in the cache.
         */
        toArray(): T[] {
            return this.values();
        }

        /**
         * @ngdoc function
         * @name IndexedCache.values
         * @methodOf IndexedCache
         * @description
         * Turns the cache object into an array of entities similar to the method on Map.values().  Unlike
         * the method on Map though this does not return the objects in insertion order.
         * @returns {IndexedCache<T>[]} Returns the array of entities currently in the cache.
         */
        values(): T[] {
            return _.toArray<IndexedCache<T>, T>(this);
        }

        /**
         * @ngdoc function
         * @methodOf IndexedCache
         * @deprecated
         * @description
         * DEPRECATED AND WILL BE REMOVED!  Use IndexedCache.set instead.
         * Adds a new key to the cache if not already there with a value of the new listItem.
         * @param {object} listItem Entity to add to the cache.
         */
        private addEntity(listItem: T): void {
            console.warn('DEPRECATED METHOD!.  addEntity method deprecited.  Please use the set method in the future to comply with ES6 Map object.');
            this.set(listItem.id, listItem);
        }

        /**
         * @ngdoc function
         * @name IndexedCache.count
         * @methodOf IndexedCache
         * @description
         * Returns the number of entities in the cache.
         * @returns {number} Number of entities in the cache.
         */
        private count(): number {
            return this.keys().length;
        }

        /**
         * @ngdoc function
         * @methodOf IndexedCache
         * @deprecated
         * @description
         * DEPRECATED AND WILL BE REMOVED! Use IndexedCache.delete instead of removeEntityById.
         * Removes a listItem from the cache.
         * @param {number} id ID of listItem to be removed.
         */
        private removeEntityById(id: number): void {
            console.warn('DEPRECATED METHOD! Use IndexedCache.delete() instead of removeEntityById().');
            this.delete(id);
        }

    }

    /** Adds a getter to base prototype wich returns  the number of key/values stored in cache. */
    Object.defineProperty(IndexedCache.prototype, "size", {
        get: function() {
            return this.count();
        },
        enumerable: false,
        configurable: false
    });


    /**
     * @ngdoc object
     * @name angularPoint.apIndexedCacheFactory
     * @description
     * Exposes the EntityFactory prototype and a constructor to instantiate a new Entity Factory in apCacheService.
     */
    export class IndexedCacheFactory {
        IndexedCache = IndexedCache;
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


    }

    angular.module('angularPoint')
        .service('apIndexedCacheFactory', IndexedCacheFactory);
}
