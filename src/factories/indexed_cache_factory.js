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
         * @name IndexedCache
         * @description
         * Cache constructor that is extended to make it easier to work with via prototype methods.
         * @constructor
         */
        function IndexedCache() {
        }

        IndexedCache.prototype = {
            addEntity: addEntity,
            clear: clear,
            first: first,
            keys: keys,
            count: count,
            removeEntity: removeEntity,
            toArray: toArray
        };

        return {
            create: create,
            IndexedCache: IndexedCache
        };

        /*********************** Private ****************************/

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

        function clear() {
            var cache = this;
            _.each(cache, function(entity, key) {
                delete cache[key];
            });
        }

        function keys() {
            var cache = this;
            return _.keys(cache);
        }

        function first() {
            var cache = this;
            var keys = cache.keys();
            return (keys.length > 0) ? cache[keys[0]] : undefined;
        }

        function count() {
            var cache = this;
            return cache.keys().length;
        }

        function removeEntity(entity) {
            var cache = this;
            if(_.isObject && entity.id && cache[entity.id]) {
                delete cache[entity.id];
            }
        }

        function toArray() {
            var cache = this;
            return _.toArray(cache);
        }

        /**
         * @ngdoc function
         * @name angularPoint.apIndexedCacheFactory:create
         * @methodOf angularPoint.apIndexedCacheFactory
         * @description
         * Instantiates and returns a new Indexed Cache.
         */
        function create() {
            return new IndexedCache();
        }
    }
)
;