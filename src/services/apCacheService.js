'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apCacheService
 * @description
 * Stores a reference for all list items based on list GUID and list item id.  Allows us to then register promises that
 * resolve once a requested list item is registered in the future.
 */
angular.module('angularPoint')
    .service('apCacheService', function ($q, $log, _, apIndexedCacheFactory) {
        var entityNameToType = {},
            entityCache = {};

        function ModelCache() {
        }

        ModelCache.prototype = apIndexedCacheFactory.IndexedCache;
        /** Make sure to properly set the appropriate constructor instead of using the one inherited from IndexedCache*/
        ModelCache.constructor = ModelCache;

        function registerModel(model) {
            if (model.list && model.list.guid && model.list.title) {
                entityNameToType[model.list.title] = {
                    model: model,
                    entityType: getEntityTypeKey(model.list.guid)
                };
            }
        }

        function getEntityTypeByName(name) {
            if (entityNameToType[name] && entityNameToType[name].entityType) {
                return entityNameToType[name].entityType;
            } else {
                $log.error('The requested list name isn\'t valid: ', name);
            }
        }

        /** Allows us to use either the List Name or the list GUID and returns the lowercase GUID */
        function getEntityTypeKey(keyString) {
            if (_.isGuid(keyString)) {
                /** GUID */
                return keyString.toLowerCase();
            } else {
                /** List Title */
                return getEntityTypeByName(keyString);
            }
        }

        /**
         * @name EntityCache
         * @description
         * Cache constructor that maintains a queue of all requests for a list item, counter for the number of times
         * the cache has been updated, timestamp of last update, and add/update/remove functionality.
         * @constructor apCacheService
         * @param {string} entityType GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         */
        function EntityCache(entityType, entityId) {
            var self = this;
            self.associationQueue = [];
            self.updateCount = 0;
            self.entityType = getEntityTypeKey(entityType);
            self.entityId = entityId;
            self.entityLocations = [];
        }

        EntityCache.prototype.registerEntity = registerEntity;

        /**
         * @name EntityCache.getEntity
         * @description
         * Promise which returns the requested entity once it has been registered in the cache.
         */
        EntityCache.prototype.getEntity = function () {
            var self = this;
            var deferred = $q.defer();
            if (self.entity) {
                /** Entity already exists so resolve immediately */
                deferred.resolve(self.entity);
            } else {
                self.associationQueue.push(deferred);
            }
            return deferred.promise;
        };

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:getCachedEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Synchronise call to return a cached entity;
         * @param {string} entityType GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         * @returns {object} entity || undefined
         */
        function getCachedEntity(entityType, entityId) {
            return getEntityContainer(entityType, entityId).entity;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:getEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Returns a deferred object that resolves with the requested entity immediately if already present or at some
         * point in the future assuming the entity is eventually registered.
         * @param {string} entityType GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         * @returns {promise} entity
         */
        function getEntity(entityType, entityId) {
            var entityCache = getEntityContainer(entityType, entityId);
            return entityCache.getEntity();
        }

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:registerEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Registers an entity in the cache and fulfills any pending deferred requests for the entity. If the
         * entity already exists in the cache, we extend the existing object with the updated entity and return a
         * reference to this updated object so the there is only a single instance of this entity withing the cache.
         * @param {object} entity Pass in a newly created entity to add to the cache.
         */
        function registerEntity(entity, targetCache) {
            var model = entity.getModel();
            var entityCache = getEntityContainer(model.list.guid, entity.id);
            /** Maintain a single object in cache for this entity */
            if (!_.isObject(entityCache.entity)) {
                /** Entity isn't currently in the cache */
                entityCache.entity = entity;
            } else {
                /** Already exists so update to maintain any other references being used for this entity. */
                _.extend(entityCache.entity, entity);
            }

            /** Counter to keep track of the number of updates for this entity */
            entityCache.updateCount++;
            if (_.isObject(targetCache) && !_.isArray(targetCache)) {
                /** Entity hasn't been added to the target cache yet */
                targetCache[entity.id] = entity;
            }


            /** Resolve any requests for this entity */
            _.each(entityCache.associationQueue, function (deferredRequest) {
                deferredRequest.resolve(entity);
                /** Remove request from queue */
                entityCache.associationQueue.shift();
            });
            return entityCache.entity;
        }


        EntityCache.prototype.removeEntity = function () {
            delete entityCache[this.entityType][this.entityId];
        };

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:removeEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Removes the entity from the local entity cache.
         * @param {string} entityType GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         */
        function removeEntity(entityType, entityId) {
            var entityCache = getEntityContainer(entityType, entityId);
            entityCache.removeEntity();
        }

        function getModelCache(entityTypeKey) {
            entityCache[entityTypeKey] = entityCache[entityTypeKey] || new ModelCache();
            return entityCache[entityTypeKey];
        }

        function getEntityContainer(entityType, entityId) {
            var entityTypeKey = getEntityTypeKey(entityType);
            var modelCache = getModelCache(entityTypeKey);
            /** Create the object structure if it doesn't already exist */
            modelCache[entityId] = modelCache[entityId] || new EntityCache(entityTypeKey, entityId);
            return modelCache[entityId];
        }

        ///** Older List Item Functionality */
        //    //TODO: Remove these if they're not being used
        //
        //function addToCache(uniqueId, constructorName, entity) {
        //    var cache = getCache(uniqueId, constructorName);
        //    cache[constructorName] = entity;
        //    return cache[constructorName];
        //}
        //
        //function getCache(uniqueId, constructorName) {
        //    listItemCache[uniqueId] = listItemCache[uniqueId] || {};
        //    listItemCache[uniqueId][constructorName] = listItemCache[uniqueId][constructorName] || {};
        //    return listItemCache[uniqueId][constructorName];
        //}
        //
        //function removeFromCache(uniqueId, constructorName, entity) {
        //    var cache = getCache(uniqueId, constructorName);
        //    if (cache && cache[constructorName] && cache[constructorName][entity.id]) {
        //        delete cache[constructorName][entity.id];
        //    }
        //}

        return {
            entityCache: entityCache,
            getCachedEntity: getCachedEntity,
            getEntity: getEntity,
            getEntityContainer: getEntityContainer,
            getEntityTypeKey: getEntityTypeKey,
            removeEntity: removeEntity,
            registerEntity: registerEntity,
            registerModel: registerModel
        };


    });
