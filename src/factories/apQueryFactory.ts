import {IndexedCache, Model, ListItem, List, FieldDefinition, IUninstantiatedExtendedListItem} from '../factories';
import {APConfig, DefaultListItemQueryOptions} from '../constants';
import {DecodeService, LoggerService, DataService} from '../services';
import {IListFieldMapping} from './apListFactory';
import {Promise} from 'es6-promise';
import _ from 'lodash';

export interface IQueryOptions {
    force?: boolean;
    //Only relevant if requesting a single item
    listItemID?: number;
    localStorage?: boolean;
    localStorageExpiration?: number;
    name?: string;
    // GetListItemChangesSinceToken || GetListItems */
    operation?: string;
    query?: string;
    queryOptions?: string;
    //Returns all items if set to 0
    rowLimit?: number;
    runOnce?: boolean;
    sessionStorage?: boolean;
    viewFields?: string;
    webURL?: string;
}

export interface IExecuteQueryOptions {
    factory?: Function;
    filter?: string;
    mapping?: IListFieldMapping;
    target?: IndexedCache<any>;
    [key: string]: any;
}

export interface IQuery<T extends ListItem<any>> {
    cacheXML?: boolean;
    changeToken?: string;
    force: boolean;
    indexedCache: IndexedCache<T>;
    //initialized: ng.IDeferred<IndexedCache<T>>;
    lastRun: Date;
    listItemID?: number;
    listName: string;
    localStorage: boolean;
    localStorageExpiration: number;
    name: string;
    negotiatingWithServer: boolean;
    // offlineXML?: string;
    operation?: string;
    promise?: Promise<IndexedCache<T>>;
    query?: string;
    queryOptions?: IQueryOptions;
    rowLimit?: number;
    runOnce: boolean;
    sessionStorage: boolean;
    viewFields: string;
    webURL?: string;
    execute(options?: Object): Promise<IndexedCache<T>>;
    getCache(): IndexedCache<T>;
    getLocalStorage(): LocalStorageQuery;
    getModel(): Model;
    hydrateFromLocalStorage(localStorageQuery: LocalStorageQuery): void;
    saveToLocalStorage(): void;

}

export class LocalStorageQuery {
    changeToken: string;
    indexedCache: { [key: number]: Object };
    key: string;
    lastRun: Date;

    constructor(key: string, stringifiedQuery: string) {
        this.key = key;
        let parsedQuery = JSON.parse(stringifiedQuery);
        Object.assign(this, parsedQuery);
        this.lastRun = new Date(parsedQuery.lastRun);
    }

    hasExpired(localStorageExpiration: number = APConfig.localStorageExpiration): boolean {
        let hasExpired = true;
        if (_.isNaN(localStorage)) {
            throw new Error('Local storage expiration is required to be a numeric value and instead is ' + localStorageExpiration);
        } else if (localStorageExpiration === 0) {
            //No expiration
            hasExpired = false;
        } else {
            //Evaluate if cache has exceeded expiration
            hasExpired = this.lastRun.getMilliseconds() + localStorageExpiration <= new Date().getMilliseconds();
        }
        return hasExpired;
    }

    removeItem() {
        localStorage.removeItem(this.key);
    }
}


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
export class Query<T extends ListItem<any>> implements IQuery<T> {
    // very memory intensive to enable cacheXML which is disabled by default
    cacheXML = false;
    // reference to the most recent query when performing GetListItemChangesSinceToken
    changeToken: string;
    force = false;
    getModel: () => Model;
    // key value hash map with key being the id of the entity
    indexedCache = new IndexedCache<T>();
    // promise resolved after first time query is executed
    // date/time last run
    lastRun: Date;
    listItemID: number;
    listName: string;
    // Should we store data from this query in local storage to speed up requests in the future
    localStorage = false;
    // Set expiration in milliseconds - Defaults to a day and if set to 0 doesn't expire
    localStorageExpiration = APConfig.localStorageExpiration;
    name: string;
    // Flag to prevent us from makeing concurrent requests
    negotiatingWithServer = false;
    /* Every time we run we want to check to update our cached data with
     * any changes made on the server */
    operation = 'GetListItemChangesSinceToken';
    promise: Promise<IndexedCache<T>>;
    // Default query returns list items in ascending ID order
    query: string = `
        <Query>
           <OrderBy>
               <FieldRef Name="ID" Ascending="TRUE"/>
           </OrderBy>
        </Query>`;
    queryOptions = DefaultListItemQueryOptions;
    rowLimit: number;
    runOnce = false;
    sessionStorage = false;
    viewFields: string;
    webURL: string = APConfig.defaultUrl;

    // Has this query been executed at least once.
    get hasExecuted(): boolean {
        return _.isDate(this.lastRun);
    }

    // Is this query setup to use browser storage.
    get usesBrowserStorage(): boolean {
        return this.localStorage || this.sessionStorage;
    }

    constructor(queryOptions: IQueryOptions, model: Model) {
        let list = model.getList();
        //Use the default viewFields from the model
        this.viewFields = list.viewFields;
        this.listName = model.getListId();

        //Allow all values on query to be overwritten by queryOptions object
        Object.assign(this, queryOptions);

        // Allow the model to be referenced at a later time
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
     * @returns {Promise<IndexedCache<T>>} Promise that resolves with the cache for this query.
     */
    execute(): Promise<IndexedCache<T>> {
        var query = this;
        let promise: Promise<IndexedCache<T>>;

        /* Return existing promise if request is already underway or has been previously executed in the past
         * 1/10th of a second */
        if (query.negotiatingWithServer || (_.isDate(query.lastRun) && query.lastRun.getTime() + APConfig.queryDebounceTime > new Date().getTime())) {
            promise = query.promise;
        } else {
            promise = new Promise((resolve, reject) => {
                // Set flag to prevent another call while this query is active
                query.negotiatingWithServer = true;

                let localStorageData;

                if (this.usesBrowserStorage) {
                    localStorageData = this.getLocalStorage();
                }

                /* Clear out existing cached list items if GetListItems is the selected operation because otherwise
                 * we could potentially have stale data if a list item no longer meets the query parameters but already
                 * exists in the cache from a previous request. Don't clear the cache in the case where runOnce is set.*/
                if (this.operation === 'GetListItems' && !this.runOnce) {
                    query.getCache().clear();
                }

                // Flag used to determine if we need to make a request to the server
                let makeRequest = true;

                /* See if we already have data in local storage and hydrate if it hasn't expired, which
                 * then allows us to only request the changes. */
                if (!query.force && localStorageData) {
                    switch (this.operation) {
                        case 'GetListItemChangesSinceToken':
                            //Only run the first time, after that the token/data are already in sync
                            if (!query.hasExecuted) {
                                query.hydrateFromLocalStorage(localStorageData);
                            }
                            break;
                        case 'GetListItems':
                            query.hydrateFromLocalStorage(localStorageData);
                            //Use cached data if we have data already available
                            makeRequest = this.getCache().size === 0;
                    }
                }

                // Optionally handle query.runOnce for GetListItems when initial call has already been made
                if (this.hasExecuted && this.runOnce) {
                    makeRequest = false;
                }

                // Only make server request if necessary.
                if (makeRequest) {
                    this.makeRequest()
                        .then((results) => {
                            this.postExecutionCleanup(results);
                            resolve(results);
                        })
                        .catch(err => reject(err));
                } else {
                    this.postExecutionCleanup(this.getCache());
                    resolve(this.getCache());
                }
            });

            // Save reference on the query **/
            query.promise = promise;

        }

        return promise;
    }

    /**
     * @ngdoc function
     * @name Query.getCache
     * @methodOf Query
     * @description
     * Use this to return the cache instead of using the actual property to allow for future refactoring.
     * @returns {IndexedCache<T>} Indexed Cache containing all elements in query.
     */
    getCache(): IndexedCache<T> {
        return this.indexedCache;
    }

    /**
     * @ngdoc function
     * @name Query.getList
     * @methodOf Query
     * @description
     * Shortcut to retrieve the list definition from the model this query belongs to.
     * @returns {List} List definition for model.
     */
    getList(): List {
        let model = this.getModel();
        return model.getList();
    }

    /**
     * @ngdoc function
     * @name Query.getLocalStorage
     * @methodOf Query
     * @description
     * Use this to return query data currenty saved in user's local or session storage.
     * @returns {LocalStorageQuery} Local storage data for this query.
     */
    getLocalStorage(): LocalStorageQuery {
        let parsedQuery, localStorageKey = this.getLocalStorageKey();
        let stringifiedQuery = localStorage.getItem(localStorageKey) || sessionStorage.getItem(localStorageKey);
        if (stringifiedQuery) {
            parsedQuery = new LocalStorageQuery(localStorageKey, stringifiedQuery);
        }
        return parsedQuery;
    }

    /**
     * @ngdoc function
     * @name Query.hydrateFromLocalStorage
     * @methodOf Query
     * @description
     * If data already exists in browser local storage, we rehydrate JSON using list item constructor and
     * then have the ability to just check the server to see what has changed from the current state.
     */
    hydrateFromLocalStorage(localStorageQuery: LocalStorageQuery): void {
        if (localStorageQuery.hasExpired(this.localStorageExpiration)) {
            //Don't continue and purge if data has exceeded expiration
            localStorageQuery.removeItem();
        } else {
            let listItemProvider = DecodeService.createListItemProvider<T>(this.getModel(), this, this.getCache());
            let fieldDefinitions = this.getList().fields;

            //Identify all DateTime JSON fields so we can cast as Date objects
            var dateTimeProperties: string[] =
                fieldDefinitions
                    .filter((fieldDefinition: FieldDefinition) => {
                        return fieldDefinition.objectType === 'DateTime';
                    })
                    .map((fieldDefinition: FieldDefinition) => {
                        return fieldDefinition.mappedName;
                    });


            //Hydrate each raw list item and add to cache
            _.each(localStorageQuery.indexedCache, (jsonObject: IUninstantiatedExtendedListItem<T>) => {
                let hydratedObject = this.hydrateJSONDates<T>(jsonObject, dateTimeProperties);
                listItemProvider(hydratedObject);
            });

            //Set the last run date
            this.lastRun = localStorageQuery.lastRun;
            //Store the change token
            this.changeToken = localStorageQuery.changeToken;
        }
    }

    /**
     * @ngdoc function
     * @name Query.hydrateJSONDates
     * @methodOf Query
     * @description
     * Objects pulled from local storage have JSON date strings so we need to convert to real dates.
     * @returns {Object} JSON object with date strings converted to Date objects.
     */
    hydrateJSONDates<T extends IUninstantiatedExtendedListItem<any>>(jsonObject: any, dateTimeProperties: string[]): T {
        _.each(dateTimeProperties, (prop: string) => {
            if (_.isString(jsonObject[prop])) {
                jsonObject[prop] = new Date(jsonObject[prop]);
            }
        });
        return jsonObject;
    }

    /**
     * @ngdoc function
     * @name Query.postExecutionCleanup
     * @methodOf Query
     * @description
     * Internal method exposed to allow for testing.  Handle cleanup after query execution is complete.
     */
    postExecutionCleanup(results: IndexedCache<T>) {
        let query = this;
        let model = query.getModel();

        // Set flag if this if the first time this query has been run
        //var firstRunQuery = _.isNull(query.lastRun);

        //if (firstRunQuery) {
        //    // Promise resolved the first time query is completed
        //    query.initialized.resolve(results);
        //}

        // Set list permissions if not already set
        var list = model.getList();
        if (!list.permissions && results.first()) {
            // Query needs to have returned at least 1 item so we can use permMask
            list.extendPermissionsFromListItem(results.first());
        }

        // Remove lock to allow for future requests
        query.negotiatingWithServer = false;

        // Store query completion date/time on model to allow us to identify age of data
        model.lastServerUpdate = new Date();

        /* Overwrite local storage value with updated state so we can potentially restore in
         * future sessions. */
        if (query.usesBrowserStorage) {
            query.saveToLocalStorage();
        }
    }

    /**
     * @ngdoc function
     * @name Query.saveToLocalStorage
     * @methodOf Query
     * @description
     * Save a snapshot of the current state to local/session storage so we can speed up calls
     * for data already residing on the users machine.
     */
    saveToLocalStorage(): void {
        //Don't use storage when running offline
        if (APConfig.offline) {
            return;
        }

        let store = {
            changeToken: this.changeToken,
            indexedCache: this.getCache(),
            lastRun: this.lastRun
        };
        let stringifiedQuery = JSON.stringify(store);
        let storageType = this.localStorage ? 'local' : 'session';
        let localStorageKey = this.getLocalStorageKey();
        //Use try/catch in case we've exceeded browser storage limit (typically 5MB)
        try {
            if (this.localStorage) {
                localStorage.setItem(localStorageKey, stringifiedQuery);
            } else {
                sessionStorage.setItem(localStorageKey, stringifiedQuery);
            }
        } catch (err) {
            if (isQuotaExceeded(err)) {
                // Storage full, maybe notify user or do some clean-up
            }
            LoggerService.debug('Looks like we\'re out of space in ' + storageType + ' storage.', {
                json: {
                    query: this.name,
                    model: this.getModel().list.title
                }
            });
            if (this.localStorage) {
                localStorage.clear();
            } else {
                sessionStorage.clear();
            }
            //Disable storage for remainder of session to prevent throwing additional errors
            this.localStorage = false;
            this.sessionStorage = false;
        }
    }

    makeRequest(): Promise<IndexedCache<T>> {
        let query = this;
        let model = this.getModel();
        let cache = this.getCache();

        return DataService.serviceWrapper(query)
            .then((responseXML) => {
                if (query.operation === 'GetListItemChangesSinceToken') {
                    DataService.processChangeTokenXML<T>(model, query, responseXML, cache);
                }

                // Convert the XML into JS objects
                var entities = DecodeService.processListItems<T>(model, query, responseXML, { target: cache });

                // Set date time to allow for time based updates
                query.lastRun = new Date();

                return entities;
            });

    }

    // They key we use for local storage
    private getLocalStorageKey() {
        var model = this.getModel();
        return model.getListId() + '.query.' + this.name;
    }

}

function isQuotaExceeded(err) {
    var quotaExceeded = false;
    if (err) {
        if (err.code) {
            switch (err.code) {
                case 22:
                    quotaExceeded = true;
                    break;
                case 1014:
                    // Firefox
                    if (err.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                        quotaExceeded = true;
                    }
                    break;
            }
        } else if (err.number === -2147024882) {
            // Internet Explorer 8
            quotaExceeded = true;
        }
    }
    return quotaExceeded;
}
