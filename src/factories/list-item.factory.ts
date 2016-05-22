import {resolvePermissions, registerChange} from '../services/utility.service';
import {generateValuePairs} from '../services/encode.service';
import {registerListItemUpdate} from '../services/change.service';
import {processListItems} from '../services/decode.service';
import {injector} from '../services/injector.service';

import {
    DataService,
    IGetFieldVersionHistoryOptions,
    IWorkflowDefinition
} from '../services/dataservice.service';
import {AP_CONFIG, IUserPermissionsObject} from '../constants';
import {Injectable } from '@angular/core';
import {
    FieldChangeSummary,
    VersionHistoryCollection,
    User,
    Lookup,
    ListService
} from '../factories';
import {ChangeSummary, FieldVersionCollection} from './list-item-version.factory';
import {IFieldDefinition, IFieldConfigurationObject} from './field-definition.factory';
import {Observable} from 'rxjs/Observable';
import {cloneDeep, isFunction, isNaN, isArray, isString} from 'lodash';

// raw list item before passed into constructor function
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
@Injectable()
export class ListItem<T extends ListItem<any>> implements IUninstantiatedExtendedListItem<T> {
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
    addAttachment(attachment: string, fileName: string): Observable<string> {
        const dataService = injector.get(DataService);
        return dataService
            .serviceWrapper({
                operation: 'AddAttachment',
                listName: this.getListId(),
                listItemID: this.id,
                fileName,
                attachment
            })
            .map((responseXML: Element) => {
                let filteredNodes = responseXML.getElementsByTagName('AddAttachmentResult');
                return filteredNodes[0].textContent;
            });
    }

    /**
     * @ngdoc function
     * @name ListItem.clone
     * @description
     * Create a deep copy of the current list item to prevent mutation of the 
     * original.
     * @returns {T} Deep copy of the list item.
     */
    clone(): T {
        let listService = this.getListService();
        return listService.factory(Object.assign({}, this));
    }

    /**
     * @ngdoc function
     * @name ListItem.changes
     * @description
     * Checks a given list item compared to its pristine state and returns a field change summary
     * with information on any significant changes to non-readonly fields.
     * @returns {FieldChangeSummary<T>} Change summary of all fields that have been modified
     * since last save.
     */
    changes(): FieldChangeSummary<T> {
        // Instantiate a copy of the original list item for comparison
        let pristineListItem = cloneDeep(this.getPristine());
        if (!pristineListItem) {
            throw new Error('Could not retrieve a pristine version of this list item.');
        }
        // Remove id so when we instantiate we don't register in cache
        pristineListItem.id = undefined;
        // Need to instantiate using the same factory as the current list item
        let listService = this.getListService();
        let instantiatedPristineListItem = listService.factory(pristineListItem);

        return new FieldChangeSummary<T>(this, instantiatedPristineListItem);
    }

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
    deleteAttachment(url: string): Observable<any> {
        const dataService = injector.get(DataService);
        return dataService
            .serviceWrapper({
                operation: 'DeleteAttachment',
                filterNode: 'Field',
                listItemID: this.id,
                url,
                listName: this.getListId()
            });
    }


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
    deleteItem(): Observable<any> {
        let listItem = this;
        let listService = listItem.getListService();

        let config = {
            operation: 'UpdateListItems',
            listName: listService.getListId(),
            batchCmd: 'Delete',
            ID: listItem.id,
            valuePairs: undefined,
            webURL: listService.identifyWebURL()
        };

        /** Check to see if list item or document because documents need the 
         * FileRef as well as id to delete
         */
        if (listItem.fileRef && listItem.fileRef.lookupValue) {
            let fileExtension = listItem.fileRef.lookupValue.split('.').pop();
            if (isNaN(fileExtension)) {
                /** File extension instead of numeric extension so it's a document
                 * @Example
                 * Document: "Site/library/file.csv"
                 * List Item: "Site/List/5_.000"
                 */
                config.valuePairs = [['FileRef', listItem.fileRef.lookupValue]];

            }
        }

        const dataService: DataService = injector.get(DataService);

        return dataService.serviceWrapper(config)
            .map((response) => {
                /** Optionally broadcast change event */
                registerChange(listService, 'delete', listItem.id);

                /** Success */
                return response;
            }, (err) => {
                let msg = 'There was an error deleting list item ' + listItem.id +
                    ' from ' + listService.title + ' due to the following Error: ' + err;
                throw new Error(msg);
            });


    }


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
    getAttachmentCollection(): Observable<string[]> {
        const dataService = injector.get(DataService);
        return dataService
            .getCollection({
                operation: 'GetAttachmentCollection',
                listName: this.getListId(),
                webURL: this.getListService().webURL,
                ID: this.id,
                filterNode: 'Attachment'
            });
    }


    /**
     * @ngdoc function
     * @name ListItem.getAvailableWorkflows
     * @description
     * Wrapper for DataService.getAvailableWorkflows.  Simply passes the current item in.
     * @returns {Observable<IWorkflowDefinition[]>} Array of objects defining each of the
     * available workflows.
     */
    getAvailableWorkflows(): Observable<IWorkflowDefinition[]> {
        const dataService = injector.get(DataService);
        return dataService.getAvailableWorkflows(this.fileRef.lookupValue);
    }


    /**
     * @ngdoc function
     * @name ListItem.getChanges
     * @description
     * Wrapper for listService.getListItemById.  Queries server for any changes and
     * extends the existing list item with those changes.
     * @returns {Observable<T>} Observable which resolves with the updated list item.
     */
    getChanges(): Observable<T> {
        let listService = this.getListService();
        return listService.getListItemById(this.id);
    }


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
    getChangeSummary(fieldNames?: string[]): Observable<ChangeSummary<T>> {
        return this.getVersionHistory(fieldNames)
            .map((versionHistoryCollection: VersionHistoryCollection<T>) => {
                return versionHistoryCollection.generateChangeSummary();
            });
    }

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
    getFieldChoices(fieldName: string): string[] {
        let listItem = this;
        let fieldDefinition = listItem.getFieldDefinition(fieldName);
        return fieldDefinition.choices || fieldDefinition.Choices || [];
    }


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
    getFieldDefinition(fieldName: string): IFieldDefinition {
        let listItem = this;
        return listItem.getListService().getFieldDefinition(fieldName);
    }


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
    getFieldDescription(fieldName: string): string {
        let listItem = this;
        let fieldDefinition = listItem.getFieldDefinition(fieldName);
        return fieldDefinition.description || fieldDefinition.Description || '';
    }


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
    getFieldLabel(fieldName: string): string {
        let listItem = this;
        let fieldDefinition = listItem.getFieldDefinition(fieldName);
        return fieldDefinition.label || fieldDefinition.DisplayName || fieldDefinition.displayName;
    }


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
    getFormattedValue(fieldName: string, options?: Object): string {
        let listItem = this;
        let fieldDefinition = listItem.getFieldDefinition(fieldName);
        if (!fieldDefinition) {
            throw new Error(`A field definition for a field named ${fieldName} wasn't found.`);
        }
        return fieldDefinition.getFormattedValue(this, options);
    }


    /**
     * @ngdoc function
     * @name ListItem.getListId
     * @description
     * Allows us to reference the list ID directly from the list item.  This is added to the
     * ListService.listService prototype in apModelFactory.
     * @returns {string} List ID.
     */
    getListId(): string {
        let listService = this.getListService();
        return listService.getListId();
    }


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
    getVersionHistory(properties?: string[]): Observable<VersionHistoryCollection<T>> {
        let listService = this.getListService();
        let observables = [];

        if (properties && !isArray(properties)) {
            throw new Error('Properties are required to be formatted as an array of strings.');
        }
        if (!properties) {
            /** If fields aren't provided, pull the version history for all NON-readonly fields */
            let targetFields = listService.fields
                .filter(fieldDefinition => fieldDefinition.readOnly === false);

            properties = targetFields.map(fieldDefinition => fieldDefinition.mappedName);
        }

        /** Generate observables for each field */
        for (let prop of properties) {
            let fieldDefinition = this.getFieldDefinition(prop);

            let payload: IGetFieldVersionHistoryOptions = {
                operation: 'GetVersionCollection',
                strFieldName: fieldDefinition.staticName,
                strlistID: listService.getListId(),
                strlistItemID: this.id
            };

            /** Manually set site url if defined, prevents SPServices from making a 
             * blocking call to fetch it.
             */
            if (AP_CONFIG.defaultUrl) {
                payload.webURL = AP_CONFIG.defaultUrl;
            }
            const dataService = injector.get(DataService);
            observables.push(dataService.getFieldVersionHistory(payload, fieldDefinition));
        }

        /** Pause until all requests are resolved */
        return Observable.forkJoin(observables)
            .map((fieldVersionCollections: FieldVersionCollection[]) => {

                let versionHistoryCollection =
                    new VersionHistoryCollection<T>(fieldVersionCollections, listService.factory);

                return versionHistoryCollection;
            });
    }

    /**
     * @ngdoc function
     * @name ListItem.isPristine
     * @description
     * Determines if a list item has changed since it was instantiated.
     * @returns {boolean} The list item is unchanged.
     */
    isPristine() {
        return !this.changes().hasMajorChanges;
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
    resolvePermissions(): IUserPermissionsObject {
        return resolvePermissions(this.permMask);
    }


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
    saveChanges({valuePairs = undefined, buildValuePairs = true} = {}): Observable<T> {
        let listService = this.getListService();

        let config = {
            batchCmd: 'Update',
            buildValuePairs,
            ID: this.id,
            listName: listService.getListId(),
            operation: 'UpdateListItems',
            valuePairs,
            webURL: listService.identifyWebURL()
        };

        /** Redirect if the request is actually creating a new list item.  This can
         * occur if we create an empty item that is instantiated from the listService
         * and then attempt to save instead of using listService.addNewItem
         */
        if (!this.id) {
            return listService.addNewItem(this, { valuePairs, buildValuePairs });
        }

        if (buildValuePairs === true) {

            let editableFields = listService.fields
                .filter((fieldDefinition) => fieldDefinition.readOnly === false);

            config.valuePairs = generateValuePairs(editableFields, this);

        }

        const dataService: DataService = injector.get(DataService);

        /** Notify change service to expect a request, only useful at this point when 
         * working offline */
        registerListItemUpdate<T>(this, config);

        return dataService
            .serviceWrapper(config)
            .map((response: Element) => {
                var listItems = processListItems<T>(response, listService.mapping, listService);

                // Identify updated list item
                let updatedListItem = listItems[0];

                // Optionally broadcast change event
                registerChange(listService, 'update', updatedListItem.id);

                // Resolve with the updated list item
                return updatedListItem;
            });
    }


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
    saveFields(fieldArray: string[]): Observable<T> {

        let listItem = this;
        let listService = listItem.getListService();
        let definitions: IFieldConfigurationObject[] = [];

        if (isString(fieldArray)) {
            throw new Error('Field names should be an array of strings instead' +
                ' of a single string.');
        }

        /** Find the field definition for each of the requested fields */
        for (let fieldName of fieldArray) {

            let match = listService.customFields
                .find((fieldDefinition) => fieldDefinition.mappedName === fieldName);

            if (match) {
                definitions.push(match);
            }

        }

        /** Generate value pairs for specified fields */
        let valuePairs = generateValuePairs(definitions, listItem);

        return this.saveChanges({
            buildValuePairs: false,
            valuePairs
        });
    }


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
    setPristine(listItem?: ListItem<any>): void {
        if (!this.id || !isFunction(this.getPristine)) {
            throw new Error('Unable to find the pristine state for this list item.');
        }
        let pristineState = this.getPristine();

        if (listItem) {
            listItem.constructor(pristineState);
        } else {
            Object.assign(this, pristineState);
        }
    }


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
    startWorkflow(options: IStartWorkflowParams): Observable<any> {
        let listItem = this;
        const dataService = injector.get(DataService);

        /** Set the relative file reference */
        options.fileRef = listItem.fileRef.lookupValue;

        if (!options.templateId && !options.workflowName) {
            throw new Error('Either a templateId or workflowName is required to' +
                ' initiate a workflow.');
        } else if (options.templateId) {
            /** The templateId is already provided so we don't need to look for it */
            return dataService.startWorkflow(options);
        } else {
            /** We first need to get the template GUID for the workflow */
            return listItem.getAvailableWorkflows()
                .flatMap((workflows) => {

                    let targetWorklow = workflows
                        .find((workflow) => workflow.name === options.workflowName);

                    if (!targetWorklow) {
                        throw new Error(`A workflow with the name ${options.workflowName} 
                        wasn't found.  The workflows available are
                        [${workflows.map(workflow => workflow.name).toString()}].`);
                    }

                    /** Create an extended set of options to pass any overrides to DataService */
                    options.templateId = targetWorklow.templateId;

                    return dataService.startWorkflow(options);

                });
        }

    }


    /**
     * @ngdoc function
     * @name ListItem.validateEntity
     * @description
     * Helper function that passes the current item to ListService.validateEntity
     * @returns {boolean} Evaluation of validity.
     */
    validateEntity(): boolean {
        let listItem = this,
            listService = listItem.getListService();
        return listService.validateEntity(listItem);
    }

}


export interface IStartWorkflowParams {
    fileRef?: string;
    item: string;
    templateId: string;
    workflowName?: string;
    workflowParameters?: string;
}
