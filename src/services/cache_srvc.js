'use strict';

/**
 * @ngdoc service
 * @name apCacheService
 * @description
 * Stores a reference for all list items based on list GUID and list item id.  Allows us to then register promises that
 * resolve once a requested list item is registered in the future.
 */
angular.module('angularPoint')
    .service('apCacheService', function () {
        var listItemCache = {}, entityTypes = {}, entityCache = {};

        /**
         * @ngdoc function
         * @name apCacheService.EntityCache
         * @description
         * Cache constructor that maintains a queue of all requests for a list item, counter for the number of times
         * the cache has been updated, timestamp of last update, and add/update/remove functionality.
         * @param {string} entityType GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         * @constructor
         */
        var EntityCache = function (entityType, entityId) {
            var self = this;
            self.associationQueue = [];
            self.updateCount = 0;
            self.entityType = entityType;
            self.entityId = entityId;
        };

        EntityCache.prototype.getEntity = function () {
            var self = this;
            var deferred = $q.defer();
            if(self.entity) {
                /** Entity already exists so resolve immediately */
            } else {
                self.associationQueue.push(deferred);
            }
            return deferred.promise;
        };

        /**
         * @ngdoc function
         * @name apCacheService.getEntity
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
        };

        /**
         * @ngdoc function
         * @name apCacheService.registerEntity
         * @description
         * Registers an entity in the cache and fulfills any pending deferred requests for the entity.
         * @param {object} entity Pass in a newly created entity to add to the cache.
         */
        var registerEntity = function (entity) {
            var entityType = entity.getModel().list.guid;
            var entityCache = getEntityCache(entityType, entity.id);
            entityCache.addEntity(entity);
        };


        EntityCache.prototype.removeEntity = function () {
            delete entityCache[this.entityType][this.entityId];
        };

        /**
         * @ngdoc function
         * @name apCacheService.removeEntity
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
            if(!entityCache[entityType] || !entityCache[entityType][entityId]) {
                entityCache[entityType] = entityCache[entityType] || {};
                entityCache[entityType][entityId] = new EntityCache(entityType, entityId);
            }
            return entityCache[entityType][entityId];
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
            registerEntity: registerEntity
        };
    });
