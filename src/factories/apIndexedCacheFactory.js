'use strict';

/**
 * @ngdoc object
 * @name angularPoint.apIndexedCacheFactory
 * @description
 * Exposes the EntityFactory prototype and a constructor to instantiate a new Entity Factory in apCacheService.
 *
 */
angular.module('angularPoint')
    .factory('apIndexedCacheFactory', function (_) {


        /*********************** Private ****************************/


        /**
         * @ngdoc object
         * @name angularPoint.IndexedCache
         * @description
         * Cache constructor that is extended to make it easier to work with via prototype methods.  Located in
         * apIndexedCacheFactory.
         * @constructor
         */
        function IndexedCache() {
        }

        IndexedCache.prototype = {
            addEntity: addEntity,
            clear: clear,
            count: count,
            first: first,
            keys: keys,
            last: last,
            removeEntity: removeEntity,
            toArray: toArray
        };

        return {
            create: create,
            IndexedCache: IndexedCache
        };

        /*********************** Private ****************************/

        /**
         * @ngdoc function
         * @name angularPoint.IndexedCache:addEntity
         * @methodOf angularPoint.IndexedCache
         * @description
         * Adds a new key to the cache if not already there with a value of the new entity.
         * @param {object} entity Entity to add to the cache.
         */
        function addEntity(entity) {
            var cache = this;

            if (_.isObject(entity) && entity.id) {
                /** Only add the entity to the cache if it's not already there */
                if(!cache[entity.id]) {
                    cache[entity.id] = entity;
                }
            }else {
                console.error('A valid entity wasn\'t found: ', entity);
            }
        }

        /**
         * @ngdoc function
         * @name angularPoint.IndexedCache:clear
         * @methodOf angularPoint.IndexedCache
         * @description
         * Clears all cached elements from the containing cache object.
         */
        function clear() {
            var cache = this;
            _.each(cache, function(entity, key) {
                delete cache[key];
            });
        }

        /**
         * @ngdoc function
         * @name angularPoint.IndexedCache:keys
         * @methodOf angularPoint.IndexedCache
         * @description
         * Returns the array of keys (entity ID's) for the cache.
         * @returns {string[]} Array of entity id's as strings.
         */
        function keys() {
            var cache = this;
            return _.keys(cache);
        }

        /**
         * @ngdoc function
         * @name angularPoint.IndexedCache:first
         * @methodOf angularPoint.IndexedCache
         * @description
         * Returns the first entity in the index (smallest ID).
         * @returns {object} First entity in cache.
         */
        function first() {
            var cache = this;
            var keys = cache.keys();
            return (keys.length > 0) ? cache[keys[0]] : undefined;
        }

        /**
         * @ngdoc function
         * @name angularPoint.IndexedCache:last
         * @methodOf angularPoint.IndexedCache
         * @description
         * Returns the last entity in the index (largest ID).
         * @returns {object} Last entity in cache.
         */
        function last() {
            var cache = this;
            var keys = cache.keys();
            return (keys.length > 0) ? cache[keys[keys.length - 1]] : undefined;
        }

        /**
         * @ngdoc function
         * @name angularPoint.IndexedCache:count
         * @methodOf angularPoint.IndexedCache
         * @description
         * Returns the number of entities in the cache.
         * @returns {number} Number of entities in the cache.
         */
        function count() {
            var cache = this;
            return cache.keys().length;
        }

        /**
         * @ngdoc function
         * @name angularPoint.IndexedCache:removeEntity
         * @methodOf angularPoint.IndexedCache
         * @description
         * Removes an entity from the cache.
         * @param {object} entity Entity to remove.
         */
        function removeEntity(entity) {
            var cache = this;
            if(_.isObject && entity.id && cache[entity.id]) {
                delete cache[entity.id];
            }
        }

        /**
         * @ngdoc function
         * @name angularPoint.IndexedCache:toArray
         * @methodOf angularPoint.IndexedCache
         * @description
         * Turns the cache object into an array of entities.
         * @returns {object[]} Returns the array of entities currently in the cache.
         */
        function toArray() {
            var cache = this;
            return _.toArray(cache);
        }

        /**
         * @ngdoc function
         * @name angularPoint.apIndexedCacheFactory:create
         * @methodOf angularPoint.apIndexedCacheFactory
         * @description
         * Instantiates and returns a new Indexed Cache.grunt
         */
        function create() {
            return new IndexedCache();
        }
    }
)
;