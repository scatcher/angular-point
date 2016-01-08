import {ListItem} from '../factories';
import {CacheService} from '../services';
import {Promise} from 'es6-promise';

/**
 * @name EntityCache
 * @description
 * Cache constructor that maintains a queue of all requests for a list item, counter for the number of times
 * the cache has been updated, timestamp of last update, and add/update/remove functionality.
 * @constructor apCacheService
 * @param {string} listId GUID for list the list item belongs to.
 * @param {number} entityId The entity.id.
 */
export class EntityContainer<T extends ListItem<any>> {
    associationQueue: Function[] = [];
    entity: T;
    entityId: number;
    listId: string;
    updateCount = 0;

    constructor(listId: string, entityId: number) {
        this.entityId = entityId;
        this.listId = CacheService.getListId(listId);
    }

    /**
     * @name EntityContainer.getEntity
     * @description
     * Promise which returns the requested entity once it has been registered in the cache.
     */
    getEntity(): Promise<ListItem<T>> {
        let promise: Promise<ListItem<T>>;
        if (this.entity) {
            /** Entity already exists so resolve immediately */
            promise = Promise.resolve(this.entity);
        } else {
            /** Add resolve to the queue to be resolved once entity is registered */
            promise = new Promise((resolve) => this.associationQueue.push(resolve));
        }
        return promise;
    }

    removeEntity() {
        CacheService.removeEntityById(this.listId, this.entityId);
    }

}
