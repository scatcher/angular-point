'use strict';

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
  .factory('apQueryFactory', function (apModalService, apCacheService, apDataService, apConfig, $q) {


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

  });