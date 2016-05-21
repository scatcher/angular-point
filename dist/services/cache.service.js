"use strict";
var utility_service_1 = require("./utility.service");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
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
var listNameToIdMap = {};
exports.listNameToIdMap = listNameToIdMap;
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
var listsMappedByListId = {};
exports.listsMappedByListId = listsMappedByListId;
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
var modelBehaviorSubject = new BehaviorSubject_1.BehaviorSubject(undefined);
exports.modelBehaviorSubject = modelBehaviorSubject;
/**
 * @ngdoc function
 * @name angularPoint.apCacheService:getListId
 * @methodOf angularPoint.apCacheService
 * @description
 * Allows us to use either the List Name or the list GUID and returns the lowercase GUID
 * @param {string} keyString List GUID or name.
 * @returns {string} Lowercase list GUID.
 */
function getListId(keyString) {
    if (utility_service_1.isGuid(keyString)) {
        /** GUID */
        return keyString.toLowerCase();
    }
    else {
        /** List Title */
        return getListIdFromListName(keyString);
    }
}
exports.getListId = getListId;
/**
 * @ngdoc function
 * @name angularPoint.apCacheService:getListIdFromListName
 * @methodOf angularPoint.apCacheService
 * @description
 * Allows us to lookup an entity cache using the name of the list instead of the GUID.
 * @param {string} name The name of the list.
 * @returns {string} GUID for the list.
 */
function getListIdFromListName(name) {
    var guid;
    if (listNameToIdMap[name] && listNameToIdMap[name].listId) {
        guid = listNameToIdMap[name].listId;
    }
    return guid;
}
exports.getListIdFromListName = getListIdFromListName;
/**
 * @ngdoc function
 * @name angularPoint.apCacheService:getListService
 * @methodOf angularPoint.apCacheService
 * @description
 * Allows us to retrieve a reference to a given model by either the list title or list GUID.
 * @param {string} listId List title or list GUID.
 * @returns {object} A reference to the requested model.
 */
function getListService(listId) {
    var model, entityTypeKey = getListId(listId);
    if (listsMappedByListId[entityTypeKey]) {
        model = listsMappedByListId[entityTypeKey].model;
    }
    return model;
}
exports.getListService = getListService;
/**
 * @ngdoc function
 * @name angularPoint.apCacheService:registerModel
 * @methodOf angularPoint.apCacheService
 * @description
 * Creates a new ModelCache for the provide model where all list items will be stored with the key equaling
 * the entity id's and value being a EntityContainer.  The entity is stored at EntityContainer.entity.
 * @param {ListService<any>} listService ListService to create the cache for.
 */
function registerListService(listService) {
    if (listService.getListId() && listService.title) {
        var listId = listService.getListId().toLowerCase();
        /** Store a reference to the model by list title */
        listNameToIdMap[listService.title] = {
            model: listService,
            listId: listId
        };
        /** Store a reference to the model by list guid */
        listsMappedByListId[listId] = {
            model: listService
        };
        modelBehaviorSubject.next(listService);
    }
}
exports.registerListService = registerListService;
//# sourceMappingURL=cache.service.js.map