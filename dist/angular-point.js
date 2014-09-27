'use strict';

//TODO: Remove dependency on toastr
/** Check to see if dependent modules exist */
try {
    angular.module('toastr');
}
catch (e) {
    /** Toastr wasn't found so redirect all toastr requests to $log */
    angular.module('toastr', [])
        .factory('toastr', ["$log", function ($log) {
            return {
                error: $log.error,
                info: $log.info,
                success: $log.info,
                warning: $log.warn
            };
        }]);
}
/**
 * @ngdoc overview
 * @module
 * @name angularPoint
 * @description
 * This is the primary angularPoint module and needs to be listed in your app.js dependencies to gain use of AngularPoint
 * functionality in your project.
 * @installModule
 */
angular.module('angularPoint', [
    'toastr'
]);
;angular.module('angularPoint')
    .config(["apConfig", function (apConfig) {

        /** Add a convenience flag, inverse of offline */
        apConfig.online = !apConfig.offline;
    }]);
;//  apWebServiceOperationConstants.OpName = [WebService, needs_SOAPAction];
//      OpName              The name of the Web Service operation -> These names are unique
//      WebService          The name of the WebService this operation belongs to
//      needs_SOAPAction    Boolean indicating whether the operation needs to have the SOAPAction passed in the setRequestHeaderfunction.
//                          true if the operation does a write, else false
angular.module('angularPoint')
    .constant('apWebServiceOperationConstants', {
        "GetAlerts": ["Alerts", false],
        "DeleteAlerts": ["Alerts", true],
        "Mode": ["Authentication", false],
        "Login": ["Authentication", false],
        "CopyIntoItems": ["Copy", true],
        "CopyIntoItemsLocal": ["Copy", true],
        "GetItem": ["Copy", false],
        "GetForm": ["Forms", false],
        "GetFormCollection": ["Forms", false],
        "AddAttachment": ["Lists", true],
        "AddDiscussionBoardItem": ["Lists", true],
        "AddList": ["Lists", true],
        "AddListFromFeature": ["Lists", true],
        "ApplyContentTypeToList": ["Lists", true],
        "CheckInFile": ["Lists", true],
        "CheckOutFile": ["Lists", true],
        "CreateContentType": ["Webs", true],
        "DeleteAttachment": ["Lists", true],
        "DeleteContentType": ["Lists", true],
        "DeleteContentTypeXmlDocument": ["Lists", true],
        "DeleteList": ["Lists", true],
        "GetAttachmentCollection": ["Lists", false],
        "GetList": ["Lists", false],
        "GetListAndView": ["Lists", false],
        "GetListCollection": ["Lists", false],
        "GetListContentType": ["Lists", false],
        "GetListContentTypes": ["Lists", false],
        "GetListItemChanges": ["Lists", false],
        "GetListItemChangesSinceToken": ["Lists", false],
        "GetListItems": ["Lists", false],
        "GetVersionCollection": ["Lists", false],
        "UndoCheckOut": ["Lists", true],
        "UpdateContentType": ["Webs", true],
        "UpdateContentTypesXmlDocument": ["Lists", true],
        "UpdateContentTypeXmlDocument": ["Lists", true],
        "UpdateList": ["Lists", true],
        "UpdateListItems": ["Lists", true],
        "AddMeeting": ["Meetings", true],
        "CreateWorkspace": ["Meetings", true],
        "RemoveMeeting": ["Meetings", true],
        "SetWorkSpaceTitle": ["Meetings", true],
        "ResolvePrincipals": ["People", false],
        "SearchPrincipals": ["People", false],
        "AddPermission": ["Permissions", true],
        "AddPermissionCollection": ["Permissions", true],
        "GetPermissionCollection": ["Permissions", true],
        "RemovePermission": ["Permissions", true],
        "RemovePermissionCollection": ["Permissions", true],
        "UpdatePermission": ["Permissions", true],
        "GetLinks": ["PublishedLinksService", true],
        "GetPortalSearchInfo": ["Search", false],
        "GetQuerySuggestions": ["Search", false],
        "GetSearchMetadata": ["Search", false],
        "Query": ["Search", false],
        "QueryEx": ["Search", false],
        "Registration": ["Search", false],
        "Status": ["Search", false],
        "SendClientScriptErrorReport": ["SharePointDiagnostics", true],
        "GetAttachments": ["SiteData", false],
        "EnumerateFolder": ["SiteData", false],
        "SiteDataGetList": ["SiteData", false],
        "SiteDataGetListCollection": ["SiteData", false],
        "SiteDataGetSite": ["SiteData", false],
        "SiteDataGetSiteUrl": ["SiteData", false],
        "SiteDataGetWeb": ["SiteData", false],
        "CreateWeb": ["Sites", true],
        "DeleteWeb": ["Sites", true],
        "GetSite": ["Sites", false],
        "GetSiteTemplates": ["Sites", false],
        "AddComment": ["SocialDataService", true],
        "AddTag": ["SocialDataService", true],
        "AddTagByKeyword": ["SocialDataService", true],
        "CountCommentsOfUser": ["SocialDataService", false],
        "CountCommentsOfUserOnUrl": ["SocialDataService", false],
        "CountCommentsOnUrl": ["SocialDataService", false],
        "CountRatingsOnUrl": ["SocialDataService", false],
        "CountTagsOfUser": ["SocialDataService", false],
        "DeleteComment": ["SocialDataService", true],
        "DeleteRating": ["SocialDataService", true],
        "DeleteTag": ["SocialDataService", true],
        "DeleteTagByKeyword": ["SocialDataService", true],
        "DeleteTags": ["SocialDataService", true],
        "GetAllTagTerms": ["SocialDataService", false],
        "GetAllTagTermsForUrlFolder": ["SocialDataService", false],
        "GetAllTagUrls": ["SocialDataService", false],
        "GetAllTagUrlsByKeyword": ["SocialDataService", false],
        "GetCommentsOfUser": ["SocialDataService", false],
        "GetCommentsOfUserOnUrl": ["SocialDataService", false],
        "GetCommentsOnUrl": ["SocialDataService", false],
        "GetRatingAverageOnUrl": ["SocialDataService", false],
        "GetRatingOfUserOnUrl": ["SocialDataService", false],
        "GetRatingOnUrl": ["SocialDataService", false],
        "GetRatingsOfUser": ["SocialDataService", false],
        "GetRatingsOnUrl": ["SocialDataService", false],
        "GetSocialDataForFullReplication": ["SocialDataService", false],
        "GetTags": ["SocialDataService", true],
        "GetTagsOfUser": ["SocialDataService", true],
        "GetTagTerms": ["SocialDataService", true],
        "GetTagTermsOfUser": ["SocialDataService", true],
        "GetTagTermsOnUrl": ["SocialDataService", true],
        "GetTagUrlsOfUser": ["SocialDataService", true],
        "GetTagUrlsOfUserByKeyword": ["SocialDataService", true],
        "GetTagUrls": ["SocialDataService", true],
        "GetTagUrlsByKeyword": ["SocialDataService", true],
        "SetRating": ["SocialDataService", true],
        "UpdateComment": ["SocialDataService", true],
        "SpellCheck": ["SpellCheck", false],
        "AddTerms": ["TaxonomyClientService", true],
        "GetChildTermsInTerm": ["TaxonomyClientService", false],
        "GetChildTermsInTermSet": ["TaxonomyClientService", false],
        "GetKeywordTermsByGuids": ["TaxonomyClientService", false],
        "GetTermsByLabel": ["TaxonomyClientService", false],
        "GetTermSets": ["TaxonomyClientService", false],
        "AddGroup": ["usergroup", true],
        "AddGroupToRole": ["usergroup", true],
        "AddRole": ["usergroup", true],
        "AddRoleDef": ["usergroup", true],
        "AddUserCollectionToGroup": ["usergroup", true],
        "AddUserCollectionToRole": ["usergroup", true],
        "AddUserToGroup": ["usergroup", true],
        "AddUserToRole": ["usergroup", true],
        "GetAllUserCollectionFromWeb": ["usergroup", false],
        "GetGroupCollection": ["usergroup", false],
        "GetGroupCollectionFromRole": ["usergroup", false],
        "GetGroupCollectionFromSite": ["usergroup", false],
        "GetGroupCollectionFromUser": ["usergroup", false],
        "GetGroupCollectionFromWeb": ["usergroup", false],
        "GetGroupInfo": ["usergroup", false],
        "GetRoleCollection": ["usergroup", false],
        "GetRoleCollectionFromGroup": ["usergroup", false],
        "GetRoleCollectionFromUser": ["usergroup", false],
        "GetRoleCollectionFromWeb": ["usergroup", false],
        "GetRoleInfo": ["usergroup", false],
        "GetRolesAndPermissionsForCurrentUser": ["usergroup", false],
        "GetRolesAndPermissionsForSite": ["usergroup", false],
        "GetUserCollection": ["usergroup", false],
        "GetUserCollectionFromGroup": ["usergroup", false],
        "GetUserCollectionFromRole": ["usergroup", false],
        "GetUserCollectionFromSite": ["usergroup", false],
        "GetUserCollectionFromWeb": ["usergroup", false],
        "GetUserInfo": ["usergroup", false],
        "GetUserLoginFromEmail": ["usergroup", false],
        "RemoveGroup": ["usergroup", true],
        "RemoveGroupFromRole": ["usergroup", true],
        "RemoveRole": ["usergroup", true],
        "RemoveUserCollectionFromGroup": ["usergroup", true],
        "RemoveUserCollectionFromRole": ["usergroup", true],
        "RemoveUserCollectionFromSite": ["usergroup", true],
        "RemoveUserFromGroup": ["usergroup", true],
        "RemoveUserFromRole": ["usergroup", true],
        "RemoveUserFromSite": ["usergroup", true],
        "RemoveUserFromWeb": ["usergroup", true],
        "UpdateGroupInfo": ["usergroup", true],
        "UpdateRoleDefInfo": ["usergroup", true],
        "UpdateRoleInfo": ["usergroup", true],
        "UpdateUserInfo": ["usergroup", true],
        "AddColleague": ["UserProfileService", true],
        "AddLink": ["UserProfileService", true],
        "AddMembership": ["UserProfileService", true],
        "AddPinnedLink": ["UserProfileService", true],
        "CreateMemberGroup": ["UserProfileService", true],
        "CreateUserProfileByAccountName": ["UserProfileService", true],
        "GetCommonColleagues": ["UserProfileService", false],
        "GetCommonManager": ["UserProfileService", false],
        "GetCommonMemberships": ["UserProfileService", false],
        "GetInCommon": ["UserProfileService", false],
        "GetPropertyChoiceList": ["UserProfileService", false],
        "GetUserColleagues": ["UserProfileService", false],
        "GetUserLinks": ["UserProfileService", false],
        "GetUserMemberships": ["UserProfileService", false],
        "GetUserPinnedLinks": ["UserProfileService", false],
        "GetUserProfileByGuid": ["UserProfileService", false],
        "GetUserProfileByIndex": ["UserProfileService", false],
        "GetUserProfileByName": ["UserProfileService", false],
        "GetUserProfileCount": ["UserProfileService", false],
        "GetUserProfileSchema": ["UserProfileService", false],
        "GetUserPropertyByAccountName": ["UserProfileService", false],
        "ModifyUserPropertyByAccountName": ["UserProfileService", true],
        "RemoveAllColleagues": ["UserProfileService", true],
        "RemoveAllLinks": ["UserProfileService", true],
        "RemoveAllMemberships": ["UserProfileService", true],
        "RemoveAllPinnedLinks": ["UserProfileService", true],
        "RemoveColleague": ["UserProfileService", true],
        "RemoveLink": ["UserProfileService", true],
        "RemoveMembership": ["UserProfileService", true],
        "RemovePinnedLink": ["UserProfileService", true],
        "UpdateColleaguePrivacy": ["UserProfileService", true],
        "UpdateLink": ["UserProfileService", true],
        "UpdateMembershipPrivacy": ["UserProfileService", true],
        "UpdatePinnedLink": ["UserProfileService", true],
        "DeleteAllVersions": ["Versions", true],
        "DeleteVersion": ["Versions", true],
        "GetVersions": ["Versions", false],
        "RestoreVersion": ["Versions", true],
        "AddView": ["Views", true],
        "DeleteView": ["Views", true],
        "GetView": ["Views", false],
        "GetViewHtml": ["Views", false],
        "GetViewCollection": ["Views", false],
        "UpdateView": ["Views", true],
        "UpdateViewHtml": ["Views", true],
        "AddWebPart": ["WebPartPages", true],
        "AddWebPartToZone": ["WebPartPages", true],
        "GetWebPart2": ["WebPartPages", false],
        "GetWebPartPage": ["WebPartPages", false],
        "GetWebPartProperties": ["WebPartPages", false],
        "GetWebPartProperties2": ["WebPartPages", false],
        "GetColumns": ["Webs", false],
        "GetContentType": ["Webs", false],
        "GetContentTypes": ["Webs", false],
        "GetCustomizedPageStatus": ["Webs", false],
        "GetListTemplates": ["Webs", false],
        "GetObjectIdFromUrl": ["Webs", false],
        "GetWeb": ["Webs", false],
        "GetWebCollection": ["Webs", false],
        "GetAllSubWebCollection": ["Webs", false],
        "UpdateColumns": ["Webs", true],
        "WebUrlFromPageUrl": ["Webs", false],
        "AlterToDo": ["Workflow", true],
        "ClaimReleaseTask": ["Workflow", true],
        "GetTemplatesForItem": ["Workflow", false],
        "GetToDosForItem": ["Workflow", false],
        "GetWorkflowDataForItem": ["Workflow", false],
        "GetWorkflowTaskData": ["Workflow", false],
        "StartWorkflow": ["Workflow", true]
    });
;/**
 * Provides a way to inject vendor libraries that otherwise are globals.
 * This improves code testability by allowing you to more easily know what
 * the dependencies of your components are (avoids leaky abstractions).
 * It also allows you to mock these dependencies, where it makes sense.
 */
angular.module('angularPoint')
/** lodash */
    .constant('_', _)
    //.constant('SPServices', $().SPServices)

/**
 * @ngdoc object
 * @name angularPoint.apConfig
 * @description
 * Basic config for the application (unique for each environment).  Update to change for your environment.
 *
 * @param {string} appTitle Name of the application in case you need to reference.
 * @param {boolean} debug Determines if we should show debug code.
 * @param {string} defaultUrl Automatically sets the defaultUrl for web service calls so we don't need to make the
 * initial blocking call by SPServices.
 * @param {string} [defaultQueryName='primary'] The name that a query is registered with on a model if a name isn't specified.
 * @param {string} [firebaseUrl] Necessary if you're using apSyncService.  Look there for more details.
 * @param {boolean} [offline] Automatically set based on the URL of the site.  Pulls offline XML when hosted locally.
 * @param {string} [offlineXML='dev/'] The location to look for offline xml files.
 * @example
 * <h4>Default Configuration</h4>
 * <pre>
 * .constant('apConfig', {
 *     appTitle: 'Angular-Point',
 *     debugEnabled: true,
 *     firebaseURL: "The optional url of your firebase source",
 *     offline: window.location.href.indexOf('localhost') > -1 ||
 *         window.location.href.indexOf('http://0.') > -1 ||
 *         window.location.href.indexOf('http://10.') > -1 ||
 *         window.location.href.indexOf('http://192.') > -1
 * })
 * </pre>
 *
 * <h4>To Override</h4>
 * <pre>
 * angular.module('MyApp', ['my dependencies'])
 *      .config(function ($stateProvider, $urlRouterProvider) {
 *          //My routes
 *      })
 *      .run(function(apConfig) {
 *          //To set the default site root
 *          apConfig.defaultUrl =
 *            '//sharepoint.myserver.com/siteRoot';
 *
 *          //To set the default location to look for
 *          //offline xml files.
 *          apConfig.offlineXML = 'myCachedQueries/';
 *      });
 * </pre>
 */
    .constant('apConfig', {
        appTitle: 'Angular-Point',
        debug: false,
        defaultQueryName: 'primary',
        defaultUrl: '',
        environment: 'production',
        firebaseURL: "The optional url of your firebase source",
        offline: window.location.href.indexOf('localhost') > -1 ||
        window.location.href.indexOf('http://0.') > -1 ||
        window.location.href.indexOf('http://10.') > -1 ||
        window.location.href.indexOf('http://192.') > -1,
        offlineXML: 'dev/'
    });
;'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apCacheService
 * @description
 * Stores a reference for all list items based on list GUID and list item id.  Allows us to then register promises that
 * resolve once a requested list item is registered in the future.
 */
angular.module('angularPoint')
    .service('apCacheService', ["$q", "$log", "_", "apIndexedCacheFactory", function ($q, $log, _, apIndexedCacheFactory) {
        /**
         * @description Stores list names when a new model is registered along with the GUID to allow us to retrieve the
         * GUID in future
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
        var listNameToIdMap = {},

            /**
             * @description Stores list GUID when a new model is registered with a reference to the model for future reference.
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
            listsMappedByListId = {},
            /**
             * @description The Main cache object which stores ModelCache objects.  Keys being the model GUID and value
             * being an a ModelCache object
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
            entityCache = {};

        /**
         * @name ModelCache
         * @description
         * Cache of Entity Containers for each registered entity retrieved by the model.
         * @constructor
         */
        function ModelCache() {
        }

        ModelCache.prototype = apIndexedCacheFactory.create();

        /** Make sure to properly set the appropriate constructor instead of using the one inherited from IndexedCache*/
        ModelCache.constructor = ModelCache;


        /**
         * @name EntityCache
         * @description
         * Cache constructor that maintains a queue of all requests for a list item, counter for the number of times
         * the cache has been updated, timestamp of last update, and add/update/remove functionality.
         * @constructor apCacheService
         * @param {string} listId GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         */
        function EntityContainer(listId, entityId) {
            var self = this;
            self.associationQueue = [];
            self.updateCount = 0;
            self.listId = getListId(listId);
            self.entityId = entityId;
            self.entityLocations = [];
        }

        EntityContainer.prototype = {
            getEntity: _getEntity,
            removeEntity: _removeEntity
        };


        return {
            deleteEntity: deleteEntity,
            entityCache: entityCache,
            getCachedEntity: getCachedEntity,
            getCachedEntities: getCachedEntities,
            getEntity: getEntity,
            getEntityContainer: getEntityContainer,
            getListIdFromListName: getListIdFromListName,
            getListId: getListId,
            getModel: getModel,
            removeEntity: removeEntity,
            registerEntity: registerEntity,
            registerModel: registerModel
        };


        /********************* Private **************************/


        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:registerModel
         * @methodOf angularPoint.apCacheService
         * @description
         * Creates a new ModelCache for the provide model where all list items will be stored with the key equaling
         * the entity id's and value being a EntityContainer.  The entity is stored at EntityContainer.entity.
         * @param {object} model Model to create the cache for.
         */
        function registerModel(model) {
            if (model.list && model.list.getListId() && model.list.title) {
                var listId = model.list.getListId().toLowerCase();
                /** Store a reference to the model by list title */
                listNameToIdMap[model.list.title] = {
                    model: model,
                    listId: listId
                };

                /** Store a reference to the model by list guid */
                listsMappedByListId[listId] = {
                    model: model
                };
            }
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
        function getModel(listId) {
            var model,
                entityTypeKey = getListId(listId);

            if (listsMappedByListId[entityTypeKey]) {
                model = listsMappedByListId[entityTypeKey].model;
            }
            return model;
        }

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
            if (_.isGuid(keyString)) {
                /** GUID */
                return keyString.toLowerCase();
            } else {
                /** List Title */
                return getListIdFromListName(keyString);
            }
        }


        /**
         * @name EntityContainer.getEntity
         * @description
         * Promise which returns the requested entity once it has been registered in the cache.
         */
        function _getEntity() {
            var entityContainer = this;
            var deferred = $q.defer();
            if (entityContainer.entity) {
                /** Entity already exists so resolve immediately */
                deferred.resolve(entityContainer.entity);
            } else {
                entityContainer.associationQueue.push(deferred);
            }
            return deferred.promise;
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
        function getCachedEntity(listId, entityId) {
            return getEntityContainer(listId, entityId).entity;
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
        function getCachedEntities(listId) {
            var modelCache = getModelCache(listId),
                allEntities = apIndexedCacheFactory.create();
            _.each(modelCache, function (entityContainer) {
                if (entityContainer.entity && entityContainer.entity.id) {
                    allEntities.addEntity(entityContainer.entity);
                }
            });
            return allEntities;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:getEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Returns a deferred object that resolves with the requested entity immediately if already present or at some
         * point in the future assuming the entity is eventually registered.
         * @param {string} listId GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         * @returns {promise} entity
         */
        function getEntity(listId, entityId) {
            var entityContainer = getEntityContainer(listId, entityId);
            return entityContainer.getEntity();
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
        function registerEntity(entity, targetCache) {
            var model = entity.getModel();
            var entityContainer = getEntityContainer(model.list.getListId(), entity.id);
            /** Maintain a single object in cache for this entity */
            if (!_.isObject(entityContainer.entity)) {
                /** Entity isn't currently in the cache */
                entityContainer.entity = entity;
            } else {
                /** Already exists so update to maintain any other references being used for this entity. */
                    //TODO Look at performance hit from extending and see if it would be acceptable just to replace
                _.extend(entityContainer.entity, entity);
            }

            /** Counter to keep track of the number of updates for this entity */
            entityContainer.updateCount++;
            if (_.isObject(targetCache) && !_.isArray(targetCache)) {
                /** Entity hasn't been added to the target cache yet */
                targetCache[entity.id] = entity;
            }


            /** Resolve any requests for this entity */
            _.each(entityContainer.associationQueue, function (deferredRequest) {
                deferredRequest.resolve(entity);
                /** Remove request from queue */
                entityContainer.associationQueue.shift();
            });
            return entityContainer.entity;
        }


        function _removeEntity() {
            var entityContainer = this;
            removeEntity(entityContainer.listId, entityContainer.entityId);
        }

        /**
         * @ngdoc function
         * @name angularPoint.apCacheService:removeEntity
         * @methodOf angularPoint.apCacheService
         * @description
         * Removes the entity from the local entity cache.
         * @param {string} listId GUID for list the list item belongs to.
         * @param {number} entityId The entity.id.
         */
        function removeEntity(listId, entityId) {
            var modelCache = getModelCache(listId, entityId);
            if (modelCache[entityId]) {
                delete modelCache[entityId];
            }
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
        function deleteEntity(listId, entityId) {
            var entityTypeKey = getListId(listId);
            removeEntity(entityTypeKey, entityId);
            var model = getModel(entityTypeKey);
            _.each(model.queries, function (query) {
                var cache = query.getCache();
                cache.removeEntity(entityId);
            });
        }

        /** Locates the stored cache for a model */
        function getModelCache(listId) {
            var entityTypeKey = getListId(listId);
            entityCache[entityTypeKey] = entityCache[entityTypeKey] || new ModelCache();
            return entityCache[entityTypeKey];
        }

        function getEntityContainer(listId, entityId) {
            var entityTypeKey = getListId(listId);
            var modelCache = getModelCache(entityTypeKey);
            /** Create the object structure if it doesn't already exist */
            modelCache[entityId] = modelCache[entityId] || new EntityContainer(entityTypeKey, entityId);
            return modelCache[entityId];
        }
    }]);
;'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apDataService
 * @description
 * Handles all interaction with SharePoint's SOAP web services.  Mostly a wrapper for SPServices functionality.
 *
 * For additional information on many of these web service calls, see Marc Anderson's
 * [SPServices](http://spservices.codeplex.com/documentation) documentation.
 *
 *
 // *  @requires apQueueService
 // *  @requires apConfig
 // *  @requires apUtilityService
 // *  @requires apFieldService
 */
angular.module('angularPoint')
    .service('apDataService', ["$q", "$timeout", "$http", "_", "apQueueService", "apConfig", "apUtilityService", "apCacheService", "apDecodeService", "apEncodeService", "apFieldService", "apIndexedCacheFactory", "toastr", "SPServices", "apWebServiceOperationConstants", "apXMLToJSONService", function ($q, $timeout, $http, _, apQueueService, apConfig, apUtilityService,
                                        apCacheService, apDecodeService, apEncodeService, apFieldService,
                                        apIndexedCacheFactory, toastr, SPServices,
                                        apWebServiceOperationConstants, apXMLToJSONService) {

        /** Exposed functionality */
        var apDataService = {
            createListItem: createListItem,
            deleteAttachment: deleteAttachment,
            deleteListItem: deleteListItem,
            executeQuery: executeQuery,
            generateWebServiceUrl: generateWebServiceUrl,
            getCollection: getCollection,
            getCurrentSite: getCurrentSite,
            getFieldVersionHistory: getFieldVersionHistory,
            getGroupCollectionFromUser: getGroupCollectionFromUser,
            getList: getList,
            getListFields: getListFields,
            getListItemById: getListItemById,
            getUserProfileByName: getUserProfileByName,
            //getView: getView,
            processChangeTokenXML: processChangeTokenXML,
            processDeletionsSinceToken: processDeletionsSinceToken,
            requestData: requestData,
            retrieveChangeToken: retrieveChangeToken,
            retrievePermMask: retrievePermMask,
            serviceWrapper: serviceWrapper,
            updateListItem: updateListItem
        };

        return apDataService;

        /*********************** Private ****************************/

        /**
         * @ngdoc function
         * @name apDataService.requestData
         * @description
         * The primary function that handles all communication with the server.  This is very low level and isn't
         * intended to be called directly.
         * @param {object} opts Payload object containing the details of the request.
         * @returns {promise} Promise that resolves with the server response.
         */
        function requestData(opts) {
            var deferred = $q.defer();

            var soapData = SPServices.generateXMLComponents(opts);
            var service = apWebServiceOperationConstants[opts.operation][0];
            generateWebServiceUrl(service, opts.webURL)
                .then(function (url) {
                    $http({
                        method: 'POST',
                        url: url,
                        data: soapData.msg,
                        responseType: "document",
                        headers: {
                            "Content-Type": "text/xml;charset='utf-8'"
                        },
                        transformRequest: function (data, headersGetter) {
                            if (soapData.SOAPAction) {
                                var headers = headersGetter();
                                headers["SOAPAction"] = soapData.SOAPAction;
                            }
                            return data;
                        },
                        transformResponse: function (data, headersGetter) {
                            if (_.isString(data)) {
                                data = $.parseXML(data);
                            }
                            return data;
                        }
                    }).then(function (response) {
                        /** Success */
                        /** Errors can still be resolved without throwing an error so check the XML */
                        var error = apDecodeService.checkResponseForErrors(response.data);
                        if (error) {
                            console.error(error, opts);
                            deferred.reject(error);
                        } else {
                            deferred.resolve(response.data);
                        }
                    }, function (response) {
                        /** Failure */
                        var error = apDecodeService.checkResponseForErrors(response.data);
                        console.error(response.statusText, opts);
                        deferred.reject(response.statusText + ': ' + error);
                    });
                });

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name apDataService.serviceWrapper
         * @description
         * Generic wrapper for any SPServices web service call.  The big benefit to this function is it allows us
         * to continue to use the $q promise model throughout the application instead of using the promise
         * implementation used in SPServices so we have a more consistent experience.
         * Check http://spservices.codeplex.com/documentation for details on expected parameters for each operation.
         *
         * @param {object} options Payload params that is directly passed to SPServices.
         * @param {string} [options.webURL] XML filter string used to find the elements to iterate over.
         * @param {string} [options.filterNode] XML filter string used to find the elements to iterate over.
         * This is typically 'z:row' for list items.
         * @returns {object} Returns a promise which when resolved either returns clean objects parsed by the value
         * in options.filterNode or the raw XML response if a options.filterNode
         *
         *      If options.filterNode is provided, returns XML parsed by node name
         *      Otherwise returns the server response
         */
        function serviceWrapper(options) {
            var defaults = {
                postProcess: processXML,
                webURL: apConfig.defaultUrl
            };
            var opts = _.extend({}, defaults, options);
            var deferred = $q.defer();

            /** Convert the xml returned from the server into an array of js objects */
            function processXML(serverResponse) {
                if (opts.filterNode) {
                    var nodes = $(serverResponse).SPFilterNode(opts.filterNode);
                    return apXMLToJSONService(nodes, {includeAllAttrs: true, removeOws: false});
                } else {
                    return serverResponse;
                }
            }

            /** Display any async animations listening */
            apQueueService.increase();

            apDataService.requestData(opts)
                .then(function (response) {
                    /** Failure */
                    var data = opts.postProcess(response);
                    apQueueService.decrease();
                    deferred.resolve(data);
                }, function (response) {
                    /** Failure */
                    toastr.error('Failed to complete the requested ' + opts.operation + ' operation.');
                    apQueueService.decrease();
                    deferred.reject(response);
                });

            return deferred.promise;
        }


        /**
         * @ngdoc function
         * @name apDataService.getFieldVersionHistory
         * @description
         * Returns the version history for a field in a list item.
         * @param {object} options Configuration object passed to SPServices.
         * <pre>
         * var options = {
         *        operation: 'GetVersionCollection',
         *        webURL: apConfig.defaultUrl,
         *        strlistID: model.list.getListId(),
         *        strlistItemID: listItem.id,
         *        strFieldName: fieldDefinition.staticName
         *    };
         * </pre>
         * @param {object} fieldDefinition Field definition object from the model.
         * @returns {object[]} Promise which resolves with an array of list item changes for the specified field.
         */
        function getFieldVersionHistory(options, fieldDefinition) {
            var defaults = {
                operation: 'GetVersionCollection'
            };
            var opts = _.extend({}, defaults, options);

            var deferred = $q.defer();

            serviceWrapper(opts)
                .then(function (response) {
                    /** Parse XML response */
                    var versions = apDecodeService.parseFieldVersions(response, fieldDefinition);
                    /** Resolve with an array of all field versions */
                    deferred.resolve(versions);
                }, function (outcome) {
                    /** Failure */
                    toastr.error('Failed to fetch version history.');
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name apDataService.getCollection
         * @description
         * Used to handle any of the Get[filterNode]Collection calls to SharePoint
         *
         * @param {Object} options - object used to extend payload and needs to include all SPServices required attributes
         * @param {string} [options.operation] GetUserCollectionFromSite
         * @param {string} [options.operation] GetGroupCollectionFromSite
         * @param {string} [options.operation] GetGroupCollectionFromUser @requires options.userLoginName
         * @param {string} [options.operation] GetUserCollectionFromGroup @requires options.groupName
         * @param {string} [options.operation] GetListCollection
         * @param {string} [options.operation] GetViewCollection @requires options.listName
         * @param {string} [options.operation] GetAttachmentCollection @requires options.listName & options.ID
         * @param {string} [options.filterNode] - Value to iterate over in returned XML
         *         if not provided it's extracted from the name of the operation
         *         ex: Get[User]CollectionFromSite, "User" is used as the filterNode
         *
         * @returns {object[]} Promise which when resolved will contain an array of objects representing the
         * requested collection.
         *
         * @example
         * <pre>
         * apDataService.getCollection({
         *        operation: "GetGroupCollectionFromUser",
         *        userLoginName: $scope.state.selectedUser.LoginName
         *        }).then(function (response) {
         *            postProcessFunction(response);
         *       });
         * </pre>
         */
        function getCollection(options) {
            var defaults = {
                postProcess: processXML
            };
            var opts = _.extend({}, defaults, options);

            /** Determine the XML node to iterate over if filterNode isn't provided */
            var filterNode = opts.filterNode || opts.operation.split('Get')[1].split('Collection')[0];

            var deferred = $q.defer();

            /** Convert the xml returned from the server into an array of js objects */
            function processXML(serverResponse) {
                var convertedItems = [];
                /** Get attachments only returns the links associated with a list item */
                if (opts.operation === 'GetAttachmentCollection') {
                    /** Unlike other call, get attachments only returns strings instead of an object with attributes */
                    $(serverResponse).SPFilterNode(filterNode).each(function () {
                        convertedItems.push($(this).text());
                    });
                } else {
                    var nodes = $(serverResponse).SPFilterNode(filterNode);
                    convertedItems = apXMLToJSONService(nodes, {includeAllAttrs: true, removeOws: false});
                }
                return convertedItems;
            }

            var validPayload = validateCollectionPayload(opts);
            if (validPayload) {
                serviceWrapper(opts)
                    .then(function (response) {
                        deferred.resolve(response);
                    });
            } else {
                toastr.error('Invalid payload:', opts);
                deferred.reject();
            }

            return deferred.promise;
        }

        /**
         * @description
         * Simply verifies that all components of the payload are present.
         * @param {object} opts Payload config.
         * @returns {boolean} Collection is valid.
         */
        function validateCollectionPayload(opts) {
            var validPayload = true;
            var verifyParams = function (params) {
                _.each(params, function (param) {
                    if (!opts[param]) {
                        toastr.error('options' + param + ' is required to complete this operation');
                        validPayload = false;
                    }
                });
            };

            //Verify all required params are included
            switch (opts.operation) {
                case 'GetGroupCollectionFromUser':
                    verifyParams(['userLoginName']);
                    break;
                case 'GetUserCollectionFromGroup':
                    verifyParams(['groupName']);
                    break;
                case 'GetViewCollection':
                    verifyParams(['listName']);
                    break;
                case 'GetAttachmentCollection':
                    verifyParams(['listName', 'ID']);
                    break;
            }
            return validPayload;
        }

        /**
         * @ngdoc function
         * @name apDataService.getUserProfile
         * @description
         * Returns the profile for an optional user, but defaults the the current user if one isn't provided.
         * Pull user profile info and parse into a profile object
         * http://spservices.codeplex.com/wikipage?title=GetUserProfileByName
         * @param {string} [login=CurrentUser] Optional param of another user's login to return the profile for.
         * @returns {object} Promise which resolves with the requested user profile.
         */
        function getUserProfileByName(login) {
            var deferred = $q.defer();
            var payload = {
                operation: 'GetUserProfileByName'
            };
            if (login) {
                payload.accountName = login;
            }
            serviceWrapper(payload)
                .then(function (serverResponse) {
                    var userProfile = {};
                    //Not formatted like a normal SP response so need to manually parse
                    $(serverResponse).SPFilterNode('PropertyData').each(function () {
                        var nodeName = $(this).SPFilterNode('Name');
                        var nodeValue = $(this).SPFilterNode('Value');
                        if (nodeName.length > 0 && nodeValue.length > 0) {
                            userProfile[nodeName.text().trim()] = nodeValue.text().trim();
                        }
                    });
                    /** Optionally specify a necessary prefix that should appear before the user login */
                    userProfile.userLoginName = apConfig.userLoginNamePrefix ?
                        (apConfig.userLoginNamePrefix + userProfile.AccountName) : userProfile.AccountName;
                    deferred.resolve(userProfile);
                });
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name apDataService.getGroupCollectionFromUser
         * @description
         * Fetches an array of group names the user is a member of.  If no user is provided we use the current user.
         * @param {string} [login=CurrentUser] Optional param of another user's login to return the profile for.
         * @returns {string[]} Promise which resolves with the array of groups the user belongs to.
         */
        function getGroupCollectionFromUser(login) {
            /** Create a new deferred object if not already defined */
            var deferred = $q.defer();
            if (!login) {
                /** No login name provided so lookup profile for current user */
                getUserProfileByName()
                    .then(function (userProfile) {
                        getGroupCollection(userProfile.userLoginName);
                    });
            } else {
                getGroupCollection(login);
            }
            return deferred.promise;

            function getGroupCollection(userLoginName) {
                apDataService.serviceWrapper({
                    operation: 'GetGroupCollectionFromUser',
                    userLoginName: userLoginName,
                    filterNode: 'Group'
                }).then(function (groupCollection) {
                    deferred.resolve(groupCollection);
                });
            }
        }

        /**
         * @ngdoc function
         * @name apDataService.generateWebServiceUrl
         * @description
         * Builds the appropriate SharePoint resource URL.  If a URL isn't provided and it hasn't already been cached
         * we make a call to the server to find the root URL.  All future requests will then use this cached value.
         * @param {string} service The name of the service the SOAP operation is using.
         * @param {string} [webURL] Optionally provide the URL so we don't need to make a call to the server.
         * @returns {promise} Resolves with the url for the service.
         */
        function generateWebServiceUrl(service, webURL) {
            var ajaxURL = "_vti_bin/" + service + ".asmx",
                deferred = $q.defer();

            if (webURL) {
                ajaxURL = webURL.charAt(webURL.length - 1) === '/' ?
                webURL + ajaxURL : webURL + '/' + ajaxURL;
                deferred.resolve(ajaxURL);
            } else {
                getCurrentSite().then(function (thisSite) {
                    ajaxURL = thisSite + ((thisSite.charAt(thisSite.length - 1) === '/') ? ajaxURL : ('/' + ajaxURL));
                    deferred.resolve(ajaxURL);
                });
            }
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name apDataService.getCurrentSite
         * @description
         * Requests and caches the root url for the current site.  It caches the response so any future calls receive
         * the cached promise.
         * @returns {promise} Resolves with the current site root url.
         */
        function getCurrentSite() {
            var deferred = $q.defer();
            var self = getCurrentSite;
            if (!self.query) {
                /** We only want to run this once so cache the promise the first time and just reference it in the future */
                self.query = deferred.promise;

                var msg = SPServices.SOAPEnvelope.header +
                    "<WebUrlFromPageUrl xmlns='" + SPServices.SCHEMASharePoint + "/soap/' ><pageUrl>" +
                    ((location.href.indexOf("?") > 0) ? location.href.substr(0, location.href.indexOf("?")) : location.href) +
                    "</pageUrl></WebUrlFromPageUrl>" +
                    SPServices.SOAPEnvelope.footer;

                $http({
                    method: 'POST',
                    url: '/_vti_bin/Webs.asmx',
                    data: msg,
                    responseType: "document",
                    headers: {
                        "Content-Type": "text/xml;charset='utf-8'"
                    }
                }).then(function (response) {
                    /** Success */
                    apConfig.defaultUrl = $(response.data).find("WebUrlFromPageUrlResult").text();
                    deferred.resolve(apConfig.defaultUrl)
                }, function (response) {
                    /** Error */
                    var error = apDecodeService.checkResponseForErrors(response.data);
                    deferred.reject(error);
                });
            }
            return self.query;
        }

        /**
         * @ngdoc function
         * @name apDataService.getList
         * @description
         * Returns all list details including field and list config.
         * @param {object} options Configuration parameters.
         * @param {string} options.listName GUID of the list.
         * @returns {object} Promise which resolves with an array of field definitions for the list.
         */
        function getList(options) {
            var defaults = {
                operation: 'GetList'
            };

            var opts = _.extend({}, defaults, options);
            return serviceWrapper(opts);
        }


        /**
         * @ngdoc function
         * @name apDataService.getListFields
         * @description
         * Returns field definitions for a specified list.
         * @param {object} options Configuration parameters.
         * @param {string} options.listName GUID of the list.
         * @returns {object} Promise which resolves with an array of field definitions for the list.
         */
        function getListFields(options) {
            var deferred = $q.defer();
            getList(options)
                .then(function (responseXml) {
                    var nodes = $(responseXml).SPFilterNode('Field');
                    var fields = apXMLToJSONService(nodes, {includeAllAttrs: true, removeOws: false});
                    deferred.resolve(fields);
                });
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name apDataService.getListItemById
         * @description
         * Returns a single list item with the provided id.
         * @param {number} entityId Id of the item being requested.
         * @param {object} model Model this entity belongs to.
         * @param {object} options Configuration parameters.
         * @param {string} options.listName GUID of the list.
         * @returns {object} Promise which resolves with the requested entity if found.
         */
        function getListItemById(entityId, model, options) {
            var deferred = $q.defer();

            var defaults = {
                operation: 'GetListItems',
                CAMLRowLimit: 1,
                CAMLQuery: '' +
                '<Query>' +
                ' <Where>' +
                '   <Eq>' +
                '     <FieldRef Name="ID"/>' +
                '     <Value Type="Number">' + entityId + '</Value>' +
                '   </Eq>' +
                ' </Where>' +
                '</Query>',
                /** Create a temporary cache to store response */
                listName: model.list.getListId(),
                target: apIndexedCacheFactory.create()
            };

            var opts = _.extend({}, defaults, options);

            serviceWrapper(opts).then(function (responseXML) {
                var parsedEntities = apDecodeService.processListItems(model, null, responseXML, opts);

                /** Should return an indexed object with a single entity so just return that entity */
                deferred.resolve(parsedEntities.first());
            });

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name apDataService.deleteAttachment
         * @description
         * Deletes and attachment on a list item.  Most commonly used by ListItem.deleteAttachment which is shown
         * in the example.
         *
         * @param {object} options Configuration parameters.
         * @param {string} options.listItemId ID of the list item with the attachment.
         * @param {string} options.url Requires the URL for the attachment we want to delete.
         * @param {string} options.listName Best option is the GUID of the list.
         * <pre>'{37388A98-534C-4A28-BFFA-22429276897B}'</pre>
         *
         * @returns {object} Promise which resolves with the updated attachment collection.
         *
         * @example
         * <pre>
         * ListItem.prototype.deleteAttachment = function (url) {
         *    var listItem = this;
         *    return apDataService.deleteAttachment({
         *        listItemId: listItem.id,
         *        url: url,
         *        listName: listItem.getModel().list.getListId()
         *    });
         * };
         * </pre>
         */
        function deleteAttachment(options) {
            var defaults = {
                operation: 'DeleteAttachment',
                filterNode: 'Field'
            };

            var opts = _.extend({}, defaults, options);

            return serviceWrapper(opts);
        }

        /**
         * @ngdoc function
         * @name apDataService.executeQuery
         * @description
         * Primary method of retrieving list items from SharePoint.  Look at Query and Model for specifics.
         * @param {object} model Reference to the model where the Query resides.
         * @param {object} query Reference to the Query making the call.
         * @param {object} [options] Optional configuration parameters.
         * @param {Array} [options.target=model.getCache()] The target destination for returned entities
         * @param {string} [options.offlineXML=apConfig.offlineXML + model.list.title + '.xml'] Optionally include the location of
         * a custom offline XML file specifically for this query.
         * @returns {object} - Key value hash containing all list item id's as keys with the entity as the value.
         */
        function executeQuery(model, query, options) {

            var defaults = {
                target: model.getCache()
            };

            var deferred = $q.defer();

            /** Extend defaults **/
            var opts = _.extend({}, defaults, options);

            serviceWrapper(query)
                .then(function (response) {
                    if (query.operation === 'GetListItemChangesSinceToken') {
                        processChangeTokenXML(model, query, response, opts);
                    }

                    /** Convert the XML into JS objects */
                    var entities = apDecodeService.processListItems(model, query, response, opts);
                    deferred.resolve(entities);

                    /** Set date time to allow for time based updates */
                    query.lastRun = new Date();
                });

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name apDataService.processChangeTokenXML
         * @description
         * The initial call to GetListItemChangesSinceToken also includes the field definitions for the
         * list so extend the existing field definitions and list defined in the model.  After that, store
         * the change token and make any changes to the user's permissions for the list.
         * @param {object} model List model.
         * @param {query} query Valid query object.
         * @param {object} responseXML XML response from the server.
         * @param {object} opts Config options built up along the way.
         */
        function processChangeTokenXML(model, query, responseXML, opts) {
            if (!model.fieldDefinitionsExtended) {
                apDecodeService.extendListDefinitionFromXML(model.list, responseXML);
                apDecodeService.extendFieldDefinitionsFromXML(model.list.fields, responseXML);
                model.fieldDefinitionsExtended = true;
            }

            /** Store token for future web service calls to return changes */
            query.changeToken = retrieveChangeToken(responseXML);

            /** Update the user permissions for this list */
            var effectivePermissionMask = retrievePermMask(responseXML);
            if (effectivePermissionMask) {
                model.list.effectivePermMask = effectivePermissionMask;
            }

            /** Change token query includes deleted items as well so we need to process them separately */
            processDeletionsSinceToken(responseXML, opts.target);
        }

        /**
         * @ngdoc function
         * @name apDataService.retrieveChangeToken
         * @description
         * Returns the change token from the xml response of a GetListItemChangesSinceToken query
         * Note: this attribute is only found when using 'GetListItemChangesSinceToken'
         * @param {xml} responseXML XML response from the server.
         */
        function retrieveChangeToken(responseXML) {
            return $(responseXML).find('Changes').attr('LastChangeToken');
        }

        /**
         * @ngdoc function
         * @name apDataService.retrievePermMask
         * @description
         * Returns the text representation of the users permission mask
         * Note: this attribute is only found when using 'GetListItemChangesSinceToken'
         * @param {xml} responseXML XML response from the server.
         */
        function retrievePermMask(responseXML) {
            return $(responseXML).find('listitems').attr('EffectivePermMask');
        }

        /**
         * @ngdoc function
         * @name apDataService.processDeletionsSinceToken
         * @description
         * GetListItemChangesSinceToken returns items that have been added as well as deleted so we need
         * to remove the deleted items from the local cache.
         * @param {xml} responseXML XML response from the server.
         * @param {Array} indexedCache Cached array of list items for a query.
         */
        function processDeletionsSinceToken(responseXML, indexedCache) {
            /** Remove any locally cached entities that were deleted from the server */
            $(responseXML).SPFilterNode('Id').each(function () {
                /** Check for the type of change */
                var changeType = $(this).attr('ChangeType');

                if (changeType === 'Delete') {
                    var entityId = parseInt($(this).text(), 10);
                    /** Remove from local data array */
                    indexedCache.removeEntity(entityId);
                }
            });
        }

        /**
         * @ngdoc function
         * @name apDataService.createListItem
         * @description
         * Creates a new list item for the provided model.
         * @param {object} model Reference to the entities model.
         * @param {object} entity JavaScript object representing the SharePoint list item.
         * @param {object} [options] Optional configuration params.
         * @param {boolean} [options.buildValuePairs=true] Automatically generate pairs based on fields defined in model.
         * @param {Array[]} [options.valuePairs] Precomputed value pairs to use instead of generating them for each
         * field identified in the model.
         * @returns {object} Promise which resolves with the newly created item.
         */
        function createListItem(model, entity, options) {
            var defaults = {
                    batchCmd: 'New',
                    buildValuePairs: true,
                    indexedCache: apIndexedCacheFactory.create({}),
                    listName: model.list.getListId(),
                    operation: 'UpdateListItems',
                    valuePairs: []
                },
                deferred = $q.defer();

            defaults.target = defaults.indexedCache;
            var opts = _.extend({}, defaults, options);

            if (opts.buildValuePairs === true) {
                var editableFields = _.where(model.list.fields, {readOnly: false});
                opts.valuePairs = apEncodeService.generateValuePairs(editableFields, entity);
            }

            opts.getCache = function () {
                return opts.indexedCache;
            };

            /** Overload the function then pass anything past the first parameter to the supporting methods */
            serviceWrapper(opts, entity, model)
                .then(function (response) {
                    /** Online this should return an XML object */
                    var indexedCache = apDecodeService.processListItems(model, opts, response, opts);
                    /** Return reference to last entity in cache because it will have the new highest id */
                    deferred.resolve(indexedCache.last());
                }, function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name apDataService.updateListItem
         * @description
         * Updates an existing list item.
         * @param {object} model Reference to the entities model.
         * @param {object} entity JavaScript object representing the SharePoint list item.
         * @param {object} [options] Optional configuration params.
         * @param {boolean} [options.buildValuePairs=true] Automatically generate pairs based on fields defined in model.
         * @param {Array[]} [options.valuePairs] Precomputed value pairs to use instead of generating them for each
         * field identified in the model.
         * @returns {object} Promise which resolves with the newly created item.
         */
        function updateListItem(model, entity, options) {
            var defaults = {
                    batchCmd: 'Update',
                    buildValuePairs: true,
                    ID: entity.id,
                    listName: model.list.getListId(),
                    operation: 'UpdateListItems',
                    target: entity.getCache(),
                    valuePairs: []
                },
                deferred = $q.defer(),
                opts = _.extend({}, defaults, options);

            if (opts.buildValuePairs === true) {
                var editableFields = _.where(model.list.fields, {readOnly: false});
                opts.valuePairs = apEncodeService.generateValuePairs(editableFields, entity);
            }

            /** Overload the function then pass anything past the first parameter to the supporting methods */
            serviceWrapper(opts, entity, model)
                .then(function (response) {
                    var indexedCache = apDecodeService.processListItems(model, entity.getQuery(), response, opts);
                    /** Return reference to updated entity  */
                    deferred.resolve(indexedCache[entity.id]);
                }, function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name apDataService.deleteListItem
         * @description
         * Typically called directly from a list item, removes the list item from SharePoint
         * and the local cache.
         * @param {object} model Reference to the entities model.
         * @param {object} entity JavaScript object representing the SharePoint list item.
         * @param {object} [options] Optional configuration params.
         * @param {Array} [options.target=item.getCache()] Optional location to search through and remove the
         * local cached copy.
         * @returns {object} Promise which resolves when the operation is complete.  Nothing of importance is returned.
         */
        function deleteListItem(model, entity, options) {
            var defaults = {
                target: _.isFunction(entity.getCache) ? entity.getCache() : model.getCache(),
                operation: 'UpdateListItems',
                listName: model.list.getListId(),
                batchCmd: 'Delete',
                ID: entity.id
            };

            var opts = _.extend({}, defaults, options);

            var deferred = $q.defer();

            serviceWrapper(opts)
                .then(function () {
                    /** Success */
                    apCacheService.deleteEntity(opts.listName, entity.id);
                    deferred.resolve();
                }, function (outcome) {
                    //In the event of an error, display toast
                    toastr.error('There was an error deleting a list item from ' + model.list.title);
                    deferred.reject(outcome);
                });

            return deferred.promise;
        }

        //Todo Determine if this has any value.
     //   /**
     //    * @ngdoc function
     //    * @name apDataService.getView
     //    * @description
     //    * Returns the schema of the specified view for the specified list.
     //    * @param {object} options Configuration parameters.
     //    * @param {string} options.listName GUID of the list.
     //    * @param {string} [options.viewName] Formatted as a GUID, if not provided returns the default view.
     //    * <pre>'{37388A98-534C-4A28-BFFA-22429276897B}'</pre>
     //    * @param {string} [options.webURL] Can override the default web url if desired.
     //    * @returns {object} {query: '', viewFields: '', rowLimit: ''}
     //    * Promise that resolves with an object similar to this.
     //    * @example
     //    * <pre>
     //    * apDataService.getView({
     //*    viewName: '{EE7C652F-9CBF-433F-B376-86B0EE989A06}',
     //*    listName: '{AA7C652F-44BF-433F-B376-234423234A06}'
     //* })
     //    *
     //    *
     //    * </pre>
     //    * <h3>Returned XML</h3>
     //    * <pre>
     //    *  <View Name="{EE7C652F-9CBF-433F-B376-86B0EE989A06}"
     //    *  DefaultView="TRUE" Type="HTML" DisplayName="View_Name"
     //    *  Url="Lists/Events/File_Name.aspx" BaseViewID="1">
     //    *  <Query>
     //    *    <Where>
     //    *      <Leq>
     //    *        <FieldRef Name="Created"/>
     //    *        <Value Type="DateTime">2003-03-03T00:00:00Z</Value>
     //    *      </Leq>
     //    *    </Where>
     //    *  </Query>
     //    *  <ViewFields>
     //    *    <FieldRef Name="fRecurrence"/>
     //    *    <FieldRef Name="Attachments"/>
     //    *    <FieldRef Name="WorkspaceLink"/>
     //    *    <FieldRef Name="LinkTitle"/>
     //    *    <FieldRef Name="Location"/>
     //    *    <FieldRef Name="EventDate"/>
     //    *    <FieldRef Name="EndDate"/>
     //    *  </ViewFields>
     //    *  <RowLimit Paged="TRUE">100</RowLimit>
     //    * </View>
     //    * </pre>
     //    *
     //    */
     //   function getView(options) {
     //       var defaults = {
     //           operation: 'GetView'
     //       };
     //
     //       var deferred = $q.defer();
     //
     //
     //       var opts = _.extend({}, defaults, options);
     //
     //       serviceWrapper(opts)
     //           .then(function (response) {
     //               /** Success */
     //               var output = {
     //                   query: '<Query>' + apUtilityService.stringifyXML($(response).find('Query')) + '</Query>',
     //                   viewFields: [],
     //                   rowLimit: $(response).find('RowLimit')[0].outerHTML
     //               };
     //
     //               var viewFields = $(response).find('ViewFields');
     //               _.each(viewFields, function(field) {
     //                   output.
     //               });
     //
     //               ///** Pass back the lists array */
     //               deferred.resolve(response);
     //           }, function (err) {
     //               /** Failure */
     //               toastr.error('Failed to fetch view details.');
     //               deferred.reject(err);
     //           });
     //
     //       return deferred.promise;
     //   }

    }]
);
;'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apDecodeService
 * @description
 * Processes the XML received from SharePoint and converts it into JavaScript objects based on predefined field types.
 *
 * @requires angularPoint.apUtilityService
 * @requires angularPoint.apQueueService
 * @requires angularPoint.apConfig
 * @requires angularPoint.apCacheService
 */
angular.module('angularPoint')
    .service('apDecodeService', ["$q", "_", "apUtilityService", "apQueueService", "apConfig", "apCacheService", "apLookupFactory", "apUserFactory", "apFieldService", function ($q, _, apUtilityService, apQueueService, apConfig, apCacheService,
                                          apLookupFactory, apUserFactory, apFieldService) {


        return {
            checkResponseForErrors: checkResponseForErrors,
            extendFieldDefinitionsFromXML: extendFieldDefinitionsFromXML,
            extendListDefinitionFromXML: extendListDefinitionsFromXML,
            jsBoolean: jsBoolean,
            jsCalc: jsCalc,
            jsChoiceMulti: jsChoiceMulti,
            jsDate:jsDate,
            jsFloat: jsFloat,
            jsInt:jsInt,
            jsLookup: jsLookup,
            jsLookupMulti: jsLookupMulti,
            jsObject: jsObject,
            jsString: jsString,
            jsUser:jsUser,
            jsUserMulti: jsUserMulti,
            parseFieldVersions: parseFieldVersions,
            parseStringValue: parseStringValue,
            processListItems: processListItems,
            //updateLocalCache: updateLocalCache,
            xmlToJson: xmlToJson
        };

        /*********************** Private ****************************/


        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:processListItems
         * @methodOf angularPoint.apDecodeService
         * @description
         * Post processing of data after returning list items from server.  Returns a promise that resolves with
         * the processed entities.  Promise allows us to batch conversions of large lists to prevent ui slowdowns.
         * @param {object} model Reference to allow updating of model.
         * @param {object} query Reference to the query responsible for requesting entities.
         * @param {xml} responseXML Resolved promise from SPServices web service call.
         * @param {object} [options] Optional configuration object.
         * @param {function} [options.factory=model.factory] Constructor function typically stored on the model.
         * @param {string} [options.filter='z:row'] XML filter string used to find the elements to iterate over.
         * @param {Array} [options.mapping=model.list.mapping] Field definitions, typically stored on the model.
         * @param {Array} [options.target=model.getCache()] Optionally pass in array to update after processing.
         * @returns {object[]} List items.
         */
        function processListItems(model, query, responseXML, options) {
            var defaults = {
                factory: model.factory,
                filter: 'z:row',
                mapping: model.list.mapping,
                target: model.getCache()
            };

            var opts = _.extend({}, defaults, options);

            /** Map returned XML to JS objects based on mapping from model */
            var filteredNodes = $(responseXML).SPFilterNode(opts.filter);

            /** Prepare constructor for XML entities with references to the query and cached container */
            var listItemProvider = createListItemProvider(model, query, opts.target);

            /** Convert XML entities into JS objects and register in cache with listItemProvider, this returns an
             * array of entities but at this point we're not using them because the indexed cache should be more
             * performant. */
            xmlToJson(filteredNodes, listItemProvider, opts);

            return opts.target;
            //return entities;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:createListItemProvider
         * @methodOf angularPoint.apDecodeService
         * @description
         * The initial constructor for a list item that references the array where the entity exists and the
         * query used to fetch the entity.  From there it extends the entity using the factory defined in the
         * model for the list item.
         * @param {object} model Reference to the model for the list item.
         * @param {object} query Reference to the query object used to retrieve the entity.
         * @param {object} indexedCache Location where we'll be pushing the new entity.
         * @returns {Function} Returns a function that takes the new list item while keeping model, query,
         * and container in scope for future reference.
         */
        function createListItemProvider(model, query, indexedCache) {
            return function (listItem) {
                /** Create Reference to the indexed cache */
                listItem.getCache = function () {
                    return indexedCache;
                };
                /** Allow us to reference the originating query that generated this object */
                listItem.getQuery = function () {
                    return query;
                };

                var entity = new model.factory(listItem);

                /** Register in global application entity cache and extends the existing entity if it
                 * already exists */
                return apCacheService.registerEntity(entity, indexedCache);
            }
        }

        ///**
        // * @ngdoc function
        // * @name angularPoint.apDecodeService:updateLocalCache
        // * @methodOf angularPoint.apDecodeService
        // * @description
        // * Maps a cache by entity id.  All provided entities are then either added if they don't already exist
        // * or replaced if they do.
        // * @param {object[]} localCache The cache for a given query.
        // * @param {object[]} entities All entities that should be merged into the cache.
        // * @returns {object} {created: number, updated: number}
        // */
        //function updateLocalCache(localCache, entities) {
        //    var updateCount = 0,
        //        createCount = 0;
        //
        //    /** Map to only run through target list once and speed up subsequent lookups */
        //    var idMap = _.pluck(localCache, 'id');
        //
        //    /** Update any existing items stored in the cache */
        //    _.each(entities, function (entity) {
        //        if (idMap.indexOf(entity.id) === -1) {
        //            /** No match found, add to target and update map */
        //            localCache.push(entity);
        //            idMap.push(entity.id);
        //            createCount++;
        //        } else {
        //            /** Replace local item with updated value */
        //            localCache[idMap.indexOf(entity.id)] = entity;
        //            updateCount++;
        //        }
        //    });
        //    return {
        //        created: createCount,
        //        updated: updateCount
        //    };
        //}

        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:xmlToJson
         * @methodOf angularPoint.apDecodeService
         * @description
         * Converts an XML node set to Javascript object array. This is a modified version of the SPServices
         * "SPXmlToJson" function.
         * @param {array} xmlEntities ["z:rows"] XML rows that need to be parsed.
         * @param {function} listItemProvider Constructor function used to build the list item with references to
         * the query, cached container, and registers each list item in the apCacheService.
         * @param {object} options Options object.
         * @param {object[]} options.mapping [columnName: "mappedName", objectType: "objectType"]
         * @param {boolean} [options.includeAllAttrs=false] If true, return all attributes, regardless whether
         * @param {boolean} [options.listItemProvider] List item constructor.
         * @param {boolean} [options.removeOws=true] Specifically for GetListItems, if true, the leading ows_ will
         * be stripped off the field name.
         * @param {array} [options.target] Optional location to push parsed entities.
         * @returns {object[]} An array of JavaScript objects.
         */
        function xmlToJson(xmlEntities, listItemProvider, options) {

            var defaults = {
                mapping: {},
                includeAllAttrs: false,
                removeOws: true
            };

            var opts = _.extend({}, defaults, options);
            var parsedEntities = [];

            _.each(xmlEntities, function (xmlEntity) {
                var parsedEntity = parseXMLEntity(xmlEntity, listItemProvider, opts);
                parsedEntities.push(parsedEntity);
            });

            return parsedEntities;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:parseXMLEntity
         * @methodOf angularPoint.apDecodeService
         * @description
         * Convert an XML list item into a JS object using the fields defined in the model for the given list item.
         * @param {object} xmlEntity XML Object.
         * @param {function} listItemProvider Constructor function that instantiates a new object.
         * @param {object} opts Configuration options.
         * @param {string} opts.mapping Mapping of fields we'd like to extend on our JS object.
         * @param {boolean} [opts.includeAllAttrs=false] If true, return all attributes, regardless whether
         * @param {boolean} [opts.listItemProvider] List item constructor.
         * @param {boolean} [opts.removeOws=true] Specifically for GetListItems, if true, the leading ows_ will
         * @returns {object} New entity using the factory on the model.
         */
        function parseXMLEntity(xmlEntity, listItemProvider, opts) {
            var entity = {};
            var rowAttrs = xmlEntity.attributes;

            /** Bring back all mapped columns, even those with no value */
            _.each(opts.mapping, function (fieldDefinition) {
                entity[fieldDefinition.mappedName] = apFieldService.getDefaultValueForType(fieldDefinition.objectType);
                //entity[fieldDefinition.mappedName] = '';
            });

            /** Parse through the element's attributes */
            _.each(rowAttrs, function (attr) {
                var thisAttrName = attr.name;
                var thisMapping = opts.mapping[thisAttrName];
                var thisObjectName = typeof thisMapping !== 'undefined' ? thisMapping.mappedName : opts.removeOws ? thisAttrName.split('ows_')[1] : thisAttrName;
                var thisObjectType = typeof thisMapping !== 'undefined' ? thisMapping.objectType : undefined;
                if (opts.includeAllAttrs || thisMapping !== undefined) {
                    entity[thisObjectName] = parseStringValue(attr.value, thisObjectType, {
                        entity: entity,
                        propertyName: thisObjectName
                    });
                }

            });
            return listItemProvider(entity);
        }

        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:parseStringValue
         * @methodOf angularPoint.apDecodeService
         * @description
         * Converts a SharePoint string representation of a field into the correctly formatted JavaScript version
         * based on object type.  A majority of this code is directly taken from Marc Anderson's incredible
         * [SPServices](http://spservices.codeplex.com/) project but it needed some minor tweaking to work here.
         * @param {string} str SharePoint string representing the value.
         * @param {string} [objectType='Text'] The type based on field definition.  See
         * See [List.customFields](#/api/List.FieldDefinition) for additional info on how to define a field type.
         * @param {object} [options] Options to pass to the object constructor.
         * @param {object} [options.entity] Reference to the parent list item which can be used by child constructors.
         * @param {object} [options.propertyName] Name of property on the list item.
         * @returns {*} The newly instantiated JavaScript value based on field type.
         */
        function parseStringValue(str, objectType, options) {

            var unescapedValue = _.unescape(str);

            var colValue;

            switch (objectType) {
                case 'DateTime': // For calculated columns, stored as datetime;#value
                    // Dates have dashes instead of slashes: ows_Created='2009-08-25 14:24:48'
                    colValue = jsDate(unescapedValue);
                    break;
                case 'Lookup':
                    colValue = jsLookup(unescapedValue, options);
                    break;
                case 'User':
                    colValue = jsUser(unescapedValue);
                    break;
                case 'LookupMulti':
                    colValue = jsLookupMulti(unescapedValue, options);
                    break;
                case 'UserMulti':
                    colValue = jsUserMulti(unescapedValue);
                    break;
                case 'Boolean':
                    colValue = jsBoolean(unescapedValue);
                    break;
                case 'Integer':
                case 'Counter':
                    colValue = jsInt(unescapedValue);
                    break;
                case 'Currency':
                case 'Number':
                case 'Float': // For calculated columns, stored as float;#value
                    colValue = jsFloat(unescapedValue);
                    break;
                case 'Calc':
                    colValue = jsCalc(unescapedValue);
                    break;
                case 'MultiChoice':
                    colValue = jsChoiceMulti(unescapedValue);
                    break;
                case 'JSON':
                    colValue = jsObject(unescapedValue);
                    break;
                case 'Choice':
                case 'HTML':
                case 'Note':
                default:
                    // All other objectTypes will be simple strings
                    colValue = jsString(unescapedValue);
                    break;
            }
            return colValue;
        }

        function jsObject(s) {
            if (!s) {
                return s;
            } else {
                /** Ensure JSON is valid and if not throw error with additional detail */
                var json = null;
                try {
                    json = JSON.parse(s);
                }
                catch (err) {
                    console.error('Invalid JSON: ', s);
                }
                return json;
            }
        }

        function jsString(s) {
            return s;
        }

        function jsInt(s) {
            if (!s) {
                return s;
            } else {
                return parseInt(s, 10);
            }
        }

        function jsFloat(s) {
            if (!s) {
                return s;
            } else {
                return parseFloat(s);
            }
        }

        function jsBoolean(s) {
            return (s === '0' || s === 'False') ? false : true;
        }

        function jsDate(s) {
            /** Replace dashes with slashes and the "T" deliminator with a space if found */
            return new Date(s.replace(/-/g, '/').replace(/Z/i, '').replace(/T/i, ' '));
        }

        function jsUser(s) {
            if (s.length === 0) {
                return null;
            }
            //Send to constructor
            return apUserFactory.create(s);
        }

        function jsUserMulti(s) {
            if (s.length === 0) {
                return [];
            } else {
                var thisUserMultiObject = [];
                var thisUserMulti = s.split(';#');
                for (var i = 0; i < thisUserMulti.length; i = i + 2) {
                    var thisUser = jsUser(thisUserMulti[i] + ';#' + thisUserMulti[i + 1]);
                    thisUserMultiObject.push(thisUser);
                }
                return thisUserMultiObject;
            }
        }

        function jsLookup(s, options) {
            if (s.length === 0) {
                return null;
            } else {
                //Send to constructor
                return apLookupFactory.create(s, options);
            }
        }

        function jsLookupMulti(s, options) {
            if (s.length === 0) {
                return [];
            } else {
                var thisLookupMultiObject = [];
                var thisLookupMulti = s.split(';#');
                for (var i = 0; i < thisLookupMulti.length; i = i + 2) {
                    var thisLookup = jsLookup(thisLookupMulti[i] + ';#' + thisLookupMulti[i + 1], options);
                    thisLookupMultiObject.push(thisLookup);
                }
                return thisLookupMultiObject;
            }
        }

        function jsChoiceMulti(s) {
            if (s.length === 0) {
                return [];
            } else {
                var thisChoiceMultiObject = [];
                var thisChoiceMulti = s.split(';#');
                for (var i = 0; i < thisChoiceMulti.length; i++) {
                    if (thisChoiceMulti[i].length !== 0) {
                        thisChoiceMultiObject.push(thisChoiceMulti[i]);
                    }
                }
                return thisChoiceMultiObject;
            }
        }


        function jsCalc(s) {
            if (s.length === 0) {
                return null;
            } else {
                var thisCalc = s.split(';#');
                // The first value will be the calculated column value type, the second will be the value
                return parseStringValue(thisCalc[1], thisCalc[0]);
            }
        }

        /**Constructors for user and lookup fields*/
        /**Allows for easier distinction when debugging if object type is shown as either Lookup or User**/

        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:extendObjectWithXMLAttributes
         * @methodOf angularPoint.apDecodeService
         * @description
         * Takes an XML element and copies all attributes over to a given JS object with corresponding values.  If
         * no JS Object is provided, it extends an empty object and returns it.
         * Note: Properties are not necessarily CAMLCase.
         * @param {object} xmlObject An XML element.
         * @param {object} [jsObject={}] An optional JS Object to extend XML attributes to.
         * @returns {object} JS Object
         */
        function extendObjectWithXMLAttributes(xmlObject, jsObject) {
            var objectToExtend = jsObject || {};
            var xmlAttributes = xmlObject.attributes;

            _.each(xmlAttributes, function (attr, attrNum) {
                var attrName = xmlAttributes[attrNum].name;
                objectToExtend[attrName] = $(xmlObject).attr(attrName);
            });
            return objectToExtend;
        }


        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:extendListDefinitionFromXML
         * @methodOf angularPoint.apDecodeService
         * @description
         * Takes the XML response from a web service call and extends the list definition in the model
         * with additional field metadata.  Important to note that all properties will coming from the XML start
         * with a capital letter.
         * @param {object} list model.list
         * @param {object} responseXML XML response from the server.
         * @returns {object} Extended list object.
         */
        function extendListDefinitionsFromXML(list, responseXML) {
            $(responseXML).find("List").each(function () {
                extendObjectWithXMLAttributes(this, list);
            });
            return list;
        }


        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:extendFieldDefinitionsFromXML
         * @methodOf angularPoint.apDecodeService
         * @description
         * Takes the XML response from a web service call and extends any field definitions in the model
         * with additional field metadata.  Important to note that all properties will coming from the XML start
         * with a capital letter.
         * @param {object[]} fieldDefinitions Field definitions from the model.
         * @param {object} responseXML XML response from the server.
         */
        function extendFieldDefinitionsFromXML(fieldDefinitions, responseXML) {
            var fieldMap = {};

            /** Map all custom fields with keys of the staticName and values = field definition */
            _.each(fieldDefinitions, function (field) {
                if (field.staticName) {
                    fieldMap[field.staticName] = field;
                }
            });

            /** Iterate over each of the field nodes */
            var fields = $(responseXML).SPFilterNode('Field');

            _.each(fields, function (xmlField) {


                var staticName = $(xmlField).attr('StaticName');
                var fieldDefinition = fieldMap[staticName];

                /** If we've defined this field then we should extend it */
                if (fieldDefinition) {

                    extendObjectWithXMLAttributes(xmlField, fieldDefinition);

                    /** Additional processing for Choice fields to include the default value and choices */
                    if (fieldDefinition.objectType === 'Choice' || fieldDefinition.objectType === 'MultiChoice') {
                        fieldDefinition.Choices = [];
                        /** Convert XML Choices object to an array of choices */
                        var xmlChoices = $(xmlField).find('CHOICE');
                        _.each(xmlChoices, function (xmlChoice) {
                            fieldDefinition.Choices.push($(xmlChoice).text());
                        });
                        fieldDefinition.Default = $(xmlField).find('Default').text();
                    }
                }
            });

            return fieldDefinitions;
        }


        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:parseFieldVersions
         * @methodOf angularPoint.apDecodeService
         * @description
         * Takes an XML response from SharePoint webservice and returns an array of field versions.
         *
         * @param {xml} responseXML Returned XML from web service call.
         * @param {object} fieldDefinition Field definition from the model.
         *
         * @returns {Array} Array objects containing the various version of a field for each change.
         */
        function parseFieldVersions(responseXML, fieldDefinition) {
            var versions = [];
            var xmlVersions = $(responseXML).find('Version');
            var versionCount = xmlVersions.length;


            _.each(xmlVersions, function (xmlVersion, index) {
                /** Parse the xml and create a representation of the version as a js object */
                var version = {
                    editor: parseStringValue($(xmlVersion).attr('Editor'), 'User'),
                    /** Turn the SharePoint formatted date into a valid date object */
                    modified: parseStringValue($(xmlVersion).attr('Modified'), 'DateTime'),
                    /** Returns records in desc order so compute the version number from index */
                    version: versionCount - index
                };

                /** Properly format field based on definition from model */
                version[fieldDefinition.mappedName] =
                    parseStringValue($(xmlVersion).attr(fieldDefinition.staticName), fieldDefinition.objectType);

                /** Push to beginning of array */
                versions.unshift(version);
            });

            return versions;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:checkResponseForErrors
         * @methodOf angularPoint.apDecodeService
         * @description
         * Errors don't always throw correctly from SPServices so this function checks to see if part
         * of the XHR response contains an "errorstring" element.
         * @param {object} responseXML XHR response from the server.
         * @returns {string|null} Returns an error string if present, otherwise returns null.
         */
        function checkResponseForErrors(responseXML) {
            var error = null;
            /** Look for <errorstring></errorstring> or <ErrorText></ErrorText> for details on any errors */
            var errorElements = ['ErrorText', 'errorstring'];
            _.each(errorElements, function (element) {
                $(responseXML).find(element).each(function () {
                    error = $(this).text();
                    /** Break early if found */
                    return false;
                });
            });
            return error;
        }
    }]);
;'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apEncodeService
 * @description
 * Processes JavaScript objects and converts them to a format SharePoint expects.
 *
 * @requires angularPoint.apConfig
 * @requires angularPoint.apUtilityService
 */
angular.module('angularPoint')
    .service('apEncodeService', ["_", "apConfig", "apUtilityService", "SPServices", function (_, apConfig, apUtilityService, SPServices) {

        return {
            choiceMultiToString: choiceMultiToString,
            createValuePair: createValuePair,
            generateValuePairs: generateValuePairs,
            stringifySharePointDate: stringifySharePointDate,
            stringifySharePointMultiSelect: stringifySharePointMultiSelect

        };

        /**
         * Converts an array of selected values into a SharePoint MultiChoice string
         * @param {string[]} arr
         * @returns {string}
         */
        function choiceMultiToString(arr) {
            var str = '';
            var delim = ';#';

            if (arr.length > 0) {
                /** String is required to begin with deliminator */
                str += delim;

                /** Append each item in the supplied array followed by deliminator */
                _.each(arr, function (choice) {
                    str += choice + delim;
                });
            }
            return str;
        }


        /**
         * @ngdoc function
         * @name angularPoint.apEncodeService:generateValuePairs
         * @methodOf angularPoint.apEncodeService
         * @description
         * Typically used to iterate over the non-readonly field definitions stored in a model and convert a
         * given list item entity into value pairs that we can pass to SPServices for saving.
         * @param {Array} fieldDefinitions Definitions from the model.
         * @param {object} item list item that we'll attempt to iterate over to find the properties that we need to
         * save it to SharePoint.
         * @returns {Array[]} Value pairs of all non-readonly fields. [[fieldName, fieldValue]]
         */
        function generateValuePairs(fieldDefinitions, item) {
            var pairs = [];
            _.each(fieldDefinitions, function (field) {
                /** Check to see if item contains data for this field */
                if (_.has(item, field.mappedName)) {
                    pairs.push(createValuePair(field, item[field.mappedName]));
                }
            });
            return pairs;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apEncodeService:createValuePair
         * @methodOf angularPoint.apEncodeService
         * @description
         * Uses a field definition from a model to properly format a value for submission to SharePoint.  Typically
         * used prior to saving a list item, we iterate over each of the non-readonly properties defined in the model
         * for a list item and convert those value into value pairs that we can then hand off to SPServices.
         * @param {object} fieldDefinition The field definition, typically defined in the model.
         * <pre>
         * {
         *  staticName: "Title",
         *  objectType: "Text",
         *  mappedName: "lastName",
         *  readOnly:false
         * }
         * </pre>
         * @param {*} value Current field value.
         * @returns {Array} [fieldName, fieldValue]
         */
        function createValuePair(fieldDefinition, value) {
            var encodedValue = encodeValue(fieldDefinition.objectType, value);
            return [fieldDefinition.staticName, encodedValue];
        }

        function encodeValue(fieldType, value) {
            var str = '';
            /** Only process if note empty, undefined, or null.  Allow false. */
            if (value !== '' && !_.isUndefined(value) && !_.isNull(value)) {
                switch (fieldType) {
                    case 'Lookup':
                    case 'User':
                        if (value.lookupId) {
                            str = value.lookupId + ';#' + value.lookupValue;
                        }
                        break;
                    case 'LookupMulti':
                    case 'UserMulti':
                        str = stringifySharePointMultiSelect(value, 'lookupId');
                        break;
                    case 'MultiChoice':
                        str = choiceMultiToString(value);
                        break;
                    case 'Boolean':
                        str = value ? 1 : 0;
                        break;
                    case 'DateTime':
                        //A string date in ISO8601 format, e.g., '2013-05-08T01:20:29Z-05:00'
                        str = stringifySharePointDate(value);
                        break;
                    case 'JSON':
                        str = JSON.stringify(value);
                        break;
                    case 'HTML':
                    case 'Note':
                    default:
                        str = value;
                }
            }
            if (_.isString(str)) {
                /** Ensure we encode before sending to server (replace ", <, >)*/
                str = SPServices.encodeXml(str);
            }
            return str;
        }


        /**
         * @ngdoc function
         * @name angularPoint.apEncodeService:stringifySharePointDate
         * @methodOf angularPoint.apEncodeService
         * @description
         * Converts a JavaScript date into a modified ISO8601 date string using the TimeZone
         * offset for the current user.
         * @example
         * <pre>'2014-05-08T08:12:18Z-07:00'</pre>
         * @param {Date} date Valid JS date.
         * @returns {string} ISO8601 date string.
         */
        function stringifySharePointDate(date) {
            if (!_.isDate(date) && _.isString(date) && date.split('-').length === 3) {
                /** Date string formatted YYYY-MM-DD */
                var dateComponents = date.split('-');
                date = new Date(dateComponents[0], dateComponents[1] - 1, dateComponents[2], 0, 0, 0);
            } else if (!_.isDate(date)) {
                throw new Error('Invalid Date Provided: ' + value.toString());
            }

            var self = stringifySharePointDate;
            var dateString = '';
            dateString += date.getFullYear();
            dateString += '-';
            dateString += apUtilityService.doubleDigit(date.getMonth() + 1);
            dateString += '-';
            dateString += apUtilityService.doubleDigit(date.getDate());
            dateString += 'T';
            dateString += apUtilityService.doubleDigit(date.getHours());
            dateString += ':';
            dateString += apUtilityService.doubleDigit(date.getMinutes());
            dateString += ':';
            dateString += apUtilityService.doubleDigit(date.getSeconds());
            dateString += 'Z-';

            if (!self.timeZone) {
                //Get difference between UTC time and local time in minutes and convert to hours
                //Store so we only need to do this once
                self.timeZone = new Date().getTimezoneOffset() / 60;
            }
            dateString += apUtilityService.doubleDigit(self.timeZone);
            dateString += ':00';
            return dateString;
        }


        /**
         * @ngdoc function
         * @name angularPoint.apEncodeService:stringifySharePointMultiSelect
         * @methodOf angularPoint.apEncodeService
         * @description
         * Turns an array of, typically {lookupId: someId, lookupValue: someValue}, objects into a string
         * of delimited id's that can be passed to SharePoint for a multi select lookup or multi user selection
         * field.  SharePoint doesn't need the lookup values so we only need to pass the ID's back.
         *
         * @param {object[]} multiSelectValue Array of {lookupId: #, lookupValue: 'Some Value'} objects.
         * @param {string} [idProperty='lookupId'] Property name where we'll find the ID value on each of the objects.
         * @param {string} [valueProperty='lookupValue'] Property name where we'll find the value for this object.
         * @returns {string} Need to format string of id's in following format [ID0];#;#[ID1];#;#[ID1]
         */
        function stringifySharePointMultiSelect(multiSelectValue, idProperty, valueProperty) {
            var stringifiedValues = '';
            var idProp = idProperty || 'lookupId';
            var valProp = valueProperty || 'lookupValue';
            _.each(multiSelectValue, function (lookupObject, iteration) {
                /** Need to format string of id's in following format [ID0];#[VAL0];#[ID1];#[VAL1];# */
                stringifiedValues += lookupObject[idProp] + ';#' + lookupObject[valProp];
                if (iteration < multiSelectValue.length) {
                    stringifiedValues += ';#';
                }
            });
            return stringifiedValues;
        }

    }]);
;'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apExportService
 * @description
 * Tools to assist with development.
 * @requires angularPoint.apUtilityService
 */
angular.module('angularPoint')
    .service('apExportService', ["_", "apUtilityService", function (_, apUtilityService) {

        /**
         * @ngdoc function
         * @name angularPoint.apExportService:saveFile
         * @methodOf angularPoint.apExportService
         * @description
         * Used to convert a JS object or XML document into a file that is then downloaded on the users
         * local machine.  Original work located:
         * [here](http://bgrins.github.io/devtools-snippets/#console-save).
         * @param {object} data JS object that we'd like to dump to a JSON file and save to the local machine.
         * @param {string} type Can be either 'xml' or 'json'.
         * @param {string} [filename=debug.json] Optionally name the file.
         * @example
         * <pre>
         * //Lets assume we want to looks at an object that is too big to be easily viewed in the console.
         * apExportService.saveJSON(objectToSave, 'myobject.json');
         * </pre>
         *
         */
        var saveFile = function (data, type, filename) {
            if (!data) {
                console.error('apExportService.save' + type.toUpperCase() + ': No data');
                return;
            }

            /** If passed in type="csv;charset=utf-8;" we just want to use "csv" */
            var fileExtension = type.split(';')[0];

            if (!filename) {
                filename = 'debug.' + fileExtension;
            }

            if (type === 'json' && typeof data === 'object') {
                data = JSON.stringify(data, undefined, 4);
            }

            var blob = new Blob([data], {type: 'text/' + type}),
                e = document.createEvent('MouseEvents'),
                a = document.createElement('a');

            a.download = filename;
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ['text/' + type, a.download, a.href].join(':');
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
        };

        /**
         * @ngdoc function
         * @name angularPoint.apExportService:saveJSON
         * @methodOf angularPoint.apExportService
         * @description
         * Simple convenience function that uses angularPoint.apExportService:saveFile to download json to the local machine.
         * @requires angularPoint.apExportService:saveFile
         * @param {object} data JS object that we'd like to dump to a JSON file and save to the local machine.
         * @param {string} [filename=debug.json] Optionally name the file.
         * @example
         * <pre>
         * //Lets assume we want to looks at an object that is too big to be easily viewed in the console.
         * apExportService.saveJSON(objectToSave, 'myobject.json');
         * </pre>
         *
         */
        var saveJSON = function (data, filename) {
            saveFile(data, 'json', filename);
        };

        /**
         * @ngdoc function
         * @name angularPoint.apExportService:saveXML
         * @methodOf angularPoint.apExportService
         * @description
         * Simple convenience function that uses angularPoint.apExportService:saveFile to download xml to the local machine.
         * @requires angularPoint.apExportService:saveFile
         * @param {object} data XML object that we'd like to dump to a XML file and save to the local machine.
         * @param {string} [filename=debug.xml] Optionally name the file.
         * @example
         * <pre>
         * //Lets assume we want to looks at an object that is too big to be easily viewed in the console.
         * apExportService.saveXML(objectToSave, 'myobject.xml');
         * </pre>
         *
         */
        var saveXML = function (data, filename) {
            saveFile(data, 'xml', filename);
        };

        /**
         * @description Replaces commonly-used Windows 1252 encoded chars that do not exist in ASCII or
         *  ISO-8859-1 with ISO-8859-1 cognates.
         * @param {string} text Text to be validated and cleaned.
         * @returns {string}
         */
        var replaceWordChars = function (text) {
            var s = text;
            // smart single quotes and apostrophe
            s = s.replace(/[\u2018|\u2019|\u201A]/g, "\'");
            // smart double quotes
            s = s.replace(/[\u201C|\u201D|\u201E]/g, "\"");
            // ellipsis
            s = s.replace(/\u2026/g, "...");
            // dashes
            s = s.replace(/[\u2013|\u2014]/g, "-");
            // circumflex
            s = s.replace(/\u02C6/g, "^");
            // open angle bracket
            s = s.replace(/\u2039/g, "<");
            // close angle bracket
            s = s.replace(/\u203A/g, ">");
            // spaces
            s = s.replace(/[\u02DC|\u00A0]/g, " ");
            return s;
        };


        /**
         * @ngdoc function
         * @name angularPoint.apExportService:saveCSV
         * @methodOf angularPoint.apExportService
         * @description
         * Converts an array of arrays into a valid CSV file that is then downloaded to the users machine
         * @requires angularPoint.apExportService:saveFile
         * @param {array[]} data Array of arrays that we'd like to dump to a CSV file and save to the local machine.
         * @param {string} [filename=debug.csv] Optionally name the file.
         * @example
         * <pre>
         * //Lets assume we want to looks at an object that is too big to be easily viewed in the console.
         * apExportService.saveCSV(objectToSave, 'MyFile');
         * //This would download a file named MyFile.csv
         * </pre>
         *
         */
        var saveCSV = function (data, filename) {
            var csvString = '';
            _.each(data, function (row) {
                _.each(row, function (column, columnIndex) {
                    var result = column === null ? '' : replaceWordChars(column);
                    if (columnIndex > 0) {
                        csvString += ',';
                    }
                    /** Escape single quotes with doubles in within the string */
                    result = result.replace(/"/g, '""');

                    /** Surround string with quotes so we can have line breaks */
                    csvString += '"' + result + '"';
                });
                csvString += '\n';
            });
            saveFile(csvString, 'csv;charset=utf-8;', filename);
        };

        /**
         * @ngdoc function
         * @name angularPoint.apExportService:generateCSV
         * @methodOf angularPoint.apExportService
         * @description
         * Converts an array of objects into a parsed array of arrays based on a field config object.
         * @param {object[]} entities Array of objects to convert.
         * @param {object|string[]} fields Array of objects defining the fields to parse.  Can also pass in strings representing the name of the field which will then be parsed based on field type.
         * FieldDefinition:
         * {string} object.field Property name on the object that we want to parse.
         * {string} [object.label=object.field capitalized] Column Label
         * {function} [object.getVal] Custom function that overrides the default method of parsing based on field type.
         * @param {object} [options] Optional config settings.
         * @param {string} [options.delim='; '] Delimiter used to separate fields that potentially contain multiple values that will be concatenated into a string.
         * @returns {array[]} Return array of arrays, with the first array being the column names and every subsequent array representing a row in the csv dataset.
         * @example
         * <pre>
         * var customDelimiter = ' | ';
         * var saveCSV = function() {
     *    var parsedCSV = apExportService.generateCSV(entities, [
     *     //Field definition
     *     { label: 'ID', field: 'id' },
     *     //Field as simple string
     *     'title',
     *     'project',
     *     { label: 'Project:ID', field: 'project.lookupId' },
     *     { label: 'Type', field: 'eventType' },
     *     { label: 'Start Date', field: 'startDate' },
     *     { label: 'End Date', field: 'endDate' },
     *     'location',
     *     'description',
     *     //Field definition with custom parse logic
     *     { label: 'Comments', field: 'comments', stringify: function (comments) {
     *       var str = '';
     *       _.each(comments, function (comment, i) {
     *         if (i > 0) {
     *           str += '\n';
     *         }
     *         str += comment.text + '\n';
     *       });
     *       return str;
     *     }}
     *   ]);
     *
     *   //Save to user's machine
     *   apExportService.saveCSV(parsedCSV, 'MyFile', {delim: customDelimiter});
     * }
         * </pre>
         *
         */
        var generateCSV = function (entities, fields, options) {
            var defaults = {delim: '; '},
                opts = _.extend({}, defaults, options),
                entitiesArray = [
                    []
                ];

            /** Process each of the entities in the data source */
            _.each(entities, function (entity, entityIndex) {
                var entityArray = [];
                /** Process each of the specified fields */
                _.each(fields, function (f) {

                    /** Handle both string and object definition */
                    var fieldDefinition = _.isString(f) ? {field: f} : f;

                    /** Split the field name from the property if provided */
                    var fieldComponents = fieldDefinition.field.split('.');
                    var propertyName = fieldComponents[0];

                    /** First array has the field names */
                    if (entityIndex === 0) {
                        /** Take a best guess if a column label isn't specified by capitalizing and inserting spaces between camel humps*/
                        var label = fieldDefinition.label ?
                            fieldDefinition.label : apUtilityService.fromCamelCase(propertyName);
                        entitiesArray[0].push(label);
                    }

                    var val = '';

                    if (_.isFunction(fieldDefinition.stringify)) {
                        /** Allows us to override standard field logic for special cases */
                        val = fieldDefinition.stringify(entity[fieldDefinition.field]);
                    } else if (fieldComponents.length > 1) {
                        /** Allow user to specify dot separated property path */
                        if (_.deepIn(entity, fieldDefinition.field)) {
                            val = _.deepGet(entity, fieldDefinition.field).toString();
                        }
                    } else {
                        /** Get the value based on field type defined in the model for the entity*/
                        var modelDefinition = entity.getFieldDefinition(propertyName);
                        val = stringifyProperty(entity[fieldDefinition.field], modelDefinition.objectType, opts.delim)
                    }
                    /** Add string to column */
                    entityArray.push(val);
                });
                /** Add row */
                entitiesArray.push(entityArray);
            });
            return entitiesArray;
        };

        /**
         * @ngdoc function
         * @name angularPoint.apExportService:stringifyProperty
         * @methodOf angularPoint.apExportService
         * @param {object|array|string|integer|boolean} prop Target that we'd like to stringify.
         * @param {string} [propertyType='String'] Assumes by default that it's already a string.  Most of the normal field
         * types identified in the model field definitions are supported.
         *
         * - Lookup
         * - User
         * - Boolean
         * - DateTime
         * - Integer
         * - Number
         * - Counter
         * - MultiChoice
         * - UserMulti
         * - LookupMulti
         *
         * @param {string} [delim='; '] Optional delimiter to split concatenated strings.
         * @example
         * <pre>
         *  var project = {
     *    title: 'Super Project',
      *   members: [
      *     { lookupId: 12, lookupValue: 'Joe' },
      *     { lookupId: 19, lookupValue: 'Beth' },
      *   ]
      * };
         *
         * var membersAsString = apExportService:stringifyProperty({
     *    project.members,
     *    'UserMulti',
     *    ' | ' //Custom Delimiter
     * });
         *
         * // membersAsString = 'Joe | Beth';
         *
         * </pre>
         * @returns {string} Stringified property on the object based on the field type.
         */
        var stringifyProperty = function (prop, propertyType, delim) {
            var str = '';
            /** Only process if prop is defined */
            if (prop) {
                switch (propertyType) {
                    case 'Lookup':
                    case 'User':
                        str = parseLookup(prop);
                        break;
                    case 'Boolean':
                        str = parseBoolean(prop);
                        break;
                    case 'DateTime':
                        str = parseDate(prop);
                        break;
                    case 'Integer':
                    case 'Number':
                    case 'Counter':
                        str = parseNumber(prop);
                        break;
                    case 'MultiChoice':
                        str = parseMultiChoice(prop, delim);
                        break;
                    case 'UserMulti':
                    case 'LookupMulti':
                        str = parseMultiLookup(prop, delim);
                        break;
                    default:
                        str = prop;
                }
            }
            return str;
        };

        /**
         * @ngdoc function
         * @name angularPoint.apExportService:parseNumber
         * @methodOf angularPoint.apExportService
         * @param {number} int Property on object to parse.
         * @description
         * Converts a number to a string representation.
         * @returns {string} Stringified number.
         */
        var parseNumber = function (int) {
            var str = '';
            if (_.isNumber(int)) {
                str = int.toString();
            }
            return str;
        };

        /**
         * @ngdoc function
         * @name angularPoint.apExportService:parseLookup
         * @methodOf angularPoint.apExportService
         * @param {obj} prop Property on object to parse.
         * @description
         * Returns the property.lookupValue if present.
         * @returns {string} Property.lookupValue.
         */
        var parseLookup = function (prop) {
            var str = '';
            if (prop && prop.lookupValue) {
                str = prop.lookupValue;
            }
            return str;
        };

        /**
         * @ngdoc function
         * @name angularPoint.apExportService:parseBoolean
         * @methodOf angularPoint.apExportService
         * @param {boolean} bool Boolean to stringify.
         * @description
         * Returns the stringified boolean if it is set.
         * @returns {string} Stringified boolean.
         */
        var parseBoolean = function (bool) {
            var str = '';
            if (_.isBoolean(bool)) {
                str = bool.toString();
            }
            return str;
        };

        /**
         * @ngdoc function
         * @name angularPoint.apExportService:parseDate
         * @methodOf angularPoint.apExportService
         * @param {date} date Date that if set converts to JSON representation.
         * @description
         * Returns JSON date.
         * @returns {string} JSON date.
         */
        var parseDate = function (date) {
            var str = '';
            if (_.isDate(date)) {
                str = date.toJSON();
            }
            return str;
        };

        /**
         * @ngdoc function
         * @name angularPoint.apExportService:parseMultiChoice
         * @methodOf angularPoint.apExportService
         * @param {string[]} arr Array of selected choices.
         * @param {string} [delim='; '] Custom delimiter used between the concatenated values.
         * @description
         * Converts an array of strings into a single concatenated string.
         * @returns {string} Concatenated string representation.
         */
        var parseMultiChoice = function (arr, delim) {
            var str = '',
                d = delim || '; ';
            _.each(arr, function (choice, i) {
                if (i > 0) {
                    str += d;
                }
                str += choice;
            });
            return str;
        };

        /**
         * @ngdoc function
         * @name angularPoint.apExportService:parseMultiLookup
         * @methodOf angularPoint.apExportService
         * @param {object[]} arr Array of lookup objects.
         * @param {string} [delim='; '] Custom delimiter used between the concatenated values.
         * @description
         * Converts an array of selected lookup values into a single concatenated string.
         * @returns {string} Concatenated string representation.
         */
        var parseMultiLookup = function (arr, delim) {
            var str = '',
                d = delim || '; ';
            _.each(arr, function (val, valIndex) {

                /** Add artificial delim */
                if (valIndex > 0) {
                    str += d;
                }

                str += parseLookup(val);
            });
            return str;
        };

        return {
            generateCSV: generateCSV,
            parseMultiLookup: parseMultiLookup,
            parseBoolean: parseBoolean,
            parseDate: parseDate,
            parseLookup: parseLookup,
            parseMultiChoice: parseMultiChoice,
            parseNumber: parseNumber,
            saveCSV: saveCSV,
            saveFile: saveFile,
            saveJSON: saveJSON,
            saveXML: saveXML,
            stringifyProperty: stringifyProperty
        };
    }]);
;'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apFieldService
 * @description
 * Handles the mapping of the various types of fields used within a SharePoint list
 * @requires angularPoint.apUtilityService
 */
angular.module('angularPoint')
    .service('apFieldService', ["_", "apUtilityService", function (_, apUtilityService) {

        var getUniqueCounter = function () {
            var self = getUniqueCounter;
            self.count = self.count || 0;
            self.count++;
            return self.count;
        };

        function randomBoolean() {
            return chance.bool();
        }

        function randomString(len) {
            return chance.word() + ' ' + chance.word();
        }

        function randomStringArray() {
            var randomArr = [];
            /** Create a random (1-4) number of strings and add to array */
            _.times(_.random(1, 4), function () {
                randomArr.push(randomString());
            });
            return randomArr;
        }

        function randomParagraph() {
            return chance.paragraph();
        }

        function randomCurrency() {
            return parseInt(_.random(10000000, true) * 100) / 100;
        }

        function randomDate() {
            return chance.date();
        }

        function randomInteger() {
            return chance.integer();
        }

        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:resolveValueForEffectivePermMask
         * @methodOf angularPoint.apFieldService
         * @description
         * Takes the name of a permission mask and returns a permission value which can then be used
         * to generate a permission object using modelService.resolvePermissions(outputfromthis)
         * @param {string} perMask Options:
         *  - AddListItems
         *  - EditListItems
         *  - DeleteListItems
         *  - ApproveItems
         *  - FullMask
         *  - ViewListItems
         * @returns {string} value
         */
        function resolveValueForEffectivePermMask(perMask) {
            var permissionValue;
            switch (perMask) {
                case 'AddListItems':
                    permissionValue = '0x0000000000000002';
                    break;
                case 'EditListItems':
                    permissionValue = '0x0000000000000004';
                    break;
                case 'DeleteListItems':
                    permissionValue = '0x0000000000000008';
                    break;
                case 'ApproveItems':
                    permissionValue = '0x0000000000000010';
                    break;
                case 'FullMask':
                    permissionValue = '0x7FFFFFFFFFFFFFFF';
                    break;
                case 'ViewListItems':
                default:
                    permissionValue = '0x0000000000000001';
                    break;
            }
            return permissionValue;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:mockPermMask
         * @methodOf angularPoint.apFieldService
         * @description
         * Defaults to a full mask but allows simulation of each of main permission levels
         * @param {object} [options] Options container.
         * @param {string} [options.permissionLevel=FullMask] Optional mask.
         * @returns {string} Values for mask.
         */
        function mockPermMask(options) {
            var mask = 'FullMask';
            if (options && options.permissionLevel) {
                mask = options.permissionLevel;
            }
            return resolveValueForEffectivePermMask(mask);
        }

        function randomLookup() {
            return {
                lookupId: getUniqueCounter(),
                lookupValue: chance.word()
            };
        }

        function randomUser() {
            return {
                lookupId: getUniqueCounter(),
                lookupValue: chance.name()
            };
        }

        function randomLookupMulti() {
            var mockData = [];
            _.each(_.random(10), function () {
                mockData.push(randomLookup());
            });
            return mockData;
        }

        function randomUserMulti() {
            var mockData = [];
            _.each(_.random(10), function () {
                mockData.push(randomUser());
            });
            return mockData;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:Field
         * @methodOf angularPoint.apFieldService
         * @description
         * Decorates field with optional defaults
         * @param {object} obj Field definition.
         * @returns {object} Field
         * @constructor
         */
        function Field(obj) {
            var self = this;
            var defaults = {
                readOnly: false,
                objectType: 'Text'
            };
            _.extend(self, defaults, obj);
            self.displayName = self.displayName ? self.displayName : apUtilityService.fromCamelCase(self.mappedName);
            /** Deprecated internal name and replace with staticName but maintain compatibility */
            self.staticName = self.staticName || self.internalName;
        }

        Field.prototype.getDefinition = function () {
            return getDefinition(this.objectType);
        };

        Field.prototype.getDefaultValueForType = function () {
            return getDefaultValueForType(this.objectType);
        };

        Field.prototype.getMockData = function (options) {
            return getMockData(this.objectType, options);
        };

        /** Field types used on the models to create a field definition */
        var fieldTypes = {
            Text: {defaultValue: '', staticMock: 'Test String', dynamicMock: randomString},
            TextLong: {defaultValue: '', staticMock: 'This is a sentence.', dynamicMock: randomParagraph},
            Boolean: {defaultValue: null, staticMock: true, dynamicMock: randomBoolean},
            Choice: {defaultValue: '', staticMock: 'My Choice', dynamicMock: randomString},
            Counter: {defaultValue: null, staticMock: getUniqueCounter(), dynamicMock: getUniqueCounter},
            Currency: {defaultValue: null, staticMock: 120.50, dynamicMock: randomCurrency},
            DateTime: {defaultValue: null, staticMock: new Date(2014, 5, 4, 11, 33, 25), dynamicMock: randomDate},
            Integer: {defaultValue: null, staticMock: 14, dynamicMock: randomInteger},
            JSON: {
                defaultValue: '', staticMock: [
                    {id: 1, title: 'test'},
                    {id: 2}
                ], dynamicMock: randomString
            },
            Lookup: {
                defaultValue: '',
                staticMock: {lookupId: 49, lookupValue: 'Static Lookup'},
                dynamicMock: randomLookup
            },
            LookupMulti: {
                defaultValue: [], staticMock: [
                    {lookupId: 50, lookupValue: 'Static Multi 1'},
                    {lookupId: 51, lookupValue: 'Static Multi 2'}
                ], dynamicMock: randomLookupMulti
            },
            Mask: {defaultValue: mockPermMask(), staticMock: mockPermMask(), dynamicMock: mockPermMask},
            MultiChoice: {
                defaultValue: [],
                staticMock: ['A Good Choice', 'A Bad Choice'],
                dynamicMock: randomStringArray
            },
            User: {defaultValue: '', staticMock: {lookupId: 52, lookupValue: 'Static User'}, dynamicMock: randomUser},
            UserMulti: {
                defaultValue: [], staticMock: [
                    {lookupId: 53, lookupValue: 'Static User 1'},
                    {lookupId: 54, lookupValue: 'Static User 2'}
                ], dynamicMock: randomUserMulti
            }
        };

        /**
         * Returns an object defining a specific field type
         * @param {string} fieldType
         * @returns {object} fieldTypeDefinition
         */
        function getDefinition(fieldType) {
            return fieldTypes[fieldType] ? fieldTypes[fieldType] : fieldTypes['Text'];
        }

        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:getDefaultValueForType
         * @methodOf angularPoint.apFieldService
         * @description
         * Returns the empty value expected for a field type
         * @param {string} fieldType Type of field.
         * @returns {*} Default value based on field type.
         */
        function getDefaultValueForType(fieldType) {
            var fieldDefinition = getDefinition(fieldType), defaultValue;
            if (fieldDefinition) {
                defaultValue = fieldDefinition.defaultValue;
            }
            return defaultValue;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:getMockData
         * @methodOf angularPoint.apFieldService
         * @description
         * Can return mock data appropriate for the field type, by default it dynamically generates data but
         * the staticValue param will instead return a hard coded type specific value
         *
         * @requires ChanceJS to produce dynamic data.
         * https://github.com/victorquinn/chancejs
         * @param {string} fieldType Field type from the field definition.
         * @param {object} [options] Optional params.
         * @param {boolean} [options.staticValue=false] Default to dynamically build mock data.
         * @returns {*} mockData
         */
        function getMockData(fieldType, options) {
            var mock;
            var fieldDefinition = getDefinition(fieldType);
            if (fieldDefinition) {
                if (_.isFunction(Chance) && options && !options.staticValue) {
                    /** Return dynamic data if ChanceJS is available and flag isn't set requiring static data */
                    mock = fieldDefinition.dynamicMock(options);
                } else {
                    /** Return static data if the flag is set or ChanceJS isn't available */
                    mock = fieldDefinition.staticMock;
                }
            }
            return mock;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:defaultFields
         * @methodOf angularPoint.apFieldService
         * @description
         * Read only fields that should be included in all lists
         */
        var defaultFields = [
            {staticName: 'ID', objectType: 'Counter', mappedName: 'id', readOnly: true},
            {staticName: 'Modified', objectType: 'DateTime', mappedName: 'modified', readOnly: true},
            {staticName: 'Created', objectType: 'DateTime', mappedName: 'created', readOnly: true},
            {staticName: 'Author', objectType: 'User', mappedName: 'author', readOnly: true},
            {staticName: 'Editor', objectType: 'User', mappedName: 'editor', readOnly: true},
            {staticName: 'PermMask', objectType: 'Mask', mappedName: 'permMask', readOnly: true},
            {staticName: 'UniqueId', objectType: 'String', mappedName: 'uniqueId', readOnly: true}
        ];

        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:extendFieldDefinitions
         * @methodOf angularPoint.apFieldService
         * @description
         * 1. Populates the fields array which uses the Field constructor to combine the default
         * SharePoint fields with those defined in the list definition on the model
         * 2. Creates the list.viewFields XML string that defines the fields to be requested on a query
         *
         * @param {object} list Reference to the list within a model.
         */
        function extendFieldDefinitions(list) {
            /**
             * Constructs the field
             * - adds to viewField
             * - create ows_ mapping
             * @param fieldDefinition
             */
            var buildField = function (fieldDefinition) {
                var field = new Field(fieldDefinition);
                list.fields.push(field);
                list.viewFields += '<FieldRef Name="' + field.staticName + '"/>';
                list.mapping['ows_' + field.staticName] = {
                    mappedName: field.mappedName,
                    objectType: field.objectType
                };
            };

            /** Open viewFields */
            list.viewFields += '<ViewFields>';

            /** Add the default fields */
            _.each(defaultFields, function (field) {
                buildField(field);
            });

            /** Add each of the fields defined in the model */
            _.each(list.customFields, function (field) {
                buildField(field);
            });

            /** Close viewFields */
            list.viewFields += '</ViewFields>';
        }

        return {
            defaultFields: defaultFields,
            extendFieldDefinitions: extendFieldDefinitions,
            getDefaultValueForType: getDefaultValueForType,
            getMockData: getMockData,
            getDefinition: getDefinition,
            mockPermMask: mockPermMask,
            resolveValueForEffectivePermMask: resolveValueForEffectivePermMask
        };

    }]);
;'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apQueueService
 * @description
 * Simple service to monitor the number of active requests we have open with SharePoint
 * Typical use is to display a loading animation of some sort
 */
angular.module('angularPoint')
    .service('apQueueService', function () {

        var observerCallbacks = [],
            apQueueService = {
                count: 0,
                decrease: decrease,
                increase: increase,
                notifyObservers: notifyObservers,
                registerObserverCallback: registerObserverCallback,
                reset: reset
            };

        return apQueueService;


        /*********************** Private ****************************/


        /**
         * @ngdoc function
         * @name angularPoint.apQueueService:increase
         * @methodOf angularPoint.apQueueService
         * @description
         * Increase the apQueueService.count by 1.
         */
        function increase() {
            apQueueService.count++;
            notifyObservers();
            return apQueueService.count;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apQueueService:decrease
         * @methodOf angularPoint.apQueueService
         * @description
         * Decrease the apQueueService.count by 1.
         * @returns {number} Current count after decrementing.
         */
        function decrease() {
            if (apQueueService.count > 0) {
                apQueueService.count--;
                notifyObservers();
                return apQueueService.count;
            }
        }

        /**
         * @ngdoc function
         * @name angularPoint.apQueueService:reset
         * @methodOf angularPoint.apQueueService
         * @description
         * Reset apQueueService.count to 0.
         * @returns {number} Current count after incrementing.
         */
        function reset() {
            apQueueService.count = 0;
            notifyObservers();
            return apQueueService.count;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apQueueService:registerObserverCallback
         * @methodOf angularPoint.apQueueService
         * @description
         * Register an observer
         * @param {function} callback Function to call when a change is made.
         */
        function registerObserverCallback(callback) {
            observerCallbacks.push(callback);
        }

        /** call this when queue changes */
        function notifyObservers() {
            _.each(observerCallbacks, function (callback) {
                callback(apQueueService.count);
            });
        }

    });
;'use strict';

/**
 * @ngdoc service
 * @name angularPoint.SPServices
 * @description
 * This is just a trimmed down version of Marc Anderson's awesome [SPServices](http://spservices.codeplex.com/) library.
 * We're primarily looking for the ability to create the SOAP envelope and let AngularJS's $http service handle all
 * communication with the server.
 *
 * */
angular.module('angularPoint')
    .service('SPServices', ["apWebServiceOperationConstants", "apWebServiceService", function (apWebServiceOperationConstants, apWebServiceService) {

        /*
         * SPServices - Work with SharePoint's Web Services using jQuery
         * Version 2014.02a
         * @requires jQuery v1.8 or greater - jQuery 1.10.x recommended
         *
         * Copyright (c) 2009-2013 Sympraxis Consulting LLC
         * Examples and docs at:
         * http://spservices.codeplex.com
         * Licensed under the MIT license:
         * http://www.opensource.org/licenses/mit-license.php
         */
        /*
         * @description Work with SharePoint's Web Services using jQuery
         * @type jQuery
         * @name SPServices
         * @category Plugins/SPServices
         * @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
         */
        /* jshint undef: true */
        /* global L_Menu_BaseUrl, _spUserId, _spPageContextInfo, GipAddSelectedItems, GipRemoveSelectedItems, GipGetGroupData */

        // Global variables
        var SCHEMASharePoint = "http://schemas.microsoft.com/sharepoint";
        var i = 0; // Generic loop counter
        var encodeOptionList = ["listName", "description"]; // Used to encode options which may contain special characters

        // Defaults added as a function in our library means that the caller can override the defaults
        // for their session by calling this function.  Each operation requires a different set of options;
        // we allow for all in a standardized way.
        var defaults = {

            operation: "", // The Web Service operation
            webURL: "", // URL of the target Web
            makeViewDefault: false, // true to make the view the default view for the list

            // For operations requiring CAML, these options will override any abstractions
            CAMLViewName: "", // View name in CAML format.
            CAMLQuery: "", // Query in CAML format
            CAMLViewFields: "", // View fields in CAML format
            CAMLRowLimit: 0, // Row limit as a string representation of an integer
            CAMLQueryOptions: "<QueryOptions></QueryOptions>", // Query options in CAML format

            // Abstractions for CAML syntax
            batchCmd: "Update", // Method Cmd for UpdateListItems
            valuePairs: [], // Fieldname / Fieldvalue pairs for UpdateListItems

            // As of v0.7.1, removed all options which were assigned an empty string ("")
            DestinationUrls: [], // Array of destination URLs for copy operations
            behavior: "Version3", // An SPWebServiceBehavior indicating whether the client supports Windows SharePoint Services 2.0 or Windows SharePoint Services 3.0: {Version2 | Version3 }
            storage: "Shared", // A Storage value indicating how the Web Part is stored: {None | Personal | Shared}
            objectType: "List", // objectType for operations which require it
            cancelMeeting: true, // true to delete a meeting;false to remove its association with a Meeting Workspace site
            nonGregorian: false, // true if the calendar is set to a format other than Gregorian;otherwise, false.
            fClaim: false, // Specifies if the action is a claim or a release. Specifies true for a claim and false for a release.
            recurrenceId: 0, // The recurrence ID for the meeting that needs its association removed. This parameter can be set to 0 for single-instance meetings.
            sequence: 0, // An integer that is used to determine the ordering of updates in case they arrive out of sequence. Updates with a lower-than-current sequence are discarded. If the sequence is equal to the current sequence, the latest update are applied.
            maximumItemsToReturn: 0, // SocialDataService maximumItemsToReturn
            startIndex: 0, // SocialDataService startIndex
            isHighPriority: false, // SocialDataService isHighPriority
            isPrivate: false, // SocialDataService isPrivate
            rating: 1, // SocialDataService rating
            maxResults: 10, // Unless otherwise specified, the maximum number of principals that can be returned from a provider is 10.
            principalType: "User", // Specifies user scope and other information: [None | User | DistributionList | SecurityGroup | SharePointGroup | All]

            async: true, // Allow the user to force async
            completefunc: null // Function to call on completion

        }; // End SPServices.defaults


        // Set up SOAP envelope
        function SOAPEnvelope() {
            return {
                header: "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' " +
                "xmlns:xsd='http://www.w3.org/2001/XMLSchema' " +
                "xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body>",
                footer: "</soap:Body></soap:Envelope>",
                payload: ""
            }
        }


        // Main function, which calls SharePoint's Web Services directly.
        var SPServices = {
            defaults: defaults,
            encodeXml: encodeXml,
            generateXMLComponents: generateXMLComponents,
            SCHEMASharePoint: SCHEMASharePoint,
            SOAPEnvelope: new SOAPEnvelope()
        };

        function generateXMLComponents(options) {

            var soapEnvelope = new SOAPEnvelope();
            var SOAPAction;

            // If there are no options passed in, use the defaults.  Extend replaces each default with the passed option.
            var opt = _.extend({}, defaults, options);

            // Encode options which may contain special character, esp. ampersand
            _.each(encodeOptionList, function (optionName) {
                if (_.isString(opt[optionName])) {
                    opt[optionName] = encodeXml(opt[optionName]);
                }
            });

            var service = apWebServiceOperationConstants[opt.operation][0];

            // Put together operation header and SOAPAction for the SOAP call based on which Web Service we're calling
            soapEnvelope.opheader = "<" + opt.operation + " xmlns='" + apWebServiceService.xmlns(service) + "' >";
            SOAPAction = apWebServiceService.action(service);

            // Add the operation to the SOAPAction and opfooter
            SOAPAction += opt.operation;
            soapEnvelope.opfooter = "</" + opt.operation + ">";

            // Each operation requires a different set of values.  This switch statement sets them up in the soapEnvelope.payload.
            switch (opt.operation) {
                // ALERT OPERATIONS
                case "GetAlerts":
                    break;
                case "DeleteAlerts":
                    soapEnvelope.payload += "<IDs>";
                    for (i = 0; i < opt.IDs.length; i++) {
                        soapEnvelope.payload += wrapNode("string", opt.IDs[i]);
                    }
                    soapEnvelope.payload += "</IDs>";
                    break;

                // AUTHENTICATION OPERATIONS
                case "Mode":
                    break;
                case "Login":
                    addToPayload(opt, ["username", "password"]);
                    break;

                // COPY OPERATIONS
                case "CopyIntoItems":
                    addToPayload(opt, ["SourceUrl"]);
                    soapEnvelope.payload += "<DestinationUrls>";
                    for (i = 0; i < opt.DestinationUrls.length; i++) {
                        soapEnvelope.payload += wrapNode("string", opt.DestinationUrls[i]);
                    }
                    soapEnvelope.payload += "</DestinationUrls>";
                    addToPayload(opt, ["Fields", "Stream", "Results"]);
                    break;
                case "CopyIntoItemsLocal":
                    addToPayload(opt, ["SourceUrl"]);
                    soapEnvelope.payload += "<DestinationUrls>";
                    for (i = 0; i < opt.DestinationUrls.length; i++) {
                        soapEnvelope.payload += wrapNode("string", opt.DestinationUrls[i]);
                    }
                    soapEnvelope.payload += "</DestinationUrls>";
                    break;
                case "GetItem":
                    addToPayload(opt, ["Url", "Fields", "Stream"]);
                    break;

                // FORM OPERATIONS
                case "GetForm":
                    addToPayload(opt, ["listName", "formUrl"]);
                    break;
                case "GetFormCollection":
                    addToPayload(opt, ["listName"]);
                    break;

                // LIST OPERATIONS
                case "AddAttachment":
                    addToPayload(opt, ["listName", "listItemID", "fileName", "attachment"]);
                    break;
                case "AddDiscussionBoardItem":
                    addToPayload(opt, ["listName", "message"]);
                    break;
                case "AddList":
                    addToPayload(opt, ["listName", "description", "templateID"]);
                    break;
                case "AddListFromFeature":
                    addToPayload(opt, ["listName", "description", "featureID", "templateID"]);
                    break;
                case "ApplyContentTypeToList":
                    addToPayload(opt, ["webUrl", "contentTypeId", "listName"]);
                    break;
                case "CheckInFile":
                    addToPayload(opt, ["pageUrl", "comment", "CheckinType"]);
                    break;
                case "CheckOutFile":
                    addToPayload(opt, ["pageUrl", "checkoutToLocal", "lastmodified"]);
                    break;
                case "CreateContentType":
                    addToPayload(opt, ["listName", "displayName", "parentType", "fields", "contentTypeProperties", "addToView"]);
                    break;
                case "DeleteAttachment":
                    addToPayload(opt, ["listName", "listItemID", "url"]);
                    break;
                case "DeleteContentType":
                    addToPayload(opt, ["listName", "contentTypeId"]);
                    break;
                case "DeleteContentTypeXmlDocument":
                    addToPayload(opt, ["listName", "contentTypeId", "documentUri"]);
                    break;
                case "DeleteList":
                    addToPayload(opt, ["listName"]);
                    break;
                case "GetAttachmentCollection":
                    addToPayload(opt, ["listName", ["listItemID", "ID"]]);
                    break;
                case "GetList":
                    addToPayload(opt, ["listName"]);
                    break;
                case "GetListAndView":
                    addToPayload(opt, ["listName", "viewName"]);
                    break;
                case "GetListCollection":
                    break;
                case "GetListContentType":
                    addToPayload(opt, ["listName", "contentTypeId"]);
                    break;
                case "GetListContentTypes":
                    addToPayload(opt, ["listName"]);
                    break;
                case "GetListItems":
                    addToPayload(opt, ["listName", "viewName", ["query", "CAMLQuery"],
                        ["viewFields", "CAMLViewFields"],
                        ["rowLimit", "CAMLRowLimit"],
                        ["queryOptions", "CAMLQueryOptions"]
                    ]);
                    break;
                case "GetListItemChanges":
                    addToPayload(opt, ["listName", "viewFields", "since", "contains"]);
                    break;
                case "GetListItemChangesSinceToken":
                    addToPayload(opt, ["listName", "viewName", ["query", "CAMLQuery"],
                        ["viewFields", "CAMLViewFields"],
                        ["rowLimit", "CAMLRowLimit"],
                        ["queryOptions", "CAMLQueryOptions"], {
                            name: "changeToken",
                            sendNull: false
                        }, {
                            name: "contains",
                            sendNull: false
                        }
                    ]);
                    break;
                case "GetVersionCollection":
                    addToPayload(opt, ["strlistID", "strlistItemID", "strFieldName"]);
                    break;
                case "UndoCheckOut":
                    addToPayload(opt, ["pageUrl"]);
                    break;
                case "UpdateContentType":
                    addToPayload(opt, ["listName", "contentTypeId", "contentTypeProperties", "newFields", "updateFields", "deleteFields", "addToView"]);
                    break;
                case "UpdateContentTypesXmlDocument":
                    addToPayload(opt, ["listName", "newDocument"]);
                    break;
                case "UpdateContentTypeXmlDocument":
                    addToPayload(opt, ["listName", "contentTypeId", "newDocument"]);
                    break;
                case "UpdateList":
                    addToPayload(opt, ["listName", "listProperties", "newFields", "updateFields", "deleteFields", "listVersion"]);
                    break;
                case "UpdateListItems":
                    addToPayload(opt, ["listName"]);
                    if (typeof opt.updates !== "undefined" && opt.updates.length > 0) {
                        addToPayload(opt, ["updates"]);
                    } else {
                        soapEnvelope.payload += "<updates><Batch OnError='Continue'><Method ID='1' Cmd='" + opt.batchCmd + "'>";
                        for (i = 0; i < opt.valuePairs.length; i++) {
                            soapEnvelope.payload += "<Field Name='" + opt.valuePairs[i][0] + "'>" + escapeColumnValue(opt.valuePairs[i][1]) + "</Field>";
                        }
                        if (opt.batchCmd !== "New") {
                            soapEnvelope.payload += "<Field Name='ID'>" + opt.ID + "</Field>";
                        }
                        soapEnvelope.payload += "</Method></Batch></updates>";
                    }
                    break;

                // MEETINGS OPERATIONS
                case "AddMeeting":
                    addToPayload(opt, ["organizerEmail", "uid", "sequence", "utcDateStamp", "title", "location", "utcDateStart", "utcDateEnd", "nonGregorian"]);
                    break;
                case "CreateWorkspace":
                    addToPayload(opt, ["title", "templateName", "lcid", "timeZoneInformation"]);
                    break;
                case "RemoveMeeting":
                    addToPayload(opt, ["recurrenceId", "uid", "sequence", "utcDateStamp", "cancelMeeting"]);
                    break;
                case "SetWorkspaceTitle":
                    addToPayload(opt, ["title"]);
                    break;

                // PEOPLE OPERATIONS
                case "ResolvePrincipals":
                    addToPayload(opt, ["principalKeys", "principalType", "addToUserInfoList"]);
                    break;
                case "SearchPrincipals":
                    addToPayload(opt, ["searchText", "maxResults", "principalType"]);
                    break;

                // PERMISSION OPERATIONS
                case "AddPermission":
                    addToPayload(opt, ["objectName", "objectType", "permissionIdentifier", "permissionType", "permissionMask"]);
                    break;
                case "AddPermissionCollection":
                    addToPayload(opt, ["objectName", "objectType", "permissionsInfoXml"]);
                    break;
                case "GetPermissionCollection":
                    addToPayload(opt, ["objectName", "objectType"]);
                    break;
                case "RemovePermission":
                    addToPayload(opt, ["objectName", "objectType", "permissionIdentifier", "permissionType"]);
                    break;
                case "RemovePermissionCollection":
                    addToPayload(opt, ["objectName", "objectType", "memberIdsXml"]);
                    break;
                case "UpdatePermission":
                    addToPayload(opt, ["objectName", "objectType", "permissionIdentifier", "permissionType", "permissionMask"]);
                    break;

                // PUBLISHEDLINKSSERVICE OPERATIONS
                case "GetLinks":
                    break;

                // SEARCH OPERATIONS
                case "GetPortalSearchInfo":
                    soapEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                    SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
                    break;
                case "GetQuerySuggestions":
                    soapEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                    SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
                    soapEnvelope.payload += wrapNode("queryXml", encodeXml(opt.queryXml));
                    break;
                case "GetSearchMetadata":
                    soapEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                    SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
                    break;
                case "Query":
                    soapEnvelope.payload += wrapNode("queryXml", encodeXml(opt.queryXml));
                    break;
                case "QueryEx":
                    soapEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                    SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
                    soapEnvelope.payload += wrapNode("queryXml", encodeXml(opt.queryXml));
                    break;
                case "Registration":
                    soapEnvelope.payload += wrapNode("registrationXml", encodeXml(opt.registrationXml));
                    break;
                case "Status":
                    break;

                // SHAREPOINTDIAGNOSTICS OPERATIONS
                case "SendClientScriptErrorReport":
                    addToPayload(opt, ["message", "file", "line", "client", "stack", "team", "originalFile"]);
                    break;

                // SITEDATA OPERATIONS
                case "EnumerateFolder":
                    addToPayload(opt, ["strFolderUrl"]);
                    break;
                case "GetAttachments":
                    addToPayload(opt, ["strListName", "strItemId"]);
                    break;
                case "SiteDataGetList":
                    addToPayload(opt, ["strListName"]);
                    // Because this operation has a name which duplicates the Lists WS, need to handle
                    soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
                    break;
                case "SiteDataGetListCollection":
                    // Because this operation has a name which duplicates the Lists WS, need to handle
                    soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
                    break;
                case "SiteDataGetSite":
                    // Because this operation has a name which duplicates the Lists WS, need to handle
                    soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
                    break;
                case "SiteDataGetSiteUrl":
                    addToPayload(opt, ["Url"]);
                    // Because this operation has a name which duplicates the Lists WS, need to handle
                    soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
                    break;
                case "SiteDataGetWeb":
                    // Because this operation has a name which duplicates the Lists WS, need to handle
                    soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
                    break;

                // SITES OPERATIONS
                case "CreateWeb":
                    addToPayload(opt, ["url", "title", "description", "templateName", "language", "languageSpecified",
                        "locale", "localeSpecified", "collationLocale", "collationLocaleSpecified", "uniquePermissions",
                        "uniquePermissionsSpecified", "anonymous", "anonymousSpecified", "presence", "presenceSpecified"
                    ]);
                    break;
                case "DeleteWeb":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetSite":
                    addToPayload(opt, ["SiteUrl"]);
                    break;
                case "GetSiteTemplates":
                    addToPayload(opt, ["LCID", "TemplateList"]);
                    break;

                // SOCIALDATASERVICE OPERATIONS
                case "AddComment":
                    addToPayload(opt, ["url", "comment", "isHighPriority", "title"]);
                    break;
                case "AddTag":
                    addToPayload(opt, ["url", "termID", "title", "isPrivate"]);
                    break;
                case "AddTagByKeyword":
                    addToPayload(opt, ["url", "keyword", "title", "isPrivate"]);
                    break;
                case "CountCommentsOfUser":
                    addToPayload(opt, ["userAccountName"]);
                    break;
                case "CountCommentsOfUserOnUrl":
                    addToPayload(opt, ["userAccountName", "url"]);
                    break;
                case "CountCommentsOnUrl":
                    addToPayload(opt, ["url"]);
                    break;
                case "CountRatingsOnUrl":
                    addToPayload(opt, ["url"]);
                    break;
                case "CountTagsOfUser":
                    addToPayload(opt, ["userAccountName"]);
                    break;
                case "DeleteComment":
                    addToPayload(opt, ["url", "lastModifiedTime"]);
                    break;
                case "DeleteRating":
                    addToPayload(opt, ["url"]);
                    break;
                case "DeleteTag":
                    addToPayload(opt, ["url", "termID"]);
                    break;
                case "DeleteTagByKeyword":
                    addToPayload(opt, ["url", "keyword"]);
                    break;
                case "DeleteTags":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetAllTagTerms":
                    addToPayload(opt, ["maximumItemsToReturn"]);
                    break;
                case "GetAllTagTermsForUrlFolder":
                    addToPayload(opt, ["urlFolder", "maximumItemsToReturn"]);
                    break;
                case "GetAllTagUrls":
                    addToPayload(opt, ["termID"]);
                    break;
                case "GetAllTagUrlsByKeyword":
                    addToPayload(opt, ["keyword"]);
                    break;
                case "GetCommentsOfUser":
                    addToPayload(opt, ["userAccountName", "maximumItemsToReturn", "startIndex"]);
                    break;
                case "GetCommentsOfUserOnUrl":
                    addToPayload(opt, ["userAccountName", "url"]);
                    break;
                case "GetCommentsOnUrl":
                    addToPayload(opt, ["url", "maximumItemsToReturn", "startIndex"]);
                    if (typeof opt.excludeItemsTime !== "undefined" && opt.excludeItemsTime.length > 0) {
                        soapEnvelope.payload += wrapNode("excludeItemsTime", opt.excludeItemsTime);
                    }
                    break;
                case "GetRatingAverageOnUrl":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetRatingOfUserOnUrl":
                    addToPayload(opt, ["userAccountName", "url"]);
                    break;
                case "GetRatingOnUrl":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetRatingsOfUser":
                    addToPayload(opt, ["userAccountName"]);
                    break;
                case "GetRatingsOnUrl":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetSocialDataForFullReplication":
                    addToPayload(opt, ["userAccountName"]);
                    break;
                case "GetTags":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetTagsOfUser":
                    addToPayload(opt, ["userAccountName", "maximumItemsToReturn", "startIndex"]);
                    break;
                case "GetTagTerms":
                    addToPayload(opt, ["maximumItemsToReturn"]);
                    break;
                case "GetTagTermsOfUser":
                    addToPayload(opt, ["userAccountName", "maximumItemsToReturn"]);
                    break;
                case "GetTagTermsOnUrl":
                    addToPayload(opt, ["url", "maximumItemsToReturn"]);
                    break;
                case "GetTagUrls":
                    addToPayload(opt, ["termID"]);
                    break;
                case "GetTagUrlsByKeyword":
                    addToPayload(opt, ["keyword"]);
                    break;
                case "GetTagUrlsOfUser":
                    addToPayload(opt, ["termID", "userAccountName"]);
                    break;
                case "GetTagUrlsOfUserByKeyword":
                    addToPayload(opt, ["keyword", "userAccountName"]);
                    break;
                case "SetRating":
                    addToPayload(opt, ["url", "rating", "title", "analysisDataEntry"]);
                    break;
                case "UpdateComment":
                    addToPayload(opt, ["url", "lastModifiedTime", "comment", "isHighPriority"]);
                    break;

                // SPELLCHECK OPERATIONS
                case "SpellCheck":
                    addToPayload(opt, ["chunksToSpell", "declaredLanguage", "useLad"]);
                    break;

                // TAXONOMY OPERATIONS
                case "AddTerms":
                    addToPayload(opt, ["sharedServiceId", "termSetId", "lcid", "newTerms"]);
                    break;
                case "GetChildTermsInTerm":
                    addToPayload(opt, ["sspId", "lcid", "termId", "termSetId"]);
                    break;
                case "GetChildTermsInTermSet":
                    addToPayload(opt, ["sspId", "lcid", "termSetId"]);
                    break;
                case "GetKeywordTermsByGuids":
                    addToPayload(opt, ["termIds", "lcid"]);
                    break;
                case "GetTermsByLabel":
                    addToPayload(opt, ["label", "lcid", "matchOption", "resultCollectionSize", "termIds", "addIfNotFound"]);
                    break;
                case "GetTermSets":
                    addToPayload(opt, ["sharedServiceId", "termSetId", "lcid", "clientTimeStamps", "clientVersions"]);
                    break;

                // USERS AND GROUPS OPERATIONS
                case "AddGroup":
                    addToPayload(opt, ["groupName", "ownerIdentifier", "ownerType", "defaultUserLoginName", "description"]);
                    break;
                case "AddGroupToRole":
                    addToPayload(opt, ["groupName", "roleName"]);
                    break;
                case "AddRole":
                    addToPayload(opt, ["roleName", "description", "permissionMask"]);
                    break;
                case "AddRoleDef":
                    addToPayload(opt, ["roleName", "description", "permissionMask"]);
                    break;
                case "AddUserCollectionToGroup":
                    addToPayload(opt, ["groupName", "usersInfoXml"]);
                    break;
                case "AddUserCollectionToRole":
                    addToPayload(opt, ["roleName", "usersInfoXml"]);
                    break;
                case "AddUserToGroup":
                    addToPayload(opt, ["groupName", "userName", "userLoginName", "userEmail", "userNotes"]);
                    break;
                case "AddUserToRole":
                    addToPayload(opt, ["roleName", "userName", "userLoginName", "userEmail", "userNotes"]);
                    break;
                case "GetAllUserCollectionFromWeb":
                    break;
                case "GetGroupCollection":
                    addToPayload(opt, ["groupNamesXml"]);
                    break;
                case "GetGroupCollectionFromRole":
                    addToPayload(opt, ["roleName"]);
                    break;
                case "GetGroupCollectionFromSite":
                    break;
                case "GetGroupCollectionFromUser":
                    addToPayload(opt, ["userLoginName"]);
                    break;
                case "GetGroupCollectionFromWeb":
                    break;
                case "GetGroupInfo":
                    addToPayload(opt, ["groupName"]);
                    break;
                case "GetRoleCollection":
                    addToPayload(opt, ["roleNamesXml"]);
                    break;
                case "GetRoleCollectionFromGroup":
                    addToPayload(opt, ["groupName"]);
                    break;
                case "GetRoleCollectionFromUser":
                    addToPayload(opt, ["userLoginName"]);
                    break;
                case "GetRoleCollectionFromWeb":
                    break;
                case "GetRoleInfo":
                    addToPayload(opt, ["roleName"]);
                    break;
                case "GetRolesAndPermissionsForCurrentUser":
                    break;
                case "GetRolesAndPermissionsForSite":
                    break;
                case "GetUserCollection":
                    addToPayload(opt, ["userLoginNamesXml"]);
                    break;
                case "GetUserCollectionFromGroup":
                    addToPayload(opt, ["groupName"]);
                    break;
                case "GetUserCollectionFromRole":
                    addToPayload(opt, ["roleName"]);
                    break;
                case "GetUserCollectionFromSite":
                    break;
                case "GetUserCollectionFromWeb":
                    break;
                case "GetUserInfo":
                    addToPayload(opt, ["userLoginName"]);
                    break;
                case "GetUserLoginFromEmail":
                    addToPayload(opt, ["emailXml"]);
                    break;
                case "RemoveGroup":
                    addToPayload(opt, ["groupName"]);
                    break;
                case "RemoveGroupFromRole":
                    addToPayload(opt, ["roleName", "groupName"]);
                    break;
                case "RemoveRole":
                    addToPayload(opt, ["roleName"]);
                    break;
                case "RemoveUserCollectionFromGroup":
                    addToPayload(opt, ["groupName", "userLoginNamesXml"]);
                    break;
                case "RemoveUserCollectionFromRole":
                    addToPayload(opt, ["roleName", "userLoginNamesXml"]);
                    break;
                case "RemoveUserCollectionFromSite":
                    addToPayload(opt, ["userLoginNamesXml"]);
                    break;
                case "RemoveUserFromGroup":
                    addToPayload(opt, ["groupName", "userLoginName"]);
                    break;
                case "RemoveUserFromRole":
                    addToPayload(opt, ["roleName", "userLoginName"]);
                    break;
                case "RemoveUserFromSite":
                    addToPayload(opt, ["userLoginName"]);
                    break;
                case "RemoveUserFromWeb":
                    addToPayload(opt, ["userLoginName"]);
                    break;
                case "UpdateGroupInfo":
                    addToPayload(opt, ["oldGroupName", "groupName", "ownerIdentifier", "ownerType", "description"]);
                    break;
                case "UpdateRoleDefInfo":
                    addToPayload(opt, ["oldRoleName", "roleName", "description", "permissionMask"]);
                    break;
                case "UpdateRoleInfo":
                    addToPayload(opt, ["oldRoleName", "roleName", "description", "permissionMask"]);
                    break;
                case "UpdateUserInfo":
                    addToPayload(opt, ["userLoginName", "userName", "userEmail", "userNotes"]);
                    break;

                // USERPROFILESERVICE OPERATIONS
                case "AddColleague":
                    addToPayload(opt, ["accountName", "colleagueAccountName", "group", "privacy", "isInWorkGroup"]);
                    break;
                case "AddLink":
                    addToPayload(opt, ["accountName", "name", "url", "group", "privacy"]);
                    break;
                case "AddMembership":
                    addToPayload(opt, ["accountName", "membershipInfo", "group", "privacy"]);
                    break;
                case "AddPinnedLink":
                    addToPayload(opt, ["accountName", "name", "url"]);
                    break;
                case "CreateMemberGroup":
                    addToPayload(opt, ["membershipInfo"]);
                    break;
                case "CreateUserProfileByAccountName":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetCommonColleagues":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetCommonManager":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetCommonMemberships":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetInCommon":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetPropertyChoiceList":
                    addToPayload(opt, ["propertyName"]);
                    break;
                case "GetUserColleagues":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetUserLinks":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetUserMemberships":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetUserPinnedLinks":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetUserProfileByGuid":
                    addToPayload(opt, ["guid"]);
                    break;
                case "GetUserProfileByIndex":
                    addToPayload(opt, ["index"]);
                    break;
                case "GetUserProfileByName":
                    // Note that this operation is inconsistent with the others, using AccountName rather than accountName
                    if (typeof opt.accountName !== "undefined" && opt.accountName.length > 0) {
                        addToPayload(opt, [
                            ["AccountName", "accountName"]
                        ]);
                    } else {
                        addToPayload(opt, ["AccountName"]);
                    }
                    break;
                case "GetUserProfileCount":
                    break;
                case "GetUserProfileSchema":
                    break;
                case "GetUserPropertyByAccountName":
                    addToPayload(opt, ["accountName", "propertyName"]);
                    break;
                case "ModifyUserPropertyByAccountName":
                    addToPayload(opt, ["accountName", "newData"]);
                    break;
                case "RemoveAllColleagues":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "RemoveAllLinks":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "RemoveAllMemberships":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "RemoveAllPinnedLinks":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "RemoveColleague":
                    addToPayload(opt, ["accountName", "colleagueAccountName"]);
                    break;
                case "RemoveLink":
                    addToPayload(opt, ["accountName", "id"]);
                    break;
                case "RemoveMembership":
                    addToPayload(opt, ["accountName", "sourceInternal", "sourceReference"]);
                    break;
                case "RemovePinnedLink":
                    addToPayload(opt, ["accountName", "id"]);
                    break;
                case "UpdateColleaguePrivacy":
                    addToPayload(opt, ["accountName", "colleagueAccountName", "newPrivacy"]);
                    break;
                case "UpdateLink":
                    addToPayload(opt, ["accountName", "data"]);
                    break;
                case "UpdateMembershipPrivacy":
                    addToPayload(opt, ["accountName", "sourceInternal", "sourceReference", "newPrivacy"]);
                    break;
                case "UpdatePinnedLink ":
                    addToPayload(opt, ["accountName", "data"]);
                    break;

                // VERSIONS OPERATIONS
                case "DeleteAllVersions":
                    addToPayload(opt, ["fileName"]);
                    break;
                case "DeleteVersion":
                    addToPayload(opt, ["fileName", "fileVersion"]);
                    break;
                case "GetVersions":
                    addToPayload(opt, ["fileName"]);
                    break;
                case "RestoreVersion":
                    addToPayload(opt, ["fileName", "fileVersion"]);
                    break;

                // VIEW OPERATIONS
                case "AddView":
                    addToPayload(opt, ["listName", "viewName", "viewFields", "query", "rowLimit", "rowLimit", "type", "makeViewDefault"]);
                    break;
                case "DeleteView":
                    addToPayload(opt, ["listName", "viewName"]);
                    break;
                case "GetView":
                    addToPayload(opt, ["listName", "viewName"]);
                    break;
                case "GetViewCollection":
                    addToPayload(opt, ["listName"]);
                    break;
                case "GetViewHtml":
                    addToPayload(opt, ["listName", "viewName"]);
                    break;
                case "UpdateView":
                    addToPayload(opt, ["listName", "viewName", "viewProperties", "query", "viewFields", "aggregations", "formats", "rowLimit"]);
                    break;
                case "UpdateViewHtml":
                    addToPayload(opt, ["listName", "viewName", "viewProperties", "toolbar", "viewHeader", "viewBody", "viewFooter", "viewEmpty", "rowLimitExceeded",
                        "query", "viewFields", "aggregations", "formats", "rowLimit"
                    ]);
                    break;

                // WEBPARTPAGES OPERATIONS
                case "AddWebPart":
                    addToPayload(opt, ["pageUrl", "webPartXml", "storage"]);
                    break;
                case "AddWebPartToZone":
                    addToPayload(opt, ["pageUrl", "webPartXml", "storage", "zoneId", "zoneIndex"]);
                    break;
                case "GetWebPart2":
                    addToPayload(opt, ["pageUrl", "storageKey", "storage", "behavior"]);
                    break;
                case "GetWebPartPage":
                    addToPayload(opt, ["documentName", "behavior"]);
                    break;
                case "GetWebPartProperties":
                    addToPayload(opt, ["pageUrl", "storage"]);
                    break;
                case "GetWebPartProperties2":
                    addToPayload(opt, ["pageUrl", "storage", "behavior"]);
                    break;

                // WEBS OPERATIONS
                case "Webs.CreateContentType":
                    addToPayload(opt, ["displayName", "parentType", "newFields", "contentTypeProperties"]);
                    break;
                case "GetColumns":
                    addToPayload(opt, ["webUrl"]);
                    break;
                case "GetContentType":
                    addToPayload(opt, ["contentTypeId"]);
                    break;
                case "GetContentTypes":
                    break;
                case "GetCustomizedPageStatus":
                    addToPayload(opt, ["fileUrl"]);
                    break;
                case "GetListTemplates":
                    break;
                case "GetObjectIdFromUrl":
                    addToPayload(opt, ["objectUrl"]);
                    break;
                case "GetWeb":
                    addToPayload(opt, [
                        ["webUrl", "webURL"]
                    ]);
                    break;
                case "GetWebCollection":
                    break;
                case "GetAllSubWebCollection":
                    break;
                case "UpdateColumns":
                    addToPayload(opt, ["newFields", "updateFields", "deleteFields"]);
                    break;
                case "Webs.UpdateContentType":
                    addToPayload(opt, ["contentTypeId", "contentTypeProperties", "newFields", "updateFields", "deleteFields"]);
                    break;
                case "WebUrlFromPageUrl":
                    addToPayload(opt, [
                        ["pageUrl", "pageURL"]
                    ]);
                    break;

                // WORKFLOW OPERATIONS
                case "AlterToDo":
                    addToPayload(opt, ["item", "todoId", "todoListId", "taskData"]);
                    break;
                case "ClaimReleaseTask":
                    addToPayload(opt, ["item", "taskId", "listId", "fClaim"]);
                    break;
                case "GetTemplatesForItem":
                    addToPayload(opt, ["item"]);
                    break;
                case "GetToDosForItem":
                    addToPayload(opt, ["item"]);
                    break;
                case "GetWorkflowDataForItem":
                    addToPayload(opt, ["item"]);
                    break;
                case "GetWorkflowTaskData":
                    addToPayload(opt, ["item", "listId", "taskId"]);
                    break;
                case "StartWorkflow":
                    addToPayload(opt, ["item", "templateId", "workflowParameters"]);
                    break;

                default:
                    break;
            }

            // Glue together the pieces of the SOAP message
            var msg = soapEnvelope.header + soapEnvelope.opheader + soapEnvelope.payload + soapEnvelope.opfooter + soapEnvelope.footer;
            var soapAction = apWebServiceOperationConstants[opt.operation][1] ? SOAPAction : false;

            return {
                msg: msg,
                SOAPEnvelope: soapEnvelope,
                SOAPAction: soapAction
            };

            // Add the option values to the soapEnvelope.payload for the operation
            //  opt = options for the call
            //  paramArray = an array of option names to add to the payload
            //      "paramName" if the parameter name and the option name match
            //      ["paramName", "optionName"] if the parameter name and the option name are different (this handles early "wrappings" with inconsistent naming)
            //      {name: "paramName", sendNull: false} indicates the element is marked as "add to payload only if non-null"
            function addToPayload(opt, paramArray) {

                var i;

                for (i = 0; i < paramArray.length; i++) {
                    // the parameter name and the option name match
                    if (typeof paramArray[i] === "string") {
                        soapEnvelope.payload += wrapNode(paramArray[i], opt[paramArray[i]]);
                        // the parameter name and the option name are different
                    } else if (_.isArray(paramArray[i]) && paramArray[i].length === 2) {
                        soapEnvelope.payload += wrapNode(paramArray[i][0], opt[paramArray[i][1]]);
                        // the element not a string or an array and is marked as "add to payload only if non-null"
                    } else if ((typeof paramArray[i] === "object") && (paramArray[i].sendNull !== undefined)) {
                        soapEnvelope.payload += ((opt[paramArray[i].name] === undefined) || (opt[paramArray[i].name].length === 0)) ? "" : wrapNode(paramArray[i].name, opt[paramArray[i].name]);
                        // something isn't right, so report it
                    } else {
                        errBox(opt.operation, "paramArray[" + i + "]: " + paramArray[i], "Invalid paramArray element passed to addToPayload()");
                    }
                }
            } // End of function addToPayload

            // The SiteData operations have the same names as other Web Service operations. To make them easy to call and unique, I'm using
            // the SiteData prefix on their names. This function replaces that name with the right name in the soapEnvelope.
            function siteDataFixSOAPEnvelope(SOAPEnvelope, siteDataOperation) {
                var siteDataOp = siteDataOperation.substring(8);
                SOAPEnvelope.opheader = SOAPEnvelope.opheader.replace(siteDataOperation, siteDataOp);
                SOAPEnvelope.opfooter = SOAPEnvelope.opfooter.replace(siteDataOperation, siteDataOp);
                return SOAPEnvelope;
            } // End of function siteDataFixSOAPEnvelope


        }; // End SPServices.generateXMLComponents


        //TODO Move this somewhere else, it's too buried down here
        // This method for finding specific nodes in the returned XML was developed by Steve Workman. See his blog post
        // http://www.steveworkman.com/html5-2/javascript/2011/improving-javascript-xml-node-finding-performance-by-2000/
        // for performance details.
        $.fn.SPFilterNode = function (name) {
            return this.find('*').filter(function () {
                return this.nodeName === name;
            });
        }; // End $.fn.SPFilterNode

        ////// PRIVATE FUNCTIONS ////////
        // Wrap an XML node (n) around a value (v)
        function wrapNode(n, v) {
            var thisValue = typeof v !== "undefined" ? v : "";
            return "<" + n + ">" + thisValue + "</" + n + ">";
        }

        // Get the filename from the full URL
        function fileName(s) {
            return s.substring(s.lastIndexOf("/") + 1, s.length);
        }

        /* Taken from http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/ */
        var xml_special_to_escaped_one_map = {
            '&': '&amp;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;'
        };

        function encodeXml(string) {
            return string.replace(/([\&"<>])/g, function (str, item) {
                return xml_special_to_escaped_one_map[item];
            });
        }

        /* Taken from http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/ */
        // Escape column values
        function escapeColumnValue(s) {
            if (typeof s === "string") {
                return s.replace(/&(?![a-zA-Z]{1,8};)/g, "&amp;");
            } else {
                return s;
            }
        }

        function errBox(msg) {
            console.error(msg);
        }

        // James Padolsey's Regex Selector for jQuery http://james.padolsey.com/javascript/regex-selector-for-jquery/
        $.expr[':'].regex = function (elem, index, match) {
            var matchParams = match[3].split(','),
                validLabels = /^(data|css):/,
                attr = {
                    method: matchParams[0].match(validLabels) ?
                        matchParams[0].split(':')[0] : 'attr',
                    property: matchParams.shift().replace(validLabels, '')
                },
                regexFlags = 'ig',
                regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
            return regex.test(jQuery(elem)[attr.method](attr.property));
        };

        return SPServices;


        //// Known list field types
        //var spListFieldTypes = [
        //    "Text",
        //    "DateTime",
        //    "datetime",
        //    "User",
        //    "UserMulti",
        //    "Lookup",
        //    "LookupMulti",
        //    "Boolean",
        //    "Integer",
        //    "Counter",
        //    "MultiChoice",
        //    "Currency",
        //    "float",
        //    "Calc",
        //    "Attachments",
        //    "Calculated",
        //    "ContentTypeId",
        //    "Note",
        //    //          "Computed",
        //    "URL",
        //    "Number",
        //    "Choice",
        //    "ModStat",
        //    "Guid",
        //    "File"
        //];


        // Convert a JavaScript date to the ISO 8601 format required by SharePoint to update list items
        //function SPConvertDateToISO(options) {
        //
        //    var opt = $.extend({}, {
        //        dateToConvert: new Date(), // The JavaScript date we'd like to convert. If no date is passed, the function returns the current date/time
        //        dateOffset: "-05:00" // The time zone offset requested. Default is EST
        //    }, options);
        //
        //    //Generate ISO 8601 date/time formatted string
        //    var s = "";
        //    var d = opt.dateToConvert;
        //    s += d.getFullYear() + "-";
        //    s += pad(d.getMonth() + 1) + "-";
        //    s += pad(d.getDate());
        //    s += "T" + pad(d.getHours()) + ":";
        //    s += pad(d.getMinutes()) + ":";
        //    s += pad(d.getSeconds()) + "Z" + opt.dateOffset;
        //    //Return the ISO8601 date string
        //    return s;
        //
        //} // End SPServices.SPConvertDateToISO

        // Split values like 1;#value into id and value
        //function SplitIndex(s) {
        //    var spl = s.split(";#");
        //    this.id = spl[0];
        //    this.value = spl[1];
        //}

        //function pad(n) {
        //    return n < 10 ? "0" + n : n;
        //}

        //var escaped_one_to_xml_special_map = {
        //    '&amp;': '&',
        //    '&quot;': '"',
        //    '&lt;': '<',
        //    '&gt;': '>'
        //};

        //
        //function decodeXml(string) {
        //    return string.replace(/(&quot;|&lt;|&gt;|&amp;)/g,
        //        function (str, item) {
        //            return escaped_one_to_xml_special_map[item];
        //        });
        //}

        // Escape Url
        //function escapeUrl(u) {
        //    return u.replace(/&/g, '%26');
        //}

        // Return the current version of SPServices as a string
        //SPServices.Version = function () {
        //
        //    return VERSION;
        //
        //}; // End SPServices.Version


        //// This function converts an XML node set to JSON
        //// Initial implementation focuses only on GetListItems
        //$.fn.SPXmlToJson = function (options) {
        //
        //    var opt = $.extend({}, {
        //        mapping: {}, // columnName: mappedName: "mappedName", objectType: "objectType"
        //        includeAllAttrs: false, // If true, return all attributes, regardless whether they are in the mapping
        //        removeOws: true, // Specifically for GetListItems, if true, the leading ows_ will be stripped off the field name
        //        sparse: false // If true, empty ("") values will not be returned
        //    }, options);
        //
        //    var attrNum;
        //    var jsonObject = [];
        //
        //    this.each(function () {
        //        var row = {};
        //        var rowAttrs = this.attributes;
        //
        //        if (!opt.sparse) {
        //            // Bring back all mapped columns, even those with no value
        //            $.each(opt.mapping, function () {
        //                row[this.mappedName] = "";
        //            });
        //        }
        //
        //        // Parse through the element's attributes
        //        for (attrNum = 0; attrNum < rowAttrs.length; attrNum++) {
        //            var thisAttrName = rowAttrs[attrNum].name;
        //            var thisMapping = opt.mapping[thisAttrName];
        //            var thisObjectName = typeof thisMapping !== "undefined" ? thisMapping.mappedName : opt.removeOws ? thisAttrName.split("ows_")[1] : thisAttrName;
        //            var thisObjectType = typeof thisMapping !== "undefined" ? thisMapping.objectType : undefined;
        //            if (opt.includeAllAttrs || thisMapping !== undefined) {
        //                row[thisObjectName] = apDecodeService.attrToJson(rowAttrs[attrNum].value, thisObjectType);
        //            }
        //        }
        //        // Push this item into the JSON Object
        //        jsonObject.push(row);
        //
        //    });
        //
        //    // Return the JSON object
        //    return jsonObject;
        //
        //}; // End SPServices.SPXmlToJson


        //function attrToJson(v, objectType) {
        //
        //    var colValue;
        //
        //    switch (objectType) {
        //        case "Text":
        //            colValue = stringToJsonObject(v);
        //            break;
        //        case "DateTime":
        //        case "datetime": // For calculated columns, stored as datetime;#value
        //            // Dates have dashes instead of slashes: ows_Created="2009-08-25 14:24:48"
        //            colValue = dateToJsonObject(v);
        //            break;
        //        case "User":
        //            colValue = userToJsonObject(v);
        //            break;
        //        case "UserMulti":
        //            colValue = userMultiToJsonObject(v);
        //            break;
        //        case "Lookup":
        //            colValue = lookupToJsonObject(v);
        //            break;
        //        case "LookupMulti":
        //            colValue = lookupMultiToJsonObject(v);
        //            break;
        //        case "Boolean":
        //            colValue = booleanToJsonObject(v);
        //            break;
        //        case "Integer":
        //            colValue = intToJsonObject(v);
        //            break;
        //        case "Counter":
        //            colValue = intToJsonObject(v);
        //            break;
        //        case "MultiChoice":
        //            colValue = choiceMultiToJsonObject(v);
        //            break;
        //        case "Number":
        //        case "Currency":
        //        case "float": // For calculated columns, stored as float;#value
        //            colValue = floatToJsonObject(v);
        //            break;
        //        case "Calculated":
        //            colValue = calcToJsonObject(v);
        //            break;
        //        case "Attachments":
        //            colValue = lookupToJsonObject(v);
        //            break;
        //        case "JSON":
        //            colValue = jsonToJsonObject(v); // Special case for text JSON stored in text columns
        //            break;
        //        default:
        //            // All other objectTypes will be simple strings
        //            colValue = stringToJsonObject(v);
        //            break;
        //    }
        //    return colValue;
        //}
        //
        //function stringToJsonObject(s) {
        //    return s;
        //}
        //
        //function intToJsonObject(s) {
        //    return parseInt(s, 10);
        //}
        //
        //function floatToJsonObject(s) {
        //    return parseFloat(s);
        //}
        //
        //function booleanToJsonObject(s) {
        //    var out = s === "0" ? false : true;
        //    return out;
        //}
        //
        //function dateToJsonObject(s) {
        //
        //    var dt = s.split("T")[0] !== s ? s.split("T") : s.split(" ");
        //    var d = dt[0].split("-");
        //    var t = dt[1].split(":");
        //    var t3 = t[2].split("Z");
        //    var date = new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t3[0]);
        //    return date;
        //}
        //
        //function userToJsonObject(s) {
        //    if (s.length === 0) {
        //        return null;
        //    } else {
        //        var thisUser = new SplitIndex(s);
        //        var thisUserExpanded = thisUser.value.split(",#");
        //        if (thisUserExpanded.length === 1) {
        //            return {
        //                userId: thisUser.id,
        //                userName: thisUser.value
        //            };
        //        } else {
        //            return {
        //                userId: thisUser.id,
        //                userName: thisUserExpanded[0].replace(/(,,)/g, ","),
        //                loginName: thisUserExpanded[1].replace(/(,,)/g, ","),
        //                email: thisUserExpanded[2].replace(/(,,)/g, ","),
        //                sipAddress: thisUserExpanded[3].replace(/(,,)/g, ","),
        //                title: thisUserExpanded[4].replace(/(,,)/g, ",")
        //            };
        //        }
        //    }
        //}

        //// Get the current context (as much as we can) on startup
        //// See: http://johnliu.net/blog/2012/2/3/sharepoint-javascript-current-page-context-info.html
        //function SPServicesContext() {
        //
        //    // SharePoint 2010 gives us a context variable
        //    if (typeof _spPageContextInfo !== "undefined") {
        //        this.thisSite = _spPageContextInfo.webServerRelativeUrl;
        //        this.thisList = _spPageContextInfo.pageListId;
        //        this.thisUserId = _spPageContextInfo.userId;
        //        // In SharePoint 2007, we know the UserID only
        //    } else {
        //        this.thisSite = (typeof L_Menu_BaseUrl !== "undefined") ? L_Menu_BaseUrl : "";
        //        this.thisList = "";
        //        this.thisUserId = (typeof _spUserId !== "undefined") ? _spUserId : undefined;
        //    }
        //
        //} // End of function SPServicesContext

        //
        //function userMultiToJsonObject(s) {
        //    if (s.length === 0) {
        //        return null;
        //    } else {
        //        var thisUserMultiObject = [];
        //        var thisUserMulti = s.split(";#");
        //        for (i = 0; i < thisUserMulti.length; i = i + 2) {
        //            var thisUser = userToJsonObject(thisUserMulti[i] + ";#" + thisUserMulti[i + 1]);
        //            thisUserMultiObject.push(thisUser);
        //        }
        //        return thisUserMultiObject;
        //    }
        //}
        //
        //function lookupToJsonObject(s) {
        //    if (s.length === 0) {
        //        return null;
        //    } else {
        //        var thisLookup = new SplitIndex(s);
        //        return {
        //            lookupId: thisLookup.id,
        //            lookupValue: thisLookup.value
        //        };
        //    }
        //}
        //
        //function lookupMultiToJsonObject(s) {
        //    if (s.length === 0) {
        //        return null;
        //    } else {
        //        var thisLookupMultiObject = [];
        //        var thisLookupMulti = s.split(";#");
        //        for (i = 0; i < thisLookupMulti.length; i = i + 2) {
        //            var thisLookup = lookupToJsonObject(thisLookupMulti[i] + ";#" + thisLookupMulti[i + 1]);
        //            thisLookupMultiObject.push(thisLookup);
        //        }
        //        return thisLookupMultiObject;
        //    }
        //}
        //
        //function choiceMultiToJsonObject(s) {
        //    if (s.length === 0) {
        //        return null;
        //    } else {
        //        var thisChoiceMultiObject = [];
        //        var thisChoiceMulti = s.split(";#");
        //        for (i = 0; i < thisChoiceMulti.length; i++) {
        //            if (thisChoiceMulti[i].length !== 0) {
        //                thisChoiceMultiObject.push(thisChoiceMulti[i]);
        //            }
        //        }
        //        return thisChoiceMultiObject;
        //    }
        //}
        //
        //function calcToJsonObject(s) {
        //    if (s.length === 0) {
        //        return null;
        //    } else {
        //        var thisCalc = s.split(";#");
        //        // The first value will be the calculated column value type, the second will be the value
        //        return attrToJson(thisCalc[1], thisCalc[0]);
        //    }
        //}
        //
        //function jsonToJsonObject(s) {
        //    if (s.length === 0) {
        //        return null;
        //    } else {
        //        return $.parseJSON(s);
        //    }
        //}

        // Build the URL for the Ajax call based on which operation we're calling
        // If the webURL has been provided, then use it, else use the current site
        //var ajaxURL = generateWebServiceUrl(service, opt.webURL);
        //var ajaxURL = "_vti_bin/" + service + ".asmx";
        //if (opt.webURL) {
        //    ajaxURL = opt.webURL.charAt(opt.webURL.length - 1) === SLASH ?
        //    opt.webURL + ajaxURL : opt.webURL + SLASH + ajaxURL;
        //} else {
        //    var thisSite = SPServices.SPGetCurrentSite();
        //    ajaxURL = thisSite + ((thisSite.charAt(thisSite.length - 1) === SLASH) ? ajaxURL : (SLASH + ajaxURL));
        //}

        // If a string is a URL, format it as a link, else return the string as-is
        //function checkLink(s) {
        //    return ((s.indexOf("http") === 0) || (s.indexOf(SLASH) === 0)) ? "<a href='" + s + "'>" + s + "</a>" : s;
        //}

        //SPServices.generateWebServiceUrl = generateWebServiceUrl;

        // Function to determine the current Web's URL.  We need this for successful Ajax calls.
        // The function is also available as a public function.
        //function SPGetCurrentSite() {
        //
        //    // We've already determined the current site...
        //    if (currentContext.thisSite.length > 0) {
        //        return currentContext.thisSite;
        //    }
        //
        //    // If we still don't know the current site, we call WebUrlFromPageUrlResult.
        //    var msg = SOAPEnvelope.header +
        //        "<WebUrlFromPageUrl xmlns='" + SCHEMASharePoint + "/soap/' ><pageUrl>" +
        //        ((location.href.indexOf("?") > 0) ? location.href.substr(0, location.href.indexOf("?")) : location.href) +
        //        "</pageUrl></WebUrlFromPageUrl>" +
        //        SOAPEnvelope.footer;
        //    $.ajax({
        //        async: false, // Need this to be synchronous so we're assured of a valid value
        //        url: "/_vti_bin/Webs.asmx",
        //        type: "POST",
        //        data: msg,
        //        dataType: "xml",
        //        contentType: "text/xml;charset=\"utf-8\"",
        //        complete: function (xData) {
        //            currentContext.thisSite = $(xData.responseXML).find("WebUrlFromPageUrlResult").text();
        //        }
        //    });
        //
        //    return currentContext.thisSite; // Return the URL
        //
        //} // End SPServices.SPGetCurrentSite

        //function generateWebServiceUrl(service, webURL) {
        //    var ajaxURL = "_vti_bin/" + service + ".asmx";
        //    if (webURL) {
        //        ajaxURL = webURL.charAt(webURL.length - 1) === SLASH ?
        //        webURL + ajaxURL : webURL + SLASH + ajaxURL;
        //    } else {
        //        var thisSite = SPServices.SPGetCurrentSite();
        //        ajaxURL = thisSite + ((thisSite.charAt(thisSite.length - 1) === SLASH) ? ajaxURL : (SLASH + ajaxURL));
        //    }
        //    return ajaxURL;
        //}

        //switch (apWebServiceOperationConstants[opt.operation][0]) {
        //    case "Alerts":
        //        SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/2002/1/alerts/' >";
        //        SOAPAction = SCHEMASharePoint + "/soap/2002/1/alerts/";
        //        break;
        //    case "Meetings":
        //        SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/meetings/' >";
        //        SOAPAction = SCHEMASharePoint + "/soap/meetings/";
        //        break;
        //    case "Permissions":
        //        SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/directory/' >";
        //        SOAPAction = SCHEMASharePoint + "/soap/directory/";
        //        break;
        //    case "PublishedLinksService":
        //        SOAPEnvelope.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/' >";
        //        SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/";
        //        break;
        //    case "Search":
        //        SOAPEnvelope.opheader += "xmlns='urn:Microsoft.Search' >";
        //        SOAPAction = "urn:Microsoft.Search/";
        //        break;
        //    case "SharePointDiagnostics":
        //        SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/diagnostics/' >";
        //        SOAPAction = "http://schemas.microsoft.com/sharepoint/diagnostics/";
        //        break;
        //    case "SocialDataService":
        //        SOAPEnvelope.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/SocialDataService' >";
        //        SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/SocialDataService/";
        //        break;
        //    case "SpellCheck":
        //        SOAPEnvelope.opheader += "xmlns='http://schemas.microsoft.com/sharepoint/publishing/spelling/' >";
        //        SOAPAction = "http://schemas.microsoft.com/sharepoint/publishing/spelling/SpellCheck";
        //        break;
        //    case "TaxonomyClientService":
        //        SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/taxonomy/soap/' >";
        //        SOAPAction = SCHEMASharePoint + "/taxonomy/soap/";
        //        break;
        //    case "usergroup":
        //        SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/directory/' >";
        //        SOAPAction = SCHEMASharePoint + "/soap/directory/";
        //        break;
        //    case "UserProfileService":
        //        SOAPEnvelope.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/UserProfileService' >";
        //        SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/";
        //        break;
        //    case "WebPartPages":
        //        SOAPEnvelope.opheader += "xmlns='http://microsoft.com/sharepoint/webpartpages' >";
        //        SOAPAction = "http://microsoft.com/sharepoint/webpartpages/";
        //        break;
        //    case "Workflow":
        //        SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/workflow/' >";
        //        SOAPAction = SCHEMASharePoint + "/soap/workflow/";
        //        break;
        //    default:
        //        SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/'>";
        //        SOAPAction = SCHEMASharePoint + "/soap/";
        //        break;
        //}


        // Utility function to show the results of a Web Service call formatted well in the browser.
        //SPServices.SPDebugXMLHttpResult = function (options) {
        //
        //    var opt = $.extend({}, {
        //        node: null, // An XMLHttpResult object from an ajax call
        //        indent: 0 // Number of indents
        //    }, options);
        //
        //    var i;
        //    var NODE_TEXT = 3;
        //    var NODE_CDATA_SECTION = 4;
        //
        //    var outString = "";
        //    // For each new subnode, begin rendering a new TABLE
        //    outString += "<table class='ms-vb' style='margin-left:" + opt.indent * 3 + "px;' width='100%'>";
        //    // DisplayPatterns are a bit unique, so let's handle them differently
        //    if (opt.node.nodeName === "DisplayPattern") {
        //        outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
        //        "</td><td><textarea readonly='readonly' rows='5' cols='50'>" + opt.node.xml + "</textarea></td></tr>";
        //        // A node which has no children
        //    } else if (!opt.node.hasChildNodes()) {
        //        outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
        //        "</td><td>" + ((opt.node.nodeValue !== null) ? checkLink(opt.node.nodeValue) : "&nbsp;") + "</td></tr>";
        //        if (opt.node.attributes) {
        //            outString += "<tr><td colspan='99'>" + showAttrs(opt.node) + "</td></tr>";
        //        }
        //        // A CDATA_SECTION node
        //    } else if (opt.node.hasChildNodes() && opt.node.firstChild.nodeType === NODE_CDATA_SECTION) {
        //        outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
        //        "</td><td><textarea readonly='readonly' rows='5' cols='50'>" + opt.node.parentNode.text + "</textarea></td></tr>";
        //        // A TEXT node
        //    } else if (opt.node.hasChildNodes() && opt.node.firstChild.nodeType === NODE_TEXT) {
        //        outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
        //        "</td><td>" + checkLink(opt.node.firstChild.nodeValue) + "</td></tr>";
        //        // Handle child nodes
        //    } else {
        //        outString += "<tr><td width='100px' style='font-weight:bold;' colspan='99'>" + opt.node.nodeName + "</td></tr>";
        //        if (opt.node.attributes) {
        //            outString += "<tr><td colspan='99'>" + showAttrs(opt.node) + "</td></tr>";
        //        }
        //        // Since the node has child nodes, recurse
        //        outString += "<tr><td>";
        //        for (i = 0; i < opt.node.childNodes.length; i++) {
        //            outString += SPServices.SPDebugXMLHttpResult({
        //                node: opt.node.childNodes.item(i),
        //                indent: opt.indent + 1
        //            });
        //        }
        //        outString += "</td></tr>";
        //    }
        //    outString += "</table>";
        //    // Return the HTML which we have built up
        //    return outString;
        //}; // End SPServices.SPDebugXMLHttpResult

        // Show a single attribute of a node, enclosed in a table
        //   node               The XML node
        //   opt                The current set of options
        //function showAttrs(node) {
        //    var i;
        //    var out = "<table class='ms-vb' width='100%'>";
        //    for (i = 0; i < node.attributes.length; i++) {
        //        out += "<tr><td width='10px' style='font-weight:bold;'>" + i + "</td><td width='100px'>" +
        //        node.attributes.item(i).nodeName + "</td><td>" + checkLink(node.attributes.item(i).nodeValue) + "</td></tr>";
        //    }
        //    out += "</table>";
        //    return out;
        //} // End of function showAttrs

        // Function which returns the account name for the current user in DOMAIN\username format
        //SPServices.SPGetCurrentUser = function (options) {
        //
        //    var opt = $.extend({}, {
        //        webURL: "", // URL of the target Site Collection.  If not specified, the current Web is used.
        //        fieldName: "Name", // Specifies which field to return from the userdisp.aspx page
        //        fieldNames: {}, // Specifies which fields to return from the userdisp.aspx page - added in v0.7.2 to allow multiple columns
        //        debug: false // If true, show error messages; if false, run silent
        //    }, options);
        //
        //    // The current user's ID is reliably available in an existing JavaScript variable
        //    if (opt.fieldName === "ID" && typeof currentContext.thisUserId !== "undefined") {
        //        return currentContext.thisUserId;
        //    }
        //
        //    var thisField = "";
        //    var theseFields = {};
        //    var fieldCount = opt.fieldNames.length > 0 ? opt.fieldNames.length : 1;
        //    var thisUserDisp;
        //    var thisWeb = opt.webURL.length > 0 ? opt.webURL : SPServices.SPGetCurrentSite();
        //
        //    // Get the UserDisp.aspx page using AJAX
        //    $.ajax({
        //        // Need this to be synchronous so we're assured of a valid value
        //        async: false,
        //        // Force parameter forces redirection to a page that displays the information as stored in the UserInfo table rather than My Site.
        //        // Adding the extra Query String parameter with the current date/time forces the server to view this as a new request.
        //        url: thisWeb + "/_layouts/userdisp.aspx?Force=True&" + new Date().getTime(),
        //        complete: function (xData) {
        //            thisUserDisp = xData;
        //        }
        //    });
        //
        //    for (i = 0; i < fieldCount; i++) {
        //
        //        // The current user's ID is reliably available in an existing JavaScript variable
        //        if (opt.fieldNames[i] === "ID") {
        //            thisField = currentContext.thisUserId;
        //        } else {
        //            var thisTextValue;
        //            if (fieldCount > 1) {
        //                thisTextValue = RegExp("FieldInternalName=\"" + opt.fieldNames[i] + "\"", "gi");
        //            } else {
        //                thisTextValue = RegExp("FieldInternalName=\"" + opt.fieldName + "\"", "gi");
        //            }
        //            $(thisUserDisp.responseText).find("table.ms-formtable td[id^='SPField']").each(function () {
        //                if (thisTextValue.test($(this).html())) {
        //                    // Each fieldtype contains a different data type, as indicated by the id
        //                    switch ($(this).attr("id")) {
        //                        case "SPFieldText":
        //                            thisField = $(this).text();
        //                            break;
        //                        case "SPFieldNote":
        //                            thisField = $(this).find("div").html();
        //                            break;
        //                        case "SPFieldURL":
        //                            thisField = $(this).find("img").attr("src");
        //                            break;
        //                        // Just in case
        //                        default:
        //                            thisField = $(this).text();
        //                            break;
        //                    }
        //                    // Stop looking; we're done
        //                    return false;
        //                }
        //            });
        //        }
        //        if (opt.fieldNames[i] !== "ID") {
        //            thisField = (typeof thisField !== "undefined") ? thisField.replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '') : null;
        //        }
        //        if (fieldCount > 1) {
        //            theseFields[opt.fieldNames[i]] = thisField;
        //        }
        //    }
        //
        //    return (fieldCount > 1) ? theseFields : thisField;
        //
        //}; // End SPServices.SPGetCurrentUser

        // SPUpdateMultipleListItems allows you to update multiple items in a list based upon some common characteristic or metadata criteria.
        //function SPUpdateMultipleListItems (options) {
        //
        //    var opt = $.extend({}, {
        //        webURL: "", // [Optional] URL of the target Web.  If not specified, the current Web is used.
        //        listName: "", // The list to operate on.
        //        CAMLQuery: "", // A CAML fragment specifying which items in the list will be selected and updated
        //        batchCmd: "Update", // The operation to perform. By default, Update.
        //        valuePairs: [], // valuePairs for the update in the form [[fieldname1, fieldvalue1], [fieldname2, fieldvalue2]...]
        //        completefunc: null, // Function to call on completion of rendering the change.
        //        debug: false // If true, show error messages;if false, run silent
        //    }, options);
        //
        //    var i;
        //    var itemsToUpdate = [];
        //    var documentsToUpdate = [];
        //
        //    // Call GetListItems to find all of the items matching the CAMLQuery
        //    SPServices({
        //        operation: "GetListItems",
        //        async: false,
        //        webURL: opt.webURL,
        //        listName: opt.listName,
        //        CAMLQuery: opt.CAMLQuery,
        //        CAMLQueryOptions: "<QueryOptions><ViewAttributes Scope='Recursive' /></QueryOptions>",
        //        completefunc: function (xData) {
        //            $(xData.responseXML).SPFilterNode("z:row").each(function () {
        //                itemsToUpdate.push($(this).attr("ows_ID"));
        //                var fileRef = $(this).attr("ows_FileRef");
        //                fileRef = "/" + fileRef.substring(fileRef.indexOf(";#") + 2);
        //                documentsToUpdate.push(fileRef);
        //            });
        //        }
        //    });
        //
        //    var fieldNum;
        //    var batch = "<Batch OnError='Continue'>";
        //    for (i = 0; i < itemsToUpdate.length; i++) {
        //        batch += "<Method ID='" + i + "' Cmd='" + opt.batchCmd + "'>";
        //        for (fieldNum = 0; fieldNum < opt.valuePairs.length; fieldNum++) {
        //            batch += "<Field Name='" + opt.valuePairs[fieldNum][0] + "'>" + escapeColumnValue(opt.valuePairs[fieldNum][1]) + "</Field>";
        //        }
        //        batch += "<Field Name='ID'>" + itemsToUpdate[i] + "</Field>";
        //        if (documentsToUpdate[i].length > 0) {
        //            batch += "<Field Name='FileRef'>" + documentsToUpdate[i] + "</Field>";
        //        }
        //        batch += "</Method>";
        //    }
        //    batch += "</Batch>";
        //
        //    // Call UpdateListItems to update all of the items matching the CAMLQuery
        //    SPServices({
        //        operation: "UpdateListItems",
        //        async: false,
        //        webURL: opt.webURL,
        //        listName: opt.listName,
        //        updates: batch,
        //        completefunc: function (xData) {
        //            // If present, call completefunc when all else is done
        //            if (opt.completefunc !== null) {
        //                opt.completefunc(xData);
        //            }
        //        }
        //    });
        //
        //} // End SPServices.SPUpdateMultipleListItems


    }]);
;'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apUtilityService
 * @description
 * Provides shared utility functionality across the application.
 *
 * @requires angularPoint.apConfig
 */
angular.module('angularPoint')
    .service('apUtilityService', ["$q", "_", "apConfig", "$timeout", function ($q, _, apConfig, $timeout) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        /** Extend underscore with a simple helper function */
        _.mixin({
            isDefined: function (value) {
                return !_.isUndefined(value);
            },
            /** Based on functionality in Breeze.js */
            isGuid: function (value) {
                return (typeof value === "string") && /[a-fA-F\d]{8}-(?:[a-fA-F\d]{4}-){3}[a-fA-F\d]{12}/
                        .test(value);
            }
        });


        /**
         * Add a leading zero if a number/string only contains a single character
         * @param {number|string} val
         * @returns {string} Two digit string.
         */
        function doubleDigit(val) {
            if (typeof val === 'number') {
                return val > 9 ? val.toString() : '0' + val;
            } else {
                return doubleDigit(parseInt(val));
            }
        }

        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:yyyymmdd
         * @methodOf angularPoint.apUtilityService
         * @description
         * Convert date into a int formatted as yyyymmdd
         * We don't need the time portion of comparison so an int makes this easier to evaluate
         */
        function yyyymmdd(date) {
            var yyyy = date.getFullYear();
            var mm = date.getMonth() + 1;
            var dd = date.getDate();
            /** Add leading 0's to month and day if necessary */
            return parseInt(yyyy + doubleDigit(mm) + doubleDigit(dd));
        }

        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:dateWithinRange
         * @methodOf angularPoint.apUtilityService
         * @description
         * Converts dates into yyyymmdd formatted ints and evaluates to determine if the dateToCheck
         * falls within the date range provided
         * @param {Date} startDate Starting date.
         * @param {Date} endDate Ending date.
         * @param {Date} [dateToCheck=new Date()] Defaults to the current date.
         * @returns {boolean} Does the date fall within the range?
         */
        function dateWithinRange(startDate, endDate, dateToCheck) {
            /** Ensure both a start and end date are provided **/
            if (!startDate || !endDate) {
                return false;
            }

            /** Use the current date as the default if one isn't provided */
            dateToCheck = dateToCheck || new Date();

            /** Create an int representation of each of the dates */
            var startInt = yyyymmdd(startDate);
            var endInt = yyyymmdd(endDate);
            var dateToCheckInt = yyyymmdd(dateToCheck);

            return startInt <= dateToCheckInt && dateToCheckInt <= endInt;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:batchProcess
         * @methodOf angularPoint.apUtilityService
         * @description
         * We REALLY don't want to lock the user's browser (blocking the UI thread) while iterating over an array of
         * entities and performing some process on them.  This function cuts the process into as many 50ms chunks as are
         * necessary. Based on example found in the following article:
         * [Timed array processing in JavaScript](http://www.nczonline.net/blog/2009/08/11/timed-array-processing-in-javascript/);
         * @param {Object[]} entities The entities that need to be processed.
         * @param {Function} process Reference to the process to be executed for each of the entities.
         * @param {Object} context this
         * @param {Number} [delay=25] Number of milliseconds to delay between batches.
         * @param {Number} [maxItems=entities.length] Maximum number of entities to process before pausing.
         * @returns {Object} Promise
         * @example
         * <pre>
         * function buildProjectSummary = function() {
         *    var deferred = $q.defer();
         *
         *    // Taken from a fictitious projectsModel.js
         *    projectModel.getAllListItems().then(function(entities) {
         *      var summaryObject = {};
         *      var extendProjectSummary = function(project) {
         *          // Do some process intensive stuff here
         *
         *      };
         *
         *      // Now that we have all of our projects we want to iterate
         *      // over each to create our summary object. The problem is
         *      // this could easily cause the page to hang with a sufficient
         *      // number of entities.
         *      apUtilityService.batchProcess(entities, extendProjectSummary, function() {
         *          // Long running process is complete so resolve promise
         *          deferred.resolve(summaryObject);
         *      }, 25, 1000);
         *    };
         *
         *    return deferred.promise;
         * }
         *
         * </pre>
         */

        function batchProcess(entities, process, context, delay, maxItems) {
            var itemCount = entities.length,
                batchCount = 0,
                chunkMax = maxItems || itemCount,
                delay = delay || 25,
                index = 0,
                deferred = $q.defer();

            function chunkTimer() {
                batchCount++;
                var start = +new Date(),
                    chunkIndex = index;

                while (index < itemCount && (index - chunkIndex) < chunkMax && (new Date() - start < 100)) {
                    process.call(context, entities[index], index, batchCount);
                    index += 1;
                }

                if (index < itemCount) {
                    $timeout(chunkTimer, delay);
                }
                else {
                    deferred.resolve(entities);
                }
            }

            chunkTimer();

            return deferred.promise;
        }


        //function batchProcess(items, process, context, delay, maxItems) {
        //    var n = items.length,
        //        delay = delay || 25,
        //        maxItems = maxItems || n,
        //        i = 0,
        //        deferred = $q.defer();
        //
        //    chunkTimer(i, n, deferred, items, process, context, delay, maxItems);
        //    return deferred.promise;
        //}
        //
        //function chunkTimer(i, n, deferred, items, process, context, delay, maxItems) {
        //    var start = +new Date(),
        //        j = i;
        //
        //    while (i < n && (i - j) < maxItems && (new Date() - start < 100)) {
        //        process.call(context, items[i]);
        //        i += 1;
        //    }
        //
        //    if (i < n) {
        //        setTimeout(function () {
        //            chunkTimer(j, n, deferred, items, process, context, delay, maxItems);
        //        }, delay);
        //    }
        //    else {
        //        deferred.resolve(items);
        //    }
        //}

        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:resolvePermissions
         * @methodOf angularPoint.apUtilityService
         * @param {string} permissionsMask The WSS Rights Mask is an 8-byte, unsigned integer that specifies
         * the rights that can be assigned to a user or site group. This bit mask can have zero or more flags set.
         * @description
         * Converts permMask into something usable to determine permission level for current user.  Typically used
         * directly from a list item.  See ListItem.resolvePermissions.
         *
         * <h3>Additional Info</h3>
         *
         * -   [PermMask in SharePoint DVWPs](http://sympmarc.com/2009/02/03/permmask-in-sharepoint-dvwps/)
         * -   [$().SPServices.SPLookupAddNew and security trimming](http://spservices.codeplex.com/discussions/208708)
         *
         * @returns {object} Object with properties for each permission level identifying if current user has rights (true || false)
         * @example
         * <pre>
         * var perm = apUtilityService.resolvePermissions('0x0000000000000010');
         * </pre>
         * Example of what the returned object would look like
         * for a site admin.
         * <pre>
         * perm = {
         *    "ViewListItems":true,
         *    "AddListItems":true,
         *    "EditListItems":true,
         *    "DeleteListItems":true,
         *    "ApproveItems":true,
         *    "OpenItems":true,
         *    "ViewVersions":true,
         *    "DeleteVersions":true,
         *    "CancelCheckout":true,
         *    "PersonalViews":true,
         *    "ManageLists":true,
         *    "ViewFormPages":true,
         *    "Open":true,
         *    "ViewPages":true,
         *    "AddAndCustomizePages":true,
         *    "ApplyThemeAndBorder":true,
         *    "ApplyStyleSheets":true,
         *    "ViewUsageData":true,
         *    "CreateSSCSite":true,
         *    "ManageSubwebs":true,
         *    "CreateGroups":true,
         *    "ManagePermissions":true,
         *    "BrowseDirectories":true,
         *    "BrowseUserInfo":true,
         *    "AddDelPrivateWebParts":true,
         *    "UpdatePersonalWebParts":true,
         *    "ManageWeb":true,
         *    "UseRemoteAPIs":true,
         *    "ManageAlerts":true,
         *    "CreateAlerts":true,
         *    "EditMyUserInfo":true,
         *    "EnumeratePermissions":true,
         *    "FullMask":true
         * }
         * </pre>
         */
        function resolvePermissions(permissionsMask) {
            var permissionSet = {};
            permissionSet.ViewListItems = (1 & permissionsMask) > 0;
            permissionSet.AddListItems = (2 & permissionsMask) > 0;
            permissionSet.EditListItems = (4 & permissionsMask) > 0;
            permissionSet.DeleteListItems = (8 & permissionsMask) > 0;
            permissionSet.ApproveItems = (16 & permissionsMask) > 0;
            permissionSet.OpenItems = (32 & permissionsMask) > 0;
            permissionSet.ViewVersions = (64 & permissionsMask) > 0;
            permissionSet.DeleteVersions = (128 & permissionsMask) > 0;
            permissionSet.CancelCheckout = (256 & permissionsMask) > 0;
            permissionSet.PersonalViews = (512 & permissionsMask) > 0;

            permissionSet.ManageLists = (2048 & permissionsMask) > 0;
            permissionSet.ViewFormPages = (4096 & permissionsMask) > 0;

            permissionSet.Open = (permissionsMask & 65536) > 0;
            permissionSet.ViewPages = (permissionsMask & 131072) > 0;
            permissionSet.AddAndCustomizePages = (permissionsMask & 262144) > 0;
            permissionSet.ApplyThemeAndBorder = (permissionsMask & 524288) > 0;
            permissionSet.ApplyStyleSheets = (1048576 & permissionsMask) > 0;
            permissionSet.ViewUsageData = (permissionsMask & 2097152) > 0;
            permissionSet.CreateSSCSite = (permissionsMask & 4194314) > 0;
            permissionSet.ManageSubwebs = (permissionsMask & 8388608) > 0;
            permissionSet.CreateGroups = (permissionsMask & 16777216) > 0;
            permissionSet.ManagePermissions = (permissionsMask & 33554432) > 0;
            permissionSet.BrowseDirectories = (permissionsMask & 67108864) > 0;
            permissionSet.BrowseUserInfo = (permissionsMask & 134217728) > 0;
            permissionSet.AddDelPrivateWebParts = (permissionsMask & 268435456) > 0;
            permissionSet.UpdatePersonalWebParts = (permissionsMask & 536870912) > 0;
            permissionSet.ManageWeb = (permissionsMask & 1073741824) > 0;
            permissionSet.UseRemoteAPIs = (permissionsMask & 137438953472) > 0;
            permissionSet.ManageAlerts = (permissionsMask & 274877906944) > 0;
            permissionSet.CreateAlerts = (permissionsMask & 549755813888) > 0;
            permissionSet.EditMyUserInfo = (permissionsMask & 1099511627776) > 0;
            permissionSet.EnumeratePermissions = (permissionsMask & 4611686018427387904) > 0;
            permissionSet.FullMask = (permissionsMask == 9223372036854775807);

            /**
             * Full Mask only resolves correctly for the Full Mask level
             * so in that case, set everything to true
             */
            if (permissionSet.FullMask) {
                _.each(permissionSet, function (perm, key) {
                    permissionSet[key] = true;
                });
            }

            return permissionSet;
        }

        function toCamelCase(s) {
            return s.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
                return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
            }).replace(/\s+/g, '');
        }

        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:fromCamelCase
         * @methodOf angularPoint.apUtilityService
         * @param {string} s String to convert.
         * @description
         * Converts a camel case string into a space delimited string with each word having a capitalized first letter.
         * @returns {string} Humanized string.
         */
        function fromCamelCase(s) {
            // insert a space before all caps
            return s.replace(/([A-Z])/g, ' $1')
                // uppercase the first character
                .replace(/^./, function (str) {
                    return str.toUpperCase();
                });
        }

        // Split values like 1;#value into id and value
        function SplitIndex(s) {
            var spl = s.split(';#');
            this.id = parseInt(spl[0], 10);
            this.value = spl[1];
        }

        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:stringifyXML
         * @methodOf angularPoint.apUtilityService
         * @description Simple utility to convert an XML object into a string and remove unnecessary whitespace.
         * @param {object} xml XML object.
         * @returns {string} Stringified version of the XML object.
         */
        function stringifyXML(xml) {
            var str;

            if(_.isObject(xml)) {
                str = xmlToString(xml).replace(/\s+/g, ' ');
            } else if(_.isString(xml)) {
                str = xml;
            }
            return str;
        }

        function xmlToString(xmlData) {

            var xmlString;
            //IE
            if (window.ActiveXObject){
                xmlString = xmlData.xml;
            }
            // code for Mozilla, Firefox, Opera, etc.
            else{
                xmlString = (new XMLSerializer()).serializeToString(xmlData);
            }
            return xmlString;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apUtilityService:registerChange
         * @methodOf angularPoint.apUtilityService
         * @description
         * If online and sync is being used, notify all online users that a change has been made.
         * //Todo Break this functionality into FireBase module that can be used if desired.
         * @param {object} model event
         */
        function registerChange(model) {
            /** Disabled this functionality until I can spend the necessary time to test */
            //if (!apConfig.offline && model.sync && _.isFunction(model.sync.registerChange)) {
            //    /** Register change after successful update */
            //    model.sync.registerChange();
            //}
        }

        return {
            batchProcess: batchProcess,
            dateWithinRange: dateWithinRange,
            doubleDigit: doubleDigit,
            fromCamelCase: fromCamelCase,
            registerChange: registerChange,
            resolvePermissions: resolvePermissions,
            SplitIndex: SplitIndex,
            stringifyXML:stringifyXML,
            toCamelCase: toCamelCase,
            yyyymmdd: yyyymmdd
        };
    }]);
;'use strict';

//  apWebServiceOperationConstants.OpName = [WebService, needs_SOAPAction];
//      OpName              The name of the Web Service operation -> These names are unique
//      WebService          The name of the WebService this operation belongs to
//      needs_SOAPAction    Boolean indicating whether the operation needs to have the SOAPAction passed in the setRequestHeaderfunction.
//                          true if the operation does a write, else false
angular.module('angularPoint')
    .service('apWebServiceService', function () {
        var SCHEMASharePoint = "http://schemas.microsoft.com/sharepoint";
        var serviceDefinitions = {
            Alerts: {
                action: SCHEMASharePoint + '/soap/2002/1/alerts/',
                xmlns: SCHEMASharePoint + '/soap/2002/1/alerts/'
            },
            Meetings: {
                action: SCHEMASharePoint + '/soap/meetings/',
                xmlns: SCHEMASharePoint + '/soap/meetings/'
            },
            Permissions: {
                action: SCHEMASharePoint + '/soap/directory/',
                xmlns: SCHEMASharePoint + '/soap/directory/'
            },
            PublishedLinksService: {
                action: 'http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/',
                xmlns: 'http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/'
            },
            Search: {
                action: 'urn:Microsoft.Search/',
                xmlns: 'urn:Microsoft.Search'
            },
            SharePointDiagnostics: {
                action: 'http://schemas.microsoft.com/sharepoint/diagnostics/',
                xmlns: SCHEMASharePoint + '/diagnostics/'
            },
            SocialDataService: {
                action: 'http://microsoft.com/webservices/SharePointPortalServer/SocialDataService/',
                xmlns: 'http://microsoft.com/webservices/SharePointPortalServer/SocialDataService'
            },
            SpellCheck: {
                action: 'http://schemas.microsoft.com/sharepoint/publishing/spelling/SpellCheck',
                xmlns: 'http://schemas.microsoft.com/sharepoint/publishing/spelling/'
            },
            TaxonomyClientService: {
                action: SCHEMASharePoint + '/taxonomy/soap/',
                xmlns: SCHEMASharePoint + '/taxonomy/soap/'
            },
            usergroup: {
                action: SCHEMASharePoint + '/soap/directory/',
                xmlns: SCHEMASharePoint + '/soap/directory/'
            },
            UserProfileService: {
                action: 'http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/',
                xmlns: 'http://microsoft.com/webservices/SharePointPortalServer/UserProfileService'
            },
            WebPartPages: {
                action: 'http://microsoft.com/sharepoint/webpartpages/',
                xmlns: 'http://microsoft.com/sharepoint/webpartpages'
            },
            Workflow: {
                action: SCHEMASharePoint + '/soap/workflow/',
                xmlns: SCHEMASharePoint + '/soap/workflow/'
            }
        };

        var webServices = [
            'Alerts',
            'Authentication',
            'Copy',
            'Forms',
            'Lists',
            'Meetings',
            'People',
            'Permissions',
            'PublishedLinksService',
            'Search',
            'SharePointDiagnostics',
            'SiteData',
            'Sites',
            'SocialDataService',
            'SpellCheck',
            'TaxonomyClientService',
            'usergroup',
            'UserProfileService',
            'Versions',
            'Views',
            'WebPartPages',
            'Webs',
            'Workflow'
        ];

        return {
            action: action,
            webServices: webServices,
            xmlns: xmlns
        };

        function action(service) {
            return serviceDefinitions[service] ? serviceDefinitions[service].action : SCHEMASharePoint + '/soap/';
        }

        function xmlns(service) {
            return serviceDefinitions[service] ? serviceDefinitions[service].xmlns : SCHEMASharePoint + '/soap/';
        }

    });
;'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apXMLToJSONService
 * @description
 * This function converts an XML node set into an array of JS objects.
 * This is essentially Marc Anderson's [SPServices](http://spservices.codeplex.com/) SPXmlTOJson function wrapped in
 * an Angular service to make it more modular and allow for testing.
 *
 */
angular.module('angularPoint')
    .service('apXMLToJSONService', ["_", "apDecodeService", function (_, apDecodeService) {

        // This function converts an XML node set to JSON
        return function (xmlNodeSet, options) {

            var defaults = {
                mapping: {}, // columnName: mappedName: "mappedName", objectType: "objectType"
                includeAllAttrs: false, // If true, return all attributes, regardless whether they are in the mapping
                removeOws: true, // Specifically for GetListItems, if true, the leading ows_ will be stripped off the field name
                sparse: false // If true, empty ("") values will not be returned
            };

            var opts = _.extend({}, defaults, options);

            var jsonObject = [];

            _.each(xmlNodeSet, function (node) {
                var row = {};
                var rowAttrs = node.attributes;

                if (!opts.sparse) {
                    // Bring back all mapped columns, even those with no value
                    _.each(opts.mapping, function (column) {
                        row[column.mappedName] = '';
                    });
                }

                _.each(rowAttrs, function (rowAttribute) {
                    var attributeName = rowAttribute.name;
                    var columnMapping = opts.mapping[attributeName];
                    var objectName = typeof columnMapping !== "undefined" ? columnMapping.mappedName : opts.removeOws ? attributeName.split("ows_")[1] : attributeName;
                    var objectType = typeof columnMapping !== "undefined" ? columnMapping.objectType : undefined;
                    if (opts.includeAllAttrs || columnMapping !== undefined) {
                        row[objectName] = apDecodeService.parseStringValue(rowAttribute.value, objectType);
                    }
                });

                // Push this item into the JSON Object
                jsonObject.push(row);
            });

            // Return the JSON object
            return jsonObject;
        };
    }]);
;'use strict';

/**
 * @ngdoc function
 * @name angularPoint.apCamlFactory
 * @description
 * Tools to assist with the creation of CAML queries.
 *
 */
angular.module('angularPoint')
    .factory('apCamlFactory', ["_", function (_) {

        return {
            camlContainsQuery: camlContainsQuery,
            chainCamlSelects: chainCamlSelects,
            createCamlContainsSelector: createCamlContainsSelector
        };


        /********************* Private **************************/


        /**
         * @ngdoc function
         * @name angularPoint.apCamlFactory:createCamlContainsSelector
         * @methodOf angularPoint.apCamlFactory
         * @description
         * Escapes characters that SharePoint gets upset about based on field type.
         * @example
         * <pre>
         * var testHTML = {objectType: 'HTML', staticName: 'HTML'};
         *
         * var testCaml = createCamlContainsSelector(testHTML, 'Test Query');
         * console.log(testCaml);
         *
         * //Returns
         * <Contains>
         *   <FieldRef Name=\"HTML\" />
         *   <Value Type=\"Text\"><![CDATA[Test Query]]></Value>
         * </Contains>
         * </pre>
         */
        function createCamlContainsSelector(fieldDefinition, searchString) {
            var camlSelector;
            switch (fieldDefinition.objectType) {
                case 'HTML':
                case 'JSON':
                    camlSelector = '' +
                    '<Contains>' +
                    '<FieldRef Name="' + fieldDefinition.staticName + '" />' +
                    /** Use CDATA wrapper to escape [&, <, > ] */
                    '<Value Type="Text"><![CDATA[' + searchString + ']]></Value>' +
                    '</Contains>';
                    break;
                default:
                    camlSelector = '' +
                    '<Contains>' +
                    '<FieldRef Name="' + fieldDefinition.staticName + '" />' +
                    '<Value Type="Text">' + searchString + '</Value>' +
                    '</Contains>';
            }
            return camlSelector;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apCamlFactory:chainCamlSelects
         * @methodOf angularPoint.apCamlFactory
         * @description
         * Used to combine multiple caml selectors into a single CAML query string wrapped properly.
         * @param {object[]} selectStatements An array of select statements to wrap in "<Or>".
         * @param {string} joinType Valid caml join type ('Or', 'And', ...).
         * @returns {string} CAML query string.
         */
        function chainCamlSelects(selectStatements, joinType) {
            var camlQuery = '',
                camlQueryClosure = '';
            _.each(selectStatements, function (statement, statementIndex) {
                /** Add an or clause if we still have additional fields to process */
                if (statementIndex < selectStatements.length - 1) {
                    camlQuery += '<' + joinType + '>';
                    camlQueryClosure = '</' + joinType + '>' + camlQueryClosure;
                }
                camlQuery += statement;
            });
            return camlQuery + camlQueryClosure;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apCamlFactory:camlContainsQuery
         * @methodOf angularPoint.apCamlFactory
         * @parameter {object[]} fieldDefinitionsArray Array of fields to search for a given search string.
         * @parameter {string} searchString String of text to search records for.
         * @description
         * Returns a combination of selectors using CAML '<Or></Or>' elements
         * @returns {string} Caml select string.
         * @example
         * <pre>
         *
         * var testHTML = {objectType: 'HTML', staticName: 'HTML'};
         * var testJSON = {objectType: 'JSON', staticName: 'JSON'};
         * var testText = {objectType: 'Text', staticName: 'Text'};
         * var testText2 = {objectType: 'Text', staticName: 'Text'};
         *
         * var testCaml = camlContainsQuery([testHTML, testText, testJSON, testText2], 'Test Query');
         * console.log(testCaml);
         *
         * //Returns
         * <Or><Contains><FieldRef Name=\"HTML\" /><Value Type=\"Text\"><![CDATA[Test Query]]>
         * </Value></Contains><Or><Contains><FieldRef Name=\"Text\" /><Value Type=\"Text\">Test Query</Value>
         * </Contains><Or><Contains><FieldRef Name=\"JSON\" /><Value Type=\"Text\"><![CDATA[Test Query]]>
         * </Value></Contains><Contains><FieldRef Name=\"Text\" /><Value Type=\"Text\">Test Query</Value>
         * </Contains></Or></Or></Or>
         * </pre>
         */
        function camlContainsQuery(fieldDefinitionsArray, searchString) {
            var selectStatements = [];

            /** Create a select statement for each field */
            _.each(fieldDefinitionsArray, function (fieldDefinition, definitionIndex) {
                selectStatements.push(createCamlContainsSelector(fieldDefinition, searchString));
            });

            return chainCamlSelects(selectStatements, 'And');
        }

    }]);
;'use strict';

/**
 * @ngdoc object
 * @name angularPoint.apIndexedCacheFactory
 * @description
 * Exposes the EntityFactory prototype and a constructor to instantiate a new Entity Factory in apCacheService.
 *
 */
angular.module('angularPoint')
    .factory('apIndexedCacheFactory', ["_", function (_) {


        /*********************** Private ****************************/


        /**
         * @ngdoc object
         * @name angularPoint.IndexedCache
         * @description
         * Cache constructor that is extended to make it easier to work with via prototype methods.  Located in
         * apIndexedCacheFactory.
         * @param {object} [object] Optionally extend new cache with provided object.
         * @constructor
         */
        function IndexedCache(object) {
            var self = this;
            if (object) {
                _.extend(self, object);
            }
        }

        IndexedCache.prototype = {
            addEntity: addEntity,
            clear: clear,
            count: count,
            first: first,
            keys: keys,
            last: last,
            nthEntity: nthEntity,
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

            if (_.isObject(entity) && !!entity.id) {
                /** Only add the entity to the cache if it's not already there */
                if (!cache[entity.id]) {
                    cache[entity.id] = entity;
                }
            } else {
                throw new Error('A valid entity wasn\'t found: ', entity);
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
            _.each(cache, function (entity, key) {
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
         * @name angularPoint.IndexedCache:nthEntity
         * @methodOf angularPoint.IndexedCache
         * @description
         * Based on the
         * @param {number} index The index of the item requested.
         * @returns {object} First entity in cache.
         */
        function nthEntity(index) {
            var cache = this;
            var keys = cache.keys();
            return cache[keys[index]];
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
            return cache.nthEntity(0);
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
            return cache[keys[keys.length - 1]];
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
         * @param {object|number} entity Entity to remove or ID of entity to be removed.
         */
        function removeEntity(entity) {
            var cache = this;
            if (_.isObject && entity.id && cache[entity.id]) {
                delete cache[entity.id];
            } else if (_.isNumber(entity)) {
                /** Allow entity ID to be used instead of then entity */
                delete cache[entity];
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
    }]
);
;'use strict';

/**
 * @ngdoc object
 * @name angularPoint.apListFactory
 * @description
 * Exposes the List prototype and a constructor to instantiate a new List.
 *
 * @requires angularPoint.apConfig
 * @requires angularPoint.apFieldService
 */
angular.module('angularPoint')
    .factory('apListFactory', ["_", "apConfig", "apFieldService", function (_, apConfig, apFieldService) {

        /**
         * @ngdoc object
         * @name List
         * @description
         * List Object Constructor.  This is handled automatically when creating a new model so there shouldn't be
         * any reason to manually call.
         * @param {object} config Initialization parameters.
         * @param {string} config.guid Unique SharePoint GUID for the list we'll be basing the model on
         * ex:'{4D74831A-42B2-4558-A67F-B0B5ADBC0EAC}'
         * @param {string} config.title Maps to the offline XML file in dev folder (no spaces)
         * ex: 'ProjectsList' so the offline XML file would be located at apConfig.offlineXML + 'ProjectsList.xml'
         * @param {object[]} [config.customFields] Mapping of SharePoint field names to the internal names we'll be using
         * in our application.  Also contains field type, readonly attribute, and any other non-standard settings.
         * See [List.customFields](#/api/List.FieldDefinition) for additional info on how to define a field type.
         * <pre>
         * [
         *   {
         *       staticName: "Title",
         *       objectType: "Text",
         *       mappedName: "lastName",
         *       readOnly:false
         *   },
         *   {
         *       staticName: "FirstName",
         *       objectType: "Text",
         *       mappedName: "firstName",
         *       readOnly:false
         *   },
         *   {
         *       staticName: "Organization",
         *       objectType: "Lookup",
         *       mappedName: "organization",
         *       readOnly:false
         *   },
         *   {
         *       staticName: "Account",
         *       objectType: "User",
         *       mappedName: "account",
         *       readOnly:false
         *   },
         *   {
         *       staticName: "Details",
         *       objectType: "Text",
         *       mappedName: "details",
         *       readOnly:false
         *   }
         * ]
         * </pre>
         * @constructor
         */
        function List(config) {
            var list = this;
            var defaults = {
                viewFields: '',
                customFields: [],
                isReady: false,
                fields: [],
                guid: '',
                mapping: {},
                title: '',
                webURL: apConfig.defaultUrl
            };

            _.extend(list, defaults, config);

            list.environments = list.environments || {production: list.guid};

            apFieldService.extendFieldDefinitions(list);
        }

        List.prototype.getListId = getListId;


        function getListId() {
            var list = this;
            if (_.isString(list.environments[apConfig.environment])) {
                /**
                 * For a multi-environment setup, we accept a list.environments object with a property for each named
                 * environment with a corresponding value of the list guid.  The active environment can be selected
                 * by setting apConfig.environment to the string name of the desired environment.
                 */
                return list.environments[apConfig.environment];
            } else {
                throw new Error('There isn\'t a valid environment definition for apConfig.environment=' + apConfig.environment + '  ' +
                'Please confirm that the list "' + list.title + '" has the necessary environmental configuration.');
            }
        }

        /**
         * @ngdoc object
         * @name List.FieldDefinition
         * @property {string} staticName The actual SharePoint field name.
         * @property {string} [objectType='Text']
         * <dl>
         *     <dt>Boolean</dt>
         *     <dd>Used to store a TRUE/FALSE value (stored in SharePoint as 0 or 1).</dd>
         *     <dt>Calc</dt>
         *     <dd>";#" Delimited String: The first value will be the calculated column value
         *     type, the second will be the value</dd>
         *     <dt>Choice</dt>
         *     <dd>Simple text string but when processing the initial list definition, we
         *     look for a Choices XML element within the field definition and store each
         *     value.  We can then retrieve the valid Choices with one of the following:
         *     ```var fieldDefinition = LISTITEM.getFieldDefinition('CHOICE_FIELD_NAME');```
         *                                      or
         *     ```var fieldDefinition = MODELNAME.getFieldDefinition('CHOICE_FIELD_NAME');```
         *     ```var choices = fieldDefinition.Choices;```

         *     </dd>
         *     <dt>Counter</dt>
         *     <dd>Same as Integer. Generally used only for the internal ID field. Its integer
         *     value is set automatically to be unique with respect to every other item in the
         *     current list. The Counter type is always read-only and cannot be set through a
         *     form post.</dd>
         *     <dt>Currency</dt>
         *     <dd>Floating point number.</dd>
         *     <dt>DateTime</dt>
         *     <dd>Replace dashes with slashes and the "T" deliminator with a space if found.  Then
         *     converts into a valid JS date object.</dd>
         *     <dt>Float</dt>
         *     <dd>Floating point number.</dd>
         *     <dt>HTML</dt>
         *     <dd>```_.unescape(STRING)```</dd>
         *     <dt>Integer</dt>
         *     <dd>Parses the string to a base 10 int.</dd>
         *     <dt>JSON</dt>
         *     <dd>Parses JSON if valid and converts into a a JS object.  If not valid, an error is
         *     thrown with additional info on specifically what is invalid.</dd>
         *     <dt>Lookup</dt>
         *     <dd>Passes string to Lookup constructor where it is broken into an object containing
         *     a "lookupValue" and "lookupId" attribute.  Inherits additional prototype methods from
         *     Lookup.  See [Lookup](#/api/Lookup) for more information.
         *     </dd>
         *     <dt>LookupMulti</dt>
         *     <dd>Converts multiple delimited ";#" strings into an array of Lookup objects.</dd>
         *     <dt>MultiChoice</dt>
         *     <dd>Converts delimited ";#" string into an array of strings representing each of the
         *     selected choices.  Similar to the single "Choice", the XML Choices are stored in the
         *     field definition after the initial call is returned from SharePoint so we can reference
         *     later.
         *     </dd>
         *     <dt>Number</dt>
         *     <dd>Treats as a float.</dd>
         *     <dt>Text</dt>
         *     <dd>**Default** No processing of the text string from XML.</dd>
         *     <dt>User</dt>
         *     <dd>Similar to Lookup but uses the "User" prototype as a constructor to convert into a
         *     User object with "lookupId" and "lookupValue" attributes.  The lookupId is the site collection
         *     ID for the user and the lookupValue is typically the display name.
         *     See [User](#/api/User) for more information.
         *     </dd>
         *     <dt>UserMulti</dt>
         *     <dd>Parses delimited string to returns an array of User objects.</dd>
         * </dl>
         * @property {string} mappedName The attribute name we'd like to use
         * for this field on the newly created JS object.
         * @property {boolean} [readOnly=false] When saving, we only push fields
         * that are mapped and not read only.
         * @property {boolean} [required=false] Allows us to validate the field to ensure it is valid based
         * on field type.

         * @description
         * Defined in the MODEL.list.fieldDefinitions array.  Each field definition object maps an internal field
         * in a SharePoint list/library to a JavaScript object using the internal SharePoint field name, the field
         * type, and the desired JavaScript property name to add onto the parsed list item object. Ignore shown usage,
         * each field definition is just an object within the fieldDefinitions array.
         *
         * @example
         * <pre>
         * angular.module('App')
         *  .service('taskerModel', function (apModelFactory) {
         *     // Object Constructor (class)
         *     // All list items are passed to the below constructor which inherits from
         *     // the ListItem prototype.
         *     function Task(obj) {
         *         var self = this;
         *         _.extend(self, obj);
         *     }
         *
         *     // Model Constructor
         *     var model = apModelFactory.create({
         *         factory: Task,
         *         list: {
         *             // Maps to the offline XML file in dev folder (no spaces)
         *             name: 'Tasks',
         *             // List GUID can be found in list properties in SharePoint designer
         *             guid: '{CB1B965E-D952-4ED5-86FD-FF8DA770F871}',
         *             customFields: [
         *                 // Array of objects mapping each SharePoint field to a
         *                 // property on a list item object
         *                 {
         *                  staticName: 'Title',
         *                  objectType: 'Text',
         *                  mappedName: 'title',
         *                  readOnly:false
         *                 },
         *                 {
         *                  staticName: 'Project',
         *                  objectType: 'Lookup',
         *                  mappedName: 'project',
         *                  readOnly:false
         *                 },
         *                 {
         *                  staticName: 'Priority',
         *                  objectType: 'Choice',
         *                  mappedName: 'priority',
         *                  readOnly:false
          *                },
         *                 {
         *                  staticName: 'Description',
         *                  objectType: 'Text',
         *                  mappedName: 'description',
         *                  readOnly:false
         *                 },
         *                 {
         *                  staticName: 'Manager',
         *                  objectType: 'Lookup',
         *                  mappedName: 'requirement',
         *                  readOnly:false
         *                 }
         *             ]
         *         }
         *     });
         *
         *     // Fetch data (pulls local xml if offline named model.list.title + '.xml')
         *     // Initially pulls all requested data.  Each subsequent call just pulls
         *     // records that have been changed, updates the model, and returns a reference
         *    // to the updated data array
         *     // @returns {Array} Requested list items
         *     model.registerQuery({name: 'primary'});
         *
         *     return model;
         * });
         * </pre>
         *
         */


        /**
         * @ngdoc function
         * @name angularPoint.apListFactory:create
         * @methodOf angularPoint.apListFactory
         * @param {object} config Options object.
         * @description
         * Instantiates and returns a new List.
         */
        var create = function (config) {
            return new List(config);
        };


        return {
            create: create,
            List: List
        }
    }]);
;'use strict';

/**
 * @ngdoc object
 * @name angularPoint.apListItemFactory
 * @description
 * Exposes the ListItem prototype and a constructor to instantiate a new ListItem.
 * See [ListItem](#/api/ListItem) for details of the methods available on the prototype.
 *
 * @requires ListItem
 * @requires angularPoint.apCacheService
 * @requires angularPoint.apDataService
 * @requires angularPoint.apUtilityService
 */
angular.module('angularPoint')
    .factory('apListItemFactory', ["$q", "_", "apCacheService", "apDataService", "apEncodeService", "apUtilityService", "apConfig", function ($q, _, apCacheService, apDataService, apEncodeService, apUtilityService, apConfig) {

        /**
         * @ngdoc object
         * @name ListItem
         * @description
         * Base prototype which all list items inherit from.  All methods can be accessed through this prototype so all CRUD
         * functionality can be called directly from a given list item.
         * @constructor
         */
        function ListItem() {
        }

        ListItem.prototype = {
            /** Ensure we properly have ListItem and the constructor */
            constructor: ListItem,

            /** Methods on the prototype */
            deleteAttachment: deleteAttachment,
            deleteItem: deleteItem,
            getAttachmentCollection: getAttachmentCollection,
            getFieldDefinition: getFieldDefinition,
            getFieldVersionHistory: getFieldVersionHistory,
            getLookupReference: getLookupReference,
            resolvePermissions: resolvePermissions,
            saveChanges: saveChanges,
            saveFields: saveFields,
            validateEntity: validateEntity
        };

        /**
         * @ngdoc function
         * @name ListItem.saveChanges
         * @description
         * Updates record directly from the object
         * @param {object} [options] Optionally pass params to the data service.
         * @param {boolean} [options.updateAllCaches=false] Search through the cache for each query to ensure entity is
         * updated everywhere.  This is more process intensive so by default we only update the cached entity in the
         * cache where this entity is currently stored.
         * @returns {object} Promise which resolved with the updated list item from the server.
         * @example
         * <pre>
         * // Example of save function on a fictitious
         * // app/modules/tasks/TaskDetailsCtrl.js modal form.
         * $scope.saveChanges = function(task) {
         *      task.saveChanges().then(function() {
         *          // Successfully saved so we can do something
         *          // like close form
         *
         *          }, function() {
         *          // Failure
         *
         *          });
         * }
         * </pre>
         */
        function saveChanges(options) {
            var listItem = this;
            var model = listItem.getModel();
            var deferred = $q.defer();

            apDataService.updateListItem(model, listItem, options)
                .then(function (response) {
                    deferred.resolve(response);
                    /** Optionally broadcast change event */
                    apUtilityService.registerChange(model);
                });

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name ListItem.saveFields
         * @description
         * Saves a named subset of fields back to SharePoint
         * Alternative to saving all fields
         * @param {array|string} fieldArray Array of internal field names that should be saved to SharePoint or a single
         * string to save an individual field.
         * @param {object} [options] Optionally pass params to the data service.
         * @param {boolean} [options.updateAllCaches=false] Search through the cache for each query to ensure entity is
         * updated everywhere.  This is more process intensive so by default we only update the cached entity in the
         * cache where this entity is currently stored.
         * @returns {object} Promise which resolves with the updated list item from the server.
         * @example
         * <pre>
         * // Example of saveFields function on a fictitious
         * // app/modules/tasks/TaskDetailsCtrl.js modal form.
         * // Similar to saveChanges but instead we only save
         * // specified fields instead of pushing everything.
         * $scope.updateStatus = function(task) {
         *      task.saveFields(['status', 'notes']).then(function() {
         *          // Successfully updated the status and
         *          // notes fields for the given task
         *
         *          }, function() {
         *          // Failure to update the field
         *
         *          });
         * }
         * </pre>
         */
        function saveFields(fieldArray, options) {

            var listItem = this;
            var model = listItem.getModel();
            var deferred = $q.defer();
            var definitions = [];
            /** Allow a string to be passed in to save a single field */
            var fieldNames = _.isString(fieldArray) ? [fieldArray] : fieldArray;
            /** Find the field definition for each of the requested fields */
            _.each(fieldNames, function (field) {
                var match = _.findWhere(model.list.customFields, {mappedName: field});
                if (match) {
                    definitions.push(match);
                }
            });

            /** Generate value pairs for specified fields */
            var valuePairs = apEncodeService.generateValuePairs(definitions, listItem);

            var defaults = {buildValuePairs: false, valuePairs: valuePairs};

            /** Extend defaults with any provided options */
            var opts = _.extend({}, defaults, options);

            apDataService.updateListItem(model, listItem, opts)
                .then(function (response) {
                    deferred.resolve(response);
                    /** Optionally broadcast change event */
                    apUtilityService.registerChange(model);
                });

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name ListItem.deleteItem
         * @description
         * Deletes record directly from the object and removes record from user cache.
         * @param {object} [options] Optionally pass params to the dataService.
         * @param {boolean} [options.updateAllCaches=false] Iterate over each of the query cache's and ensure the entity is
         * removed everywhere.  This is more process intensive so by default we only remove the cached entity in the
         * cache where this entity is currently stored.
         * @returns {object} Promise which really only lets us know the request is complete.
         * @example
         * ```
         * <ul>
         *    <li ng-repeat="task in tasks">
         *        {{task.title}} <a href ng-click="task.deleteItem()>delete</a>
         *    </li>
         * </ul>
         * ```
         * List of tasks.  When the delete link is clicked, the list item item is removed from the local cache and
         * the view is updated to no longer show the task.
         */
        function deleteItem(options) {
            var listItem = this;
            var model = listItem.getModel();
            var deferred = $q.defer();

            apDataService.deleteListItem(model, listItem, options).then(function (response) {
                deferred.resolve(response);
                /** Optionally broadcast change event */
                apUtilityService.registerChange(model);
            });

            return deferred.promise;
        }


        /**
         * @ngdoc function
         * @name ListItem.getLookupReference
         * @description
         * Allows us to retrieve the entity being referenced in a given lookup field.
         * @param {string} fieldName Name of the lookup property on the list item that references an entity.
         * @param {number} [lookupId=listItem.fieldName.lookupId] The listItem.lookupId of the lookup object.  This allows us to also use this logic
         * on a multi-select by iterating over each of the lookups.
         * @example
         * <pre>
         * var project = {
         *    title: 'Project 1',
         *    location: {
         *        lookupId: 5,
         *        lookupValue: 'Some Building'
         *    }
         * };
         *
         * //To get the location entity
         * var entity = project.getLookupReference('location');
         * </pre>
         * @returns {object} The entity the lookup is referencing or undefined if not in the cache.
         */
        function getLookupReference(fieldName, lookupId) {
            var listItem = this;
            if (_.isUndefined(fieldName)) {
                throw new Error('A field name is required.', fieldName);
            } else if (_.isEmpty(listItem[fieldName])) {
                return '';
            } else {
                var model = listItem.getModel();
                var fieldDefinition = model.getFieldDefinition(fieldName);
                /** Ensure the field definition has the List attribute which contains the GUID of the list
                 *  that a lookup is referencing. */
                if (fieldDefinition && fieldDefinition.List) {
                    var targetId = lookupId || listItem[fieldName].lookupId;
                    return apCacheService.getCachedEntity(fieldDefinition.List, targetId);
                } else {
                    throw new Error('This isn\'t a valid Lookup field or the field definitions need to be extended ' +
                    'before we can complete this request.', fieldName, lookupId);
                }
            }
        }

        /**
         * @ngdoc function
         * @name ListItem.validateEntity
         * @description
         * Helper function that passes the current item to Model.validateEntity
         * @param {object} [options] Optionally pass params to the dataService.
         * @param {boolean} [options.toast=true] Set to false to prevent toastr messages from being displayed.
         * @returns {boolean} Evaluation of validity.
         */
        function validateEntity(options) {
            var listItem = this,
                model = listItem.getModel();
            return model.validateEntity(listItem, options);
        }

        /**
         * @ngdoc function
         * @name ListItem.getFieldDefinition
         * @description
         * Returns the field definition from the definitions defined in the custom fields array within a model.
         * @example
         * <pre>
         * var project = {
         *    title: 'Project 1',
         *    location: {
         *        lookupId: 5,
         *        lookupValue: 'Some Building'
         *    }
         * };
         *
         * //To get field metadata
         * var locationDefinition = project.getFieldDefinition('location');
         * </pre>
         * @param {string} fieldName Internal field name.
         * @returns {object} Field definition.
         */
        function getFieldDefinition(fieldName) {
            var listItem = this;
            return listItem.getModel().getFieldDefinition(fieldName);
        }


        /**
         * @ngdoc function
         * @name ListItem.getAttachmentCollection
         * @description
         * Requests all attachments for a given list item.
         * @returns {object} Promise which resolves with all attachments for a list item.
         * @example
         * <pre>
         * //Pull down all attachments for the current list item
         * var fetchAttachments = function (listItem) {
         *     listItem.getAttachmentCollection()
         *         .then(function (attachments) {
         *             scope.attachments = attachments;
         *         });
         * };
         * </pre>
         */
        function getAttachmentCollection() {
            var listItem = this;
            return apDataService.getCollection({
                operation: 'GetAttachmentCollection',
                listName: listItem.getModel().list.getListId(),
                webURL: listItem.getModel().list.webURL,
                ID: listItem.id,
                filterNode: 'Attachment'
            });
        }

        /**
         * @ngdoc function
         * @name ListItem.deleteAttachment
         * @description
         * Delete an attachment from a list item.
         * @param {string} url Requires the URL for the attachment we want to delete.
         * @returns {object} Promise which resolves with the updated attachment collection.
         * @example
         * <pre>
         * $scope.deleteAttachment = function (attachment) {
         *     var confirmation = window.confirm("Are you sure you want to delete this file?");
         *     if (confirmation) {
         *         scope.listItem.deleteAttachment(attachment).then(function () {
         *             alert("Attachment successfully deleted");
         *         });
         *     }
         * };
         * </pre>
         */
        function deleteAttachment(url) {
            var listItem = this;
            return apDataService.deleteAttachment({
                listItemID: listItem.id,
                url: url,
                listName: listItem.getModel().list.getListId()
            });
        }

        /**
         * @ngdoc function
         * @name ListItem.resolvePermissions
         * @description
         * See apModelService.resolvePermissions for details on what we expect to have returned.
         * @returns {Object} Contains properties for each permission level evaluated for current user.
         * @example
         * Lets assume we're checking to see if a user has edit rights for a given task list item.
         * <pre>
         * var canUserEdit = function(task) {
         *      var userPermissions = task.resolvePermissions();
         *      return userPermissions.EditListItems;
         * };
         * </pre>
         * Example of what the returned object would look like
         * for a site admin.
         * <pre>
         * userPermissions = {
         *    "ViewListItems":true,
         *    "AddListItems":true,
         *    "EditListItems":true,
         *    "DeleteListItems":true,
         *    "ApproveItems":true,
         *    "OpenItems":true,
         *    "ViewVersions":true,
         *    "DeleteVersions":true,
         *    "CancelCheckout":true,
         *    "PersonalViews":true,
         *    "ManageLists":true,
         *    "ViewFormPages":true,
         *    "Open":true,
         *    "ViewPages":true,
         *    "AddAndCustomizePages":true,
         *    "ApplyThemeAndBorder":true,
         *    "ApplyStyleSheets":true,
         *    "ViewUsageData":true,
         *    "CreateSSCSite":true,
         *    "ManageSubwebs":true,
         *    "CreateGroups":true,
         *    "ManagePermissions":true,
         *    "BrowseDirectories":true,
         *    "BrowseUserInfo":true,
         *    "AddDelPrivateWebParts":true,
         *    "UpdatePersonalWebParts":true,
         *    "ManageWeb":true,
         *    "UseRemoteAPIs":true,
         *    "ManageAlerts":true,
         *    "CreateAlerts":true,
         *    "EditMyUserInfo":true,
         *    "EnumeratePermissions":true,
         *    "FullMask":true
         * }
         * </pre>
         */
        function resolvePermissions() {
            var listItem = this;
            return apUtilityService.resolvePermissions(listItem.permMask);
        }


        /**
         * @ngdoc function
         * @name ListItem.getFieldVersionHistory
         * @description
         * Takes an array of field names, finds the version history for field, and returns a snapshot of the object at each
         * version.  If no fields are provided, we look at the field definitions in the model and pull all non-readonly
         * fields.  The only way to do this that I've been able to get working is to get the version history for each
         * field independently and then build the history by combining the server responses for each requests into a
         * snapshot of the object.
         * @param {string[]} [fieldNames] An array of field names that we're interested in.
         * @returns {object} promise - containing array of changes
         * @example
         * Assuming we have a modal form where we want to display each version of the title and project fields
         * of a given list item.
         * <pre>
         * myGenericListItem.getFieldVersionHistory(['title', 'project'])
         *     .then(function(versionHistory) {
         *            // We now have an array of every version of these fields
         *            $scope.versionHistory = versionHistory;
         *      };
         * </pre>
         */
        function getFieldVersionHistory(fieldNames) {
            var deferred = $q.defer();
            var promiseArray = [];
            var listItem = this;
            var model = listItem.getModel();

            /** Constructor that creates a promise for each field */
            var createPromise = function (fieldName) {

                var fieldDefinition = _.findWhere(model.list.fields, {mappedName: fieldName});

                var payload = {
                    operation: 'GetVersionCollection',
                    strlistID: model.list.getListId(),
                    strlistItemID: listItem.id,
                    strFieldName: fieldDefinition.staticName
                };

                /** Manually set site url if defined, prevents SPServices from making a blocking call to fetch it. */
                if (apConfig.defaultUrl) {
                    payload.webURL = apConfig.defaultUrl;
                }

                promiseArray.push(apDataService.getFieldVersionHistory(payload, fieldDefinition));
            };

            if (!fieldNames) {
                /** If fields aren't provided, pull the version history for all NON-readonly fields */
                var targetFields = _.where(model.list.fields, {readOnly: false});
                fieldNames = [];
                _.each(targetFields, function (field) {
                    fieldNames.push(field.mappedName);
                });
            } else if (_.isString(fieldNames)) {
                /** If a single field name is provided, add it to an array so we can process it more easily */
                fieldNames = [fieldNames];
            }

            /** Generate promises for each field */
            _.each(fieldNames, function (fieldName) {
                createPromise(fieldName);
            });

            /** Pause until all requests are resolved */
            $q.all(promiseArray).then(function (changes) {
                var versionHistory = {};

                /** All fields should have the same number of versions */
                _.each(changes, function (fieldVersions) {

                    _.each(fieldVersions, function (fieldVersion) {
                        versionHistory[fieldVersion.modified.toJSON()] =
                            versionHistory[fieldVersion.modified.toJSON()] || {};

                        /** Add field to the version history for this version */
                        _.extend(versionHistory[fieldVersion.modified.toJSON()], fieldVersion);
                    });
                });

                var versionArray = [];
                /** Add a version prop on each version to identify the numeric sequence */
                _.each(versionHistory, function (ver, num) {
                    ver.version = num;
                    versionArray.push(ver);
                });

                deferred.resolve(versionArray);
            });

            return deferred.promise;
        }

        /** In the event that a factory isn't specified, just use a
         * standard constructor to allow it to inherit from ListItem */
        var StandardListItem = function (item) {
            var self = this;
            _.extend(self, item);
        };


        /**
         * @ngdoc function
         * @name angularPoint.apListItemFactory:create
         * @methodOf angularPoint.apListItemFactory
         * @description
         * Instantiates and returns a new ListItem.
         */
        var create = function () {
            return new ListItem();
        };

        /**
         * @ngdoc function
         * @name angularPoint.apListItemFactory:createGenericFactory
         * @methodOf angularPoint.apListItemFactory
         * @description
         * In the event that a factory isn't specified, just use a
         * standard constructor to allow it to inherit from ListItem
         */
        var createGenericFactory = function () {
            return new StandardListItem();
        };

        return {
            create: create,
            createGenericFactory: createGenericFactory,
            ListItem: ListItem,
            StandardListItem: StandardListItem
        }
    }]);
;'use strict';

/**
 * @ngdoc function
 * @name angularPoint.apLookupFactory
 * @description
 * Tools to assist with the creation of CAML queries.
 *
 */
angular.module('angularPoint')
    .factory('apLookupFactory', ["_", "$q", "apUtilityService", function (_, $q, apUtilityService) {


        /**
         * @ngdoc function
         * @name Lookup
         * @description
         * Allows for easier distinction when debugging if object type is shown as either Lookup or User.  Also allows us
         * to create an async request for the entity being referenced by the lookup
         * @param {string} s String to split into lookupValue and lookupId
         * @param {object} options Contains a reference to the parent list item and the property name.
         * @param {object} options.entity Reference to parent list item.
         * @param {object} options.propertyName Key on list item object.
         * @constructor
         */
        function Lookup(s, options) {
            var lookup = this;
            var thisLookup = new apUtilityService.SplitIndex(s);
            lookup.lookupId = thisLookup.id;
            lookup.lookupValue = thisLookup.value || '';
            //TODO Check to see if there's a better way to handle this besides adding a property to the lookup obj
            //lookup._props = function () {
            //    return options;
            //};
        }

        //Todo Look to see if getting this working again has any real value
        //Lookup.prototype = {
        //    getEntity: getEntity,
        //    getProperty: getProperty
        //};

        ///**
        // * @ngdoc function
        // * @name Lookup.getEntity
        // * @methodOf Lookup
        // * @description
        // * Allows us to create a promise that will resolve with the entity referenced in the lookup whenever that list
        // * item is registered.
        // * @example
        // * <pre>
        // * var project = {
        // *    title: 'Project 1',
        // *    location: {
        // *        lookupId: 5,
        // *        lookupValue: 'Some Building'
        // *    }
        // * };
        // *
        // * //To get the location entity
        // * project.location.getEntity().then(function(entity) {
        // *     //Resolves with the full location entity once it's registered in the cache
        // *
        // *    });
        // * </pre>
        // * @returns {promise} Resolves with the object the lookup is referencing.
        // */
        //function getEntity() {
        //    var self = this;
        //    var props = self._props();
        //
        //    if (!props.getEntity) {
        //        var query = props.getQuery();
        //        var listItem = query.searchLocalCache(props.entity.id);
        //
        //        /** Create a new deferred object if this is the first run */
        //        props.getEntity = $q.defer();
        //        listItem.getLookupReference(props.propertyName, self.lookupId)
        //            .then(function (entity) {
        //                props.getEntity.resolve(entity);
        //            })
        //    }
        //    return props.getEntity.promise;
        //}

        ///**
        // * @ngdoc function
        // * @name Lookup.getProperty
        // * @methodOf Lookup
        // * @description
        // * Returns a promise which resolves with the value of a property in the referenced object.
        // * @param {string} propertyPath The dot separated propertyPath.
        // * @example
        // * <pre>
        // * var project = {
        // *    title: 'Project 1',
        // *    location: {
        // *        lookupId: 5,
        // *        lookupValue: 'Some Building'
        // *    }
        // * };
        // *
        // * //To get the location.city
        // * project.location.getProperty('city').then(function(city) {
        // *    //Resolves with the city property from the referenced location entity
        // *
        // *    });
        // * </pre>
        // * @returns {promise} Resolves with the value, or undefined if it doesn't exists.
        // */
        //function getProperty(propertyPath) {
        //    var self = this;
        //    var deferred = $q.defer();
        //    self.getEntity().then(function (entity) {
        //        deferred.resolve(_.deepGetOwnValue(entity, propertyPath));
        //    });
        //    return deferred.promise;
        //}


        /**
         * @ngdoc function
         * @name angularPoint.apLookupFactory:create
         * @methodOf angularPoint.apLookupFactory
         * @description
         * Instantiates and returns a new Lookup field.
         */
        var create = function (s, options) {
            return new Lookup(s, options);
        };

        return {
            create: create,
            Lookup: Lookup
        }
    }]);
;'use strict';

/**
 * @ngdoc object
 * @name angularPoint.apModelFactory
 * @description
 * Exposes the model prototype and a constructor to instantiate a new Model.
 *
 * @requires angularPoint.apModalService
 * @requires angularPoint.apCacheService
 * @requires angularPoint.apDataService
 * @requires angularPoint.apListFactory
 * @requires angularPoint.apListItemFactory
 * @requires angularPoint.apQueryFactory
 * @requires angularPoint.apUtilityService
 */
angular.module('angularPoint')
    .factory('apModelFactory', ["_", "apCacheService", "apDataService", "apListFactory", "apListItemFactory", "apQueryFactory", "apUtilityService", "apFieldService", "apConfig", "apIndexedCacheFactory", "apDecodeService", "$q", "toastr", function (_, apCacheService, apDataService, apListFactory, apListItemFactory, apQueryFactory, apUtilityService, apFieldService, apConfig, apIndexedCacheFactory, apDecodeService, $q, toastr) {

        var defaultQueryName = apConfig.defaultQueryName;

        /**
         * @ngdoc function
         * @name Model
         * @description
         * Model Constructor
         * Provides the Following
         * - adds an empty "data" array
         * - adds an empty "queries" object
         * - adds a deferred obj "ready"
         * - builds "model.list" with constructor
         * - adds "getAllListItems" function
         * - adds "addNewItem" function
         * @param {object} config Object containing optional params.
         * @param {object} [config.factory = apListItemFactory.createGenericFactory()] - Constructor function for
         * individual list items.
         * @param {boolean} [config.fieldDefinitionsExtended=false] Queries using the GetListItemChangesSinceToken
         * operation return the full list definition along with the requested entities.  The first time one of these
         * queries is executed we will try to extend our field definitions defined in the model with the additional
         * information provided from the server.  Examples are options for a Choice field, display name of the field,
         * field description, and any other field information provided for the fields specified in the model.  This
         * flag is set once the first query is complete so we don't process again.
         * @param {object} config.list - Definition of the list in SharePoint.
         * be passed to the list constructor to extend further
         * @param {string} config.list.title - List name, no spaces.  Offline XML file will need to be
         * named the same (ex: CustomList so xml file would be apConfig.offlineXML + '/CustomList.xml')
         * @param {string} config.list.getListId() - Unique SharePoint ID (ex: '{3DBEB25A-BEF0-4213-A634-00DAF46E3897}')
         * @param {object[]} config.list.customFields - Maps SharePoint fields with names we'll use within the
         * application.  Identifies field types and formats accordingly.  Also denotes if a field is read only.
         * @constructor
         *
         * @example
         * <pre>
         * //Taken from a fictitious projectsModel.js
         * var model = new apModelFactory.Model({
         *     factory: Project,
         *     list: {
         *         guid: '{PROJECT LIST GUID}',
         *         title: 'Projects',
         *         customFields: [
         *             {
         *                staticName: 'Title',
         *                objectType: 'Text',
         *                mappedName: 'title',
         *                readOnly: false
         *             },
         *             {
         *                staticName: 'Customer',
         *                objectType: 'Lookup',
         *                mappedName: 'customer',
         *                readOnly: false
         *             },
         *             {
         *                staticName: 'ProjectDescription',
         *                objectType: 'Text',
         *                mappedName: 'projectDescription',
         *                readOnly: false
         *             },
         *             {
         *                staticName: 'Status',
         *                objectType: 'Text',
         *                mappedName: 'status',
         *                readOnly: false
         *             },
         *             {
         *                staticName: 'TaskManager',
         *                objectType: 'User',
         *                mappedName: 'taskManager',
         *                readOnly: false
         *             },
         *             {
         *                staticName: 'ProjectGroup',
         *                objectType: 'Lookup',
         *                mappedName: 'group',
         *                readOnly: false
         *             },
         *             {
         *                staticName: 'CostEstimate',
         *                objectType: 'Currency',
         *                mappedName: 'costEstimate',
         *                readOnly: false
         *             },
         *             {
         *                staticName: 'Active',
         *                objectType: 'Boolean',
         *                mappedName: 'active',
         *                readOnly: false
         *             },
         *             {
         *                staticName: 'Attachments',
         *                objectType: 'Attachments',
         *                mappedName: 'attachments',
         *                readOnly: true
         *             }
         *         ]
         *     }
         * });
         * </pre>
         */
        function Model(config) {
            var model = this;
            var defaults = {
                data: [],
                factory: apListItemFactory.createGenericFactory(),
                fieldDefinitionsExtended: false,
                /** Date/Time of last communication with server */
                lastServerUpdate: null,
                queries: {}
            };

            _.extend(model, defaults, config);

            /** Use list constructor to decorate */
            model.list = apListFactory.create(model.list);

            /** Set the constructor's prototype to inherit from ListItem so we can inherit functionality */
            model.factory.prototype = apListItemFactory.create();
            /** Constructor for ListItem is Object so ensure we update to properly reference ListItem */
            model.factory.constructor = apListItemFactory.ListItem;

            /** Make the model directly accessible from the list item */
            model.factory.prototype.getModel = function () {
                return model;
            };

            /** Register cache name with cache service so we can map factory name with list GUID */
            apCacheService.registerModel(model);

            /** Convenience query that simply returns all list items within a list. */
            model.registerQuery({
                name: 'getAllListItems',
                operation: 'GetListItems'
            });

            model.searchLocalCache = searchLocalCache;

            return model;
        }

        /** All Models inherit the following from their base prototype */
        Model.prototype = {
            addNewItem: addNewItem,
            createEmptyItem: createEmptyItem,
            executeQuery: executeQuery,
            extendListMetadata: extendListMetadata,
            generateMockData: generateMockData,
            getAllListItems: getAllListItems,
            getCache: getCache,
            getCachedEntity: getCachedEntity,
            getCachedEntities: getCachedEntities,
            getFieldDefinition: getFieldDefinition,
            getListItemById: getListItemById,
            //getLocalEntity: getLocalEntity,
            getQuery: getQuery,
            //initializeModalState: initializeModalState,
            isInitialised: isInitialised,
            //resolvePermissions: resolvePermissions,
            registerQuery: registerQuery,
            validateEntity: validateEntity
        };

        return {
            create: create,
            deepGroup: deepGroup,
            Model: Model,
            searchLocalCache: searchLocalCache
        };


        /********************* Private **************************/

        /**
         * @ngdoc function
         * @name Model.searchLocalCache
         * @module Model
         * @description
         * Search functionality that allow for deeply searching an array of objects for the first
         * record matching the supplied value.  Additionally it maps indexes to speed up future calls.  It
         * currently rebuilds the mapping when the length of items in the local cache has changed or when the
         * rebuildIndex flag is set.
         *
         * @param {*} value The value or array of values to compare against.
         * @param {object} [options] Object containing optional parameters.
         * @param {string} [options.propertyPath] The dot separated propertyPath.
         * <pre>
         * 'project.lookupId'
         * </pre>
         * @param {object} [options.cacheName] Required if using a data source other than primary cache.
         * @param {object} [options.localCache=model.getCache()] Array of objects to search (Default model.getCache()).
         * @param {boolean} [options.rebuildIndex=false] Ignore previous index and rebuild.
         *
         * @returns {(object|object[])} Either the object(s) that you're searching for or undefined if not found.
         */
        function searchLocalCache(value, options) {
            var model = this,
                searchCache,
                searchIndex,
                searchResults,
                defaults = {
                    propertyPath: 'id',
                    localCache: model.getCache(),
                    cacheName: 'main',
                    rebuildIndex: false
                };
            /** Extend defaults with any provided options */
            var opts = _.extend({}, defaults, options);

            if (opts.propertyPath === 'id') {
                searchIndex = opts.localCache;
            } else {
                /** Create a cache if it doesn't already exist */
                model._cachedIndexes = model._cachedIndexes || {};
                model._cachedIndexes[opts.cacheName] = model._cachedIndexes[opts.cacheName] || {};
                searchCache = model._cachedIndexes[opts.cacheName];
                var properties = opts.propertyPath.split('.');
                /** Create cache location with the same property map as the one provided
                 * @example
                 * <pre>
                 * model._cachedIndexes{
                 *      main: { //Default Cache name unless otherwise specified
                 *          lookup: {
                 *              lookupId: { ///// Cache Location for 'lookup.lookupId' //////// }
                 *          },
                 *          user: {
                 *              lookupValue: { ///// Cache Location for 'user.lookupValue' //////// }
                 *          }
                 *      }
                 * }
                 * </pre>
                 */
                _.each(properties, function (attribute) {
                    searchCache[attribute] = searchCache[attribute] || {};
                    /** Update cache reference to another level down the cache object */
                    searchCache = searchCache[attribute];
                });

                /** Remap if no existing map, the number of items in the array has changed, or the rebuild flag is set */
                if (!_.isNumber(searchCache.count) || searchCache.count !== opts.localCache.count() || opts.rebuildIndex) {
                    searchCache.indexedCache = deepGroup(opts.localCache, opts.propertyPath);
                    /** Store the current length of the array for future comparisons */
                    searchCache.count = opts.localCache.count();
                    /** Simple counter to gauge the frequency we rebuild cache */
                    searchCache.buildCount = searchCache.buildCount || 0;
                    searchCache.buildCount++;
                }
                searchIndex = searchCache.indexedCache;
            }

            /** Allow an array of values to be passed in */
            if (_.isArray(value)) {
                searchResults = [];
                _.each(value, function (key) {
                    searchResults.push(searchIndex[key]);
                });
                /** Primitive passed in */
            } else {
                searchResults = searchIndex[value];
            }
            return searchResults;
        }

        /**
         * @ngdoc function
         * @name Model.deepGroup
         * @module Model
         * @description
         * Creates an indexed cache of entities using a provided property path string to find the key for the cache.
         * @param {object} object A cached index object.
         * @param {string} propertyPath Dot separated property path that leads to the desired property to use as a key.
         * @returns {object} New indexed cache based on the provided property path string.
         */
        function deepGroup(object, propertyPath) {

            function DeepGroup() {
            }

            /** Use the methods on the IndexedCacheFactory for the base prototype */
            DeepGroup.prototype = apIndexedCacheFactory.IndexedCache;
            /** Overwrite the addEntity method on base prototype to allow for dynamic property path */
            DeepGroup.prototype.addEntity = addEntity;


            var group = new DeepGroup();
            _.each(object, function (entity) {
                group.addEntity(entity);
            });

            return group;


            function addEntity(entity) {
                var cache = this;
                var targetProperty = _.deepGet(entity, propertyPath);
                if (targetProperty) {
                    cache[targetProperty] = entity;
                }
            }
        }

        ///**
        // * @ngdoc function
        // * @name Model.getLocalEntity
        // * @module Model
        // * @description
        // * Similar to Model.searchLocalCache but you don't need to specify a query, only searches by list item
        // * id, and returns a promise that is fulfilled once the requested list item is registered in the cache
        // *
        // * @param {number} entityId The ListItem.id of the object.
        // * @returns {promise} Will resolve once the item is registered in the cache.
        // * @example
        // * <pre>
        // * var task = {
        // *    title: 'A Task',
        // *    project: {
        // *        lookupId: 4,
        // *        lookupValue: 'Super Project'
        // *    }
        // * };
        // *
        // * // Now we'd like to get the project referenced in the task
        // * projectModel.getLocalEntity(task.project.lookupId).then(function(entity) {
        // *     var projectThatICareAbout = entity;
        // *     //Do something with it
        // * }
        // * </pre>
        // */
        //function getLocalEntity(entityId) {
        //    var model = this;
        //    return apCacheService.getEntity(model.list.getListId(), entityId);
        //}

        /**
         * @ngdoc function
         * @name Model.getAllListItems
         * @description
         * Inherited from Model constructor
         * Gets all list items in the current list, processes the xml, and caches the data in model.
         * @returns {object} Promise returning all list items when resolved.
         * @example
         * <pre>
         * //Taken from a fictitious projectsModel.js
         * projectModel.getAllListItems().then(function(entities) {
         *     //Do something with all of the returned entities
         *     $scope.projects = entities;
         * };
         * </pre>
         */
        function getAllListItems() {
            var model = this;
            return apDataService.executeQuery(model, model.queries.getAllListItems);
        }

        /**
         * @ngdoc function
         * @name Model.getListItemById
         * @param {number} entityId Id of the item being requested.
         * @param {object} options Used to override apDataService defaults.
         * @description
         * Inherited from Model constructor
         * Attempts to retrieve the requested list item from the server.
         * @returns {object} Promise that resolves with the requested list item if found.  Otherwise it returns undefined.
         * @example
         * <pre>
         * //Taken from a fictitious projectsModel.js
         * projectModel.getListItemById().then(function(entity) {
         *     //Do something with the located entity
         *     $scope.project = entity;
         * };
         * </pre>
         */
        function getListItemById(entityId, options) {
            var model = this,
                /** Only required option for apDataService is listName which is available on model */
                defaults = {listName: model.list.getListId()},
                opts = _.extend({}, defaults, options);

            /** Fetch from the server */
            return apDataService.getListItemById(entityId, model, opts);
        }

        /**
         * @ngdoc function
         * @name Model.addNewItem
         * @module Model
         * @description
         * Using the definition of a list stored in a model, create a new list item in SharePoint.
         * @param {object} entity An object that will be converted into key/value pairs based on the field definitions
         * defined in the model.
         * @param {object} [options] - Pass additional options to the data service.
         * @returns {object} A promise which when resolved will returned the newly created list item from there server.
         * This allows us to update the view with a valid new object that contains a unique list item id.
         *
         * @example
         * <pre>
         * <file name="app/modules/project/projectsModel.js">
         * projectModel.addNewItem({
         *        title: 'A Project',
         *        customer: {lookupValue: 'My Customer', lookupId: 123},
         *        description: 'This is the project description'
         *     }).then(function(newEntityFromServer) {
         *         //The local query cache is automatically updated but
         *         //any other dependent logic can go here
         * };
         * </file>
         * </pre>
         */
        function addNewItem(entity, options) {
            var model = this,
                deferred = $q.defer();

            apDataService.createListItem(model, entity, options)
                .then(function (response) {
                    deferred.resolve(response);
                    /** Optionally broadcast change event */
                    apUtilityService.registerChange(model);
                });
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name Model.registerQuery
         * @module Model
         * @description
         * Constructor that allows us create a static query with the option to build dynamic queries as seen in the
         * third example.  This construct is a passthrough to [SPServices](http://spservices.codeplex.com/)
         * @param {object} [queryOptions] Optional options to pass through to the
         * [dataService](#/api/dataService.executeQuery).
         * @param {string} [queryOptions.name=defaultQueryName] Optional name of the new query (recommended but will
         * default to 'Primary' if not specified)
         * @param {string} [queryOptions.operation="GetListItemChangesSinceToken"] Defaults to
         * [GetListItemChangesSinceToken](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken%28v=office.12%29.aspx)
         * but for a smaller payload and faster response you can use
         * [GetListItems](http://spservices.codeplex.com/wikipage?title=GetListItems&referringTitle=Lists).
         * @param {boolean} [queryOptions.cacheXML=false] Typically don't need to store the XML response because it
         * has already been parsed into JS objects.
         * @param {string} [queryOptions.offlineXML] Optionally reference a specific XML file to use for this query instead
         * of using the shared XML file used by all queries on this model.  Useful to mock custom query results.
         * @param {string} [queryOptions.query] CAML Query - Josh McCarty has a good quick reference
         * [here](http://joshmccarty.com/2012/06/a-caml-query-quick-reference)
         * @param {string} [queryOptions.queryOptions]
         * <pre>
         * // Default options
         * '<QueryOptions>' +
         * '   <IncludeMandatoryColumns>' +
         *      'FALSE' +
         *     '</IncludeMandatoryColumns>' +
         * '   <IncludeAttachmentUrls>' +
         *      'TRUE' +
         *     '</IncludeAttachmentUrls>' +
         * '   <IncludeAttachmentVersion>' +
         *      'FALSE' +
         *     '</IncludeAttachmentVersion>' +
         * '   <ExpandUserField>' +
         *      'FALSE' +
         *     '</ExpandUserField>' +
         * '</QueryOptions>',
         * </pre>
         *
         *
         * @returns {object} Query Returns a new query object.
         *
         * @example
         * <h4>Example #1</h4>
         * <pre>
         * // Query to retrieve the most recent 25 modifications
         * model.registerQuery({
     *    name: 'recentChanges',
     *    CAMLRowLimit: 25,
     *    query: '' +
     *        '<Query>' +
     *        '   <OrderBy>' +
     *        '       <FieldRef Name="Modified" Ascending="FALSE"/>' +
     *        '   </OrderBy>' +
     *            //Prevents any records from being returned if user doesn't
     *            // have permissions on project
     *        '   <Where>' +
     *        '       <IsNotNull>' +
     *        '           <FieldRef Name="Project"/>' +
     *        '       </IsNotNull>' +
     *        '   </Where>' +
     *        '</Query>'
     * });
         * </pre>
         *
         * <h4>Example #2</h4>
         * <pre>
         * // Could be placed on the projectModel and creates the query but doesn't
         * // call it
         * projectModel.registerQuery({
     *     name: 'primary',
     *     query: '' +
     *         '<Query>' +
     *         '   <OrderBy>' +
     *         '       <FieldRef Name="Title" Ascending="TRUE"/>' +
     *         '   </OrderBy>' +
     *         '</Query>'
     * });
         *
         * //To call the query or check for changes since the last call
         * projectModel.executeQuery('primary').then(function(entities) {
     *     // We now have a reference to array of entities stored in the local
     *     // cache.  These inherit from the ListItem prototype as well as the
     *     // Project prototype on the model
     *     $scope.projects = entities;
     * });
         * </pre>
         *

         * <h4>Example #3</h4>
         * <pre>
         * // Advanced functionality that would allow us to dynamically create
         * // queries for list items with a lookup field associated with a specific
         * // project id.  Let's assume this is on the projectTasksModel.
         * model.queryByProjectId(projectId) {
     *     // Unique query name
     *     var queryKey = 'pid' + projectId;
     *
     *     // Register project query if it doesn't exist
     *     if (!_.isObject(model.queries[queryKey])) {
     *         model.registerQuery({
     *             name: queryKey,
     *             query: '' +
     *                 '<Query>' +
     *                 '   <OrderBy>' +
     *                 '       <FieldRef Name="ID" Ascending="TRUE"/>' +
     *                 '   </OrderBy>' +
     *                 '   <Where>' +
     *                 '       <And>' +
     *                              // Prevents any records from being returned
     *                              //if user doesn't have permissions on project
     *                 '           <IsNotNull>' +
     *                 '               <FieldRef Name="Project"/>' +
     *                 '           </IsNotNull>' +
     *                              // Return all records for the project matching
     *                              // param projectId
     *                 '           <Eq>' +
     *                 '               <FieldRef Name="Project" LookupId="TRUE"/>' +
     *                 '               <Value Type="Lookup">' + projectId + '</Value>' +
     *                 '           </Eq>' +
     *                 '       </And>' +
     *                 '   </Where>' +
     *                 '</Query>'
     *         });
     *     }
     *     //Still using execute query but now we have a custom query
     *     return model.executeQuery(queryKey);
     * };
         pre>
         */
        function registerQuery(queryOptions) {
            var model = this;

            var defaults = {
                /** If name isn't set, assume this is the only model and designate as primary */
                name: defaultQueryName
            };

            queryOptions = _.extend({}, defaults, queryOptions);

            model.queries[queryOptions.name] = apQueryFactory.create(queryOptions, model);

            /** Return the newly created query */
            return model.queries[queryOptions.name];
        }

        /**
         * @ngdoc function
         * @name Model.getQuery
         * @module Model
         * @description
         * Helper function that attempts to locate and return a reference to the requested or catchall query.
         * @param {string} [queryName=defaultQueryName] A unique key to identify this query.
         * @returns {object} See Query prototype for additional details on what a Query looks like.
         *
         * @example
         * <pre>
         * var primaryQuery = projectModel.getQuery();
         * </pre>
         *
         * <pre>
         * var primaryQuery = projectModel.getQuery('primary');
         * </pre>
         *
         * <pre>
         * var namedQuery = projectModel.getQuery('customQuery');
         * </pre>
         */
        function getQuery(queryName) {
            var model = this, query;
            if (_.isObject(model.queries[queryName])) {
                /** The named query exists */
                query = model.queries[queryName];
            } else if (_.isObject(model.queries[defaultQueryName]) && !queryName) {
                /** A named query wasn't specified and the catchall query exists */
                query = model.queries[defaultQueryName];
            } else {
                /** Requested query not found */
                query = undefined;
            }
            return query;
        }

        /**
         * @ngdoc function
         * @name Model.getFieldDefinition
         * @module Model
         * @description
         * Returns the field definition from the definitions defined in the custom fields array within a model.
         * <pre>
         * var project = {
         *    title: 'Project 1',
         *    location: {
         *        lookupId: 5,
         *        lookupValue: 'Some Building'
         *    }
         * };
         *
         * //To get field metadata
         * var locationDefinition = projectsModel.getFieldDefinition('location');
         * </pre>
         * @param {string} fieldName Internal field name.
         * @returns {object} Field definition.
         */
        function getFieldDefinition(fieldName) {
            var model = this;
            return _.findWhere(model.list.fields, {mappedName: fieldName});
        }


        /**
         * @ngdoc function
         * @name Model.getCache
         * @module Model
         * @description
         * Helper function that return the local cache for a named query if provided, otherwise
         * it returns the cache for the primary query for the model.  Useful if you know the query
         * has already been resolved and there's no need to check SharePoint for changes.
         *
         * @param {string} [queryName=defaultQueryName] A unique key to identify this query.
         * @returns {Array} Returns the contents of the current cache for a named query.
         *
         * @example
         * <pre>
         * var primaryQueryCache = projectModel.getCache();
         * </pre>
         *
         * <pre>
         * var primaryQueryCache = projectModel.getCache('primary');
         * </pre>
         *
         * <pre>
         * var namedQueryCache = projectModel.getCache('customQuery');
         * </pre>
         */
        function getCache(queryName) {
            var model = this, query, cache;
            query = model.getQuery(queryName);
            if (query && query.indexedCache) {
                cache = query.indexedCache;
            }
            return cache;
        }


        /**
         * @ngdoc function
         * @name Model.getCachedEntity
         * @module Model
         * @description
         * Attempts to locate a model entity by id.
         * @param {number} entityId The ID of the requested entity.
         * @returns {object} Returns either the requested entity or undefined if it's not found.
         */
        function getCachedEntity(entityId) {
            var model = this;
            return apCacheService.getCachedEntity(model.list.getListId(), entityId);
        }

        /**
         * @ngdoc function
         * @name Model.getCachedEntities
         * @module Model
         * @description
         * Returns all entities registered for this model regardless of query.
         * @returns {object[]} All registered entities for this model.
         */
        function getCachedEntities() {
            var model = this;
            return apCacheService.getCachedEntities(model.list.getListId());
        }

        /**
         * @ngdoc function
         * @name Model.executeQuery
         * @module Model
         * @description
         * The primary method for retrieving data from a query registered on a model.  It returns a promise
         * which resolves to the local cache after post processing entities with constructors.
         *
         * @param {string} [queryName=defaultQueryName] A unique key to identify this query
         * @param {object} [options] Pass options to the data service.
         * @returns {object} Promise that when resolves returns an array of list items which inherit from ListItem and
         * optionally go through a defined constructor on the model.
         *
         * @example To call the query or check for changes since the last call.
         * <pre>
         * projectModel.executeQuery('MyCustomQuery').then(function(entities) {
         *      //We now have a reference to array of entities stored in the local cache
         *      //These inherit from the ListItem prototype as well as the Project prototype on the model
         *      $scope.subsetOfProjects = entities;
         *  });
         * </pre>
         */
        function executeQuery(queryName, options) {
            var model = this;
            var query = model.getQuery(queryName);
            if (query) {
                return query.execute(options);
            }
        }

        /**
         * @ngdoc function
         * @name Model.extendListMetadata
         * @module Model
         * @description
         * Extends the List and Fields with list information returned from the server.  Only runs once and after that
         * returns the existing promise.
         * @param {object} [options] Pass-through options to apDataService.getList
         * @returns {object} Promise that is resolved once the information has been added.
         */
        function extendListMetadata(options) {
            var model = this,
                deferred = $q.defer(),
                defaults = {listName: model.list.getListId()};

            /** Only request information if the list hasn't already been extended and is not currently being requested */
            if (!model.fieldDefinitionsExtended && !model.deferredListDefinition) {
                model.deferredListDefinition = deferred.promise;
                var opts = _.extend({}, defaults, options);
                apDataService.getList(opts)
                    .then(function (responseXML) {
                        apDecodeService.extendListDefinitionFromXML(model.list, responseXML);
                        apDecodeService.extendFieldDefinitionsFromXML(model.list.fields, responseXML);
                        model.fieldDefinitionsExtended = true;
                        deferred.resolve(model);
                    });
            }
            return model.deferredListDefinition;
        }

        /**
         * @ngdoc function
         * @name Model.isInitialised
         * @module Model
         * @description
         * Methods which allows us to easily determine if we've successfully made any queries this session.
         * @returns {boolean} Returns evaluation.
         */
        function isInitialised() {
            var model = this;
            return _.isDate(model.lastServerUpdate);
        }

        /**
         * @ngdoc function
         * @name Model.createEmptyItem
         * @module Model
         * @description
         * Creates an object using the editable fields from the model, all attributes are empty based on the field
         * type unless an overrides object is passed in.  The overrides object extends the defaults.  A benefit to this
         * approach is the returned object inherits from the ListItem prototype so we have the ability to call
         * entity.saveChanges instead of calling the model.addNewItem(entity).
         *
         * @param {object} [overrides] - Optionally extend the new empty item with specific values.
         * @returns {object} Newly created list item.
         */
        function createEmptyItem(overrides) {
            var model = this;
            var newItem = {};
            _.each(model.list.customFields, function (fieldDefinition) {
                /** Create attributes for each non-readonly field definition */
                if (!fieldDefinition.readOnly) {
                    /** Create an attribute with the expected empty value based on field definition type */
                    newItem[fieldDefinition.mappedName] = apFieldService.getDefaultValueForType(fieldDefinition.objectType);
                }
            });
            /** Extend any values that should override the default empty values */
            var rawObject = _.extend({}, newItem, overrides);
            return new model.factory(rawObject);
        }

        /**
         * @ngdoc function
         * @name Model.generateMockData
         * @module Model
         * @description
         * Generates 'n' mock records for testing using the field types defined in the model to provide something to visualize.
         *
         * @param {object} [options] Object containing optional parameters.
         * @param {number} [options.quantity=10] The requested number of mock records to return.
         * @param {string} [options.permissionLevel=FullMask] Sets the mask on the mock records to simulate desired
         * permission level.
         * @param {boolean} [options.staticValue=false] By default all mock data is dynamically created but if set,
         * this will cause static data to be used instead.
         */
        function generateMockData(options) {
            var mockData = [],
                model = this;

            var defaults = {
                quantity: 10,
                staticValue: false,
                permissionLevel: 'FullMask'
            };

            /** Extend defaults with any provided options */
            var opts = _.extend({}, defaults, options);

            _.times(opts.quantity, function (count) {
                var mock = {};
                /** Create an attribute with mock data for each field */
                _.each(model.list.fields, function (field) {
                    mock[field.mappedName] = field.getMockData(opts);
                });
                mock.id = count + 1;
                /** Use the factory on the model to extend the object */
                mockData.push(new model.factory(mock));
            });
            return mockData;
        }

        /**
         * @ngdoc function
         * @name Model.validateEntity
         * @module Model
         * @description
         * Uses the custom fields defined in an model to ensure each field (required = true) is evaluated
         * based on field type
         *
         * @param {object} entity SharePoint list item.
         * @param {object} [options] Object containing optional parameters.
         * @param {boolean} [options.toast=true] Should toasts be generated to alert the user of issues.
         * @returns {boolean} Evaluation of validity.
         */
        function validateEntity(entity, options) {
            var valid = true,
                model = this;

            var defaults = {
                toast: true
            };

            /** Extend defaults with any provided options */
            var opts = _.extend({}, defaults, options);

            var checkObject = function (fieldValue) {
                return _.isObject(fieldValue) && _.isNumber(fieldValue.lookupId);
            };

            _.each(model.list.customFields, function (fieldDefinition) {
                var fieldValue = entity[fieldDefinition.mappedName];
                var fieldDescriptor = '"' + fieldDefinition.objectType + '" value.';
                /** Only evaluate required fields */
                if ((fieldDefinition.required || fieldDefinition.Required) && valid) {
                    switch (fieldDefinition.objectType) {
                        case 'Boolean':
                            valid = _.isBoolean(fieldValue);
                            break;
                        case 'DateTime':
                            valid = _.isDate(fieldValue);
                            break;
                        case 'Lookup':
                        case 'User':
                            valid = checkObject(fieldValue);
                            break;
                        case 'LookupMulti':
                        case 'UserMulti':
                            /** Ensure it's a valid array containing objects */
                            valid = _.isArray(fieldValue) && fieldValue.length > 0;
                            if (valid) {
                                /** Additionally check that each lookup/person contains a lookupId */
                                _.each(fieldValue, function (fieldObject) {
                                    if (valid) {
                                        valid = checkObject(fieldObject);
                                    } else {
                                        /** Short circuit */
                                        return false;
                                    }
                                });
                            }
                            break;
                        default:
                            /** Evaluate everything else as a string */
                            valid = !_.isEmpty(fieldValue);

                    }
                    if (!valid && opts.toast) {
                        var fieldName = fieldDefinition.label || fieldDefinition.staticName;
                        toastr.error(fieldName + ' does not appear to be a valid ' + fieldDescriptor);
                    }
                }
                if (!valid) {
                    return false;
                }
            });
            return valid;
        }


        ///**
        // * @ngdoc function
        // * @name Model.resolvePermissions
        // * @module Model
        // * @description
        // * See apModelFactory.resolvePermissions for details on what we expect to have returned.
        // * @returns {Object} Contains properties for each permission level evaluated for current user.
        // * @example
        // * Lets assume we're checking to see if a user has edit rights for a given list.
        // * <pre>
        // * var userPermissions = tasksModel.resolvePermissions();
        // * var userCanEdit = userPermissions.EditListItems;
        // * </pre>
        // * Example of what the returned object would look like
        // * for a site admin.
        // * <pre>
        // * perm = {
        // *    "ViewListItems":true,
        // *    "AddListItems":true,
        // *    "EditListItems":true,
        // *    "DeleteListItems":true,
        // *    "ApproveItems":true,
        // *    "OpenItems":true,
        // *    "ViewVersions":true,
        // *    "DeleteVersions":true,
        // *    "CancelCheckout":true,
        // *    "PersonalViews":true,
        // *    "ManageLists":true,
        // *    "ViewFormPages":true,
        // *    "Open":true,
        // *    "ViewPages":true,
        // *    "AddAndCustomizePages":true,
        // *    "ApplyThemeAndBorder":true,
        // *    "ApplyStyleSheets":true,
        // *    "ViewUsageData":true,
        // *    "CreateSSCSite":true,
        // *    "ManageSubwebs":true,
        // *    "CreateGroups":true,
        // *    "ManagePermissions":true,
        // *    "BrowseDirectories":true,
        // *    "BrowseUserInfo":true,
        // *    "AddDelPrivateWebParts":true,
        // *    "UpdatePersonalWebParts":true,
        // *    "ManageWeb":true,
        // *    "UseRemoteAPIs":true,
        // *    "ManageAlerts":true,
        // *    "CreateAlerts":true,
        // *    "EditMyUserInfo":true,
        // *    "EnumeratePermissions":true,
        // *    "FullMask":true
        // * }
        // * </pre>
        // */
        //
        //function resolvePermissions() {
        //    var model = this;
        //    if (model.list && model.list.effectivePermMask) {
        //        return apUtilityService.resolvePermissions(model.list.effectivePermMask);
        //    } else {
        //        window.console.error('Attempted to resolve permissions of a model that hasn\'t been initialized.', model);
        //        return apUtilityService.resolvePermissions(null);
        //    }
        //}

        /**
         * @ngdoc function
         * @name angularPoint.apModelFactory:create
         * @methodOf angularPoint.apModelFactory
         * @param {object} config Options object.
         * @description
         * Instantiates and returns a new Model.
         * @example
         * <pre>
         * var model = apModelFactory.create({
         *     factory: Task,
         *     list: {
         *         title: 'Tasks', //Maps to the offline XML file in dev folder (no spaces)
         *         // List GUID can be found in list properties in SharePoint designer
         *         guid: '{DBA4535D-D8F3-4D65-B7C0-7E970AE3A52D}',
         *         customFields: [
         *             // Array of objects mapping each SharePoint field to a property on a list item object
         *             {staticName: 'Title', objectType: 'Text', mappedName: 'title', readOnly: false},
         *             {staticName: 'Description', objectType: 'Text', mappedName: 'description', readOnly: false},
         *             {staticName: 'Priority', objectType: 'Text', mappedName: 'priority', readOnly: false},
         *             {staticName: 'Status', objectType: 'Text', mappedName: 'status', readOnly: false},
         *             {staticName: 'RequestedBy', objectType: 'User', mappedName: 'requestedBy', readOnly: false},
         *             {staticName: 'AssignedTo', objectType: 'User', mappedName: 'assignedTo', readOnly: false},
         *             {staticName: 'EstimatedEffort', objectType: 'Integer', mappedName: 'estimatedEffort', readOnly: false},
         *             {staticName: 'PercentComplete', objectType: 'Integer', mappedName: 'percentComplete', readOnly: false}
         *         ]
         *     }
         * });
         * </pre>
         */
        function create(config) {
            return new Model(config);
        }


    }]);
;'use strict';

/**
 * @ngdoc object
 * @name angularPoint.apQueryFactory
 * @description
 * Exposes the Query prototype and a constructor to instantiate a new Query.
 *
 * @requires angularPoint.apCacheService
 * @requires angularPoint.apDataService
 * @requires angularPoint.apConfig
 */
angular.module('angularPoint')
    .factory('apQueryFactory', ["_", "apCacheService", "apIndexedCacheFactory", "apDataService", "apConfig", "$q", function (_, apCacheService, apIndexedCacheFactory, apDataService, apConfig, $q) {


        /**
         * @ngdoc function
         * @name Query
         * @description
         * Primary constructor that all queries inherit from.
         * @param {object} config Initialization parameters.
         * @param {string} [config.operation=GetListItemChangesSinceToken] Optionally use 'GetListItems' to
         * receive a more efficient response, just don't have the ability to check for changes since the last time
         * the query was called.
         * @param {boolean} [config.cacheXML=true] Set to false if you want a fresh request.
         * @param {string} [config.offlineXML] Optionally reference a specific XML file to use for this query instead
         * of using the shared XML file for this list.
         * @param {string} [config.query=Ordered ascending by ID] CAML query passed to SharePoint to control
         * the data SharePoint returns.
         * @param {string} [config.queryOptions] SharePoint options.
         * <pre>
         * //Default
         * queryOptions: '' +
         * '<QueryOptions>' +
         * '   <IncludeMandatoryColumns>' +
         *      'FALSE' +
         *     '</IncludeMandatoryColumns>' +
         * '   <IncludeAttachmentUrls>' +
         *      'TRUE' +
         *     '</IncludeAttachmentUrls>' +
         * '   <IncludeAttachmentVersion>' +
         *      'FALSE' +
         *     '</IncludeAttachmentVersion>' +
         * '   <ExpandUserField>' +
         *      'FALSE' +
         *     '</ExpandUserField>' +
         * '</QueryOptions>',
         * </pre>
         * @param {object} model Reference to the parent model for the query.  Allows us to reference when out of
         * scope.
         * @constructor
         *
         * @example
         * <pre>
         * // Query to retrieve the most recent 25 modifications
         * model.registerQuery({
         *    name: 'recentChanges',
         *    CAMLRowLimit: 25,
         *    query: '' +
         *        '<Query>' +
         *        '   <OrderBy>' +
         *        '       <FieldRef Name="Modified" Ascending="FALSE"/>' +
         *        '   </OrderBy>' +
         *            // Prevents any records from being returned if user
         *            // doesn't have permissions on project
         *        '   <Where>' +
         *        '       <IsNotNull>' +
         *        '           <FieldRef Name="Project"/>' +
         *        '       </IsNotNull>' +
         *        '   </Where>' +
         *        '</Query>'
         * });
         * </pre>
         */
        function Query(config, model) {
            var query = this;
            var defaults = {
                /** Container to hold returned entities */
                //todo moved to indexedCache instead for better performance
                //cache: [],
                /** Reference to the most recent query when performing GetListItemChangesSinceToken */
                changeToken: undefined,
                /** Promise resolved after first time query is executed */
                initialized: $q.defer(),
                /** Key value hash map with key being the id of the entity */
                indexedCache: apIndexedCacheFactory.create(),
                /** Date/Time last run */
                lastRun: null,
                listName: model.list.getListId(),
                /** Flag to prevent us from makeing concurrent requests */
                negotiatingWithServer: false,
                /** Every time we run we want to check to update our cached data with
                 * any changes made on the server */
                operation: 'GetListItemChangesSinceToken',
                /** Very memory intensive to enable cacheXML which is disabled by default*/
                cacheXML: false,
                /** Default query returns list items in ascending ID order */
                query: '' +
                '<Query>' +
                '   <OrderBy>' +
                '       <FieldRef Name="ID" Ascending="TRUE"/>' +
                '   </OrderBy>' +
                '</Query>',
                queryOptions: '' +
                '<QueryOptions>' +
                '   <IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns>' +
                '   <IncludeAttachmentUrls>TRUE</IncludeAttachmentUrls>' +
                '   <IncludeAttachmentVersion>FALSE</IncludeAttachmentVersion>' +
                '   <ExpandUserField>FALSE</ExpandUserField>' +
                '</QueryOptions>',
                viewFields: model.list.viewFields
            };

            /** Set the default url if the config param is defined, otherwise let SPServices handle it */
            if (apConfig.defaultUrl) {
                defaults.webURL = apConfig.defaultUrl;
            }

            _.extend(query, defaults, config);


            /** Key/Value mapping of SharePoint properties to SPServices properties */
            var mapping = [
                ['query', 'CAMLQuery'],
                ['viewFields', 'CAMLViewFields'],
                ['rowLimit', 'CAMLRowLimit'],
                ['queryOptions', 'CAMLQueryOptions'],
                ['listItemID', 'ID']
            ];

            _.each(mapping, function (map) {
                if (query[map[0]] && !query[map[1]]) {
                    /** Ensure SPServices properties are added in the event the true property name is used */
                    query[map[1]] = query[map[0]];
                }
            });

            /** Allow the model to be referenced at a later time */
            query.getModel = function () {
                return model;
            };

            query.getCache = getCache;
        }

        Query.prototype = {
            execute: execute,
            searchLocalCache: searchLocalCache
        };

        return {
            create: create,
            Query: Query
        };

        /*********************** PRIVATE ****************************/


        /**
         * @ngdoc function
         * @name Query.execute
         * @methodOf Query
         * @description
         * Query SharePoint, pull down all initial records on first call along with list definition if using
         * "GetListItemChangesSinceToken".  Note: this is  substantially larger than "GetListItems" on first call.
         * Subsequent calls pulls down changes (Assuming operation: "GetListItemChangesSinceToken").
         * @param {object} [options] Any options that should be passed to dataService.executeQuery.
         * @returns {object[]} Array of list item objects.
         */
        function execute(options) {
            var query = this;
            var model = query.getModel();
            var deferred = $q.defer();

            /** Return existing promise if request is already underway or has been previously executed in the past
             * 1/10th of a second */
            if (query.negotiatingWithServer || (_.isDate(query.lastRun) && query.lastRun.getTime() + 100 > new Date().getTime())) {
                return query.promise;
            } else {
                /** Set flag to prevent another call while this query is active */
                query.negotiatingWithServer = true;

                /** Set flag if this if the first time this query has been run */
                var firstRunQuery = _.isNull(query.lastRun);

                var defaults = {
                    /** Designate the central cache for this query if not already set */
                    target: query.getCache()
                };

                /** Extend defaults with any options */
                var queryOptions = _.extend({}, defaults, options);

                apDataService.executeQuery(model, query, queryOptions).then(function (results) {
                    if (firstRunQuery) {
                        /** Promise resolved the first time query is completed */
                        query.initialized.resolve(queryOptions.target);
                    }

                    /** Remove lock to allow for future requests */
                    query.negotiatingWithServer = false;

                    /** Store query completion date/time on model to allow us to identify age of data */
                    model.lastServerUpdate = new Date();

                    deferred.resolve(queryOptions.target);
                });

                /** Save reference on the query **/
                query.promise = deferred.promise;
                return deferred.promise;
            }
        }

        function getCache() {
            var query = this;
            return query.indexedCache;
        }

        /**
         * @ngdoc function
         * @name Query.searchLocalCache
         * @methodOf Query
         * @description
         * Simple wrapper that by default sets the search location to the local query cache.
         * @param {*} value Value to evaluate against.
         * @param {object} [options] Options to pass to Model.prototype.searchLocalCache.
         * @returns {object|object[]} Either the object(s) that you're searching for or undefined if not found.
         */
        function searchLocalCache(value, options) {
            var query = this;
            var model = query.getModel();
            var defaults = {
                cacheName: query.name,
                localCache: query.getCache()
            };
            var opts = _.extend({}, defaults, options);
            return model.searchLocalCache(value, opts);
        }

        /**
         * @ngdoc function
         * @name angularPoint.apQueryFactory:create
         * @methodOf angularPoint.apQueryFactory
         * @param {object} config Options object.
         * @param {object} model Reference to the model.
         * @description
         * Instantiates and returns a new Query.
         */
        function create(config, model) {
            return new Query(config, model);
        }

    }]);
;'use strict';

/**
 * @ngdoc function
 * @name angularPoint.apUserFactory
 * @description
 * Tools to assist with the creation of CAML queries.
 *
 */
angular.module('angularPoint')
    .factory('apUserFactory', ["apUtilityService", function (apUtilityService) {


        /**
         * @ngdoc function
         * @name User
         * @description
         * Allows for easier distinction when debugging if object type is shown as a User.  Turns a delimited ";#"
         * string into an object shown below depeinding on field settings:
         * <pre>
         * {
         *      lookupId: 1,
         *      lookupValue: 'Joe User'
         * }
         * </pre>
         * or
         * <pre>
         * {
         *      lookupId: 1,
         *      lookupValue: 'Joe User',
         *      loginName: 'joe.user',
         *      email: 'joe@company.com',
         *      sipAddress: 'whatever',
         *      title: 'Sr. Widget Maker'
         * }
         * </pre>
         * @param {string} s Delimited string used to create a User object.
         * @constructor
         */
        function User(s) {
            var self = this;
            var thisUser = new apUtilityService.SplitIndex(s);

            var thisUserExpanded = thisUser.value.split(',#');
            if (thisUserExpanded.length === 1) {
                //Standard user columns only return a id,#value pair
                self.lookupId = thisUser.id;
                self.lookupValue = thisUser.value;
            } else {
                //Allow for case where user adds additional properties when setting up field
                self.lookupId = thisUser.id;
                self.lookupValue = thisUserExpanded[0].replace(/(,,)/g, ',');
                self.loginName = thisUserExpanded[1].replace(/(,,)/g, ',');
                self.email = thisUserExpanded[2].replace(/(,,)/g, ',');
                self.sipAddress = thisUserExpanded[3].replace(/(,,)/g, ',');
                self.title = thisUserExpanded[4].replace(/(,,)/g, ',');
            }
        }

        /**
         * @ngdoc function
         * @name angularPoint.apUserFactory:create
         * @methodOf angularPoint.apUserFactory
         * @description
         * Instantiates and returns a new User field.
         */
        var create = function (s) {
            return new User(s);
        };

        return {
            create: create,
            User: User
        }
    }]);;'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apUserModel
 * @description
 * Simple service that allows us to request and cache both the current user and their group memberships.
 *
 * @requires apDataService
 * @requires apConfig
 *
 */
angular.module('angularPoint')
    .service('apUserModel', ["$q", "_", "apDataService", "apConfig", function ($q, _, apDataService, apConfig) {

        var model = {
                checkIfMember: checkIfMember,
                getGroupCollection: getGroupCollection,
                getUserProfile: getUserProfile
            },
            /** Local references to cached promises */
            _getGroupCollection,
            _getUserProfile;

        return model;


        /**
         * @ngdoc function
         * @name angularPoint.apUserModel:getUserProfile
         * @methodOf angularPoint.apUserModel
         * @description
         * Returns the user profile for the current user and caches results.
         * Pull user profile info and parse into a profile object
         * http://spservices.codeplex.com/wikipage?title=GetUserProfileByName
         * @param {boolean} [force=false] Ignore any cached value.
         * @returns {object} Promise which resolves with the requested user profile.
         */
        function getUserProfile(force) {
            if (!_getUserProfile || force) {
                /** Create a new deferred object if not already defined */
                _getUserProfile = apDataService.getUserProfileByName();
            }
            return _getUserProfile;
        }


        /**
         * @ngdoc function
         * @name angularPoint.apUserModel:getGroupCollection
         * @methodOf angularPoint.apUserModel
         * @description
         * Returns the group names for the current user and caches results.
         * @param {boolean} [force=false] Ignore any cached value.
         * @returns {string[]} Promise which resolves with the array of groups the user belongs to.
         */
        function getGroupCollection(force) {
            if (!_getGroupCollection || force) {
                /** Create a new deferred object if not already defined */
                var deferred = $q.defer();
                getUserProfile(force).then(function (userProfile) {
                    apDataService.getGroupCollectionFromUser(userProfile.userLoginName)
                        .then(function (groupCollection) {
                            deferred.resolve(groupCollection);
                        });
                });
                _getGroupCollection = deferred.promise;
            }
            return _getGroupCollection;
        }


        /**
         * @ngdoc function
         * @name angularPoint.apUserModel:checkIfMember
         * @methodOf angularPoint.apUserModel
         * @description
         * Checks to see if current user is a member of the specified group.
         * @param {string} groupName Name of the group.
         * @param {boolean} [force=false] Ignore any cached value.
         * @returns {boolean} Is the user a member of the group?
         */
        function checkIfMember(groupName, force) {
            //Allow function to be called before group collection is ready
            var deferred = $q.defer();
            var self = this;

            //Initially ensure groups are ready, any future calls will receive the return
            model.getGroupCollection(force).then(function (groupCollection) {
                //Data is ready
                //Map the group names to cache results for future calls, rebuild if data has changed
                if (!self.groupMap || self.groupMap.length !== groupCollection.length) {
                    self.groupMap = [];
                    _.each(groupCollection, function (group) {
                        self.groupMap.push(group.Name);
                    });
                }
                deferred.resolve(_.isObject(groupCollection[self.groupMap.indexOf(groupName)]));
            });

            return deferred.promise;
        }

    }]);;'use strict';

/**
 * @ngdoc directive
 * @name angularPoint.directive:apAttachments
 * @element span
 * @function
 *
 * @description
 * Uses an iFrame to hijack the portions of the upload attachment form that we would like to show to the user. Adds
 * event listeners on the form and waits for an upload to complete, then queries for the updated list of attachments
 * to display below the form, and resets the iFrame.  The listed attachments are linked to allow opening and also
 * provide delete functionality to disassociate with the list item.
 *
 *
 * @param {object} listItem The list item that we'd like to view/add attachments.
 * @param {function} [changeEvent] Callback when the attachments have been updated.
 *
 * @example
 * <pre>
 *     <span data-ap-attachments
 *      data-list-item="verification"
 *      data-change-event="fetchAttachments"></span>
 * </pre>
 */
angular.module('angularPoint')
    .directive('apAttachments', ["$sce", "toastr", "_", function ($sce, toastr, _) {
        return {
            restrict: "A",
            replace: true,
            templateUrl: 'src/directives/ap_attachments/ap_attachments_tmpl.html',
            scope: {
                listItem: "=",      //List item the attachments belong to
                changeEvent: '='    //Optional - called after an attachment is deleted
            },
            link: function (scope, element, attrs) {

                scope.attachments = [];
                scope.state = {
                    ready: false
                };

                scope.refresh = function () {
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                };

                function resetSrc() {
                    if (_.isFunction(scope.changeEvent)) {
                        scope.changeEvent();
                    }
                    //Reset iframe
                    element.find('iframe').attr('src', element.find('iframe').attr('src'));
                }

                var listItemModel = scope.listItem.getModel();
                var uploadUrl = listItemModel.list.webURL + '/_layouts/Attachfile.aspx?ListId=' +
                    listItemModel.list.getListId() + '&ItemId=' + scope.listItem.id + '&IsDlg=1';

                scope.trustedUrl = $sce.trustAsResourceUrl(uploadUrl);

                //Pull down all attachments for the current list item
                var fetchAttachments = function () {
                    toastr.info("Checking for attachments");
                    scope.listItem.getAttachmentCollection().then(function (attachments) {
                        scope.attachments.length = 0;
                        //Push any new attachments into the existing array to prevent breakage of references
                        Array.prototype.push.apply(scope.attachments, attachments);
                    });
                };

                //Instantiate request
                fetchAttachments();

                scope.fileName = function (attachment) {
                    var index = attachment.lastIndexOf("/") + 1;
                    return attachment.substr(index);
                };

                scope.deleteAttachment = function (attachment) {
                    var confirmation = window.confirm("Are you sure you want to delete this file?");
                    if (confirmation) {
                        toastr.info("Negotiating with the server");
                        scope.listItem.deleteAttachment(attachment).then(function () {
                            toastr.success("Attachment successfully deleted");
                            fetchAttachments();
                            if (_.isFunction(scope.changeEvent)) {
                                scope.changeEvent();
                            }
                        });
                    }
                };

                //Run when the iframe url changes and fully loaded
                element.find('iframe').bind('load', function (event) {
                    scope.state.ready = true;
                    scope.refresh();
                    var iframe = $(this).contents();

                    if (iframe.find("#CancelButton").length < 1) {
                        //Upload complete, reset iframe
                        toastr.success("File successfully uploaded");
                        resetSrc();
                        fetchAttachments();
                        if (_.isFunction(scope.changeEvent)) {
                            scope.changeEvent();
                        }

                    } else {
                        //Hide the standard cancel button
                        iframe.find("#CancelButton").hide();
                        iframe.find(".ms-dialog").css({height: '95px'});

                        //Style OK button
                        iframe.find("input[name$='Ok']").css({float: 'left'}).click(function (event) {
                            //Click handler
                            toastr.info("Please wait while the file is uploaded");
                        });

                        iframe.find("input[name$='$InputFile']").attr({'size': 40});

                        //Style iframe to prevent scroll bars from appearing
                        iframe.find("#s4-workspace").css({
                            'overflow-y': 'hidden',
                            'overflow-x': 'hidden'
                        });

                        console.log("Frame Loaded");
                    }
                });

            }
        };
    }]);
;'use strict';

/**
 * @ngdoc directive
 * @name angularPoint.directive:apSelect
 * @element span
 * @function
 *
 * @description
 * A SharePoint lookup value is represented as an object containing a lookupId and lookupValue.
 * ```
 * Lookup = {
 *     lookupId: 1,
 *     lookupValue: 'Typically the Title of the Item we're referencing'
 * }
 * ```
 * With that in mind, we know that the list providing lookup options is made up of SharePoint list items.  This
 * directive attempts to create a select using the array of lookup options and once selected, sets field referencing
 * the target object with the applicable `lookupValue` and `lookupId`.
 *
 *
 * @param {object} target Reference to the target attribute on the list item.
 * @param {object[]} arr Array of list items used to populate the options for the select.
 * @param {string} [lookupValue='title'] Name of the attribute to use as the display value for each item
 * in `arr` array.
 * @param {boolean} [multi=false] Allows us to use a multi-select using Select2.
 *
 * @example
 * Form field below allows us to display a multi-select with options coming
 * from a taskCategories array.  Each item selected pushes an object into
 * the activeTask.categories array.  Each of these objects will have a
 * lookupId = category.id and lookupValue = category.acronym.
 * <pre>
 * <div class="form-group">
 *      <label class="control-label">Task Categories</label>
 *      <span data-ap-select data-multi="true"
 *          data-arr="taskCategories"
 *          data-target="activeTask.categories"
 *          data-lookup-value="'acronym'"></span>
 *  </div>
 * </pre>
 */
angular.module('angularPoint')
    .directive('apSelect', ["_", function (_) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'src/directives/ap_select/ap_select_tmpl.html',
            scope: {
                target: '=',   //The field on the model to bind to
                bindedField: '=',   //Deprecated....why did I use binded instead of bound?
                multi: '=',         //Single select if not set or set to false
                arr: '=',           //Array of lookup options
                lookupValue: '=',   //Field name to map the lookupValue to (default: 'title')
                ngDisabled: '='     //Pass through to disable control using ng-disabled on element if set
            },
            link: function (scope) {
                if (scope.bindedField && !scope.target) {
                    //Todo remove all references to "bindedField" and change to target
                    scope.target = scope.bindedField;
                }
                scope.state = {
                    multiSelectIDs: [],
                    singleSelectID: ''
                };

                /** Default to title field if not provided */
                scope.state.lookupField = scope.lookupValue || 'title';

                var buildLookupObject = function (stringId) {
                    var intID = parseInt(stringId, 10);
                    var match = _.findWhere(scope.arr, {id: intID});
                    return {lookupId: intID, lookupValue: match[scope.state.lookupField]};
                };

                //Todo: Get this hooked up to allow custom function to be passed in instead of property name
                scope.generateDisplayText = function (item) {
                    if (_.isFunction(scope.state.lookupField)) {
                        //Passed in a reference to a function to generate the select display text
                        return scope.state.lookupField(item);
                    } else if (_.isString(scope.state.lookupField)) {
                        //Passed in a property name on the item to use
                        return item[scope.state.lookupField];
                    } else {
                        //Default to the title property of the object
                        return item.title;
                    }
                };

                scope.updateMultiModel = function () {
                    /** Ensure field being binded against is array */
                    if (!_.isArray(scope.target)) {
                        scope.target = [];
                    }
                    /** Clear out existing contents */
                    scope.target.length = 0;
                    /** Push formatted lookup object back */
                    _.each(scope.state.multiSelectIDs, function (stringId) {
                        scope.target.push(buildLookupObject(stringId));
                    });
                };

                scope.updateSingleModel = function () {
                    /** Create an object with expected lookupId/lookupValue properties */
                    scope.target = buildLookupObject(scope.state.singleSelectID);
                };

                /** Process initially and whenever the underlying value is changed */
                scope.$watch('target', function () {
                    if (scope.multi) {
                        /** Multi Select Mode
                         *  Set the string version of id's to allow multi-select control to work properly */
                        _.each(scope.target, function (selectedLookup) {
                            /** Push id as a string to match what Select2 is expecting */
                            scope.state.multiSelectIDs.push(selectedLookup.lookupId.toString());
                        });
                    } else {
                        /** Single Select Mode */
                        if (_.isObject(scope.target) && scope.target.lookupId) {
                            /** Set the selected id as string */
                            scope.state.singleSelectID = scope.target.lookupId;
                        }
                    }
                });

            }
        };
    }]);
;angular.module('angularPoint').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/directives/ap_attachments/ap_attachments_tmpl.html',
    "<div style=\"min-height: 200px\"><div class=row><div class=col-xs-12><div ng-hide=state.ready class=\"alert alert-info\">Loading attachment details</div><div style=\"height: 110px\" ng-show=state.ready><h4><small>Add Attachment</small></h4><iframe frameborder=0 seamless width=100% src=\"{{ trustedUrl }}\" scrolling=no style=\"height: 95px\"></iframe></div></div></div><h4 ng-show=\"attachments.length > 0\"><small>Attachments</small></h4><ul class=list-unstyled><li ng-repeat=\"attachment in attachments\"><a href=\"{{ attachment }}\" target=_blank>{{ fileName(attachment) }}</a> <button class=\"btn btn-link\" ng-click=deleteAttachment(attachment) title=\"Delete this attachment\"><i class=\"fa fa-times red\"></i></button></li></ul></div>"
  );


  $templateCache.put('src/directives/ap_comments/ap_comments_tmpl.html',
    "<div><div class=pull-right><button class=\"btn btn-primary btn-xs\" ng-click=createNewComment() title=\"Create a new comment\" ng-show=\"state.tempComment.length > 0\">Save</button> <button class=\"btn btn-default btn-xs\" ng-click=clearTempVars() title=\"Cancel comment\" ng-show=\"state.tempComment.length > 0\">Cancel</button>    </div><div style=\"min-height: 150px\"><div class=newComment><div class=form-group><h4><small>New Comment</small></h4><textarea class=form-control rows=2 ng-model=state.tempComment placeholder=\"Create a new comment...\"></textarea></div></div><div class=\"alert text-center\" style=\"margin-top: 30px\" ng-show=!state.ready><h4><small>loading...</small></h4></div><div class=grey style=\"margin-top: 30px\" ng-show=\"!comments && !state.newCommentVisible && state.ready\">No comments have been made. Create one using the input box above.</div><div ng-if=\"comments && comments.thread.length > 0\" class=comments-container><span ng-include=\"'src/directives/ap_comments/ap_recursive_comment.html'\" ng-init=\"comment = comments;\"></span></div></div></div>"
  );


  $templateCache.put('src/directives/ap_comments/ap_recursive_comment.html',
    "<ul class=comments><li class=comment ng-repeat=\"response in comment.thread\" style=\"border-top-width: 1px;border-top-color: grey\"><div class=comment-content><div class=content><h5><small><span class=author>{{ response.author.lookupValue }}</span> <span>{{ response.modified | date:'short' }}</span> <button class=\"btn btn-link btn-xs\" ng-click=\"state.respondingTo = response\"><i class=\"fa fa-mail-reply\"></i> Reply</button> <button class=\"btn btn-link btn-xs\" ng-click=deleteComment(response)><i class=\"fa fa-trash-o\"></i> Delete</button></small></h5><p class=comment-text>{{ response.comment }}</p></div></div><div ng-if=\"state.respondingTo === response\"><div class=row><div class=col-xs-12><form><div class=form-group><h5><small>Response<label class=pull-right><button class=\"btn btn-link btn-xs\" ng-click=createResponse(response)><i class=\"fa fa-save\"></i> Save</button> <button class=\"btn btn-link btn-xs\" ng-click=clearTempVars()><i class=\"fa fa-undo\"></i> Cancel</button></label></small></h5><textarea class=form-control rows=2 ng-model=state.tempResponse></textarea></div></form></div></div></div><div ng-if=\"response.thread.length !== -1\"><span ng-include=\"'src/directives/ap_comments/ap_recursive_comment.html'\" ng-init=\"comment = response;\"></span></div></li></ul>"
  );


  $templateCache.put('src/directives/ap_select/ap_select_tmpl.html',
    "<span class=ng-cloak><span ng-if=!multi><select class=form-control ng-model=state.singleSelectID ng-change=updateSingleModel() style=\"width: 100%\" ng-disabled=ngDisabled ng-options=\"lookup.id as lookup[state.lookupField] for lookup in arr\"></select></span> <span ng-if=multi><select multiple ui-select2 ng-model=state.multiSelectIDs ng-change=updateMultiModel() style=\"width: 100%\" ng-disabled=ngDisabled><option></option><option ng-repeat=\"lookup in arr\" value=\"{{ lookup.id }}\" ng-bind=lookup[state.lookupField]>&nbsp;</option></select></span></span>"
  );

}]);
