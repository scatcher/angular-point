import {ListService, ListItem} from '../factories';
import {AP_CONFIG, DefaultListItemQueryOptions} from '../constants';
import {Injectable} from '@angular/core';
import {injector} from '../services/injector.service';
import {DataService} from '../services/dataservice.service';
import {processListItems} from '../services/decode.service';
import {Observable} from 'rxjs/Observable';
import {isNaN, isDate, each, isString} from 'lodash';


export interface IQueryOptions {
    force?: boolean;
    // Only relevant if requesting a single item
    listItemID?: number;
    name: string;
    operation: 'GetListItems' | 'GetListItemChangesSinceToken';
    query?: string;
    queryOptions?: string;
    // Returns all items if set to 0
    rowLimit?: number;
    runOnce?: boolean;
    viewFields?: string;
    webURL?: string;
}

export interface IQuery<T extends ListItem<any>> {
    cacheXML?: boolean;
    changeToken?: string;
    force: boolean;
    lastRun: Date;
    listItemID?: number;
    name: string;
    negotiatingWithServer: boolean;
    operation: 'GetListItems' | 'GetListItemChangesSinceToken';
    Observable?: Observable<T[]>;
    query?: string;
    queryOptions?: string;
    rowLimit?: number;
    runOnce: boolean;
    viewFields: string;
    webURL?: string;
    execute(options?: Object): Observable<T[]>;
    getListService(): ListService<T>;
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
@Injectable()
export class Query<T extends ListItem<any>> implements IQuery<T> {
    // reference to the most recent query when performing GetListItemChangesSinceToken
    changeToken: string;
    force = false;
    getListService: () => ListService<T>;
    // date/time last run
    lastRun: Date;
    listItemID: number;
    listName: string;
    name: string;
    // Flag to prevent us from making concurrent requests
    negotiatingWithServer = false;
    /* Every time we run we want to check to update our cached data with
     * any changes made on the server */
    operation: 'GetListItems' | 'GetListItemChangesSinceToken';
    observable: Observable<T[]>;
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
    viewFields: string;
    webURL: string = AP_CONFIG.defaultUrl;

    // Has this query been executed at least once.
    get hasExecuted(): boolean {
        return isDate(this.lastRun);
    }

    constructor(queryOptions: IQueryOptions, listService: ListService<T>, viewFields: string) {
        this.viewFields = viewFields;
        this.listName = listService.getListId();
        //Allow all values on query to be overwritten by queryOptions object
        Object.assign(this, queryOptions);

        // Allow the listService to be referenced at a later time
        this.getListService = () => listService;
    }


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
    execute(): Observable<T[]> {

        /* Return existing observable if request is already underway or has been previously executed in the past
         * 1/10th of a second */
        if (this.negotiatingWithServer || (this.hasExecuted && this.lastRun.getTime() + AP_CONFIG.queryDebounceTime > new Date().getTime())) {
            return this.observable;

        } else if (this.runOnce && this.hasExecuted) {
            return this.observable;

        } else {
            // Set flag to prevent another call while this query is active
            this.negotiatingWithServer = true;
            let query = this;
            let listService = this.getListService();
            const dataService: DataService = injector.get(DataService);
            this.observable = dataService.serviceWrapper(query)
                .map((results) => {
                    
                    if (query.operation === 'GetListItemChangesSinceToken') {
                        dataService.processChangeTokenXML<T>(listService, query, results);
                    }

                    // Convert the XML into JS objects
                    var entities = processListItems<T>(results, listService.mapping, listService);

                    // Set list permissions if not already set
                    if (!listService.permissions && results.length > 0) {
                        // Query needs to have returned at least 1 item so we can use permMask
                        listService.extendPermissionsFromListItem(results[0]);
                    }

                    // Remove lock to allow for future requests
                    this.negotiatingWithServer = false;

                    // Set date time to allow for time based updates
                    query.lastRun = new Date();

                    // Store query completion date/time on listService to allow us to identify age of data
                    listService.lastServerUpdate = new Date();

                    return entities;
                });

            return this.observable;

        }
    }

}
