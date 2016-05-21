"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var factories_1 = require('../factories');
var constants_1 = require('../constants');
var core_1 = require('@angular/core');
var injector_service_1 = require('../services/injector.service');
var dataservice_service_1 = require('../services/dataservice.service');
var decode_service_1 = require('../services/decode.service');
var lodash_1 = require('lodash');
/**
 * @ngdoc function
 * @name Query
 * @description
 * Primary constructor that all queries inherit from. This object is a passthrough to [SPServices](http: //spservices.codeplex.com/).  All
 * options to passed through to [dataService.executeQuery](#/api/dataService.executeQuery).
 * @param {object} queryOptions Initialization parameters.
 * @param {boolean} [queryOptions.force=false] Ignore cached data and force server query.
 * @param {number} [queryOptions.listItemID] Optionally request for a single list item by id.
 * @param {boolean} [queryOptions.localStorage=false] Should we store data from this query in local storage to speed up requests in the future.
 * @param {number} [queryOptions.localStorageExpiration=86400000] Set expiration in milliseconds - Defaults to a day
 * and if set to 0 doesn't expire.  Can be updated globally using APConfig.localStorageExpiration.
 * @param {string} [queryOptions.name=primary] The name that we use to identify this query.
 * @param {string} [queryOptions.operation=GetListItemChangesSinceToken] Optionally use 'GetListItems' to
 * receive a more efficient response, just don't have the ability to check for changes since the last time
 * the query was called. Defaults to [GetListItemChangesSinceToken](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken%28v=office.12%29.aspx)
 * but for a smaller payload and faster response you can use [GetListItems](http: //spservices.codeplex.com/wikipage?title=GetListItems&referringTitle=Lists).
 * @param {string} [queryOptions.query=Ordered ascending by ID] CAML query passed to SharePoint to control
 * the data SharePoint returns. Josh McCarty has a good quick reference [here](http: //joshmccarty.com/2012/06/a-caml-query-quick-reference).
 * @param {string} [queryOptions.queryOptions] SharePoint options xml as string.
 * <pre>
 * <QueryOptions>
 *    <IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns>
 *    <IncludeAttachmentUrls>TRUE</IncludeAttachmentUrls>
 *    <IncludeAttachmentVersion>FALSE</IncludeAttachmentVersion>
 *    <ExpandUserField>FALSE</ExpandUserField>
 * </QueryOptions>
 * </pre>
 * @param {string} [queryOptions.rowLimit] The number of list items to return, 0 returns all list items.
 * @param {boolean} [queryOptions.runOnce] Pertains to GetListItems only, optionally run a single time and return initial value for all future
 * calls.  Works well with data that isn't expected to change throughout the session but unlike localStorage or sessionStorage
 * the data doesn't persist between sessions.
 * @param {boolean} [queryOptions.sessionStorage=false] Use the browsers sessionStorage to cache the list items and uses the
 * queryOptions.localStorageExpiration param to validate how long the cache is good for.
 * @param {string} [queryOptions.viewFields] XML as string that specifies fields to return.
 * @param {string} [queryOptions.webURL] Used to override the default URL if list is located somewhere else.
 * @param {object} model Reference to the parent model for the query.  Allows us to reference when out of
 * scope.
 * @example
 * <pre>
 * // Query to retrieve the most recent 25 modifications
 * model.registerQuery({
 *    name: 'recentChanges',
 *    rowLimit: 25,
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
var Query = (function () {
    function Query(queryOptions, listService, viewFields) {
        this.force = false;
        // Flag to prevent us from making concurrent requests
        this.negotiatingWithServer = false;
        // Default query returns list items in ascending ID order
        this.query = "\n        <Query>\n           <OrderBy>\n               <FieldRef Name=\"ID\" Ascending=\"TRUE\"/>\n           </OrderBy>\n        </Query>";
        this.queryOptions = constants_1.DefaultListItemQueryOptions;
        this.runOnce = false;
        this.webURL = constants_1.AP_CONFIG.defaultUrl;
        this.viewFields = viewFields;
        this.listName = listService.getListId();
        //Allow all values on query to be overwritten by queryOptions object
        Object.assign(this, queryOptions);
        // Allow the listService to be referenced at a later time
        this.getListService = function () { return listService; };
    }
    Object.defineProperty(Query.prototype, "hasExecuted", {
        // Has this query been executed at least once.
        get: function () {
            return lodash_1.isDate(this.lastRun);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @ngdoc function
     * @name Query.execute
     * @methodOf Query
     * @description
     * Query SharePoint, pull down all initial records on first call along with list definition if using
     * "GetListItemChangesSinceToken".  Note: this is  substantially larger than "GetListItems" on first call.
     * Subsequent calls pulls down changes (Assuming operation: "GetListItemChangesSinceToken").
     * @returns {Observable<T[]>} Observable that resolves with the cache for this query.
     */
    Query.prototype.execute = function () {
        var _this = this;
        /* Return existing observable if request is already underway or has been previously executed in the past
         * 1/10th of a second */
        if (this.negotiatingWithServer || (this.hasExecuted && this.lastRun.getTime() + constants_1.AP_CONFIG.queryDebounceTime > new Date().getTime())) {
            return this.observable;
        }
        else if (this.runOnce && this.hasExecuted) {
            return this.observable;
        }
        else {
            // Set flag to prevent another call while this query is active
            this.negotiatingWithServer = true;
            var query_1 = this;
            var listService_1 = this.getListService();
            var dataService_1 = injector_service_1.injector.get(dataservice_service_1.DataService);
            this.observable = dataService_1.serviceWrapper(query_1)
                .map(function (results) {
                if (query_1.operation === 'GetListItemChangesSinceToken') {
                    dataService_1.processChangeTokenXML(listService_1, query_1, results);
                }
                // Convert the XML into JS objects
                var entities = decode_service_1.processListItems(results, listService_1.mapping, listService_1);
                // Set list permissions if not already set
                if (!listService_1.permissions && results.length > 0) {
                    // Query needs to have returned at least 1 item so we can use permMask
                    listService_1.extendPermissionsFromListItem(results[0]);
                }
                // Remove lock to allow for future requests
                _this.negotiatingWithServer = false;
                // Set date time to allow for time based updates
                query_1.lastRun = new Date();
                // Store query completion date/time on listService to allow us to identify age of data
                listService_1.lastServerUpdate = new Date();
                return entities;
            });
            return this.observable;
        }
    };
    Query = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [Object, factories_1.ListService, String])
    ], Query);
    return Query;
}());
exports.Query = Query;
//# sourceMappingURL=query.factory.js.map