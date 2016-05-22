import { IWorkflowDefinition } from '../services/dataservice.service';
import { IUserPermissionsObject } from '../constants';
import { FieldChangeSummary, VersionHistoryCollection, User, Lookup, ListService } from '../factories';
import { ChangeSummary } from './list-item-version.factory';
import { IFieldDefinition } from './field-definition.factory';
import { Observable } from 'rxjs/Observable';
export interface IUninstantiatedListItem {
    author: User;
    created: Date;
    editor: User;
    fileRef: Lookup<any>;
    id: number;
    modified: Date;
    permMask: string;
    uniqueId: string;
    version?: number;
    [key: string]: any;
}
/** standard uninstantiated list item with helper methods required to instantiate
 * with list service factory */
export interface IUninstantiatedExtendedListItem<T extends ListItem<any>> extends IUninstantiatedListItem {
    getPristine?: () => Object;
}
/**
 * @ngdoc object
 * @name ListItem
 * @description
 * Base prototype which all list items inherit from.  All methods can be accessed
 * through this prototype so all CRUD functionality can be called directly from a given list item.
 * @constructor
 */
export declare class ListItem<T extends ListItem<any>> implements IUninstantiatedExtendedListItem<T> {
    author: User;
    created: Date;
    editor: User;
    fileRef: Lookup<T>;
    getListService: () => ListService<T>;
    getPristine: () => IUninstantiatedListItem;
    id: number;
    modified: Date;
    permMask: string;
    uniqueId: string;
    /**
     * @ngdoc function
     * @name ListItem.addAttachment
     * @description
     * Uploads an attachment to a given list item.
     * @param {string} attachment A base-64 encoded ASCII string.
     * @param {string} fileName The name of the file to store in SharePoint.
     * @returns {Observable<string>} The relative url of the new attachment.
     */
    addAttachment(attachment: string, fileName: string): Observable<string>;
    /**
     * @ngdoc function
     * @name ListItem.clone
     * @description
     * Create a deep copy of the current list item to prevent mutation of the
     * original.
     * @returns {T} Deep copy of the list item.
     */
    clone(): T;
    /**
     * @ngdoc function
     * @name ListItem.changes
     * @description
     * Checks a given list item compared to its pristine state and returns a field change summary
     * with information on any significant changes to non-readonly fields.
     * @returns {FieldChangeSummary<T>} Change summary of all fields that have been modified
     * since last save.
     */
    changes(): FieldChangeSummary<T>;
    /**
     * @ngdoc function
     * @name ListItem.deleteAttachment
     * @description
     * Delete an attachment from a list item.
     * @param {string} url Requires the URL for the attachment we want to delete.
     * @returns {Observable<any>} Observable which resolves without any contents once deleted.
     * @example
     * <pre>
     * deleteAttachment(listItem: ListItem<any>, attachment: string) {
     *     let confirmation = window.confirm("Are you sure you want to delete this file?");
     *     if (confirmation) {
     *         listItem.deleteAttachment(attachment)
     *              .subscribe(function () {
     *                  alert("Attachment successfully deleted");
     *              });
     *     }
     * };
     * </pre>
     */
    deleteAttachment(url: string): Observable<any>;
    /**
     * @ngdoc function
     * @name ListItem.deleteItem
     * @description
     * Deletes record directly from the object and removes record
     * from user cache.
     * @returns {Observable<any>} Observable which really only lets
     * us know the request is complete.
     * @example
     * ```
     * <ul>
     *    <li *ngFor="let task of tasks">
     *        {{task.title}} <a href (click)="task.deleteItem()>delete</a>
     *    </li>
     * </ul>
     * ```
     * List of tasks.  When the delete link is clicked, the list item
     * item is removed from the local cache and the view is updated to
     * no longer show the task.
     */
    deleteItem(): Observable<any>;
    /**
     * @ngdoc function
     * @name ListItem.getAttachmentCollection
     * @description
     * Requests all attachments for a given list item.
     * @returns {Observable<string[]>} Observable which resolves with all
     * attachments for a list item.
     * @example
     * <pre>
     * //Pull down all attachments for the current list item
     * fetchAttachments(listItem: ListItem<any>) => {
     *     listItem.getAttachmentCollection()
     *         .subscribe(attachments => this.attachments = attachments );
     * };
     * </pre>
     */
    getAttachmentCollection(): Observable<string[]>;
    /**
     * @ngdoc function
     * @name ListItem.getAvailableWorkflows
     * @description
     * Wrapper for DataService.getAvailableWorkflows.  Simply passes the current item in.
     * @returns {Observable<IWorkflowDefinition[]>} Array of objects defining each of the
     * available workflows.
     */
    getAvailableWorkflows(): Observable<IWorkflowDefinition[]>;
    /**
     * @ngdoc function
     * @name ListItem.getChanges
     * @description
     * Wrapper for listService.getListItemById.  Queries server for any changes and
     * extends the existing list item with those changes.
     * @returns {Observable<T>} Observable which resolves with the updated list item.
     */
    getChanges(): Observable<T>;
    /**
     * @ngdoc function
     * @name ListItem.getChangeSummary
     * @description
     * Uses ListItem.getVersionHistory and determines what information changed between
     * each list item version.
     * @param {string[]} [fieldNames] An array/single string of field names on the list
     * item to fetch a version history for.
     * @returns {Observable<ChangeSummary<T>>} Observable which resolves with an array
     * of list item versions.
     * @example
     * Assuming we have a modal form where we want to display each version of the title
     * and project fields of a given list item.
     * <pre>
     * myGenericListItem.getChangeSummary(['title', 'project'])
     *     .subscribe((changeSummary: ChangeSummary) => {
     *            // We now have an array of every version of these fields
     *            this.changeSummary = changeSummary;
     *      };
     * </pre>
     */
    getChangeSummary(fieldNames?: string[]): Observable<ChangeSummary<T>>;
    /**
     * @ngdoc function
     * @name ListItem.getFieldChoices
     * @param {string} fieldName Internal field name.
     * @description
     * Uses the field definition defined in the list service to attempt to find the choices
     * array for a given Lookup or MultiLookup type field.  The default value is
     * fieldDefinition.choices which can optionally be added to a given field definition.
     * If this isn't found, we check fieldDefinition.Choices which is populated after a
     * GetListItemsSinceToken operation or a ListService.extendListMetadata operation.
     * Finally if that isn't available we return an empty array.
     * @returns {string[]} An array of choices for a Choice or MultiChoice type field.
     */
    getFieldChoices(fieldName: string): string[];
    /**
     * @ngdoc function
     * @name ListItem.getFieldDefinition
     * @description
     * Returns the field definition from the definitions defined in the custom fields array
     * within a list service.
     * @example
     * <pre>
     * let project = {
     *    title: 'Project 1',
     *    location: {
     *        lookupId: 5,
     *        lookupValue: 'Some Building'
     *    }
     * };
     *
     * //To get field metadata
     * let locationDefinition = project.getFieldDefinition('location');
     * </pre>
     * @param {string} fieldName Internal field name.
     * @returns {object} Field definition.
     */
    getFieldDefinition(fieldName: string): IFieldDefinition;
    /**
     * @ngdoc function
     * @name ListItem.getFieldDescription
     * @param {string} fieldName Internal field name.
     * @description
     * Uses the field definition defined in the list service to attempt to find the description
     * for a given field.  The default value is fieldDefinition.Description which is populated
     * after a GetListItemsSinceToken operation or a ListService.extendListMetadata operation.
     * If this isn't available we look for an optional attribute of a field
     * fieldDefinition.description.  Finally if that have anything it returns an empty string.
     * @returns {string} The description for a given field object.
     */
    getFieldDescription(fieldName: string): string;
    /**
     * @ngdoc function
     * @name ListItem.getFieldLabel
     * @param {string} fieldName Internal field name.
     * @description
     * Uses the field definition defined in the list service to attempt to find the label for a
     * given field.  The default value is fieldDefinition.label.  If not available it will then
     * use fieldDefinition.DisplayName which is populated after a GetListItemsSinceToken operation
     * or a ListService.extendListMetadata operation.  If this isn't available it will fallback
     * to the the fieldDefinition.DisplayName which is a best guess at converting the caml case
     * version of the mapped name using UtilityService.fromCamelCase.
     * @returns {string} The label for a given field object.
     */
    getFieldLabel(fieldName: string): string;
    /**
     * @ngdoc function
     * @name ListItem.getFormattedValue
     * @description
     * Given the attribute name on a listItem, we can lookup the field type and from there return
     * a formatted string representation of that value.
     * @param {string} fieldName Attribute name on the object that contains the value to stringify.
     * @param {object} [options] Pass through to apFormattedFieldValueService.getFormattedFieldValue
     * or any custom method specified on the field definition.
     * @returns {string} Formatted string representing the field value.
     */
    getFormattedValue(fieldName: string, options?: Object): string;
    /**
     * @ngdoc function
     * @name ListItem.getListId
     * @description
     * Allows us to reference the list ID directly from the list item.  This is added to the
     * ListService.listService prototype in apModelFactory.
     * @returns {string} List ID.
     */
    getListId(): string;
    /**
     * @ngdoc function
     * @name ListItem.getVersionHistory
     * @description
     * Takes an array of field names, finds the version history for field, and returns a snapshot
     * of the object at each version.  If no fields are provided, we look at the field definitions
     * in the list service and pull all non-readonly fields.  The only way to do this that I've
     * been able to get working is to get the version history for each field independently and
     * then build the history by combining the server responses for each requests into a snapshot
     * of the object.  Each version has the standard modified date but also includes a version
     * property with the version number.
     * @param {string[]} [properties] An array of property names on the list item
     * that we're interested in.
     * @returns {Observable<VersionHistoryCollection<T>>} Observable which resolves with an object
     * with keys=version and values = ListItemVersion.
     * @example
     * Assuming we have a modal form where we want to display each version of the title and project
     * fields of a given list item.
     * <pre>
     * myGenericListItem.getVersionHistory(['title', 'project'])
     *     .subscribe(versionHistory => {
     *            // We now have an array of every version of these fields
     *            vm.versionHistory = versionHistory;
     *      }, err => {
     *          // Do something with the error
     *      });
     * </pre>
     */
    getVersionHistory(properties?: string[]): Observable<VersionHistoryCollection<T>>;
    /**
     * @ngdoc function
     * @name ListItem.isPristine
     * @description
     * Determines if a list item has changed since it was instantiated.
     * @returns {boolean} The list item is unchanged.
     */
    isPristine(): boolean;
    /**
     * @ngdoc function
     * @name ListItem.resolvePermissions
     * @description
     * See apModelService.resolvePermissions for details on what we expect to have returned.
     * @returns {Object} Contains properties for each permission level evaluated for current user.
     * @example
     * Lets assume we're checking to see if a user has edit rights for a given task list item.
     * <pre>
     * let canUserEdit = task => {
     *      let userPermissions = task.resolvePermissions();
     *      return userPermissions.EditListItems;
     * };
     * </pre>
     * Example of what the returned object would look like
     * for a site admin.
     * <pre>
     * userPermissions = {
     *    "ViewListItems": true,
     *    "AddListItems": true,
     *    "EditListItems": true,
     *    "DeleteListItems": true,
     *    "ApproveItems": true,
     *    "OpenItems": true,
     *    "ViewVersions": true,
     *    "DeleteVersions": true,
     *    "CancelCheckout": true,
     *    "PersonalViews": true,
     *    "ManageLists": true,
     *    "ViewFormPages": true,
     *    "Open": true,
     *    "ViewPages": true,
     *    "AddAndCustomizePages": true,
     *    "ApplyThemeAndBorder": true,
     *    "ApplyStyleSheets": true,
     *    "ViewUsageData": true,
     *    "CreateSSCSite": true,
     *    "ManageSubwebs": true,
     *    "CreateGroups": true,
     *    "ManagePermissions": true,
     *    "BrowseDirectories": true,
     *    "BrowseUserInfo": true,
     *    "AddDelPrivateWebParts": true,
     *    "UpdatePersonalWebParts": true,
     *    "ManageWeb": true,
     *    "UseRemoteAPIs": true,
     *    "ManageAlerts": true,
     *    "CreateAlerts": true,
     *    "EditMyUserInfo": true,
     *    "EnumeratePermissions": true,
     *    "FullMask": true
     * }
     * </pre>
     */
    resolvePermissions(): IUserPermissionsObject;
    /**
     * @ngdoc function
     * @name ListItem.saveChanges
     * @description
     * Updates record directly from the object
     * @param {object} [options] Optionally pass params to the data service.
     * @param {boolean} [options.updateAllCaches=false] Search through the cache for each
     * query to ensure listItem is updated everywhere.  This is more process intensive so
     * by default we only update the cached listItem in the cache where this listItem is
     * currently stored.
     * @returns {object} Observable<T> which resolved with the updated list item from the server.
     * @example
     * <pre>
     * // Example of save function on a fictitious
     * // app/tasks/tasks_modal.component.js modal form class.
     * saveChanges(task: Task) {
     *      task.saveChanges()
     *          .subscribe(udpatedTask => {
     *              // Successfully saved so we can do something
     *              // like close form
     *
     *          }, err => {
     *              // Failure
     *
     *          });
     * }
     * </pre>
     */
    saveChanges({valuePairs, buildValuePairs}?: {
        valuePairs?: any;
        buildValuePairs?: boolean;
    }): Observable<T>;
    /**
     * @ngdoc function
     * @name ListItem.saveFields
     * @description
     * Saves a named subset of fields back to SharePoint.  This is an alternative to
     * saving all fields.
     * @param {string[]} fieldArray Array of internal field names that should be saved
     * to SharePoint.
     * @param {object} [options] Optionally pass params to the data service.
     * @returns {Observable<T>} Observable which resolves with the updated list item
     * from the server.
     * @example
     * <pre>
     * // Example of saveFields function on a fictitious
     * // app/tasks/task_details.component.ts modal form.
     * // Similar to saveChanges but instead we only save
     * // specified fields instead of pushing everything.
     * updateStatus(task: Task) {
     *      task.saveFields(['status', 'notes'])
     *          .subscribe(updatedTask => {
     *              // Successfully updated the status and
     *              // notes fields for the given task
     *
     *          }, err => {
     *              // Failure to update the field
     *
     *          });
     * }
     * </pre>
     */
    saveFields(fieldArray: string[]): Observable<T>;
    /**
     * @ngdoc function
     * @name ListItem.setPristine
     * @param {ListItem} [listItem] Optionally pass list item object back to the list
     * item constructor to run any initialization logic.  Otherwise we just overwrite
     * existing values on the object with a copy from the original object.
     * @description
     * Resets all list item properties back to a pristine state but doesn't update any
     * properties added manually to the list item.
     */
    setPristine(listItem?: ListItem<any>): void;
    /**
     * @ngdoc function
     * @name ListItem.startWorkflow
     * @description
     * Given a workflow name or templateId we initiate a given workflow using
     * DataService.startWorkflow.
     * @param {object} options Params for method and pass through options to
     * DataService.startWorkflow.
     * @param {string} [options.templateId] Used to directly start the workflow without
     * looking up the templateId.
     * @param {string} [options.workflowName] Use this value to lookup the templateId
     * and then start the workflow.
     * @returns {Observable<any>} Resolves with server response.
     */
    startWorkflow(options: IStartWorkflowParams): Observable<any>;
    /**
     * @ngdoc function
     * @name ListItem.validateEntity
     * @description
     * Helper function that passes the current item to ListService.validateEntity
     * @returns {boolean} Evaluation of validity.
     */
    validateEntity(): boolean;
}
export interface IStartWorkflowParams {
    fileRef?: string;
    item: string;
    templateId: string;
    workflowName?: string;
    workflowParameters?: string;
}
