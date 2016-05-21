import { ListService, ListItem } from '../factories';
import { Observable } from 'rxjs/Observable';
export interface IQueryOptions {
    force?: boolean;
    listItemID?: number;
    name: string;
    operation: 'GetListItems' | 'GetListItemChangesSinceToken';
    query?: string;
    queryOptions?: string;
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
export declare class Query<T extends ListItem<any>> implements IQuery<T> {
    changeToken: string;
    force: boolean;
    getListService: () => ListService<T>;
    lastRun: Date;
    listItemID: number;
    listName: string;
    name: string;
    negotiatingWithServer: boolean;
    operation: 'GetListItems' | 'GetListItemChangesSinceToken';
    observable: Observable<T[]>;
    query: string;
    queryOptions: string;
    rowLimit: number;
    runOnce: boolean;
    viewFields: string;
    webURL: string;
    hasExecuted: boolean;
    constructor(queryOptions: IQueryOptions, listService: ListService<T>, viewFields: string);
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
    execute(): Observable<T[]>;
}
