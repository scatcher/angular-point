'use strict';

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
    .service('apDataService', function ($q, $timeout, $http, _, apQueueService, apConfig, apUtilityService,
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

    }
);
