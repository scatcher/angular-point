'use strict';

/**
 * @ngdoc service
 * @name apDataService
 * @description
 * Handles all interaction with SharePoint web services
 *
 * For additional information on many of these web service calls, see Marc Anderson's SPServices documentation
 *  http://spservices.codeplex.com/documentation
 *
 *  @requires angularPoint.apQueueService
 *  @requires angularPoint.apConfig
 *  @requires angularPoint.apUtilityService
 *  @requires angularPoint.apFieldService
 */
angular.module('angularPoint')
    .service('apDataService', function ($q, $timeout, apQueueService, apConfig, apUtilityService, apDecodeService, apEncodeService, apFieldService, toastr) {
        var dataService = {};

        /** Flag to use cached XML files from the src/dev folder */
        var offline = apConfig.offline;
        /** Allows us to make code easier to read */
        var online = !offline;


        /**
         * @ngdoc function
         * @name apDataService.getFieldVersionHistory
         * @description
         * Returns the version history for a field in a list item.
         * @param {object} payload Configuration object passed to SPServices.
         <pre>
         var payload = {
                operation: 'GetVersionCollection',
                webURL: apConfig.defaultUrl,
                strlistID: model.list.guid,
                strlistItemID: listItem.id,
                strFieldName: fieldDefinition.internalName
            };
         </pre>
         * @param {object} fieldDefinition Field definition object from the model.
         * @returns {object[]} Promise which resolves with an array of list item changes for the specified field.
         */
        var getFieldVersionHistory = function (payload, fieldDefinition) {
            var deferred = $q.defer();
            if (online) {
                /** SPServices returns a promise */
                var webServiceCall = $().SPServices(payload);

                webServiceCall.then(function () {
                    /** Parse XML response */
                    var versions = apDecodeService.parseFieldVersions(webServiceCall.responseText, fieldDefinition);
                    /** Resolve with an array of all field versions */
                    deferred.resolve(versions);
                }, function (outcome) {
                    /** Failure */
                    toastr.error('Failed to fetch version history.');
                    deferred.reject(outcome);
                });
            } else {
                /** Simulate async response if offline */
                $timeout(function () {
                    /** Resolve with an empty array */
                    deferred.resolve([]);
                });
            }
            return deferred.promise;
        };

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
         <pre>
         apDataService.getCollection({
                operation: "GetGroupCollectionFromUser",
                userLoginName: $scope.state.selectedUser.LoginName
                }).then(function (response) {
                    postProcessFunction(response);
               });
         </pre>
         */
        var getCollection = function (options) {
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
                var offlineData = 'dev/' + opts.operation + '.xml';

                /** Get offline data */
                $.ajax(offlineData).then(
                    function (offlineData) {
                        apQueueService.decrease();
                        /** Pass back the group array */
                        deferred.resolve(processXML(offlineData));
                    }, function (outcome) {
                        toastr.error('You need to have a dev/' + opts.operation + '.xml in order to get the group collection in offline mode.');
                        deferred.reject(outcome);
                        apQueueService.decrease();
                    });
            } else {
                var validPayload = true;
                var payload = {};

                _.extend(payload, opts);


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

        };

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
        var serviceWrapper = function (options) {
            var defaults = {};
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
                    deferred.resolve(processXML(webServiceCall.responseXML));
                }, function (outcome) {
                    /** Failure */
                    toastr.error('Failed to fetch list collection.');
                    apQueueService.decrease();
                    deferred.reject(outcome);
                });
            } else {
                /** Debugging offline */
                var offlineData = 'dev/' + opts.operation + '.xml';

                /** Get offline data */
                $.ajax(offlineData).then(
                    function (offlineData) {
                        apQueueService.decrease();
                        /** Pass back the group array */
                        deferred.resolve(processXML(offlineData));
                    }, function (outcome) {
                        toastr.error('You need to have a dev/' + opts.operation + '.xml in order to get the group collection in offline mode.');
                        deferred.reject(outcome);
                        apQueueService.decrease();
                    });
            }

            return deferred.promise;
        };

        /**
         * @ngdoc function
         * @name apDataService.getList
         * @description
         * Returns all list settings for each list on the site
         * @param {object} options Configuration parameters.
         * @param {string} options.listName GUID of the list.
         * @param {string} [options.webURL] Can override the default web url if desired.
         * @returns {object[]} Promise which resolves with an array of field definitions for the list.
         */
        var getList = function (options) {
            var opts = _.extend({}, options);
            apQueueService.increase();
            var deferred = $q.defer();

            //TODO: Use serviceWrapper
            var webServiceCall = $().SPServices({
                operation: 'GetList',
                listName: opts.listName
            });

            webServiceCall.then(function () {
                /** Success */
                apQueueService.decrease();

                /** Map returned XML to JSON */
                var json = $(webServiceCall.responseXML).SPFilterNode('Field').SPXmlToJson({
                    includeAllAttrs: true,
                    removeOws: false
                });
                /** Pass back the lists array */
                deferred.resolve(json);
            }, function (outcome) {
                /** Failure */
                deferred.reject(outcome);
                toastr.error('Failed to fetch list details.');
            }).always(function () {
                apQueueService.decrease();
            });

            return deferred.promise;
        };

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
        var deleteAttachment = function (options) {
            var defaults = {
                operation: 'DeleteAttachment'
            };
            var opts = _.extend({}, defaults, options);
            apQueueService.increase();
            var deferred = $q.defer();

            //TODO: Use serviceWrapper
            var webServiceCall = $().SPServices({
                operation: 'DeleteAttachment',
                listItemID: opts.listItemId,
                url: opts.url,
                listName: opts.listName
            });

            webServiceCall.then(function () {
                /** Success */
                apQueueService.decrease();

                /** Map returned XML to JSON */
                var json = $(webServiceCall.responseXML).SPFilterNode('Field').SPXmlToJson({
                    includeAllAttrs: true,
                    removeOws: false
                });
                /** Pass back the lists array */
                deferred.resolve(json);
            }, function (outcome) {
                /** Failure */
                deferred.reject(outcome);
                toastr.error('Failed to fetch list details.');
            }).always(function () {
                apQueueService.decrease();
            });

            return deferred.promise;
        };

        /**
         * @ngdoc function
         * @name apDataService.getView
         * @description
         * Returns details of a SharePoint list view
         * @param {object} options Configuration parameters.
         * @param {string} options.listName GUID of the list.
         * @param {string} [options.viewName] Formatted as a GUID, if not provided
         * <pre>'{37388A98-534C-4A28-BFFA-22429276897B}'</pre>
         * @param {string} [options.webURL] Can override the default web url if desired.
         * @returns {object} promise
         */
        var getView = function (options) {
            var opts = _.extend({}, options);
            var deferred = $q.defer();

            apQueueService.increase();

            var payload = {
                operation: 'GetView',
                listName: opts.listName
            };

            /** Set view name if provided in options, otherwise it returns default view */
            if (opts.viewName) {
                payload.viewName = opts.viewName;
            }

            //TODO: Use serviceWrapper
            var webServiceCall = $().SPServices(payload);

            webServiceCall.then(function () {
                /** Success */
                var output = {
                    query: '<Query>' + $(webServiceCall.responseText).find('Query').html() + '</Query>',
                    viewFields: '<ViewFields>' + $(webServiceCall.responseText).find('ViewFields').html() + '</ViewFields>',
                    rowLimit: $(webServiceCall.responseText).find('RowLimit').html()
                };

                /** Pass back the lists array */
                deferred.resolve(output);
            }, function (outcome) {
                /** Failure */
                toastr.error('Failed to fetch view details.');
                deferred.reject(outcome);
            }).always(function () {
                apQueueService.decrease();
            });

            return deferred.promise;
        };


        /**
         * @ngdoc function
         * @name apDataService.executeQuery
         * @description
         * Primary method of retrieving list items from SharePoint.  Look at Query and Model for specifics.
         * @param {object} model Reference to the model where the Query resides.
         * @param {object} query Reference to the Query making the call.
         * @param {object} [options] Optional configuration parameters.
         * @param {Array} [options.target=model.getCache()] The target destination for returned entities
         * @param {string} [options.offlineXML='dev/' + model.list.title + '.xml'] Optionally include the location of
         * a custom offline XML file specifically for this query.
         * @returns {object[]} - Array of list item objects.
         */
        var executeQuery = function (model, query, options) {

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
                    if (query.operation === 'GetListItemChangesSinceToken') {

                        /** The initial call to GetListItemChangesSinceToken also includes the field definitions for the
                         *  list so use this to extend the existing field definitions defined in the model.
                         */
                        if (!model.list.extendedFieldDefinitions) {
                            model.list.extendedFieldDefinitions = apDecodeService.parseFieldDefinitionXML(model.list.customFields, responseXML);
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
                    /** Convert the XML into JS */
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
                var offlineData = opts.offlineXML || query.offlineXML || 'dev/' + model.list.title + '.xml';

                /** Only pull down offline xml if this is the first time the query is run */
                if (query.lastRun) {
                    /** Query has already been run, resolve reference to existing data */
                    query.lastRun = new Date();
                    apQueueService.decrease();
                    deferred.resolve(query.cache);
                } else {
                    /** First run for query
                     *  Get offline data stored in the src/dev folder
                     */
                    $.ajax(offlineData).then(function (responseXML) {
                        apDecodeService.processListItems(model, responseXML, opts)
                            .then(function (entities) {
                                /** Set date time to allow for time based updates */
                                query.lastRun = new Date();
                                apQueueService.decrease();

                                /** Extend the field definition in the model with the offline data */
                                if (query.operation === 'GetListItemChangesSinceToken') {
                                    model.list.extendedFieldDefinitions = apDecodeService.parseFieldDefinitionXML(model.list.customFields, responseXML);
                                }

                                deferred.resolve(entities);
                            });
                    }, function () {
                        var mockData = model.generateMockData();
                        deferred.resolve(mockData);
                        toastr.error('There was a problem locating the "dev/' + model.list.title + '.xml"');
                    });
                }

            }

            return deferred.promise;
        };

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
            var index = _.indexOf(entityArray, item);

            if (index) {
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
        var addUpdateItemModel = function (model, entity, options) {
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
                    var newItem;
                    /** Include standard mock fields for new item */
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
                    /** Update existing record in local cache*/
                    _.extend(entity, offlineDefaults);
                    deferred.resolve(entity);
                }
                apQueueService.decrease();
            }
            return deferred.promise;
        };

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
        var deleteItemModel = function (model, entity, options) {
            apQueueService.increase();

            var defaults = {
                target: entity.getContainer(),
                updateAllCaches: false
            };
            var opts = _.extend({}, defaults, options);

            var payload = {
                operation: 'UpdateListItems',
                webURL: model.list.webURL,
                listName: model.list.guid,
                batchCmd: 'Delete',
                ID: entity.id
            };

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
                var webServiceCall = $().SPServices(payload);

                webServiceCall.then(function () {
                    /** Success */
                    cleanCache();
                    apQueueService.decrease();
                    deferred.resolve(opts.target);
                }, function (outcome) {
                    //In the event of an error, display toast
                    toastr.error('There was an error deleting a list item from ' + model.list.title);
                    apQueueService.decrease();
                    deferred.reject(outcome);
                });
            } else {
                /** Offline debug mode */
                /** Simulate deletion and remove locally */
                cleanCache();
                apQueueService.decrease();
                deferred.resolve(opts.target);
            }

            return deferred.promise;
        };

        /** Exposed functionality */
        _.extend(dataService, {
            addUpdateItemModel: addUpdateItemModel,
            deleteAttachment: deleteAttachment,
            deleteItemModel: deleteItemModel,
            getCollection: getCollection,
            getFieldVersionHistory: getFieldVersionHistory,
            getList: getList,
            getView: getView,
            executeQuery: executeQuery,
            serviceWrapper: serviceWrapper
        });

        return dataService;

    }
);