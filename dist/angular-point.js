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
])

  .run(["apConfig", function (apConfig) {

        /** Add a convenience flag, inverse of offline */
        apConfig.online = !apConfig.offline;
  }]);

;/**
 * Provides a way to inject vendor libraries that otherwise are globals.
 * This improves code testability by allowing you to more easily know what
 * the dependencies of your components are (avoids leaky abstractions).
 * It also allows you to mock these dependencies, where it makes sense.
 */
angular.module('angularPoint')
/** lodash */
    .constant('_', _)

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
  .service('apCacheService', ["$q", "$log", "_", function ($q, $log, _) {
    var listItemCache = {}, entityNameToType = {}, entityCache = {};

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
    }

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
      var entityCache = getEntityCache(entityType, entityId);
      return entityCache.getEntity();
    }

    EntityCache.prototype.addEntity = function (entity) {
      var self = this;
      self.entity = entity;
      self.updateCount++;
      self.entity.age = new Date();
      _.each(self.associationQueue, function (deferredRequest) {
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
    function registerEntity(entity) {
      var entityType = entity.getModel().list.guid;
      var entityCache = getEntityCache(entityType, entity.id);
      return entityCache.addEntity(entity);
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
      var entityCache = getEntityCache(entityType, entityId);
      entityCache.removeEntity();
    }

    function getEntityCache(entityType, entityId) {
      var entityTypeKey = getEntityTypeKey(entityType);
      /** Create the object structure if it doesn't already exist */
      if (!entityCache[entityTypeKey] || !entityCache[entityTypeKey][entityId]) {
        entityCache[entityTypeKey] = entityCache[entityTypeKey] || {};
        entityCache[entityTypeKey][entityId] = new EntityCache(entityTypeKey, entityId);
      }
      return entityCache[entityTypeKey][entityId];
    }

    /** Older List Item Functionality */
    //TODO: Remove these if they're not being used

    function addToCache(uniqueId, constructorName, entity) {
      var cache = getCache(uniqueId, constructorName);
      cache[constructorName] = entity;
      return cache[constructorName];
    }

    function getCache(uniqueId, constructorName) {
      listItemCache[uniqueId] = listItemCache[uniqueId] || {};
      listItemCache[uniqueId][constructorName] = listItemCache[uniqueId][constructorName] || {};
      return listItemCache[uniqueId][constructorName];
    }

    function removeFromCache(uniqueId, constructorName, entity) {
      var cache = getCache(uniqueId, constructorName);
      if (cache && cache[constructorName] && cache[constructorName][entity.id]) {
        delete cache[constructorName][entity.id];
      }
    }

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
    .service('apDataService', ["$q", "$timeout", "_", "apQueueService", "apConfig", "apUtilityService", "apDecodeService", "apEncodeService", "apFieldService", "toastr", function ($q, $timeout, _, apQueueService, apConfig, apUtilityService, apDecodeService, apEncodeService, apFieldService, toastr) {

        /** Flag to use cached XML files from the location specified in apConfig.offlineXML */
        var offline = apConfig.offline;
        /** Allows us to make code easier to read */
        var online = !offline;

        /** Exposed functionality */
        return {
            addUpdateItemModel: addUpdateItemModel,
            deleteAttachment: deleteAttachment,
            deleteItemModel: deleteItemModel,
            getCollection: getCollection,
            getFieldVersionHistory: getFieldVersionHistory,
//      getList: getList,
            getListFields: getListFields,
            getListItemById: getListItemById,
            getView: getView,
            executeQuery: executeQuery,
            serviceWrapper: serviceWrapper
        };


        /*********************** Private ****************************/

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
         *        strlistID: model.list.guid,
         *        strlistItemID: listItem.id,
         *        strFieldName: fieldDefinition.internalName
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

            if (online) {
                serviceWrapper(opts)
                    .then(function (response) {
                        /** Parse XML response */
                        var versions = apDecodeService.parseFieldVersions(response.responseText, fieldDefinition);
                        /** Resolve with an array of all field versions */
                        deferred.resolve(versions);
                    }, function (outcome) {
                        /** Failure */
                        toastr.error('Failed to fetch version history.');
                        deferred.reject(outcome);
                    });
            } else {
                /** Resolve with an empty array because we don't know what the data should look like to mock */
                deferred.resolve([]);
            }
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
            apQueueService.increase();
            var defaults = {};
            var opts = _.extend({}, defaults, options);

            /** Determine the XML node to iterate over if filterNode isn't provided */
            var filterNode = opts.filterNode || opts.operation.split('Get')[1].split('Collection')[0];

            var deferred = $q.defer();

            /** Convert the xml returned from the server into an array of js objects */
            var processXML = function (serverResponse) {
                var convertedItems = [];
                /** Get attachments only returns the links associated with a list item */
                if (opts.operation === 'GetAttachmentCollection') {
                    /** Unlike other call, get attachments only returns strings instead of an object with attributes */
                    $(serverResponse).SPFilterNode(filterNode).each(function () {
                        convertedItems.push($(this).text());
                    });
                } else {
                    convertedItems = $(serverResponse).SPFilterNode(filterNode).SPXmlToJson({
                        includeAllAttrs: true,
                        removeOws: false
                    });
                }
                return convertedItems;
            };

            if (offline) {
                var offlineData = apConfig.offlineXML + opts.operation + '.xml';

                /** Get offline data */
                $.ajax(offlineData).then(
                    function (offlineData) {
                        apQueueService.decrease();
                        /** Pass back the group array */
                        deferred.resolve(processXML(offlineData));
                    }, function (outcome) {
                        toastr.error('You need to have a ' + apConfig.offlineXML + opts.operation + '.xml ' +
                        'in order to get the group collection in offline mode.');
                        deferred.reject(outcome);
                        apQueueService.decrease();
                    });
            } else {
                var validPayload = true;
                var payload = _.extend({}, opts);

                var verifyParams = function (params) {
                    _.each(params, function (param) {
                        if (!payload[param]) {
                            toastr.error('options' + param + ' is required to complete this operation');
                            validPayload = false;
                            deferred.reject([]);
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

                if (validPayload) {
                    var webServiceCall = $().SPServices(payload);

                    webServiceCall.then(function () {
                        //Success
                        apQueueService.decrease();
                        logErrorsToConsole(webServiceCall.responseXML, opts.operation);
                        deferred.resolve(processXML(webServiceCall.responseXML));
                    }, function (outcome) {
                        //Failure
                        toastr.error('Failed to fetch list collection.');
                        apQueueService.decrease();
                        deferred.reject(outcome);
                    });
                }
            }

            return deferred.promise;

        }

        /**
         * @ngdoc function
         * @name apDataService.logErrorsToConsole
         * @description
         * Helper function to look for errors in a response from the server and output them to console.
         * @param {object} responseXML XML response from the server.
         * @param {string} operation The type of operation that was being attempted.
         */
        function logErrorsToConsole(responseXML, operation) {
            /** Errors can still be resolved without throwing an error so check the XML */
            var errorMessage = apDecodeService.checkResponseForErrors(responseXML);
            if(errorMessage) {
                console.error(operation, errorMessage);
            }
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
            //TODO: Make this the primary function which interacts with SPServices and makes web service call.  No need having this logic duplicated.
        function serviceWrapper(options) {
            var defaults = {
                /** You need to specify the offline xml file if you want to properly mock the request when offline */
                offlineXML: apConfig.offlineXML + options.operation + '.xml'
            };
            var opts = _.extend({}, defaults, options);
            var deferred = $q.defer();

            apQueueService.increase();

            /** Convert the xml returned from the server into an array of js objects */
            var processXML = function (serverResponse) {
                if (opts.filterNode) {
                    return $(serverResponse).SPFilterNode(opts.filterNode).SPXmlToJson({
                        includeAllAttrs: true,
                        removeOws: false
                    });
                } else {
                    return serverResponse;
                }
            };

            if (online) {
                /** Add in webURL to speed up call, set to default if not specified */
                var payload = {};

                _.extend(payload, opts);

                var webServiceCall = $().SPServices(payload);

                webServiceCall.then(function () {
                    /** Success */
                    apQueueService.decrease();
                    /** Errors can still be resolved without throwing an error so check the XML */
                    logErrorsToConsole(webServiceCall.responseXML, opts.operation);
                    deferred.resolve(processXML(webServiceCall.responseXML));


                }, function (outcome) {
                    /** Failure */
                    toastr.error('Failed to complete the requested ' + opts.operation + ' operation.');
                    apQueueService.decrease();
                    deferred.reject(outcome);
                });
            } else {
                /** Get offline data */
                $.ajax(opts.offlineXML).then(
                    function (offlineData) {
                        apQueueService.decrease();
                        /** Pass back the group array */
                        deferred.resolve(processXML(offlineData));
                    }, function (outcome) {
                        toastr.error('You need to have a ' + opts.offlineXML + ' file in order mock this request.');
                        deferred.reject(outcome);
                        apQueueService.decrease();
                    });
            }

            return deferred.promise;
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
            var defaults = {
                operation: 'GetList',
                filterNode: 'Field'
            };

            var opts = _.extend({}, defaults, options);
            return serviceWrapper(opts);
        }

        /**
         * @ngdoc function
         * @name apDataService.getListItemById
         * @description
         * Returns a single list item with the provided id.
         * @param {number} entityId Id of the item being requested.
         * @param {object} options Configuration parameters.
         * @param {string} options.listName GUID of the list.
         * @returns {object} Promise which resolves with the requested entity if found.
         */
        function getListItemById(entityId, options) {
            var defaults = {
                operation: 'GetListItems',
                filterNode: 'z:row',
                CAMLRowLimit: 1,
                CAMLQuery: '' +
                '<Query>' +
                ' <Where>' +
                '   <Eq>' +
                '     <FieldRef Name="ID"/>' +
                '     <Value Type="Number">' + entityId + '</Value>' +
                '   </Eq>' +
                ' </Where>' +
                '</Query>'
            };

            var opts = _.extend({}, defaults, options);
            return serviceWrapper(opts);
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
         *        listName: listItem.getModel().list.guid
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
         * @name apDataService.getView
         * @description
         * Returns the schema of the specified view for the specified list.
         * @param {object} options Configuration parameters.
         * @param {string} options.listName GUID of the list.
         * @param {string} [options.viewName] Formatted as a GUID, if not provided
         * <pre>'{37388A98-534C-4A28-BFFA-22429276897B}'</pre>
         * @param {string} [options.webURL] Can override the default web url if desired.
         * @returns {object} {query: '', viewFields: '', rowLimit: ''}
         * Promise that resolves with an object similar to this.
         * @example
         * <pre>
         * apDataService.getView({
     *    viewName: '{EE7C652F-9CBF-433F-B376-86B0EE989A06}',
     *    listName: '{AA7C652F-44BF-433F-B376-234423234A06}'
     * })
         *
         *
         * </pre>
         * <h3>Returned XML</h3>
         * <pre>
         *  <View Name="{EE7C652F-9CBF-433F-B376-86B0EE989A06}"
         *  DefaultView="TRUE" Type="HTML" DisplayName="View_Name"
         *  Url="Lists/Events/File_Name.aspx" BaseViewID="1">
         *  <Query>
         *    <Where>
         *      <Leq>
         *        <FieldRef Name="Created"/>
         *        <Value Type="DateTime">2003-03-03T00:00:00Z</Value>
         *      </Leq>
         *    </Where>
         *  </Query>
         *  <ViewFields>
         *    <FieldRef Name="fRecurrence"/>
         *    <FieldRef Name="Attachments"/>
         *    <FieldRef Name="WorkspaceLink"/>
         *    <FieldRef Name="LinkTitle"/>
         *    <FieldRef Name="Location"/>
         *    <FieldRef Name="EventDate"/>
         *    <FieldRef Name="EndDate"/>
         *  </ViewFields>
         *  <RowLimit Paged="TRUE">100</RowLimit>
         * </View>
         * </pre>
         *
         */
        function getView(options) {
            var defaults = {
                operation: 'GetView',
                offlineXML: apConfig.offlineXML + 'GetView.xml'
            };

            var deferred = $q.defer();


            var opts = _.extend({}, defaults, options);

            serviceWrapper(opts)
                .then(function (response) {
                    /** Already have the correct node if offline, otherwise if offline we need the responseText prop */
                    var responseText = apConfig.offline ? response : response.responseText;
                    /** Success */
                    var output = {
                        query: '<Query>' + $(responseText).find('Query').html() + '</Query>',
                        viewFields: '<ViewFields>' + $(responseText).find('ViewFields').html() + '</ViewFields>',
                        rowLimit: $(responseText).find('RowLimit').html()
                    };

                    /** Pass back the lists array */
                    deferred.resolve(output);
                }, function (err) {
                    /** Failure */
                    toastr.error('Failed to fetch view details.');
                    deferred.reject(err);
                });

            return deferred.promise;
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
         * @returns {object[]} - Array of list item objects.
         */
        function executeQuery(model, query, options) {

            var defaults = {
                target: model.getCache()
            };

            var deferred = $q.defer();

            /** Extend defaults **/
            var opts = _.extend({}, defaults, options);

            /** Allow a list item to reference the query which generated it */
            opts.getQuery = function () {
                return query;
            };

            /** Trigger processing animation */
            apQueueService.increase();

            if (online) {
                var webServiceCall = $().SPServices(query);
                webServiceCall.then(function () {
                    var responseXML = webServiceCall.responseXML;

                    /** Errors can still be resolved without throwing an error so check the XML */
                    logErrorsToConsole(webServiceCall.responseXML, opts.operation);

                    if (query.operation === 'GetListItemChangesSinceToken') {

                        /** The initial call to GetListItemChangesSinceToken also includes the field definitions for the
                         *  list so use this to extend the existing field definitions and list defined in the model. */
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

                    /** Convert the XML into JS objects */
                    apDecodeService.processListItems(model, responseXML, opts)
                        .then(function (entities) {
                            /** Set date time to allow for time based updates */
                            query.lastRun = new Date();
                            apQueueService.decrease();
                            deferred.resolve(entities);
                        });
                });
            } else {
                /** Simulate an web service call if working offline */
                /** Optionally set alternate offline XML location but default to value in model */
                var offlineData = opts.offlineXML || query.offlineXML || apConfig.offlineXML + model.list.title + '.xml';

                /** Only pull down offline xml if this is the first time the query is run */
                if (query.lastRun) {
                    /** Query has already been run, resolve reference to existing data */
                    query.lastRun = new Date();
                    apQueueService.decrease();
                    deferred.resolve(query.cache);
                } else {
                    /** First run for query
                     *  Get offline XML file from the location specified in apConfig.offlineXML
                     */
                    $.ajax(offlineData).then(function (responseXML) {
                        apDecodeService.processListItems(model, responseXML, opts)
                            .then(function (entities) {
                                /** Set date time to allow for time based updates */
                                query.lastRun = new Date();
                                apQueueService.decrease();

                                /** Extend the field and list definition in the model with the offline data */
                                if (query.operation === 'GetListItemChangesSinceToken') {
                                    apDecodeService.extendListDefinitionFromXML(model.list, responseXML);
                                    apDecodeService.extendFieldDefinitionsFromXML(model.list.fields, responseXML);
                                }

                                deferred.resolve(entities);
                            });
                    }, function () {
                        var mockData = model.generateMockData();
                        deferred.resolve(mockData);
                        toastr.error('There was a problem locating the "' + apConfig.offlineXML + model.list.title + '.xml"');
                    });
                }
            }

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name apDataService.removeEntityFromLocalCache
         * @description
         * Searches for an entity based on list item ID and removes it from the cached array if it exists.
         * @param {Array} entityArray Cached array of list items for a query.
         * @param {Number} entityId The ID to evaluate against to determine if there is a match.
         * @returns {boolean} Returns true if a list item was successfully found and removed.
         */
        function removeEntityFromLocalCache(entityArray, entityId) {
            var successfullyDeleted = false;

            /** Remove from local data array */
            var item = _.findWhere(entityArray, {id: entityId});
            /** Use lodash _.indexOf to workaround IE issues */
            var index = _.indexOf(entityArray, item);

            if (index > -1) {
                /** Remove the locally cached record */
                entityArray.splice(index, 1);
                successfullyDeleted = true;
            }

            return successfullyDeleted;
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
         * @param {Array} entityArray Cached array of list items for a query.
         */
        function processDeletionsSinceToken(responseXML, entityArray) {
            var deleteCount = 0;

            /** Remove any locally cached entities that were deleted from the server */
            $(responseXML).SPFilterNode('Id').each(function () {
                /** Check for the type of change */
                var changeType = $(this).attr('ChangeType');

                if (changeType === 'Delete') {
                    var entityId = parseInt($(this).text(), 10);
                    /** Remove from local data array */
                    var foundAndRemoved = removeEntityFromLocalCache(entityArray, entityId);
                    if (foundAndRemoved) {
                        deleteCount++;
                    }
                }
            });
            if (deleteCount > 0 && offline) {
                console.log(deleteCount + ' item(s) removed from local cache to mirror changes on source list.');
            }
        }


        /**
         * @ngdoc function
         * @name apDataService.updateAllCaches
         * @description
         * Propagates a change to all duplicate entities in all cached queries within a given model.
         * @param {object} model Reference to the entities model.
         * @param {object} entity JavaScript object representing the SharePoint list item.
         * @param {object} [exemptQuery] - The query containing the updated item is automatically updated so we don't
         * need to process it.
         *
         * @returns {number} The number of queries where the entity was found and updated.
         */
        function updateAllCaches(model, entity, exemptQuery) {
            var queriesUpdated = 0;
            /** Search through each of the queries and update any occurrence of this entity */
            _.each(model.queries, function (query) {
                /** Process all query caches except the one originally used to retrieve entity because
                 * that is automatically updated by "apDecodeService.processListItems". */
                if (query != exemptQuery) {
                    apDecodeService.updateLocalCache(query.cache, [entity]);
                }
            });
            return queriesUpdated;
        }

        /**
         * @ngdoc function
         * @name apDataService.addUpdateItemModel
         * @description
         * Adds or updates a list item based on if the item passed in contains an id attribute.
         * @param {object} model Reference to the entities model.
         * @param {object} entity JavaScript object representing the SharePoint list item.
         * @param {object} [options] Optional configuration params.
         * @param {string} [options.mode='update'] [update, replace, return]
         * @param {boolean} [options.buildValuePairs=true] Automatically generate pairs based on fields defined in model.
         * @param {boolean} [options.updateAllCaches=false] Search through the cache for each query on the model and
         * update all instances of this entity to ensure entity is updated everywhere.  This is more process intensive
         * so by default we only update the cached entity in the cache where this entity is currently stored.  Note: Only
         * applicable when updating an entity.
         * @param {Array[]} [options.valuePairs] Precomputed value pairs to use instead of generating them for each
         * field identified in the model.
         * @returns {object} Promise which resolves with the newly updated item.
         */
        function addUpdateItemModel(model, entity, options) {
            var defaults = {
                mode: 'update',  //Options for what to do with local list data array in store [replace, update, return]
                buildValuePairs: true,
                updateAllCaches: false,
                valuePairs: []
            };
            var deferred = $q.defer();
            var opts = _.extend({}, defaults, options);

            /** Display loading animation */
            apQueueService.increase();

            if (opts.buildValuePairs === true) {
                var editableFields = _.where(model.list.fields, {readOnly: false});
                opts.valuePairs = apEncodeService.generateValuePairs(editableFields, entity);
            }
            var payload = {
                operation: 'UpdateListItems',
                webURL: model.list.webURL,
                listName: model.list.guid,
                valuepairs: opts.valuePairs
            };

            if ((_.isObject(entity) && _.isNumber(entity.id))) {
                /** Updating existing list item */
                payload.batchCmd = 'Update';
                payload.ID = entity.id;
            } else {
                /** Creating new list item */
                payload.batchCmd = 'New';
            }

            if (online) {
                /** Make call to lists web service */
                var webServiceCall = $().SPServices(payload);

                webServiceCall.then(function () {
                    /** Success */
                    apDecodeService.processListItems(model, webServiceCall.responseXML, opts).then(function (output) {
                        var updatedEntity = output[0];

                        /** Optionally search through each cache on the model and update any other references to this entity */
                        if (opts.updateAllCaches && _.isNumber(entity.id)) {
                            updateAllCaches(model, updatedEntity, entity.getQuery());
                        }
                        deferred.resolve(updatedEntity);
                    });
                }, function (outcome) {
                    /** In the event of an error, display toast */
                    toastr.error('There was an error getting the requested data from ' + model.list.name);
                    deferred.reject(outcome);
                }).always(function () {
                    apQueueService.decrease();
                });
            } else {
                /** Logic to simulate expected behavior when working offline */
                /** Offline mode */
                window.console.log(payload);

                /** Mock data */
                var offlineDefaults = {
                    modified: new Date(),
                    editor: {
                        lookupId: 23,
                        lookupValue: 'Generic User'
                    }
                };

                if (!entity.id) {
                    var newItem = {};

                    /* Include standard mock fields for new item */
                    offlineDefaults.author = {
                        lookupId: 23,
                        lookupValue: 'Generic User'
                    };

                    offlineDefaults.created = new Date();

                    /** We don't know which query cache to push it to so add it to all */
                    _.each(model.queries, function (query) {
                        /** Find next logical id to assign */
                        var maxId = 1;
                        _.each(query.cache, function (entity) {
                            if (entity.id > maxId) {
                                maxId = entity.id;
                            }
                        });
                        offlineDefaults.id = maxId + 1;
                        /** Add default attributes */
                        _.extend(entity, offlineDefaults);
                        /** Use factory to build new object */
                        newItem = new model.factory(entity);
                        query.cache.push(newItem);
                    });

                    deferred.resolve(newItem);
                } else {
                    /** Update existing record in local cache */
                    _.extend(entity, offlineDefaults);
                    deferred.resolve(entity);
                }
                apQueueService.decrease();
            }
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name apDataService.deleteItemModel
         * @description
         * Typically called directly from a list item, removes the list item from SharePoint
         * and the local cache.
         * @param {object} model Reference to the entities model.
         * @param {object} entity JavaScript object representing the SharePoint list item.
         * @param {object} [options] Optional configuration params.
         * @param {Array} [options.target=item.getContainer()] Optional location to search through and remove the
         * local cached copy.
         * @param {boolean} [options.updateAllCaches=false] Search through the cache for each query on the model
         * to ensure entity is removed everywhere.  This is more process intensive so by default we only delete the
         * cached entity in the cache where this entity is currently stored.
         * @returns {object} Promise which resolves when the operation is complete.  Nothing of importance is returned.
         */
        function deleteItemModel(model, entity, options) {
            var defaults = {
                target: _.isFunction(entity.getContainer) ? entity.getContainer() : model.getCache(),
                updateAllCaches: false,
                operation: 'UpdateListItems',
                webURL: model.list.webURL,
                listName: model.list.guid,
                batchCmd: 'Delete',
                ID: entity.id
            };

            var opts = _.extend({}, defaults, options);

            var deferred = $q.defer();

            function cleanCache() {
                var deleteCount = 0;
                if (opts.updateAllCaches) {
                    var model = entity.getModel();
                    _.each(model.queries, function (query) {
                        var entityRemoved = removeEntityFromLocalCache(query.cache, entity.id);
                        if (entityRemoved) {
                            deleteCount++;
                        }
                    });
                } else {
                    var entityRemoved = removeEntityFromLocalCache(opts.target, entity.id);
                    if (entityRemoved) {
                        deleteCount++;
                    }
                }
                return deleteCount;
            }

            if (online) {
                serviceWrapper(opts)
                    .then(function () {
                        /** Success */
                        cleanCache();
                        apQueueService.decrease();
                        deferred.resolve(opts.target);
                    }, function (outcome) {
                        //In the event of an error, display toast
                        toastr.error('There was an error deleting a list item from ' + model.list.title);
                        deferred.reject(outcome);
                    });
            } else {
                /** Offline debug mode */
                /** Simulate deletion and remove locally */
                cleanCache();
                deferred.resolve(opts.target);
            }

            return deferred.promise;
        }
    }]
);;'use strict';

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
    .service('apDecodeService', ["$q", "_", "apUtilityService", "apQueueService", "apConfig", "apCacheService", function ($q, _, apUtilityService, apQueueService, apConfig, apCacheService) {

        return {
            attrToJson: attrToJson,
            checkResponseForErrors: checkResponseForErrors,
            extendFieldDefinitionsFromXML: extendFieldDefinitionsFromXML,
            extendListDefinitionFromXML: extendListDefinitionFromXML,
            lookupToJsonObject: lookupToJsonObject,
            parseFieldVersions: parseFieldVersions,
            processListItems: processListItems,
            updateLocalCache: updateLocalCache,
            xmlToJson: xmlToJson
        };

        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:processListItems
         * @methodOf angularPoint.apDecodeService
         * @description
         * Post processing of data after returning list items from server.  Returns a promise that resolves with
         * the processed entities.  Promise allows us to batch conversions of large lists to prevent ui slowdowns.
         * @param {object} model Reference to allow updating of model.
         * @param {xml} responseXML Resolved promise from SPServices web service call.
         * @param {object} [options] Optional configuration object.
         * @param {function} [options.factory=model.factory] Constructor function typically stored on the model.
         * @param {string} [options.filter='z:row'] XML filter string used to find the elements to iterate over.
         * @param {Array} [options.mapping=model.list.mapping] Field definitions, typically stored on the model.
         * @param {string} [options.mode='update'] Options for what to do with local list data array in
         * store ['replace', 'update', 'return']
         * @param {Array} [options.target=model.getCache()] Optionally pass in array to update after processing.
         * @returns {object} Promise
         */
        function processListItems(model, responseXML, options) {
            var deferred = $q.defer();

            var defaults = {
                /** Default list item constructor */
                ctor: function (item) {
                    /** Allow us to reference the originating query that generated this object */
                    item.getQuery = function () {
                        return opts.getQuery();
                    };
                    /** Create Reference to the containing array */
                    item.getContainer = function () {
                        return opts.target;
                    };
                    var listItem = new model.factory(item);

                    /** Register in global application entity cache */
                    apCacheService.registerEntity(listItem);
                    return listItem;
                },
                factory: model.factory,
                filter: 'z:row',
                mapping: model.list.mapping,
                mode: 'update',
                target: model.getCache(),
                /** Don't want to throttle if we're testing offline */
                throttle: apConfig.online
            };

            var opts = _.extend({}, defaults, options);

            /** Map returned XML to JS objects based on mapping from model */
            var filteredNodes = $(responseXML).SPFilterNode(opts.filter);

            xmlToJson(filteredNodes, opts).then(function (entities) {
                if (opts.mode === 'replace') {
                    /** Replace any existing data */
                    opts.target = entities;
                    if (apConfig.offline) {
                        console.log(model.list.title + ' Replaced with ' + opts.target.length + ' new records.');
                    }
                } else if (opts.mode === 'update') {
                    var updateStats = updateLocalCache(opts.target, entities);
                    if (apConfig.offline) {
                        console.log(model.list.title + ' Changes (Create: ' + updateStats.created +
                        ' | Update: ' + updateStats.updated + ')');
                    }
                }
                apQueueService.decrease();
                deferred.resolve(entities);
            });

            return deferred.promise;

        }

        function checkResponseForErrors(responseXML) {
            var errorString = null;
            /** Responses with a <errorstring></errorstring> element with details on what happened */
            $(responseXML).find("errorstring").each(function() {
                errorString = $(this).text();
            });
            return errorString;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:updateLocalCache
         * @methodOf angularPoint.apDecodeService
         * @description
         * Maps a cache by entity id.  All provided entities are then either added if they don't already exist
         * or replaced if they do.
         * @param {object[]} localCache The cache for a given query.
         * @param {object[]} entities All entities that should be merged into the cache.
         * @returns {object} {created: number, updated: number}
         */
        function updateLocalCache(localCache, entities) {
            var updateCount = 0,
                createCount = 0;

            /** Map to only run through target list once and speed up subsequent lookups */
            var idMap = _.pluck(localCache, 'id');

            /** Update any existing items stored in the cache */
            _.each(entities, function (entity) {
                if (idMap.indexOf(entity.id) === -1) {
                    /** No match found, add to target and update map */
                    localCache.push(entity);
                    idMap.push(entity.id);
                    createCount++;
                } else {
                    /** Replace local item with updated value */
                    localCache[idMap.indexOf(entity.id)] = entity;
                    updateCount++;
                }
            });
            return {
                created: createCount,
                updated: updateCount
            };
        }


        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:xmlToJson
         * @methodOf angularPoint.apDecodeService
         * @description
         * Converts an XML node set to Javascript object array. This is a modified version of the SPServices
         * "SPXmlToJson" function.
         * @param {array} rows ["z:rows"] XML rows that need to be parsed.
         * @param {object} options Options object.
         * @param {object[]} options.mapping [columnName: "mappedName", objectType: "objectType"]
         * @param {boolean} [options.includeAllAttrs=false] If true, return all attributes, regardless whether
         * @param {boolean} [options.ctor] List item constructor.
         * @param {boolean} [options.throttle=true] Cut long running conversions into chunks to prevent ui performance
         * hit.  The downside is most evergreen browsers can handle it so it could slow them down unnecessarily.
         * @param {boolean} [options.removeOws=true] Specifically for GetListItems, if true, the leading ows_ will
         * be stripped off the field name.
         * @returns {Array} An array of JavaScript objects.
         */
        function xmlToJson(rows, options) {

            var defaults = {
                mapping: {},
                includeAllAttrs: false,
                removeOws: true,
                throttle: true
            };

            var deferred = $q.defer();


            var opts = _.extend({}, defaults, options);

            var attrNum;
            var entities = [];

            var processRow = function (item) {
                var row = {};
                var rowAttrs = item.attributes;

                /** Bring back all mapped columns, even those with no value */
                _.each(opts.mapping, function (prop) {
                    row[prop.mappedName] = '';
                });

                // Parse through the element's attributes
                for (attrNum = 0; attrNum < rowAttrs.length; attrNum++) {
                    var thisAttrName = rowAttrs[attrNum].name;
                    var thisMapping = opts.mapping[thisAttrName];
                    var thisObjectName = typeof thisMapping !== 'undefined' ? thisMapping.mappedName : opts.removeOws ? thisAttrName.split('ows_')[1] : thisAttrName;
                    var thisObjectType = typeof thisMapping !== 'undefined' ? thisMapping.objectType : undefined;
                    if (opts.includeAllAttrs || thisMapping !== undefined) {
                        row[thisObjectName] = attrToJson(rowAttrs[attrNum].value, thisObjectType, {
                            getQuery: opts.getQuery,
                            entity: row,
                            propertyName: thisObjectName
                        });
                    }
                }
                /** Push the newly created list item into the return array */
                if (_.isFunction(opts.ctor)) {
                    /** Use provided list item constructor */
                    entities.push(opts.ctor(row));
                } else {
                    entities.push(row);
                }
            };

            if (opts.throttle) {
                /** Action is async so wait until promise from batchProcess is resolved */
                apUtilityService.batchProcess(rows, processRow, this, 25)
                    .then(function () {
                        deferred.resolve(entities);
                    });
            } else {
                _.each(rows, processRow);
                deferred.resolve(entities);
            }

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apDecodeService:attrToJson
         * @methodOf angularPoint.apDecodeService
         * @description
         * Converts a SharePoint string representation of a field into the correctly formatted JavaScript version
         * based on object type.
         * @param {string} value SharePoint string.
         * @param {string} [objectType='Text'] The type based on field definition.  See
         * See [List.customFields](#/api/List.FieldDefinition) for additional info on how to define a field type.
         * @param {object} [options] Options to pass to the object constructor.
         * @param {object} [options.entity] Reference to the parent list item which can be used by child constructors.
         * @param {object} [options.propertyName] Name of property on the list item.
         * @returns {*} The newly instantiated JavaScript value based on field type.
         */
        function attrToJson(value, objectType, options) {

            var colValue;

            switch (objectType) {
                case 'DateTime': // For calculated columns, stored as datetime;#value
                    // Dates have dashes instead of slashes: ows_Created='2009-08-25 14:24:48'
                    colValue = dateToJsonObject(value);
                    break;
                case 'Lookup':
                    colValue = lookupToJsonObject(value, options);
                    break;
                case 'User':
                    colValue = userToJsonObject(value);
                    break;
                case 'LookupMulti':
                    colValue = lookupMultiToJsonObject(value, options);
                    break;
                case 'UserMulti':
                    colValue = userMultiToJsonObject(value);
                    break;
                case 'Boolean':
                    colValue = booleanToJsonObject(value);
                    break;
                case 'Integer':
                case 'Counter':
                    colValue = intToJsonObject(value);
                    break;
                case 'Currency':
                case 'Number':
                case 'Float': // For calculated columns, stored as float;#value
                    colValue = floatToJsonObject(value);
                    break;
                case 'Calc':
                    colValue = calcToJsonObject(value);
                    break;
                case 'MultiChoice':
                    colValue = choiceMultiToJsonObject(value);
                    break;
                case 'HTML':
                    colValue = parseHTML(value);
                    break;
                case 'JSON':
                    colValue = parseJSON(value);
                    break;
                case 'Choice':
                default:
                    // All other objectTypes will be simple strings
                    colValue = stringToJsonObject(value);
                    break;
            }
            return colValue;
        }

        function parseJSON(s) {
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

        function parseHTML(s) {
            return _.unescape(s);
        }

        function stringToJsonObject(s) {
            return s;
        }

        function intToJsonObject(s) {
            if (!s) {
                return s;
            } else {
                return parseInt(s, 10);
            }
        }

        function floatToJsonObject(s) {
            if (!s) {
                return s;
            } else {
                return parseFloat(s);
            }
        }

        function booleanToJsonObject(s) {
            return (s === '0' || s === 'False') ? false : true;
        }

        function dateToJsonObject(s) {
            /** Replace dashes with slashes and the "T" deliminator with a space if found */
            return new Date(s.replace(/-/g, '/').replace(/T/i, ' '));
        }

        function userToJsonObject(s) {
            if (s.length === 0) {
                return null;
            }
            //Send to constructor
            return new User(s);
        }

        function userMultiToJsonObject(s) {
            if (s.length === 0) {
                return [];
            } else {
                var thisUserMultiObject = [];
                var thisUserMulti = s.split(';#');
                for (var i = 0; i < thisUserMulti.length; i = i + 2) {
                    var thisUser = userToJsonObject(thisUserMulti[i] + ';#' + thisUserMulti[i + 1]);
                    thisUserMultiObject.push(thisUser);
                }
                return thisUserMultiObject;
            }
        }

        function lookupToJsonObject(s, options) {
            if (s.length === 0) {
                return null;
            } else {
                //Send to constructor
                return new Lookup(s, options);
            }
        }

        function lookupMultiToJsonObject(s, options) {
            if (s.length === 0) {
                return [];
            } else {
                var thisLookupMultiObject = [];
                var thisLookupMulti = s.split(';#');
                for (var i = 0; i < thisLookupMulti.length; i = i + 2) {
                    var thisLookup = lookupToJsonObject(thisLookupMulti[i] + ';#' + thisLookupMulti[i + 1], options);
                    thisLookupMultiObject.push(thisLookup);
                }
                return thisLookupMultiObject;
            }
        }

        function choiceMultiToJsonObject(s) {
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


        function calcToJsonObject(s) {
            if (s.length === 0) {
                return null;
            } else {
                var thisCalc = s.split(';#');
                // The first value will be the calculated column value type, the second will be the value
                return attrToJson(thisCalc[1], thisCalc[0]);
            }
        }

        /**Constructors for user and lookup fields*/
        /**Allows for easier distinction when debugging if object type is shown as either Lookup or User**/

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
            lookup.lookupValue = thisLookup.value;
            lookup._props = function () {
                return options;
            };
        }

        /**
         * @ngdoc function
         * @name Lookup.getEntity
         * @methodOf Lookup
         * @description
         * Allows us to create a promise that will resolve with the entity referenced in the lookup whenever that list
         * item is registered.
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
         * project.location.getEntity().then(function(entity) {
         *     //Resolves with the full location entity once it's registered in the cache
         *
         *    });
         * </pre>
         * @returns {promise} Resolves with the object the lookup is referencing.
         */
        Lookup.prototype.getEntity = function () {
            var self = this;
            var props = self._props();

            if (!props.getEntity) {
                var query = props.getQuery();
                var listItem = query.searchLocalCache(props.entity.id);

                /** Create a new deferred object if this is the first run */
                props.getEntity = $q.defer();
                listItem.getLookupReference(props.propertyName, self.lookupId)
                    .then(function (entity) {
                        props.getEntity.resolve(entity);
                    })
            }
            return props.getEntity.promise;
        };

        /**
         * @ngdoc function
         * @name Lookup.getProperty
         * @methodOf Lookup
         * @description
         * Returns a promise which resolves with the value of a property in the referenced object.
         * @param {string} propertyPath The dot separated propertyPath.
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
         * //To get the location.city
         * project.location.getProperty('city').then(function(city) {
         *    //Resolves with the city property from the referenced location entity
         *
         *    });
         * </pre>
         * @returns {promise} Resolves with the value, or undefined if it doesn't exists.
         */
        Lookup.prototype.getProperty = function (propertyPath) {
            var self = this;
            var deferred = $q.defer();
            self.getEntity().then(function (entity) {
                deferred.resolve(_.deepGetOwnValue(entity, propertyPath));
            });
            return deferred.promise;
        };

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
         */
        function extendListDefinitionFromXML(list, responseXML) {
            $(responseXML).find("List").each(function() {
                extendObjectWithXMLAttributes(this, list);
            });
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

            /** Map all custom fields with keys of the internalName and values = field definition */
            _.each(fieldDefinitions, function (field) {
                if (field.internalName) {
                    fieldMap[field.internalName] = field;
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
                        _.each(xmlChoices, function(xmlChoice) {
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
            var versionCount = $(responseXML).find('Version').length;
            $(responseXML).find('Version').each(function (index) {
                var self = this;

                /** Parse the xml and create a representation of the version as a js object */
                var version = {
                    editor: attrToJson($(self).attr('Editor'), 'User'),
                    /** Turn the SharePoint formatted date into a valid date object */
                    modified: attrToJson($(self).attr('Modified'), 'DateTime'),
                    /** Returns records in desc order so compute the version number from index */
                    version: versionCount - index
                };

                /** Properly format field based on definition from model */
                version[fieldDefinition.mappedName] =
                    attrToJson($(self).attr(fieldDefinition.internalName), fieldDefinition.objectType);

                /** Push to beginning of array */
                versions.unshift(version);
            });

            return versions;
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
  .service('apEncodeService', ["_", "apConfig", "apUtilityService", function (_, apConfig, apUtilityService) {

    /** Flag to use cached XML files from the src/dev folder */
    var offline = apConfig.offline;

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
         *  internalName: "Title",
         *  objectType: "Text",
         *  mappedName: "lastName",
         *  readOnly:false
         * }
     * </pre>
     * @param {*} value Current field value.
     * @returns {Array} [fieldName, fieldValue]
     */
    var createValuePair = function (fieldDefinition, value) {
      var valuePair = [];
      var internalName = fieldDefinition.internalName;

      if (!value || value === '') {
        /** Create empty value pair if blank or undefined */
        valuePair = [internalName, ''];
      } else {
        switch (fieldDefinition.objectType) {
          case 'Lookup':
          case 'User':
            if (!value.lookupId) {
              valuePair = [internalName, ''];
            } else {
              valuePair = [internalName, value.lookupId];
            }
            break;
          case 'LookupMulti':
          case 'UserMulti':
            var stringifiedArray = stringifySharePointMultiSelect(value, 'lookupId');
            valuePair = [fieldDefinition.internalName, stringifiedArray];
            break;
          case 'MultiChoice':
            valuePair = [fieldDefinition.internalName, choiceMultiToString(value)];
            break;
          case 'Boolean':
            valuePair = [internalName, value ? 1 : 0];
            break;
          case 'DateTime':
            if (_.isDate(value)) {
              //A string date in ISO8601 format, e.g., '2013-05-08T01:20:29Z-05:00'
              valuePair = [internalName, stringifySharePointDate(value)];
            } else {
              valuePair = [internalName, ''];
            }
            break;
          case 'Note':
          case 'HTML':
            valuePair = [internalName, _.escape(value)];
            break;
          case 'JSON':
            valuePair = [internalName, angular.toJson(value)];
            break;
          default:
            valuePair = [internalName, value];
        }
        if (offline) {
          console.log('{' + fieldDefinition.objectType + '} ' + valuePair);
        }
      }
      return valuePair;
    };

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
      if (!_.isDate(date)) {
        return '';
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
        window.console.log('Calculating');

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
     * @returns {string} Need to format string of id's in following format [ID0];#;#[ID1];#;#[ID1]
     */
    function stringifySharePointMultiSelect(multiSelectValue, idProperty) {
      var stringifiedValues = '';
      var idProp = idProperty || 'lookupId';
      _.each(multiSelectValue, function (lookupObject, iteration) {
        /** Need to format string of id's in following format [ID0];#;#[ID1];#;#[ID1] */
        stringifiedValues += lookupObject[idProp];
        if (iteration < multiSelectValue.length) {
          stringifiedValues += ';#;#';
        }
      });
      return stringifiedValues;
    }

    return {
      choiceMultiToString: choiceMultiToString,
      createValuePair: createValuePair,
      generateValuePairs: generateValuePairs,
      stringifySharePointDate: stringifySharePointDate,
      stringifySharePointMultiSelect: stringifySharePointMultiSelect

    }
  }]);;'use strict';

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
      if(prop) {
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
  }]);;'use strict';

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
      _.times(_.random(1,4), function () {
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
      Boolean: { defaultValue: null, staticMock: true, dynamicMock: randomBoolean },
      Choice: { defaultValue: '', staticMock: 'My Choice', dynamicMock: randomString },
      ChoiceMulti: { defaultValue: [], staticMock: ['A Good Choice', 'A Bad Choice'], dynamicMock: randomStringArray },
      Counter: { defaultValue: null, staticMock: getUniqueCounter(), dynamicMock: getUniqueCounter },
      Currency: { defaultValue: null, staticMock: 120.50, dynamicMock: randomCurrency },
      DateTime: { defaultValue: null, staticMock: new Date(2014, 5, 4, 11, 33, 25), dynamicMock: randomDate },
      Integer: { defaultValue: null, staticMock: 14, dynamicMock: randomInteger },
      JSON: { defaultValue: '', staticMock: [
        {id: 1, title: 'test'},
        {id: 2}
      ], dynamicMock: randomString },
      Lookup: { defaultValue: '', staticMock: {lookupId: 49, lookupValue: 'Static Lookup'}, dynamicMock: randomLookup },
      LookupMulti: { defaultValue: [], staticMock: [
        {lookupId: 50, lookupValue: 'Static Multi 1'},
        {lookupId: 51, lookupValue: 'Static Multi 2'}
      ], dynamicMock: randomLookupMulti },
      Mask: { defaultValue: mockPermMask(), staticMock: mockPermMask(), dynamicMock: mockPermMask },
      User: { defaultValue: '', staticMock: {lookupId: 52, lookupValue: 'Static User'}, dynamicMock: randomUser },
      UserMulti: { defaultValue: [], staticMock: [
        {lookupId: 53, lookupValue: 'Static User 1'},
        {lookupId: 54, lookupValue: 'Static User 2'}
      ], dynamicMock: randomUserMulti }
    };

    /**
     * Returns an object defining a specific field type
     * @param {string} fieldType
     * @returns {object} fieldTypeDefinition
     */
    function getDefinition(fieldType) {
      return fieldTypes[fieldType];
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
        if(_.isFunction(Chance) && options && !options.staticValue) {
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
      { internalName: 'ID', objectType: 'Counter', mappedName: 'id', readOnly: true},
      { internalName: 'Modified', objectType: 'DateTime', mappedName: 'modified', readOnly: true},
      { internalName: 'Created', objectType: 'DateTime', mappedName: 'created', readOnly: true},
      { internalName: 'Author', objectType: 'User', mappedName: 'author', readOnly: true},
      { internalName: 'Editor', objectType: 'User', mappedName: 'editor', readOnly: true},
      { internalName: 'PermMask', objectType: 'Mask', mappedName: 'permMask', readOnly: true},
      { internalName: 'UniqueId', objectType: 'String', mappedName: 'uniqueId', readOnly: true}
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
        list.viewFields += '<FieldRef Name="' + field.internalName + '"/>';
        list.mapping['ows_' + field.internalName] = { mappedName: field.mappedName, objectType: field.objectType };
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

    return{
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
 * @name angularPoint.apModalService
 * @description
 * Extends a modal form to include many standard functions
 *
 */
angular.module('angularPoint')
  .service('apModalService', ["$modal", "_", "toastr", function ($modal, _, toastr) {

    /**
     * @ngdoc function
     * @name angularPoint.apModalService:modalModelProvider
     * @methodOf angularPoint.apModalService
     * @description
     * Extends a model to allow us to easily attach a modal form that accepts and injects a
     * dynamic number of arguments.
     * @param {object} options Configuration object.
     * @param {string} options.templateUrl Reference to the modal view.
     * @param {string} options.controller Name of the modal controller.
     * @param {string[]} [options.expectedArguments] First argument name should be the item being edited.
     * @returns {object} Function which returns openModal that in turn returns a promise.
     *
     * @example
     * <pre>
     *    model.openModal = apModalService.modalModelProvider({
         *        templateUrl: 'modules/comp_request/views/comp_request_modal_view.html',
         *        controller: 'compRequestModalCtrl',
         *        expectedArguments: ['request']
         *    });
     * </pre>
     */
    function modalModelProvider(options) {
      return function openModal() {
        var self = openModal;
        var defaults = {
          templateUrl: options.templateUrl,
          controller: options.controller,
          resolve: {}
        };
        var modalConfig = _.extend({}, defaults, options);

        /** Store a reference to any arguments that were passed in */
        var args = arguments;

        /**
         * Create members to be resolved and passed to the controller as locals;
         *  Equivalent of the resolve property for AngularJS routes
         */
        _.each(options.expectedArguments, function (argumentName, index) {
          modalConfig.resolve[argumentName] = function () {
            return args[index];
          };
        });

        var modalInstance = $modal.open(modalConfig);

        /** Assume that if there is a first argument, it is the item we're editing */
        if (args[0]) {
          /** Create a copy in case we need to revert back */
          self.snapshot = angular.copy(args[0]);
          modalInstance.result.then(function () {

          }, function () {
            /** Undo any changes if cancelled */
            _.extend(args[0], self.snapshot);
          });
        }

        return modalInstance.result;
      };
    }

    /**
     * @ngdoc function
     * @name angularPoint.apModalService:getPermissions
     * @methodOf angularPoint.apModalService
     * @description
     * Returns an object containing the permission levels for the current user
     * @param {object} entity JavaScript object representing the SharePoint list item.
     * @param {object} [model] Fallback so we can use the model to determine the user's
     * list permissions instead of the list item.
     * @returns {object} {userCanEdit: boolean, userCanDelete: boolean, userCanApprove: boolean, fullControl: boolean}
     */
    function getPermissions(entity, model) {
      var userPermissions = {
        /** Assume that if no item is passed in, the user can create one */
        userCanApprove: false,
        userCanDelete: false,
        userCanEdit: false,
        fullControl: false
      };

      function resolvePermissions(permObj) {
        var userPermMask = permObj.resolvePermissions();
        userPermissions.userCanEdit = userPermMask.EditListItems;
        userPermissions.userCanDelete = userPermMask.DeleteListItems;
        userPermissions.userCanApprove = userPermMask.ApproveItems;
        userPermissions.fullControl = userPermMask.FullMask;
      }

      if (entity && entity.resolvePermissions) {
        resolvePermissions(entity);
      } else if (model && model.resolvePermissions) {
        /** Fallback to retrieve permissions from the model when a list item isn't available */
        resolvePermissions(model);
      }

      return userPermissions;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apModalService:initializeState
     * @methodOf angularPoint.apModalService
     * @description
     * Creates a state object, populates permissions for current user, and sets display mode
     *
     * @param {object} entity JavaScript object representing the SharePoint list item.
     * @param {object} [options] Optional state params.
     * @param {object} [model] Optional fallback to list permissions instead of using
     * list item permissions.
     * @returns {object} Returns the extended state.
     *
     * @example
     * <pre>
     * $scope.state = apModalService.initializeState(request, {
         *     dateExceedsBoundary: false,
         *     enableApproval: false
         * });
     * </pre>
     * <pre>
     * //Returns
     * $scope.state = {
         *    // Default "View" and once permissions are checked it
         *    // can also be "New" || "Edit"
         *    displayMode: "New",
         *    // Below 2 options allow for locking with 3 way
         *    // binding service like FireBase
         *    locked: false,
         *    lockedBy: '',
         *    // Flag which can be used to disable form controls
         *    negotiatingWithServer: false,
         *    userCanApprove: false,
         *    userCanDelete: false,
         *    userCanEdit: false,
         *    //User has admin rights
         *    fullControl: false
         * }
     * </pre>
     */
    function initializeState(entity, options, model) {
      var state = {
        displayMode: 'View', // New || Edit || View
        locked: false,
        lockedBy: '',
        negotiatingWithServer: false,
        ready: false
      };

      var permissions = getPermissions(entity, model);

      /** Check if it's a new form */
      if (!entity || !entity.id) {
        state.displayMode = 'New';
      } else if (permissions.userCanEdit) {
        state.displayMode = 'Edit';
      }

      return _.extend(state, permissions, options);
    }

    /**
     * @ngdoc function
     * @name angularPoint.apModalService:deleteEntity
     * @methodOf angularPoint.apModalService
     * @description
     * Prompts for confirmation of deletion, then deletes and closes modal
     * @param {object} entity JavaScript object representing the SharePoint list item.
     * @param {object} state Controllers state object.
     * @param {object} $modalInstance Reference to the modal instance for the modal dialog.
     * @param {object} [options] Options to pass to ListItem.deleteItem().
     * @example
     *
     * <pre>
     *   $scope.deleteRequest = function () {
     *     apModalService.deleteEntity($scope.request, $scope.state,
     *        $modalInstance, {updateAllCaches: true});
     * };
     * </pre>
     */
    function deleteEntity(entity, state, $modalInstance, options) {
      var confirmation = window.confirm('Are you sure you want to delete this record?');
      if (confirmation) {
        /** Disable form buttons */
        state.negotiatingWithServer = true;
        entity.deleteItem(options).then(function () {
          toastr.success('Record deleted successfully');
          $modalInstance.close();
        }, function () {
          toastr.error('Failed to delete record.  Please try again.');
        });
      }
    }

    /**
     * @ngdoc function
     * @name angularPoint.apModalService:saveEntity
     * @methodOf angularPoint.apModalService
     * @description
     * Creates a new record if necessary, otherwise updates the existing record
     * @param {object} entity List item.
     * @param {object} model Reference to the model for the list item.
     * @param {object} state Deprecated....
     * @param {object} $modalInstance Reference to the modal instance for the modal dialog.
     * @param {object} [options] Options to pass to ListItem.saveChanges().
     * @example
     * <pre>
     *  $scope.saveRequest = function () {
     *      apModalService.saveEntity($scope.request, compRequestsModel,
     *          $scope.state, $modalInstance, {updateAllCaches: true});
     *  };
     *  </pre>
     */
    function saveEntity(entity, model, state, $modalInstance, options) {
      if (entity.id) {
        entity.saveChanges(options)
          .then(function () {
            toastr.success('Record updated');
            $modalInstance.close();
          }, function () {
            toastr.error('There was a problem updating this record.  Please try again.');
          });
      } else {
        /** Create new record */
        model.addNewItem(entity, options)
          .then(function () {
            toastr.success('New record created');
            $modalInstance.close();
          }, function () {
            toastr.error('There was a problem creating a new record.  Please try again.');
          });
      }
    }

    return {
      deleteEntity: deleteEntity,
      initializeState: initializeState,
      modalModelProvider: modalModelProvider,
      getPermissions: getPermissions,
      saveEntity: saveEntity
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

    var counter = 0;

    /**
     * @ngdoc function
     * @name angularPoint.apQueueService:increase
     * @methodOf angularPoint.apQueueService
     * @description
     * Increase the counter by 1.
     */
    var increase = function () {
      counter++;
      notifyObservers();
      return counter;
    };

    /**
     * @ngdoc function
     * @name angularPoint.apQueueService:decrease
     * @methodOf angularPoint.apQueueService
     * @description
     * Decrease the counter by 1.
     * @returns {number} Current count after decrementing.
     */
    var decrease = function () {
      if (counter > 0) {
        counter--;
        notifyObservers();
        return counter;
      }
    };

    /**
     * @ngdoc function
     * @name angularPoint.apQueueService:reset
     * @methodOf angularPoint.apQueueService
     * @description
     * Reset counter to 0.
     * @returns {number} Current count after incrementing.
     */
    var reset = function () {
      counter = 0;
      notifyObservers();
      return counter;
    };

    var observerCallbacks = [];

    /**
     * @ngdoc function
     * @name angularPoint.apQueueService:registerObserverCallback
     * @methodOf angularPoint.apQueueService
     * @description
     * Register an observer
     * @param {function} callback Function to call when a change is made.
     */
    var registerObserverCallback = function (callback) {
      observerCallbacks.push(callback);
    };

    /** call this when queue changes */
    var notifyObservers = function () {
      angular.forEach(observerCallbacks, function (callback) {
        callback(counter);
      });
    };

    return {
      count: counter,
      decrease: decrease,
      increase: increase,
      registerObserverCallback: registerObserverCallback,
      reset: reset
    };
  });;'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apUtilityService
 * @description
 * Provides shared utility functionality across the application.
 *
 * @requires angularPoint.apConfig
 */
angular.module('angularPoint')
  .service('apUtilityService', ["$q", "_", "apConfig", "$log", function ($q, _, apConfig, $log) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    /** Extend underscore with a simple helper function */
    _.mixin({
      isDefined: function (value) {
        return !_.isUndefined(value);
      },
      /** Based on functionality in Breeze.js */
      isGuid: function (value) {
        return (typeof value === "string") && /[a-fA-F\d]{8}-(?:[a-fA-F\d]{4}-){3}[a-fA-F\d]{12}/.test(value);
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
     * items and performing some process on them.  This function cuts the process into as many 50ms chunks as are
     * necessary. Based on example found in the following article:
     * [Timed array processing in JavaScript](http://www.nczonline.net/blog/2009/08/11/timed-array-processing-in-javascript/);
     * @param {Object[]} items The entities that need to be processed.
     * @param {Function} process Reference to the process to be executed for each of the entities.
     * @param {Object} context this
     * @param {Number} [delay=25] Number of milliseconds to delay between batches.
     * @param {Number} [maxItems=items.length] Maximum number of items to process before pausing.
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

    function batchProcess(items, process, context, delay, maxItems) {
      var n = items.length,
        delay = delay || 25,
        maxItems = maxItems || n,
        i = 0, deferred = $q.defer();


      function chunkTimer() {
        var start = +new Date(),
          j = i;

        while (i < n && (i - j) < maxItems && (new Date() - start < 100)) {
          process.call(context, items[i]);
          i += 1;
        }

        if (i < n) {
          $log.info("Batch Delayed");
          setTimeout(chunkTimer, delay);
        }
        else {
          deferred.resolve(items);
        }
      }

      chunkTimer();
      return deferred.promise;
    }

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
     * @name angularPoint.apUtilityService:registerChange
     * @methodOf angularPoint.apUtilityService
     * @description
     * If online and sync is being used, notify all online users that a change has been made.
     * //Todo Break this functionality into FireBase module that can be used if desired.
     * @param {object} model event
     */
    function registerChange(model) {
      if (!apConfig.offline && model.sync && _.isFunction(model.sync.registerChange)) {
        /** Register change after successful update */
        model.sync.registerChange();
      }
    }

    return {
      batchProcess: batchProcess,
      dateWithinRange: dateWithinRange,
      doubleDigit: doubleDigit,
      fromCamelCase: fromCamelCase,
      registerChange: registerChange,
      resolvePermissions: resolvePermissions,
      SplitIndex: SplitIndex,
      toCamelCase: toCamelCase,
      yyyymmdd: yyyymmdd
    };
  }]);;'use strict';

/**
 * @ngdoc function
 * @name angularPoint.apCamlFactory
 * @description
 * Tools to assist with the creation of CAML queries.
 *
 */
angular.module('angularPoint')
  .factory('apCamlFactory', ["_", function (_) {

    /**
     * @ngdoc function
     * @name angularPoint.apCamlFactory:createCamlContainsSelector
     * @methodOf angularPoint.apCamlFactory
     * @description
     * Escapes characters that SharePoint gets upset about based on field type.
     * @example
     * <pre>
     * var testHTML = {objectType: 'HTML', internalName: 'HTML'};
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
    var createCamlContainsSelector = function (fieldDefinition, searchString) {
      var camlSelector;
      switch (fieldDefinition.objectType) {
        case 'HTML':
        case 'JSON':
          camlSelector = '' +
            '<Contains>' +
            '<FieldRef Name="' + fieldDefinition.internalName + '" />' +
          /** Use CDATA wrapper to escape [&, <, > ] */
            '<Value Type="Text"><![CDATA[' + searchString + ']]></Value>' +
            '</Contains>';
          break;
        default:
          camlSelector = '' +
            '<Contains>' +
            '<FieldRef Name="' + fieldDefinition.internalName + '" />' +
            '<Value Type="Text">' + searchString + '</Value>' +
            '</Contains>';
      }
      return camlSelector;
    };

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
    var chainCamlSelects = function (selectStatements, joinType) {
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
    };

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
     * var testHTML = {objectType: 'HTML', internalName: 'HTML'};
     * var testJSON = {objectType: 'JSON', internalName: 'JSON'};
     * var testText = {objectType: 'Text', internalName: 'Text'};
     * var testText2 = {objectType: 'Text', internalName: 'Text'};
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
    var camlContainsQuery = function (fieldDefinitionsArray, searchString) {
      var selectStatements = [];

      /** Create a select statement for each field */
      _.each(fieldDefinitionsArray, function (fieldDefinition, definitionIndex) {
        selectStatements.push(createCamlContainsSelector(fieldDefinition, searchString));
      });

      return chainCamlSelects(selectStatements, 'And');
    };

//    var testHTML = {objectType: 'HTML', internalName: 'HTML'};
//    var testJSON = {objectType: 'JSON', internalName: 'JSON'};
//    var testText = {objectType: 'Text', internalName: 'Text'};
//    var testText2 = {objectType: 'Text', internalName: 'Text'};
//
//    var testCaml = camlContainsQuery([testHTML, testText, testJSON, testText2], 'Test Query');
//
//
//    console.log(testCaml);

    return {
      camlContainsQuery: camlContainsQuery,
      chainCamlSelects: chainCamlSelects,
      createCamlContainsSelector: createCamlContainsSelector
    }

  }]);;'use strict';

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
         *       internalName: "Title",
         *       objectType: "Text",
         *       mappedName: "lastName",
         *       readOnly:false
         *   },
     *   {
         *       internalName: "FirstName",
         *       objectType: "Text",
         *       mappedName: "firstName",
         *       readOnly:false
         *   },
     *   {
         *       internalName: "Organization",
         *       objectType: "Lookup",
         *       mappedName: "organization",
         *       readOnly:false
         *   },
     *   {
         *       internalName: "Account",
         *       objectType: "User",
         *       mappedName: "account",
         *       readOnly:false
         *   },
     *   {
         *       internalName: "Details",
         *       objectType: "Text",
         *       mappedName: "details",
         *       readOnly:false
         *   }
     * ]
     * </pre>
     * @constructor
     */
    function List(config) {
      var defaults = {
        viewFields: '',
        customFields: [],
        isReady: false,
        fields: [],
        guid: '',
        mapping: {},
        title: ''
      };

      /** Manually set site url if defined, prevents SPServices from making a blocking call to fetch it. */
      if (apConfig.defaultUrl) {
        defaults.webURL = apConfig.defaultUrl;
      }


      var list = _.extend({}, defaults, config);

      apFieldService.extendFieldDefinitions(list);

      return list;
    }

    /**
     * @ngdoc object
     * @name List.FieldDefinition
     * @property {string} internalName The actual SharePoint field name.
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
         *                  internalName: 'Title',
         *                  objectType: 'Text',
         *                  mappedName: 'title',
         *                  readOnly:false
         *                 },
         *                 {
         *                  internalName: 'Project',
         *                  objectType: 'Lookup',
         *                  mappedName: 'project',
         *                  readOnly:false
         *                 },
         *                 {
         *                  internalName: 'Priority',
         *                  objectType: 'Choice',
         *                  mappedName: 'priority',
         *                  readOnly:false
          *                },
         *                 {
         *                  internalName: 'Description',
         *                  objectType: 'Text',
         *                  mappedName: 'description',
         *                  readOnly:false
         *                 },
         *                 {
         *                  internalName: 'Manager',
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
  }]);;'use strict';

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

    /**
     * @ngdoc function
     * @name ListItem.getDataService
     * @description
     * Allows us to reference when out of scope
     * @returns {object} Reference to the dataService in the event that it's out of scope.
     */
    ListItem.prototype.getDataService = function () {
      return apDataService;
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
    ListItem.prototype.saveChanges = function (options) {
      var listItem = this;
      var model = listItem.getModel();
      var deferred = $q.defer();

      apDataService.addUpdateItemModel(model, listItem, options).then(function (response) {
        deferred.resolve(response);
        /** Optionally broadcast change event */
        apUtilityService.registerChange(model);
      });

      return deferred.promise;
    };

    /**
     * @ngdoc function
     * @name ListItem.saveFields
     * @description
     * Saves a named subset of fields back to SharePoint
     * Alternative to saving all fields
     * @param {array} fieldArray Array of internal field names that should be saved to SharePoint.
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
    ListItem.prototype.saveFields = function (fieldArray, options) {

      var listItem = this;
      var model = listItem.getModel();
      var deferred = $q.defer();
      var definitions = [];
      /** Find the field definition for each of the requested fields */
      _.each(fieldArray, function (field) {
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

      apDataService.addUpdateItemModel(model, listItem, opts)
        .then(function (response) {
          deferred.resolve(response);
          /** Optionally broadcast change event */
          apUtilityService.registerChange(model);
        });

      return deferred.promise;
    };

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
    ListItem.prototype.deleteItem = function (options) {
      var listItem = this;
      var model = listItem.getModel();
      var deferred = $q.defer();

      apDataService.deleteItemModel(model, listItem, options).then(function (response) {
        deferred.resolve(response);
        /** Optionally broadcast change event */
        apUtilityService.registerChange(model);
      });

      return deferred.promise;
    };


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
     * project.getLookupReference('location')
     *     .then(function(entity) {
         *        //Do something with the location entity
         *
         *     });
     * </pre>
     *
     * <pre>
     * var project = {
         *    title: 'Project 1',
         *    location: [
         *        { lookupId: 5, lookupValue: 'Some Building' },
         *        { lookupId: 6, lookupValue: 'Some Other Building' },
         *    ]
         * };
     *
     * //To get the location entity
     * project.getLookupReference('location', project.location[0].lookupId)
     *     .then(function(entity) {
         *        //Do something with the location entity
         *
         *     });
     * </pre>
     * @returns {promise} Resolves with the entity the lookup is referencing.
     */
    ListItem.prototype.getLookupReference = function (fieldName, lookupId) {
      var listItem = this;
      var deferred = $q.defer();
      var targetId = lookupId || listItem[fieldName].lookupId;


      if (fieldName) {
        var model = listItem.getModel();
        var fieldDefinition = model.getFieldDefinition(fieldName);
        /** Ensure the field definition has the List attribute which contains the GUID of the list
         *  that a lookup is referencing.
         */
        if (fieldDefinition && fieldDefinition.List) {
          apCacheService.getEntity(fieldDefinition.List, targetId).then(function (entity) {
            deferred.resolve(entity);
          });
        } else {
          deferred.fail('Need a List GUID before we can find this in cache.');
        }
      } else {
        deferred.fail('Need both fieldName && lookupId params');
      }
      return deferred.promise;
    };

    /**
     * @ngdoc function
     * @name ListItem.validateEntity
     * @description
     * Helper function that passes the current item to Model.validateEntity
     * @param {object} [options] Optionally pass params to the dataService.
     * @param {boolean} [options.toast=true] Set to false to prevent toastr messages from being displayed.
     * @returns {boolean} Evaluation of validity.
     */
    ListItem.prototype.validateEntity = function (options) {
      var listItem = this,
        model = listItem.getModel();
      return model.validateEntity(listItem, options);
    };

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
    ListItem.prototype.getFieldDefinition = function (fieldName) {
      return this.getModel().getFieldDefinition(fieldName);
    };


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
    ListItem.prototype.getAttachmentCollection = function () {
      return apDataService.getCollection({
        operation: 'GetAttachmentCollection',
        listName: this.getModel().list.guid,
        webURL: this.getModel().list.webURL,
        ID: this.id,
        filterNode: 'Attachment'
      });
    };

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
    ListItem.prototype.deleteAttachment = function (url) {
      var listItem = this;
      return apDataService.deleteAttachment({
        listItemId: listItem.id,
        url: url,
        listName: listItem.getModel().list.guid
      });
    };

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
    ListItem.prototype.resolvePermissions = function () {
      return apUtilityService.resolvePermissions(this.permMask);
    };


    ListItem.prototype.getEntityReferenceCache = function () {
      return apCacheService.listItem.get(this.uniqueId);
    };


    /**
     * @ngdoc function
     * @name ListItem.addEntityReference
     * @description
     * Allows us to pass in another entity to associate superficially, only persists for the current session and
     * no data is saved but it allows us to iterate over all of the references much faster than doing a lookup each
     * on each digest.  Creates a item._apCache property on the list item object.  It then creates an object for each
     * type of list item passed in using the list name in the list item model.
     * @param {object} entity List item to associate.
     * @returns {Object} The cache for the list of the item passed in.
     * @example
     * <pre>
     * // Function to save references between a fictitious project
     * // and corresponding associated tasks
     * function associateProjectTasks(project) {
         *    //Assuming project.tasks is a multi-lookup
         *    _.each(project.tasks, function(taskLookup) {
         *        var task = tasksModel.searchLocalCache(taskLookup.lookupId);
         *        if(task) {
         *            task.addEntityReference(project);
         *            project.addEntityReference(task);
         *        }
         *    });
         * }
     * </pre>
     *
     * <pre>
     * //Structure of cache
     * listItem._apCache = {
         *    Projects: {
         *        14: {id: 14, title: 'Some Project'},
         *        15: {id: 15, title: 'Another Project'}
         *    },
         *    Tasks: {
         *        300: {id: 300, title: 'Task 300'},
         *        412: {id: 412, title: 'Some Important Tasks'}
         *    }
         * }
     * </pre>
     */
    ListItem.prototype.addEntityReference = function (entity) {
      var self = this;
      /** Verify that a valid entity is being provided */
      if (entity && entity.constructor.name === 'ListItem') {
        var uniqueId = self.uniqueId;
        var constructorName = entity.getModel().list.title;
        return apCacheService.listItem.add(uniqueId, constructorName, entity);
      } else {
        $log.warn('Please verify that a valid entity is being used: ', self, entity);
      }
    };

    ListItem.prototype.getEntityReferences = function (constructorName) {
      var self = this;
      var cache = self.getEntityReferenceCache();
//          var cache = self._apCache.entityReference;
      if (constructorName && !cache[constructorName]) {
        return {};
      } else if (constructorName && cache[constructorName]) {
        return cache[constructorName];
      } else {
        return cache;
      }
    };

    ListItem.prototype.removeEntityReference = function (entity) {
      var uniqueId = this.uniqueId;
      var constructorName = entity.getModel().list.title;
      return apCacheService.listItem.remove(uniqueId, constructorName, entity);

      var pType = entity.getModel().list.title;
      var cache = self.getEntityReferenceCache();
      if (entity.id && cache[pType] && cache[pType][entity.id]) {
        delete cache[pType][entity.id];
      }
    };


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
    ListItem.prototype.getFieldVersionHistory = function (fieldNames) {
      var deferred = $q.defer();
      var promiseArray = [];
      var listItem = this;
      var model = listItem.getModel();

      /** Constructor that creates a promise for each field */
      var createPromise = function (fieldName) {

        var fieldDefinition = _.findWhere(model.list.fields, {mappedName: fieldName});

        var payload = {
          operation: 'GetVersionCollection',
          strlistID: model.list.guid,
          strlistItemID: listItem.id,
          strFieldName: fieldDefinition.internalName
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
            if (!versionHistory[fieldVersion.modified.toJSON()]) {
              versionHistory[fieldVersion.modified.toJSON()] = {};
            }
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
    };

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
  }]);;'use strict';

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
    .factory('apModelFactory', ["_", "apModalService", "apCacheService", "apDataService", "apListFactory", "apListItemFactory", "apQueryFactory", "apUtilityService", "apFieldService", "apConfig", "$q", "toastr", function (_, apModalService, apCacheService, apDataService, apListFactory,
                                         apListItemFactory, apQueryFactory, apUtilityService, apFieldService,
                                         apConfig, $q, toastr) {

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
         * @param {string} config.list.guid - Unique SharePoint ID (ex: '{3DBEB25A-BEF0-4213-A634-00DAF46E3897}')
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
         *                internalName: 'Title',
         *                objectType: 'Text',
         *                mappedName: 'title',
         *                readOnly: false
         *             },
         *             {
         *                internalName: 'Customer',
         *                objectType: 'Lookup',
         *                mappedName: 'customer',
         *                readOnly: false
         *             },
         *             {
         *                internalName: 'ProjectDescription',
         *                objectType: 'Text',
         *                mappedName: 'projectDescription',
         *                readOnly: false
         *             },
         *             {
         *                internalName: 'Status',
         *                objectType: 'Text',
         *                mappedName: 'status',
         *                readOnly: false
         *             },
         *             {
         *                internalName: 'TaskManager',
         *                objectType: 'User',
         *                mappedName: 'taskManager',
         *                readOnly: false
         *             },
         *             {
         *                internalName: 'ProjectGroup',
         *                objectType: 'Lookup',
         *                mappedName: 'group',
         *                readOnly: false
         *             },
         *             {
         *                internalName: 'CostEstimate',
         *                objectType: 'Currency',
         *                mappedName: 'costEstimate',
         *                readOnly: false
         *             },
         *             {
         *                internalName: 'Active',
         *                objectType: 'Boolean',
         *                mappedName: 'active',
         *                readOnly: false
         *             },
         *             {
         *                internalName: 'Attachments',
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
        Model.prototype.addNewItem = addNewItem;
        Model.prototype.createEmptyItem = createEmptyItem;
        Model.prototype.executeQuery = executeQuery;
        Model.prototype.generateMockData = generateMockData;
        Model.prototype.getAllListItems = getAllListItems;
        Model.prototype.getCache = getCache;
        Model.prototype.getFieldDefinition = getFieldDefinition;
        Model.prototype.getListItemById = getListItemById;
        Model.prototype.getLocalEntity = getLocalEntity;
        Model.prototype.getQuery = getQuery;
        Model.prototype.initializeModalState = initializeModalState;
        Model.prototype.isInitialised = isInitialised;
        Model.prototype.resolvePermissions = resolvePermissions;
        Model.prototype.registerQuery = registerQuery;
        Model.prototype.validateEntity = validateEntity;

        return {
            create: create,
            Model: Model
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
        function searchLocalCache (value, options) {
            var model = this;
            var response;
            var defaults = {
                propertyPath: 'id',
                localCache: model.getCache(),
                cacheName: 'main',
                rebuildIndex: false
            };
            /** Extend defaults with any provided options */
            var opts = _.extend({}, defaults, options);
            /** Create a cache if it doesn't already exist */
            model._cachedIndexes = model._cachedIndexes || {};
            model._cachedIndexes[opts.cacheName] = model._cachedIndexes[opts.cacheName] || {};
            var cache = model._cachedIndexes[opts.cacheName];
            var properties = opts.propertyPath.split('.');
            _.each(properties, function (attribute) {
                cache[attribute] = cache[attribute] || {};
                /** Update cache reference to another level down the cache object */
                cache = cache[attribute];
            });
            cache.map = cache.map || [];
            /** Remap if no existing map, the number of items in the array has changed, or the rebuild flag is set */
            if (!_.isNumber(cache.count) || cache.count !== opts.localCache.length || opts.rebuildIndex) {
                cache.map = _.deepPluck(opts.localCache, opts.propertyPath);
                /** Store the current length of the array for future comparisons */
                cache.count = opts.localCache.length;
            }
            /** Allow an array of values to be passed in */
            if (_.isArray(value)) {
                response = [];
                _.each(value, function (key) {
                    response.push(opts.localCache[cache.map.indexOf(key)]);
                });
            } else {
                response = opts.localCache[cache.map.indexOf(value)];
            }
            return response;
        }

        /**
         * @ngdoc function
         * @name Model.getLocalEntity
         * @module Model
         * @description
         * Similar to Model.searchLocalCache but you don't need to specify a query, only searches by list item
         * id, and returns a promise that is fulfilled once the requested list item is registered in the cache
         *
         * @param {number} entityId The ListItem.id of the object.
         * @returns {promise} Will resolve once the item is registered in the cache.
         * @example
         * <pre>
         * var task = {
         *    title: 'A Task',
         *    project: {
         *        lookupId: 4,
         *        lookupValue: 'Super Project'
         *    }
         * };
         *
         * // Now we'd like to get the project referenced in the task
         * projectModel.getLocalEntity(task.project.lookupId).then(function(entity) {
         *     var projectThatICareAbout = entity;
         *     //Do something with it
         * }
         * </pre>
         */
        function getLocalEntity(entityId) {
            var model = this;
            return apCacheService.getEntity(model.list.guid, entityId);
        }

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
         * @returns {object} Promise that resolves with the requested list item if found.  Otherwise it returns null.
         * When working offline it returns a mock entity and replaces the mock id with the id provided.
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
                deferred = $q.defer(),
                /** Only required option for apDataService is listName which is avalable on model */
                defaults = {listName: model.list.guid},
                opts = _.extend({}, defaults, options);

            /** Working Online */
            if (!apConfig.offline) {
                /** Fetch from the server */
                apDataService.getListItemById(entityId, opts)
                    .then(function (entitiesArray) {
                        /** Should be a single entity in the array if found */
                        if (entitiesArray.length === 1) {
                            deferred.resolve(entitiesArray[0]);
                        } else {
                            /** List item not found */
                            deferred.resolve(null);
                        }
                    });
            } else {
                /** Working offline so generate a mock record using provided id */
                var mock = model.generateMockData({quantity: 1});
                mock.id = entityId;
                deferred.resolve(mock);
            }
            return deferred.promise;
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
            var model = this;
            var deferred = $q.defer();
            apDataService.addUpdateItemModel(model, entity, options).then(function (response) {
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
            if (query && query.cache) {
                cache = query.cache;
            }
            return cache;
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
                if (fieldDefinition.required && valid) {
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
                        var fieldName = fieldDefinition.label || fieldDefinition.internalName;
                        toastr.error(fieldName + ' does not appear to be a valid ' + fieldDescriptor);
                    }
                }
                if (!valid) {
                    return false;
                }
            });
            return valid;
        }


        /**
         * @ngdoc function
         * @name Model.initializeModalState
         * @module Model
         * @description
         * Uses apModalService to return some general state information for a modal form using
         * the current user's permissions if an entity is passed in.  Otherwise we attempt to
         * return the user's permissions for the list.  We also include some additional flags
         * and with the use of the options param extend any other custom attributes on the returned
         * state object.
         *
         * @param {object} [entity] SharePoint list item.
         * @param {object} [options] Object containing optional attributes that will be used
         * to extend the returned state object.
         * @returns {object} State object with flags.
         *
         * @example
         * <pre>
         * <file name="app/modules/project/project_modal_ctrl.js">
         * //Controller
         * 'use strict';
         * angular.module('App')
         *  .controller('projectModalCtrl', function (
         *                                              $scope,
         *                                              $modalInstance,
         *                                              projectsModel,
         *                                              apModalService,
         *                                              project
         *                                            ) {
         *
         *      $scope.state = projectsModel.initializeModalState(project, {
         *           stateOption1: false,
         *           stateOption2: true
         *      });
         *
         *      $scope.cancel = function () {
         *           $modalInstance.dismiss('cancel');
         *      };
         *
         *      $scope.project = project;
         *
         *      $scope.saveRequest = function () {
         *           apModalService.saveEntity(
         *              $scope.request,
         *              projectsModel,
         *              $scope.state,
         *              $modalInstance );
         *      };
         * });
         * </file>

         * <file name="app/modules/project/project_modal_view.html">
         * //VIEW
         * <div ng-form>
         *     <div class="modal-header">
         *         <button type="button" class="close"
         *                ng-click="cancel()" aria-hidden="true">&times;</button>
         *         <h4>Project Details</h4>
         *     </div>
         *     <div class="modal-body">
         *         <div class="well">
         *             <div ng-form>
         *                 <div class="form-group">
         *                     <label>Title</label>
         *                     <input type="text"
         *                        class="form-control" ng-model="project.title"/>
         *                 </div>
         *                 <div class="form-group">
         *                     <label>Description</label>
         *                     <textarea rows="6" cols="50" class="form-control"
         *                               ng-model="project.description"></textarea>
         *                 </div>
         *             </div>
         *         </div>
         *     </div>
         *     <div class="modal-footer">
         *         <div class="pull-left">
         *             <button class="btn btn-danger"
         *                    ng-click="deleteRecord()"
         *                   ng-show="project.id && state.canDelete"
         *                   ng-disabled="state.negotiatingWithServer"
         *                   title="Delete this task request">
         *                 <i class="fa fa-trash-o"></i>
         *             </button>
         *         </div>
         *         <button class="btn btn-primary"
         *            ng-click="save()"
         *            ng-disabled="project.title.length === 0 ||
         *                state.negotiatingWithServer">OK</button>
         *         <button class="btn btn-default"
         *            ng-click="cancel()">Cancel</button>
         *     </div>
         * </div>
         * </file>
         * </pre>
         *
         * <pre>
         * //Returns
         * $scope.state = {
         *    // Default "View" and once permissions are checked it
         *    // can also be "New" || "Edit"
         *    displayMode: "New",
         *    // Below 2 options allow for locking with 3 way
         *    // binding service like FireBase
         *    locked: false,
         *    lockedBy: '',
         *    // Flag which can be used to disable form controls
         *    negotiatingWithServer: false,
         *    userCanApprove: false,
         *    userCanDelete: false,
         *    userCanEdit: false,
         *    //User has admin rights
         *    fullControl: false,
         *    //Custom attributes passed in the options param
         *    stateOption1: false,
         *    stateOption2: true
         * }
         * </pre>
         */
        function initializeModalState(entity, options) {
            return apModalService.initializeState(entity, options, this);
        }

        /**
         * @ngdoc function
         * @name Model.resolvePermissions
         * @module Model
         * @description
         * See apModelFactory.resolvePermissions for details on what we expect to have returned.
         * @returns {Object} Contains properties for each permission level evaluated for current user.
         * @example
         * Lets assume we're checking to see if a user has edit rights for a given list.
         * <pre>
         * var userPermissions = tasksModel.resolvePermissions();
         * var userCanEdit = userPermissions.EditListItems;
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

        function resolvePermissions() {
            var model = this;
            if (model.list && model.list.effectivePermMask) {
                return apUtilityService.resolvePermissions(model.list.effectivePermMask);
            } else {
                window.console.error('Attempted to resolve permissions of a model that hasn\'t been initialized.', model);
                return apUtilityService.resolvePermissions(null);
            }
        }

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
         *             {internalName: 'Title', objectType: 'Text', mappedName: 'title', readOnly: false},
         *             {internalName: 'Description', objectType: 'Text', mappedName: 'description', readOnly: false},
         *             {internalName: 'Priority', objectType: 'Text', mappedName: 'priority', readOnly: false},
         *             {internalName: 'Status', objectType: 'Text', mappedName: 'status', readOnly: false},
         *             {internalName: 'RequestedBy', objectType: 'User', mappedName: 'requestedBy', readOnly: false},
         *             {internalName: 'AssignedTo', objectType: 'User', mappedName: 'assignedTo', readOnly: false},
         *             {internalName: 'EstimatedEffort', objectType: 'Integer', mappedName: 'estimatedEffort', readOnly: false},
         *             {internalName: 'PercentComplete', objectType: 'Integer', mappedName: 'percentComplete', readOnly: false}
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
 * @requires angularPoint.apModalService
 * @requires angularPoint.apCacheService
 * @requires angularPoint.apDataService
 * @requires angularPoint.apConfig
 */
angular.module('angularPoint')
  .factory('apQueryFactory', ["_", "apModalService", "apCacheService", "apDataService", "apConfig", "$q", function (_, apModalService, apCacheService, apDataService, apConfig, $q) {


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
        cache: [],
        /** Promise resolved after first time query is executed */
        initialized: $q.defer(),
        /** Date/Time last run */
        lastRun: null,
        listName: model.list.guid,
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
    }

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
    Query.prototype.execute = function (options) {
      var query = this;
      var model = query.getModel();
      var deferred = $q.defer();

      /** Return existing promise if request is already underway */
      if (query.negotiatingWithServer) {
        return query.promise;
      } else {
        /** Set flag to prevent another call while this query is active */
        query.negotiatingWithServer = true;

        /** Set flag if this if the first time this query has been run */
        var firstRunQuery = _.isNull(query.lastRun);

        var defaults = {
          /** Designate the central cache for this query if not already set */
          target: query.cache
        };

        /** Extend defaults with any options */
        var queryOptions = _.extend({}, defaults, options);

        apDataService.executeQuery(model, query, queryOptions).then(function (results) {
          if (firstRunQuery) {
            /** Promise resolved the first time query is completed */
            query.initialized.resolve(queryOptions.target);

            /** Remove lock to allow for future requests */
            query.negotiatingWithServer = false;
          }

          /** Store query completion date/time on model to allow us to identify age of data */
          model.lastServerUpdate = new Date();

          deferred.resolve(queryOptions.target);
        });

        /** Save reference on the query **/
        query.promise = deferred.promise;
        return deferred.promise;
      }
    };

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
    Query.prototype.searchLocalCache = function (value, options) {
      var query = this;
      var model = query.getModel();
      var defaults = {
        cacheName: query.name,
        localCache: query.cache
      };
      var opts = _.extend({}, defaults, options);
      return model.searchLocalCache(value, opts);
    };

    /**
     * @ngdoc function
     * @name angularPoint.apQueryFactory:create
     * @methodOf angularPoint.apQueryFactory
     * @param {object} config Options object.
     * @param {object} model Reference to the model.
     * @description
     * Instantiates and returns a new Query.
     */
    var create = function (config, model) {
      return new Query(config, model);
    };


    return {
      create: create,
      Query: Query
    }

  }]);;'use strict';

/**Angular will instantiate this singleton by calling "new" on this function the first time it's referenced
 /* State will persist throughout life of session*/
angular.module('angularPoint')
  .service('apUserModel', ["$q", "_", "apDataService", "apConfig", function ($q, _, apDataService, apConfig) {

    var model = {};

    /**
     * Pull user profile info and parse into a profile object
     * http://spservices.codeplex.com/wikipage?title=GetUserProfileByName
     */
    model._getUserProfile = function () {
      var deferred = $q.defer();
      apDataService.serviceWrapper({
        operation: 'GetUserProfileByName'
      }).then(function (serverResponse) {
        var userProfile = {};
        //Not formatted like a normal SP response so need to manually parse
        $(serverResponse).SPFilterNode('PropertyData').each(function () {
          var nodeName = $(this).SPFilterNode('Name');
          var nodeValue = $(this).SPFilterNode('Value');
          if (nodeName.length > 0 && nodeValue.length > 0) {
            userProfile[nodeName.text().trim()] = nodeValue.text().trim();
          }
        });
        userProfile.userLoginName = apConfig.userLoginNamePrefix ? apConfig.userLoginNamePrefix + userProfile.AccountName : userProfile.AccountName;
        deferred.resolve(userProfile);
      });

      return deferred.promise;
    };

    //Make the call and create a reference for future use
    model.getUserProfile = model._getUserProfile();

    model._getGroupCollection = function () {
      var deferred = $q.defer();
      model.getUserProfile.then(function (userProfile) {
        apDataService.serviceWrapper({
          operation: 'GetGroupCollectionFromUser',
          userLoginName: userProfile.userLoginName,
          filterNode: 'Group'
        }).then(function (groupCollection) {
          deferred.resolve(groupCollection);
        });
      });
      return deferred.promise;
    };

    model.getGroupCollection = model._getGroupCollection();

    model.checkIfMember = function (groupName) {
      //Allow function to be called before group collection is ready
      var deferred = $q.defer();
      var self = this;

      //Initially ensure groups are ready, any future calls will receive the returne
      model.getGroupCollection.then(function (groupCollection) {
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
    };

    return model;
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
          listItemModel.list.guid + '&ItemId=' + scope.listItem.id + '&IsDlg=1';

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
  }]);;'use strict';

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
          return { lookupId: intID, lookupValue: match[scope.state.lookupField] };
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
  }]);;angular.module('angularPoint').run(['$templateCache', function($templateCache) {
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


  $templateCache.put('src/views/group_manager_view.html',
    "<style>select.multiselect {\n" +
    "        min-height: 400px;\n" +
    "    }\n" +
    "\n" +
    "    .ui-match {\n" +
    "        background: yellow;\n" +
    "    }</style><div class=container><ul class=\"nav nav-tabs\"><li ng-class=\"{active: state.activeTab === 'Users'}\"><a href ng-click=\"updateTab('Users')\">Users</a></li><li ng-class=\"{active: state.activeTab === 'Groups'}\"><a href ng-click=\"updateTab('Groups')\">Groups</a></li><li ng-class=\"{active: state.activeTab === 'Merge'}\"><a href ng-click=\"state.activeTab = 'Merge'\">Merge</a></li><li ng-class=\"{active: state.activeTab === 'UserList'}\"><a href ng-click=\"state.activeTab = 'UserList'\">User List</a></li><li ng-class=\"{active: state.activeTab === 'GroupList'}\"><a href ng-click=\"state.activeTab = 'GroupList'\">Group List</a></li></ul><div ng-if=\"state.activeTab === 'Users'\"><div class=\"panel panel-default\"><div class=panel-heading><div class=row><div class=col-xs-5><span style=font-weight:bold>Select a Group:</span><select class=form-control ng-model=users.filter ng-options=\"group.Name for group in groups.all\" ng-change=updateAvailableUsers(users.filter) style=\"min-width: 100px\"></select></div><div class=col-xs-7><span style=font-weight:bold>Site/Site Collection:</span> <input class=form-control ng-model=state.siteUrl ng-change=updateAvailableUsers(users.filter)></div></div><div class=row ng-if=users.filter.Description><div class=col-xs-12><p class=help-block>Description: {{ users.filter.Description }}</p></div></div></div><div class=panel-body><div class=row><div class=col-xs-12><div colspan=3 class=description>This tab will allow you to quickly assign multiple users to a selected group.</div></div></div><hr class=hr-sm><div class=row><div class=col-xs-5><div class=form-group><label>Available Users ({{users.available.length}})</label><select ng-model=users.selectedAvailable ng-options=\"user.Name for user in users.available\" multiple class=\"multiselect form-control\"></select></div></div><div class=\"col-xs-2 text-center\" style=\"padding-top: 175px\"><button class=\"btn btn-default\" style=width:80px ng-click=\"updatePermissions('AddUserToGroup', users.selectedAvailable, [users.filter])\" title=\"Add user\"><i class=\"fa fa-2x fa-angle-double-right\"></i></button><br><br><button class=\"btn btn-default\" style=width:80px ng-click=\"updatePermissions('RemoveUserFromGroup', users.selectedAssigned, [users.filter])\"><i class=\"fa fa-2x fa-angle-double-left\"></i></button></div><div class=col-xs-5><div class=form-group><label>Assigned Users ({{users.assigned.length}})</label><select ng-model=users.selectedAssigned ng-options=\"user.Name for user in users.assigned\" multiple class=\"multiselect form-control\"></select></div></div></div></div></div></div><div ng-if=\"state.activeTab === 'Groups'\"><div class=\"panel panel-default\"><div class=panel-heading><div class=row><div class=col-xs-5><span style=font-weight:bold>Select a User:</span><select class=form-control ng-model=groups.filter ng-options=\"user.Name for user in users.all\" ng-change=updateAvailableGroups(groups.filter) style=\"min-width: 100px\"></select></div><div class=col-xs-7><span style=font-weight:bold>Site/Site Collection:</span> <input class=form-control ng-model=state.siteUrl ng-change=updateAvailableGroups(groups.filter)></div></div></div><div class=panel-body><div class=row><div class=col-xs-12><div colspan=3 class=description>This page was created to make the process of managing users/groups within the site collection more manageable. When a user is selected, the available groups are displayed on the left and the groups that the user is currently a member of will show on the right. Selecting multiple groups is supported.</div></div></div><hr class=hr-sm><div class=row><div class=col-xs-5><div class=form-group><label>Available Groups ({{groups.available.length}})</label><select ng-model=groups.selectedAvailable ng-options=\"group.Name for group in groups.available\" multiple class=\"multiselect form-control\"></select></div></div><div class=\"col-xs-2 text-center\" style=\"padding-top: 175px\"><button class=\"btn btn-default\" style=width:80px ng-click=\"updatePermissions('AddUserToGroup', [groups.filter], groups.selectedAvailable)\" title=\"Add to group\"><i class=\"fa fa-2x fa-angle-double-right\"></i></button><br><br><button class=\"btn btn-default\" style=width:80px ng-click=\"updatePermissions('RemoveUserFromGroup', [groups.filter], groups.selectedAssigned)\"><i class=\"fa fa-2x fa-angle-double-left\"></i></button></div><div class=col-xs-5><div class=form-group><label>Assigned Users ({{users.assigned.length}})</label><select ng-model=groups.selectedAssigned ng-options=\"group.Name for group in groups.assigned\" multiple class=\"multiselect form-control\"></select></div></div></div></div></div></div><div ng-if=\"state.activeTab === 'Merge'\"><div class=\"panel panel-default\"><div class=panel-body><div class=row><div class=col-xs-12><div class=description>This tab allows us to copy the members from the \"Source\" group over to the \"Target\" group. It's not a problem if any of the users already exist in the destination group. Note: This is a onetime operation so any additional members added to the Source group will not automatically be added to the destination group. You will need to repeat this process.</div></div></div><hr class=hr-sm><div class=row><div class=col-xs-5><fieldset><legend>Step 1</legend><div class=well><div class=form-group><label>Source Group</label><select class=form-control ng-model=state.sourceGroup ng-options=\"group.Name for group in groups.all\" ng-change=updateAvailableUsers(state.sourceGroup) style=\"min-width: 100px\"></select></div></div></fieldset></div><div class=col-xs-5><fieldset><legend>Step 2</legend><div class=well><div class=form-group><label>Source Group</label><select class=form-control ng-model=state.targetGroup ng-options=\"group.Name for group in groups.all\" style=\"min-width: 100px\"></select></div></div></fieldset></div><div class=col-xs-2><fieldset><legend>Step 3</legend><button class=\"btn btn-success\" ng-disabled=\"state.sourceGroup.length < 1 || state.targetGroup.length < 1\" ng-click=mergeGroups() title=\"Copy all members from the source group over to the destination group.\"><i class=\"fa fa-2x fa-magic\"></i> Merge</button></fieldset></div></div></div></div></div><div ng-if=\"state.activeTab === 'UserList'\"><div class=\"panel panel-default\"><div class=panel-heading><span style=font-weight:bold>User Filter</span> <input class=form-control ng-model=state.userFilter ng-change=usersTable.reload()></div><table ng-table=usersTable class=table template-pagination=custom/pager><tr ng-repeat=\"user in $data\"><td data-title=\"'ID'\">{{ user.ID }}</td><td data-title=\"'Name'\"><a href ng-click=userDetailsLink(user) ng-bind-html=\"user.Name |  highlight:state.userFilter\"></a></td><td data-title=\"'Email'\">{{ user.Email }}</td></tr></table></div></div><div ng-if=\"state.activeTab === 'GroupList'\"><div class=\"panel panel-default\"><div class=panel-heading><span style=font-weight:bold>Group Filter</span> <input class=form-control ng-model=state.groupFilter ng-change=groupsTable.reload()></div><table ng-table=groupsTable class=table template-pagination=custom/pager><tr ng-repeat=\"group in $data\"><td data-title=\"'ID'\">{{ group.ID }}</td><td data-title=\"'Name'\"><a href ng-click=groupDetailsLink(group) ng-bind-html=\"group.Name |  highlight:state.groupFilter\"></a></td><td data-title=\"'Description'\">{{ group.Description }}</td></tr></table></div></div></div><script type=text/ng-template id=custom/pager><div class=\"row\">\n" +
    "        <div class=\"col-xs-12\">\n" +
    "            <ul class=\"pager ng-cloak\">\n" +
    "                <li ng-repeat=\"page in pages\"\n" +
    "                    ng-class=\"{'disabled': !page.active}\"\n" +
    "                    ng-show=\"page.type == 'prev' || page.type == 'next'\" ng-switch=\"page.type\">\n" +
    "                    <a ng-switch-when=\"prev\" ng-click=\"params.page(page.number)\" href=\"\">\n" +
    "                        <i class=\"fa fa-chevron-left\"></i>\n" +
    "                    </a>\n" +
    "                    <a ng-switch-when=\"next\" ng-click=\"params.page(page.number)\" href=\"\">\n" +
    "                        <i class=\"fa fa-chevron-right\"></i>\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div></script>"
  );

}]);
