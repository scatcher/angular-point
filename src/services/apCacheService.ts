import * as _ from 'lodash';
import { ListItem } from '../factories/apListItemFactory';
import { IndexedCache, IndexedCacheFactory } from '../factories/apIndexedCacheFactory';
import { Model } from '../factories/apModelFactory';
import { Query } from '../factories/apQueryFactory';

let service: CacheService, $q: ng.IQService, $log: ng.ILogService, apIndexedCacheFactory: IndexedCacheFactory;

/**
 * @description Stores list GUID when a new model is registered with a reference to the model for
 *     future reference.
 * @example
 * <pre>
 *     listsMappedByListId = {
 *          list1GUID: {
 *              model: list1Model
 *          },
 *          list2GUID: {
 *              model: list2Model
 *          }
 *          ...
 *     }
 * </pre>
 */
const listsMappedByListId = {};
/**
 * @description The Main cache object which stores ModelCache objects.  Keys being the model GUID and
 *     value being an a ModelCache object
 * @example
 * <pre>
 *     entityCache = {
 *          list1GUID: {
 *              item1ID: { //EnityCache for entity 1
 *                  associationQueue: [],
 *                  updateCount: 3,
 *                  listId: list1GUID,
 *                  entityId: item1ID,
 *                  entityLocations: [],
 *                  entity: {} //This is where the actual entity is referenced
 *              }
 *              item2ID: { //EnityCache for entity 2
 *                  ...
 *              }
 *          },
 *          list2GUID: {
 *              item1ID: ...
 *          }
 *          ...
 *     }
 * </pre>
 */
const entityCache = {};

/**
 * @name EntityCache
 * @description
 * Cache constructor that maintains a queue of all requests for a list item, counter for the number of times
 * the cache has been updated, timestamp of last update, and add/update/remove functionality.
 * @constructor apCacheService
 * @param {string} listId GUID for list the list item belongs to.
 * @param {number} entityId The entity.id.
 */
export class EntityContainer {
    associationQueue = [];
    entity;
    entityLocations = [];
    updateCount = 0;

    constructor(private listId: string, private entityId: number) {}

    /**
     * @name EntityContainer.getEntity
     * @description
     * Promise which returns the requested entity once it has been registered in the cache.
     */
    getEntity() {
        const deferred = $q.defer();
        if (this.entity) {
            /** Entity already exists so resolve immediately */
            deferred.resolve(this.entity);
        } else {
            this.associationQueue.push(deferred);
        }
        return deferred.promise;
    }

    removeEntity() {
        service.removeEntityById(this.listId, this.entityId);
    }
}

/**
 * @name ModelCache
 * @description
 * Cache of Entity Containers for each registered entity retrieved by the model.
 * @constructor
 */
export class ModelCache {
    [key: string]: EntityContainer;
}

/**
 * @ngdoc service
 * @name angularPoint.apCacheService
 * @description
 * Stores a reference for all list items based on list GUID and list item id.  Allows us to then register promises
 *     that resolve once a requested list item is registered in the future.
 */
export class CacheService {
    static $inject = ['$q', '$log', 'apIndexedCacheFactory'];
    entityCache = entityCache;

    constructor(_$q_, _$log_, _apIndexedCacheFactory_) {
        $q = _$q_;
        $log = _$log_;
        apIndexedCacheFactory = _apIndexedCacheFactory_;

        service = this;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apCacheService:deleteEntity
     * @methodOf angularPoint.apCacheService
     * @description
     * Deletes all references to an entity.
     * @param {string} listId GUID for list the list item belongs to.
     * @param {number} entityId The entity.id.
     */
    deleteEntity(listId: string, entityId: number): void {
        this.removeEntityById(listId, entityId);
        let model = this.getModel(listId);
        _.each(model.queries, (query: Query<any>) => {
            let cache = query.getCache();
            if (cache.has(entityId)) {
                cache.delete(entityId);
            }
        });
    }

    /**
     * @ngdoc function
     * @name angularPoint.apCacheService:getCachedEntities
     * @methodOf angularPoint.apCacheService
     * @description
     * Returns all entities for a given model as an indexed cache with keys being the entity id's.
     * @param {string} listId GUID for list the list item belongs to.
     * @returns {object} Indexed cache containing all entities for a model.
     */
    getCachedEntities<T extends ListItem<any>>(listId: string): IndexedCache<T> {
        let modelCache = this.getModelCache(listId),
            allEntities = apIndexedCacheFactory.create<T>();

        _.each(modelCache, (entityContainer: EntityContainer) => {
            if (entityContainer.entity && entityContainer.entity.id) {
                allEntities.set(entityContainer.entity.id, entityContainer.entity);
            }
        });
        return allEntities;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apCacheService:getCachedEntity
     * @methodOf angularPoint.apCacheService
     * @description
     * Synchronise call to return a cached entity;
     * @param {string} listId GUID for list the list item belongs to.
     * @param {number} entityId The entity.id.
     * @returns {object} entity || undefined
     */
    getCachedEntity<T extends ListItem<any>>(listId: string, entityId: number): T {
        return this.getEntityContainer(listId, entityId).entity;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apCacheService:getEntity
     * @methodOf angularPoint.apCacheService
     * @description
     * Returns a deferred object that resolves with the requested entity immediately if already present or at
     *     some point in the future assuming the entity is eventually registered.
     * @param {string} listId GUID for list the list item belongs to.
     * @param {number} entityId The entity.id.
     * @returns {promise} entity
     */
    getEntity<T extends ListItem<any>>(listId: string, entityId: number): ng.IPromise<T> {
        let entityContainer = this.getEntityContainer(listId, entityId);
        return entityContainer.getEntity() as ng.IPromise<T>;
    }

    private getEntityContainer(listId: string, entityId: number): EntityContainer {
        let modelCache = this.getModelCache(listId);
        /** Create the object structure if it doesn't already exist */
        modelCache[entityId] = modelCache[entityId] || new EntityContainer(listId, entityId);
        return modelCache[entityId];
    }

    /**
     * @ngdoc function
     * @name angularPoint.apCacheService:getModel
     * @methodOf angularPoint.apCacheService
     * @description
     * Allows us to retrieve a reference to a given model by either the list title or list GUID.
     * @param {string} listId List title or list GUID.
     * @returns {object} A reference to the requested model.
     */
    getModel(listId: string): Model {
        let model;

        if (listsMappedByListId[listId]) {
            model = listsMappedByListId[listId].model;
        }
        return model;
    }

    /** Locates the stored cache for a model */
    getModelCache(listId: string): ModelCache {
        entityCache[listId] = entityCache[listId] || new ModelCache();
        return entityCache[listId];
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
     * @param {object} [targetCache] Optionally pass in a secondary cache to add a reference to this entity.
     */
    registerEntity<T extends ListItem<any>>(entity: T, targetCache?: IndexedCache<T>): T {
        let model = entity.getModel();
        let entityContainer = this.getEntityContainer(model.getListId(), entity.id);
        /** Maintain a single object in cache for this entity */
        if (!_.isObject(entityContainer.entity)) {
            /** Entity isn't currently in the cache */
            entityContainer.entity = entity;
        } else {
            /** Already exists so update to maintain any other references being used for this entity. */
            // TODO Look at performance hit from extending and see if it would be acceptable just to replace
            _.assign(entityContainer.entity, entity);
        }

        /** Counter to keep track of the number of updates for this entity */
        entityContainer.updateCount++;

        if (_.isObject(targetCache) && !_.isArray(targetCache) && !targetCache[entity.id]) {
            /** Entity hasn't been added to the target cache yet */
            targetCache[entity.id] = entityContainer.entity;
        }

        /** Resolve any requests for this entity */
        entityContainer.associationQueue.forEach(deferredRequest => {
            deferredRequest.resolve(entityContainer.entity);
            /** Remove request from queue */
            entityContainer.associationQueue.shift();
        });

        return entityContainer.entity;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apCacheService:registerModel
     * @methodOf angularPoint.apCacheService
     * @description
     * Creates a new ModelCache for the provide model where all list items will be stored with the key equaling
     * the entity id's and value being a EntityContainer.  The entity is stored at EntityContainer.entity.
     * @param {object} model Model to create the cache for.
     */
    registerModel(model: Model): void {
        if (model.list && model.getListId()) {
            let listId = model.getListId();

            /** Store a reference to the model by list guid */
            listsMappedByListId[listId] = {
                model: model,
            };
        }
    }

    /**
     * @ngdoc function
     * @name angularPoint.apCacheService:removeEntityById
     * @methodOf angularPoint.apCacheService
     * @description
     * Removes the entity from the local entity cache.
     * @param {string} listId GUID for list the list item belongs to.
     * @param {number} entityId The entity.id.
     */
    removeEntityById(listId: string, entityId: number): void {
        let modelCache = this.getModelCache(listId);
        if (modelCache[entityId]) {
            delete modelCache[entityId];
        }
    }
}
