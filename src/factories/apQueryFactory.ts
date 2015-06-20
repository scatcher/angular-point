/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    var $q, apIndexedCacheFactory: IndexedCacheFactory, apConfig: IAPConfig, apDefaultListItemQueryOptions,
        apDataService: DataService;

    export interface IQuery<T> {
        cacheXML?: boolean;
        changeToken?: string;
        execute(options?: Object): ng.IPromise<IndexedCache<T>>;
        getModel(): Model;
        indexedCache: IndexedCache<T>;
        initialized: ng.IDeferred<IndexedCache<T>>
        lastRun: Date;
        listName: string;
        name: string;
        negotiatingWithServer: boolean;
        offlineXML?: string;
        operation?: string;
        promise?: ng.IPromise<IndexedCache<T>>;
        query?: string;
        queryOptions?: IQueryOptions;
        viewFields: string;
        webURL?: string;
    }

    export interface IQueryOptions {
        name?: string;
        operation?: string;
    }

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
    export class Query<T> implements IQuery<T> {
        /** Very memory intensive to enable cacheXML which is disabled by default*/
        cacheXML: boolean = false;
        /** Reference to the most recent query when performing GetListItemChangesSinceToken */
        changeToken = undefined;

        getModel: () => Model;

        /** Key value hash map with key being the id of the entity */
        indexedCache: IndexedCache<T>;
        /** Promise resolved after first time query is executed */
        initialized: ng.IDeferred<IndexedCache<T>>;
        /** Date/Time last run */
        lastRun;
        listName;
        name: string;
        /** Flag to prevent us from makeing concurrent requests */
        negotiatingWithServer: boolean = false;
        /** Every time we run we want to check to update our cached data with
         * any changes made on the server */
        operation = 'GetListItemChangesSinceToken';
        promise;
        /** Default query returns list items in ascending ID order */
        query: string = `
        <Query>
           <OrderBy>
               <FieldRef Name="ID" Ascending="TRUE"/>
           </OrderBy>
        </Query>`;
        queryOptions;
        viewFields;
        webURL;

        constructor(config, model: Model) {
            this.indexedCache = apIndexedCacheFactory.create<T>();
            this.initialized = $q.defer();
            this.listName = model.list.getListId();
            this.queryOptions = apDefaultListItemQueryOptions;
            this.viewFields = model.list.viewFields;

            /** Set the default url if the config param is defined, otherwise let SPServices handle it */
            if (apConfig.defaultUrl) {
                this.webURL = apConfig.defaultUrl;
            }

            _.assign(this, config);

            /** Allow the model to be referenced at a later time */
            this.getModel = () => model;
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
        execute(options): ng.IPromise<IndexedCache<T>> {
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
                var queryOptions = _.assign({}, defaults, options);

                apDataService.executeQuery(model, query, queryOptions).then((results) => {
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

        getCache(): IndexedCache<T> {
            return this.indexedCache;
        }
    }


    export class QueryFactory {
        Query = Query;
        static $inject = ['$q', 'apConfig', 'apDataService', 'apDefaultListItemQueryOptions', 'apIndexedCacheFactory'];

        constructor(_$q_, _apConfig_, _apDataService_, _apDefaultListItemQueryOptions_, _apIndexedCacheFactory_) {

            $q = _$q_;
            apConfig = _apConfig_;
            apDataService = _apDataService_;
            apDefaultListItemQueryOptions = _apDefaultListItemQueryOptions_;
            apIndexedCacheFactory = _apIndexedCacheFactory_;

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
        create<T>(config, model): IQuery<T> {
            return new Query<T>(config, model);
        }
    }

    /**
     * @ngdoc object
     * @name angularPoint.apQueryFactory
     * @description
     * Exposes the Query prototype and a constructor to instantiate a new Query.
     *
     * @requires angularPoint.apDataService
     * @requires angularPoint.apConfig
     */
    angular.module('angularPoint')
        .service('apQueryFactory', QueryFactory);


}
