'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apCacheService
 * @description
 * Stores a reference for all list items based on list GUID and list item id.  Allows us to then register promises that
 * resolve once a requested list item is registered in the future.
 */
angular.module('angularPoint')
    .service('apCacheService', function ($q, $log) {
        var listItemCache = {}, entityNameToType = {}, entityCache = {};

        var registerModel = function (model) {
            if (model.list && model.list.guid && model.list.title) {
                entityNameToType[model.list.title] = {
                    model: model,
                    entityType: getEntityTypeKey(model.list.guid)
                };
            }
        };

        var getEntityTypeByName = function (name) {
            if(entityNameToType[name] && entityNameToType[name].entityType) {
                return entityNameToType[name].entityType;
            } else {
                $log.error('The requested list name isn\'t valid: ', name);
            }
        };

        /** Allows us to use either the List Name or the list GUID and returns the lowercase GUID */
        var getEntityTypeKey = function (keyString) {
            /** A GUID will contain "{", where a list title won't */
            if (_.isGuid(keyString)) {
                /** GUID */
                return keyString.toLowerCase();
            } else {
                /** List Title */
                return getEntityTypeByName(keyString);
            }
        };
        
        /**
         * @ngdoc object
         * @name angularPoint.apCacheService.EntityCache
         * @description
         * Cache constructor that maintains a queue of all requests for a list item, counter for the number of times
         * the cache has been updated, timestamp of last update, and add/update/remove functionality.
         * @param {string} entityType GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         * @requires angularPoint.apCacheService
         */
        var EntityCache = function (entityType, entityId) {
            var self = this;
            self.associationQueue = [];
            self.updateCount = 0;
            self.entityType = getEntityTypeKey(entityType);
            self.entityId = entityId;
        };

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService.EntityCache:getEntity
         * @mthodOf angularPoint.apCacheService.EntityCache
         * @description
         * Promise which returns the requested entity once it has been registered in the cache.
         */
        EntityCache.prototype.getEntity = function () {
            var self = this;
            var deferred = $q.defer();
            if(self.entity) {
                /** Entity already exists so resolve immediately */
                deferred.resolve(self.entity);
            } else {
                self.associationQueue.push(deferred);
            }
            return deferred.promise;
        };

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
        var getEntity = function (entityType, entityId) {
            var entityCache = getEntityCache(entityType, entityId);
            return entityCache.getEntity();
        };

        EntityCache.prototype.addEntity = function (entity) {
            var self = this;
            self.entity = entity;
            self.updateCount ++;
            self.entity.age = new Date();
            _.each(self.associationQueue, function(deferredRequest) {
                deferredRequest.resolve(entity);
                /** Remove request from queue */
                self.associationQueue.shift();
            });
            return self.entity;
        };

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:registerEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Registers an entity in the cache and fulfills any pending deferred requests for the entity.
         * @param {object} entity Pass in a newly created entity to add to the cache.
         */
        var registerEntity = function (entity) {
            var entityType = entity.getModel().list.guid;
            var entityCache = getEntityCache(entityType, entity.id);
            return entityCache.addEntity(entity);
        };


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
        var removeEntity = function (entityType, entityId) {
            var entityCache = getEntityCache(entityType, entityId);
            entityCache.removeEntity();
        };

        var getEntityCache = function (entityType, entityId) {
            var entityTypeKey = getEntityTypeKey(entityType);
            /** Create the object structure if it doesn't already exist */
            if(!entityCache[entityTypeKey] || !entityCache[entityTypeKey][entityId]) {
                entityCache[entityTypeKey] = entityCache[entityTypeKey] || {};
                entityCache[entityTypeKey][entityId] = new EntityCache(entityTypeKey, entityId);
            }
            return entityCache[entityTypeKey][entityId];
        };

        /** Older List Item Functionality */
        //TODO: Remove these if there not being used

        var addToCache = function (uniqueId, constructorName, entity) {
            var cache = getCache(uniqueId, constructorName);
            cache[constructorName] = entity;
            return cache[constructorName];
        };

        var getCache = function (uniqueId, constructorName) {
            listItemCache[uniqueId] = listItemCache[uniqueId] || {};
            listItemCache[uniqueId][constructorName] = listItemCache[uniqueId][constructorName] || {};
            return listItemCache[uniqueId][constructorName];
        };

        var removeFromCache = function (uniqueId, constructorName, entity) {
            var cache = getCache(uniqueId, constructorName);
            if (cache && cache[constructorName] && cache[constructorName][entity.id]) {
                delete cache[constructorName][entity.id];
            }
        };

        return {
            getEntity: getEntity,
            removeEntity: removeEntity,
            listItem: {
                add: addToCache,
                get: getCache,
                remove: removeFromCache
            },
            registerEntity: registerEntity,
            registerModel: registerModel
        };
    });
