'use strict';

/**
 * @ngdoc object
 * @name ListItem
 * @description
 */
angular.module('angularPoint')
    .factory('apListItemFactory', function (apCacheService, apDataService, apUtilityService) {

        /**
         * @ngdoc function
         * @name ListItem
         * @module ListItem
         * @description
         * Base prototype which all list items inherit CRUD functionality that can be called directly from obj.
         * @constructor
         */
        function ListItem() {
        }

        /**
         * @ngdoc function
         * @name ListItem.getDataService
         * @module ListItem
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
         * @module ListItem
         * @description
         * Updates record directly from the object
         * @param {object} [options] Optionally pass params to the data service.
         * @param {boolean} [options.updateAllCaches=false] Search through the cache for each query to ensure entity is
         * updated everywhere.  This is more process intensive so by default we only update the cached entity in the
         * cache where this entity is currently stored.
         * @returns {object} Promise which resolved with the updated list item from the server.
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
         * @module ListItem
         * @description
         * Saves a named subset of fields back to SharePoint
         * Alternative to saving all fields
         * @param {array} fieldArray Array of internal field names that should be saved to SharePoint.
         * <pre>
         * //Create an array to store all promises.
         * var queue = [],
         * progressCounter = 0;
         *
         * //We're only updating a single field on each entity so it's much
         * // faster to use ListItem.saveFields() so we don't need to push the
         * // entire object back to the server.
         * _.each(selectedItems, function (entity) {
         *    entity.title = title + ': Now Updated!';
         *    var request = entity.saveFields('title').then(function() {
         *        progressCounter++;
         *    }
         *    queue.push(request);
         *  });
         *
         * $q.all(queue).then(function() {
         *     // All items have now been processed so we can do something...but
         *     // the view is automatically updated so we don't need to bother
         *     // if there's no other required business logic.
         * });
         * </pre>
         * @param {object} [options] Optionally pass params to the data service.
         * @param {boolean} [options.updateAllCaches=false] Search through the cache for each query to ensure entity is
         * updated everywhere.  This is more process intensive so by default we only update the cached entity in the
         * cache where this entity is currently stored.
         * @returns {object} Promise which resolves with the updated list item from the server.
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
            var valuePairs = apDataService.generateValuePairs(definitions, listItem);

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
         * @module ListItem
         * @description
         * Deletes record directly from the object and removes record from user cache.
         * @param {object} [options] Optionally pass params to the dataService.
         * @param {boolean} [options.updateAllCaches=false] Iterate over each of the query cache's and ensure the entity is
         * removed everywhere.  This is more process intensive so by default we only remove the cached entity in the
         * cache where this entity is currently stored.
         * @returns {object} Promise which really only lets us know the request is complete.
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
         * @module ListItem
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
         * @module ListItem
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
         * @module ListItem
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
         * @module ListItem
         * @description
         * Requests all attachments for a given list item.
         * @returns {object} Promise which resolves with all attachments for a list item.
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
         * @module ListItem
         * @description
         * Delete an attachment from a list item.
         * @param {string} url Requires the URL for the attachment we want to delete.
         * @returns {object} Promise which resolves with the updated attachment collection.
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
         * @module ListItem
         * @description
         * See apModelService.resolvePermissions for details on what we expect to have returned.
         * @returns {Object} Contains properties for each permission level evaluated for current user.
         * @example
         * <pre>
         * var permissionObject = myGenericListItem.resolvePermissions();
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
         * @module ListItem
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
         * @module ListItem
         * @description
         * Takes an array of field names, finds the version history for field, and returns a snapshot of the object at each
         * version.  If no fields are provided, we look at the field definitions in the model and pull all non-readonly
         * fields.  The only way to do this that I've been able to get working is to get the version history for each
         * field independently and then build the history by combining the server responses for each requests into a
         * snapshot of the object.
         * @param {string[]} [fieldNames] An array of field names that we're interested in.
         * <pre>
         * myGenericListItem.getFieldVersionHistory(['title', 'project'])
         * .then(function(versionHistory) {
         *        //We now have an array of versions of the list item
         *    };
         * </pre>
         * @returns {object} promise - containing array of changes
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

        return {
            ListItem: ListItem
        }
    });