'use strict';

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
    .factory('apListItemFactory', function ($q, _, apCacheService, apDataService, apEncodeService, apUtilityService,
                                            apConfig) {

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

        ///**
        // * @ngdoc function
        // * @name ListItem.getDataService
        // * @description
        // * Allows us to reference when out of scope
        // * @returns {object} Reference to the dataService in the event that it's out of scope.
        // */
        //ListItem.prototype.getDataService = function () {
        //  return apDataService;
        //};

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

            apDataService.addUpdateItemModel(model, listItem, options).then(function (response) {
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
        function saveFields(fieldArray, options) {

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

            apDataService.deleteItemModel(model, listItem, options).then(function (response) {
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
            if(_.isUndefined(fieldName)) {
                throw new Error('A field name is required.', fieldName);
            } else if(_.isEmpty(listItem[fieldName])) {
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
                listItemId: listItem.id,
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
    });