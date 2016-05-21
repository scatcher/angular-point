import { ListService } from "../factories";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
/**
 * @description Stores list names when a new model is registered along with the GUID to allow us to
 *     retrieve the GUID in future
 * @example
 * <pre>
 *     listNameToIdMap = {
 *          list1Name: {
 *              model: list1Model,
 *              listId: list1GUID
 *          },
 *          list2Name: {
 *              model: list2Model,
 *              listId: list2GUID
 *          }
 *          ...
 *     }
 * </pre>
 */
declare let listNameToIdMap: {
    [key: string]: {
        model: ListService<any>;
        listId: string;
    };
};
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
declare let listsMappedByListId: {
    [key: string]: {
        model: ListService<any>;
    };
};
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
declare let modelBehaviorSubject: BehaviorSubject<any>;
export { listNameToIdMap, listsMappedByListId, modelBehaviorSubject, getListId, getListIdFromListName, getListService, registerListService };
/**
 * @ngdoc function
 * @name angularPoint.apCacheService:getListId
 * @methodOf angularPoint.apCacheService
 * @description
 * Allows us to use either the List Name or the list GUID and returns the lowercase GUID
 * @param {string} keyString List GUID or name.
 * @returns {string} Lowercase list GUID.
 */
declare function getListId(keyString: string): string;
/**
 * @ngdoc function
 * @name angularPoint.apCacheService:getListIdFromListName
 * @methodOf angularPoint.apCacheService
 * @description
 * Allows us to lookup an entity cache using the name of the list instead of the GUID.
 * @param {string} name The name of the list.
 * @returns {string} GUID for the list.
 */
declare function getListIdFromListName(name: string): string;
/**
 * @ngdoc function
 * @name angularPoint.apCacheService:getListService
 * @methodOf angularPoint.apCacheService
 * @description
 * Allows us to retrieve a reference to a given model by either the list title or list GUID.
 * @param {string} listId List title or list GUID.
 * @returns {object} A reference to the requested model.
 */
declare function getListService(listId: string): ListService<any>;
/**
 * @ngdoc function
 * @name angularPoint.apCacheService:registerModel
 * @methodOf angularPoint.apCacheService
 * @description
 * Creates a new ModelCache for the provide model where all list items will be stored with the key equaling
 * the entity id's and value being a EntityContainer.  The entity is stored at EntityContainer.entity.
 * @param {ListService<any>} listService ListService to create the cache for.
 */
declare function registerListService(listService: ListService<any>): void;
