import {CacheService, DataService, DecodeService, EncodeService, UtilityService, ChangeService} from '../services';
import {APConfig, IUserPermissionsObject} from '../constants';
import {FieldChangeSummary,
    VersionHistoryCollection,
    User,
    Lookup,
    IndexedCache,
    Query,
    Model,
    List
} from '../factories';
import {ChangeSummary} from './apListItemVersionFactory';
import {IFieldDefinition} from './apFieldFactory';
import {FieldVersionCollection} from './apListItemVersionFactory';
import {Promise} from 'es6-promise';
import {IWorkflowDefinition, IStartWorkflowParams} from '../interfaces/main';
import  _ from 'lodash';


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

// standard uninstantiated list item with helper methods required to instantiate with model factory
export interface IUninstantiatedExtendedListItem<T extends ListItem<any>> extends IUninstantiatedListItem {
    getCache?: () => IndexedCache<T>;
    getQuery?: () => Query<T>;
}


/**
 * @ngdoc object
 * @name ListItem
 * @description
 * Base prototype which all list items inherit from.  All methods can be accessed through this prototype so all CRUD
 * functionality can be called directly from a given list item.
 * @constructor
 */
export class ListItem<T> implements IUninstantiatedExtendedListItem<T> {
    author:User;
    created:Date;
    editor:User;
    fileRef:Lookup<T>;
    getCache:() => IndexedCache<T>;
    getModel:<M extends Model>() => M;
    getPristine:() => IUninstantiatedListItem;
    getQuery:() => Query<T>;
    id:number;
    modified:Date;
    permMask:string;
    uniqueId:string;
    private preDeleteAction:() => boolean;
    private preSaveAction:() => boolean;
    private postSaveAction:() => void;


    /**
     * @ngdoc function
     * @name ListItem.changes
     * @description
     * Checks a given list item compared to its pristine state and retuns a field change summary
     * with information on any significant changes to non-readonly fields.
     * @returns {FieldChangeSummary<T>} Change summary of all fields that have been modified
     * since last save.
     */
    changes():FieldChangeSummary<T> {
        //Instantiate a copy of the original list item for comparrison
        let pristineListItem = _.cloneDeep<{ id: number }>(this.getPristine());
        if (!pristineListItem) {
            throw new Error('Could not retrieve a pristine version of this list item.');
        }
        //Remove id so when we instantiate we don't register in cache
        pristineListItem.id = undefined;
        //Need to instantiate using the same factory as the current list item
        let factory:Function = this.constructor;
        let instantiatedPristineListItem = new factory(pristineListItem);

        return new FieldChangeSummary(this, instantiatedPristineListItem);
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
     *     let confirmation = window.confirm("Are you sure you want to delete this file?");
     *     if (confirmation) {
     *         scope.listItem.deleteAttachment(attachment).then(function () {
     *             alert("Attachment successfully deleted");
     *         });
     *     }
     * };
     * </pre>
     */
    deleteAttachment(url:string):Promise<any> {

        return DataService.serviceWrapper({
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
     * Deletes record directly from the object and removes record from user cache.
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
    deleteItem():Promise<any> {
        let listItem = this;
        let model = listItem.getModel();

        let config = {
            operation: 'UpdateListItems',
            listName: model.getListId(),
            batchCmd: 'Delete',
            ID: listItem.id,
            valuePairs: undefined,
            webURL: model.list.identifyWebURL()
        };

        let promise = new Promise((resolve, reject) => {
            if (_.isFunction(listItem.preDeleteAction) && !listItem.preDeleteAction()) {
                //preDeleteAction exists but returned false so we don't delete
                reject('Pre-Delete Action Returned False');
            } else {

                /** Check to see if list item or document because documents need the FileRef as well as id to delete */
                if (listItem.fileRef && listItem.fileRef.lookupValue) {
                    let fileExtension = listItem.fileRef.lookupValue.split('.').pop();
                    if (_.isNaN(fileExtension)) {
                        /** File extension instead of numeric extension so it's a document
                         * @Example
                         * Document: "Site/library/file.csv"
                         * List Item: "Site/List/5_.000"
                         */
                        config.valuePairs = [['FileRef', listItem.fileRef.lookupValue]];

                    }
                }

                DataService.serviceWrapper(config)
                    .then((response) => {
                        /** Optionally broadcast change event */
                        UtilityService.registerChange(model, 'delete', listItem.id);

                        /** Success */
                        CacheService.deleteEntity(config.listName, listItem.id);

                        resolve(response);
                    })
                    .catch((err) => {
                        //In the event of an error, display toast
                        let msg = 'There was an error deleting list item ' + listItem.id + ' from ' + model.list.title +
                            ' due to the following Error: ' + err;
                        reject(msg);
                    });
            }
        });


        return promise;
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
     * let fetchAttachments = function (listItem) {
     *     listItem.getAttachmentCollection()
     *         .then(function (attachments) {
     *             scope.attachments = attachments;
     *         });
     * };
     * </pre>
     */
    getAttachmentCollection():Promise<string[]> {
        let listItem = this;
        return DataService.getCollection({
            operation: 'GetAttachmentCollection',
            listName: listItem.getListId(),
            webURL: listItem.getList().webURL,
            ID: listItem.id,
            filterNode: 'Attachment'
        });
    }


    /**
     * @ngdoc function
     * @name ListItem.getAvailableWorkflows
     * @description
     * Wrapper for DataService.getAvailableWorkflows.  Simply passes the current item in.
     * @returns {promise} Array of objects defining each of the available workflows.
     */
    getAvailableWorkflows():Promise<IWorkflowDefinition[]> {
        let listItem = this;
        return DataService.getAvailableWorkflows(listItem.fileRef.lookupValue);
    }


    /**
     * @ngdoc function
     * @name ListItem.getChanges
     * @description
     * Wrapper for model.getListItemById.  Queries server for any changes and extends the existing
     * list item with those changes.
     * @returns {promise} Promise which resolves with the updated list item.
     */
    getChanges():Promise<T> {
        let model = this.getModel();
        return model.getListItemById(this.id);
    }


    /**
     * @ngdoc function
     * @name ListItem.getChangeSummary
     * @description
     * Uses ListItem.getVersionHistory and determines what information changed between each list item
     * version.
     * @param {string[]} [fieldNames] An array/single string of field names on the list item to fetch a version
     * history for.
     * @returns {Promise<ChangeSummary<T>>} Promise which resolves with an array of list item versions.
     * @example
     * Assuming we have a modal form where we want to display each version of the title and project fields
     * of a given list item.
     * <pre>
     * myGenericListItem.getChangeSummary(['title', 'project'])
     *     .then(function(changeSummary: ChangeSummary) {
     *            // We now have an array of every version of these fields
     *            vm.changeSummary = changeSummary;
     *      };
     * </pre>
     */
    getChangeSummary(fieldNames?:string[]):Promise<ChangeSummary<T>> {
        return this.getVersionHistory(fieldNames)
            .then((versionHistoryCollection:VersionHistoryCollection<T>) => versionHistoryCollection.generateChangeSummary());
    }

    /**
     * @ngdoc function
     * @name ListItem.getFieldChoices
     * @param {string} fieldName Internal field name.
     * @description
     * Uses the field definition defined in the model to attempt to find the choices array for a given Lookup or
     * MultiLookup type field.  The default value is fieldDefinition.choices which can optionally be added to a
     * given field definition.  If this isn't found, we check fieldDefinition.Choices which is populated after a
     * GetListItemsSinceToken operation or a Model.extendListMetadata operation.  Finally if that isn't available
     * we return an empty array.
     * @returns {string[]} An array of choices for a Choice or MultiChoice type field.
     */
    getFieldChoices(fieldName:string):string[] {
        let listItem = this;
        let fieldDefinition = listItem.getFieldDefinition(fieldName);
        return fieldDefinition.choices || fieldDefinition.Choices || [];
    }


    /**
     * @ngdoc function
     * @name ListItem.getFieldDefinition
     * @description
     * Returns the field definition from the definitions defined in the custom fields array within a model.
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
    getFieldDefinition(fieldName:string):IFieldDefinition {
        let listItem = this;
        return listItem.getModel().getFieldDefinition(fieldName);
    }


    /**
     * @ngdoc function
     * @name ListItem.getFieldDescription
     * @param {string} fieldName Internal field name.
     * @description
     * Uses the field definition defined in the model to attempt to find the description for a given field.  The default
     * value is fieldDefinition.Description which is populated after a GetListItemsSinceToken operation or a
     * Model.extendListMetadata operation.  If this isn't available we look for an optional attribute of a field
     * fieldDefinition.description.  Finally if that have anything it returns an empty string.
     * @returns {string} The description for a given field object.
     */
    getFieldDescription(fieldName:string):string {
        let listItem = this;
        let fieldDefinition = listItem.getFieldDefinition(fieldName);
        return fieldDefinition.description || fieldDefinition.Description || '';
    }


    /**
     * @ngdoc function
     * @name ListItem.getFieldLabel
     * @param {string} fieldName Internal field name.
     * @description
     * Uses the field definition defined in the model to attempt to find the label for a given field.  The default
     * value is fieldDefinition.label.  If not available it will then use fieldDefinition.DisplayName which is
     * populated after a GetListItemsSinceToken operation or a Model.extendListMetadata operation.  If this isn't
     * available it will fallback to the the fieldDefinition.DisplayName which is a best guess at converting the
     * caml case version of the mapped name using UtilityService.fromCamelCase.
     * @returns {string} The label for a given field object.
     */
    getFieldLabel(fieldName:string):string {
        let listItem = this;
        let fieldDefinition = listItem.getFieldDefinition(fieldName);
        return fieldDefinition.label || fieldDefinition.DisplayName || fieldDefinition.displayName;
    }


    /**
     * @ngdoc function
     * @name ListItem.getFormattedValue
     * @description
     * Given the attribute name on a listItem, we can lookup the field type and from there return a formatted
     * string representation of that value.
     * @param {string} fieldName Attribute name on the object that contains the value to stringify.
     * @param {object} [options] Pass through to apFormattedFieldValueService.getFormattedFieldValue or any
     * custom method specified on the field definition.
     * @returns {string} Formatted string representing the field value.
     */
    getFormattedValue(fieldName:string, options?:Object):string {
        let listItem = this;
        let fieldDefinition = listItem.getFieldDefinition(fieldName);
        if (!fieldDefinition) {
            throw new Error(`A field definition for a field named ${fieldName} wasn't found.`);
        }
        return fieldDefinition.getFormattedValue(this, options);
    }


    /**
     * @ngdoc function
     * @name ListItem.getList
     * @description
     * Abstraction to allow logic in model to be used instead of defining the list location in more than one place.
     * @returns {object} List for the list item.
     */
    getList():List {
        let model:Model = this.getModel();
        return model.getList();
    }


    /**
     * @ngdoc function
     * @name ListItem.getListId
     * @description
     * Allows us to reference the list ID directly from the list item.  This is added to the
     * model.factory prototype in apModelFactory.
     * @returns {string} List ID.
     */
    getListId():string {
        let model = this.getModel();
        return model.getListId();
    }


    /**
     * @ngdoc function
     * @name ListItem.getLookupReference
     * @description
     * Allows us to retrieve the listItem being referenced in a given lookup field.
     * @param {string} fieldName Name of the lookup property on the list item that references a listItem.
     * @param {number} [lookupId=listItem.fieldName.lookupId] The listItem.lookupId of the lookup object.  This allows us to also use this logic
     * on a multi-select by iterating over each of the lookups.
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
     * //To get the location listItem
     * let listItem = project.getLookupReference('location');
     * </pre>
     * @returns {object} The listItem the lookup is referencing or undefined if not in the cache.
     */
    getLookupReference<T2 extends ListItem<any>>(fieldName:string, lookupId?:number):T2 {
        let listItem = this;
        let lookupReference;
        if (_.isUndefined(fieldName)) {
            throw new Error('A field name is required.');
        } else if (_.isEmpty(listItem[fieldName])) {
            lookupReference = '';
        } else {
            let model = listItem.getModel();
            let fieldDefinition = model.getFieldDefinition(fieldName);
            /** Ensure the field definition has the List attribute which contains the GUID of the list
             *  that a lookup is referencing.
             */
            if (fieldDefinition && fieldDefinition.List) {
                let targetId = lookupId || listItem[fieldName].lookupId;
                lookupReference = CacheService.getCachedEntity(fieldDefinition.List, targetId);
            } else {
                throw new Error(`This isn't a valid Lookup field or the field definitions need to be extended
                        before we can complete this request.`);
            }
        }
        return lookupReference;

    }


    /**
     * @ngdoc function
     * @name ListItem.getVersionHistory
     * @description
     * Takes an array of field names, finds the version history for field, and returns a snapshot of the object at each
     * version.  If no fields are provided, we look at the field definitions in the model and pull all non-readonly
     * fields.  The only way to do this that I've been able to get working is to get the version history for each
     * field independently and then build the history by combining the server responses for each requests into a
     * snapshot of the object.  Each version has the standard modified date but also includes a version property with
     * the version number.
     * @param {string[]} [properties] An array of property names on the list item
     * that we're interested in.
     * @returns {Promise<VersionHistoryCollection<T>>} Promise which resolves with an object with keys=version
     * and values = ListItemVersion.
     * @example
     * Assuming we have a modal form where we want to display each version of the title and project fields
     * of a given list item.
     * <pre>
     * myGenericListItem.getVersionHistory(['title', 'project'])
     *     .then(function(versionHistory) {
     *            // We now have an array of every version of these fields
     *            vm.versionHistory = versionHistory;
     *      })
     *      .catch(function(err) {
     *          // Do something with the error
     *      });
     * </pre>
     */
    getVersionHistory(properties?:string[]):Promise<VersionHistoryCollection<T>> {
        let listItem = this;
        let model = listItem.getModel();
        let promiseArray = [];

        if (properties && !_.isArray(properties)) {
            throw new Error('Properties are required to be formatted as an array of strings.');
        }
        if (!properties) {
            /** If fields aren't provided, pull the version history for all NON-readonly fields */
            let targetFields = model.list.fields.filter(fieldDefinition => fieldDefinition.readOnly === false);
            properties = targetFields.map(fieldDefinition => fieldDefinition.mappedName);
        }

        /** Generate promises for each field */
        for (let p:string of properties) {
            let promise = createPromise(p);
            promiseArray.push(promise);
        }

        /** Pause until all requests are resolved */
        return Promise.all(promiseArray)
            .then((fieldVersionCollections:FieldVersionCollection[]) => {
                let versionHistoryCollection = new VersionHistoryCollection<T>(fieldVersionCollections, model.factory);
                return versionHistoryCollection;
            });

        /** Constructor that creates a promise for each field */
        function createPromise(prop:string) {

            let fieldDefinition = listItem.getFieldDefinition(prop);

            let payload = {
                operation: 'GetVersionCollection',
                strListID: model.getListId(),
                strListItemID: listItem.id,
                strFieldName: fieldDefinition.staticName,
                webURL: undefined
            };

            /** Manually set site url if defined, prevents SPServices from making a blocking call to fetch it. */
            if (APConfig.defaultUrl) {
                payload.webURL = APConfig.defaultUrl;
            }

            return DataService.getFieldVersionHistory<T>(payload, fieldDefinition);
        }
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
     * @name ListItem.prototype.registerPreDeleteAction
     * @param {Function} action Function that accepts no arguments and returns a boolean determining if delete can continue.
     * @returns {Function} Function that can be called to unregister.
     * @description
     * Register a function on the list item prototype that is executed prior to deleting.  Good use case
     * is to perform cleanup prior to deleting or determining if user can delete.  Method returns boolean and if
     * true delete will continue, otherwise delete is prevented. There is no ListItem.registerPostDeleteAction because
     * the list item no longer exists.
     *
     * @example
     * <pre>
     * //In example projectsModel.ts
     *  export class Project extends ap.ListItem<Project>{
     *      title: string;
     *      users: User[];
     *      ...some other expected attributes
     *      constructor(obj) {
     *          super(obj);
     *          Object.assign(this, obj);
     *      }
     *  }
     *
     *  let unregister = Project.prototype.registerPreDeleteAction(function() {
     *      //Do some validation here and return true if user can delete
     *      //otherwise return false to prevent delete action
     *  });
     *
     *  //At some point in the future if no longer necessary
     *  unregister();
     *
     * </pre>
     */
    registerPreDeleteAction(action:() => boolean):() => void {
        this.preDeleteAction = action;
        //Return function to unregister
        return () => this.preDeleteAction = undefined;
    }


    /**
     * @ngdoc function
     * @name ListItem.prototype.registerPreSaveAction
     * @param {Function} action Function that accepts no arguments and returns a boolean determining is save can continue.
     * @returns {Function} Function that can be called to unregister.
     * @description
     * Register a function on the list item prototype that is executed prior to saving.  Good use case
     * is to validate list item or perform cleanup prior to saving.  Method returns boolean and if
     * true save will continue, otherwise save is prevented.
     *
     * @example
     * <pre>
     * //In example projectsModel.ts
     *  export class Project extends ap.ListItem<Project>{
     *      title: string;
     *      users: User[];
     *      ...some other expected attributes
     *      constructor(obj) {
     *          super(obj);
     *          Object.assign(this, obj);
     *      }
     *  }
     *
     *  let unregister = Project.prototype.registerPreSaveAction(function() {
     *      //Do some validation here and return true if user can save
     *      //otherwise return false to prevent save action
     *  });
     *
     *  //At some point in the future if no longer necessary
     *  unregister();
     *
     * </pre>
     */
    registerPreSaveAction(action:() => boolean):() => void {
        this.preSaveAction = action;
        //Return function to unregister
        return () => this.preSaveAction = undefined;
    }

    /**
     * @ngdoc function
     * @name ListItem.prototype.registerPostSaveAction
     * @param {Function} action Callback function that accepts no arguments, returns nothing, and is called
     * after a list item has completed saving.
     * @returns {Function} Function that can be called to unregister.
     * @description
     * Register a function on the model prototype that is executed after saving.  Good use case
     * is to perform cleanup after save.
     *
     * @example
     * <pre>
     * //In example projectsModel.ts
     *  export class Project extends ap.ListItem<Project>{
     *      title: string;
     *      users: User[];
     *      ...some other expected attributes
     *      constructor(obj) {
     *          super(obj);
     *          Object.assign(this, obj);
     *      }
     *  }
     *
     *  let unregister = Project.prototype.registerPostSaveAction(function() {
     *      //Use this method to perform any cleanup after save event
     *      //for any list item of this type
     *  });
     *
     *  //At some point in the future if no longer necessary
     *  unregister();
     *
     * </pre>
     */
    registerPostSaveAction(action:() => void):() => void {
        this.postSaveAction = action;
        //Return function to unregister
        return () => delete this.postSaveAction;
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
     * let canUserEdit = function(task) {
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
    resolvePermissions():IUserPermissionsObject {
        return UtilityService.resolvePermissions(this.permMask);
    }


    /**
     * @ngdoc function
     * @name ListItem.saveChanges
     * @description
     * Updates record directly from the object
     * @param {object} [options] Optionally pass params to the data service.
     * @param {boolean} [options.updateAllCaches=false] Search through the cache for each query to ensure listItem is
     * updated everywhere.  This is more process intensive so by default we only update the cached listItem in the
     * cache where this listItem is currently stored.
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
    saveChanges({ target = this.getCache ? this.getCache() : new IndexedCache<T>(), valuePairs = undefined, buildValuePairs = true } = {}):Promise<T> {
        let listItem = this;
        let model = listItem.getModel();

        let config = {
            batchCmd: 'Update',
            buildValuePairs,
            ID: listItem.id,
            listName: model.getListId(),
            operation: 'UpdateListItems',
            target,
            valuePairs,
            webURL: model.list.identifyWebURL()
        };

        let promise = new Promise((resolve, reject) => {
            if (_.isFunction(listItem.preSaveAction) && !listItem.preSaveAction()) {
                //preSaveAction exists but returned false so we don't save
                reject('Pre-Save Action Returned False');
            } else {
                //Either no preSaveAction registered or it passed validation

                /** Redirect if the request is actually creating a new list item.  This can occur if we create
                 * an empty item that is instantiated from the model and then attempt to save instead of using
                 * model.addNewItem
                 */
                if (!listItem.id) {
                    return model.addNewItem(listItem, {target, valuePairs, buildValuePairs});
                }

                if (buildValuePairs === true) {
                    let editableFields = model.list.fields.filter((fieldDefinition) => fieldDefinition.readOnly === false);
                    config.valuePairs = EncodeService.generateValuePairs(editableFields, listItem);
                }

                DataService.serviceWrapper(config)
                    .then((response:Document) => {
                        var indexedCache = DecodeService.processListItems<T>(model, listItem.getQuery<T>(), response, config);

                        //Identify updated list item
                        let updatedListItem = indexedCache.get(listItem.id);

                        /** Optionally broadcast change event */
                        UtilityService.registerChange(model, 'update', updatedListItem.id);

                        //Optionally perform any post save cleanup if registered
                        if (_.isFunction(listItem.postSaveAction)) {
                            listItem.postSaveAction();
                        }

                        //Resolve with the updated list item
                        resolve(updatedListItem);
                    });

                /** Notify change service to expect a request, only useful at this point when working offline */
                ChangeService.registerListItemUpdate<T>(listItem, config, promise);


            }
        });


        return promise;
    }


    /**
     * @ngdoc function
     * @name ListItem.saveFields
     * @description
     * Saves a named subset of fields back to SharePoint.  This is an alternative to saving all fields.
     * @param {string[]} fieldArray Array of internal field names that should be saved to SharePoint.
     * @param {object} [options] Optionally pass params to the data service.
     * @returns {object} Promise which resolves with the updated list item from the server.
     * @example
     * <pre>
     * // Example of saveFields function on a fictitious
     * // app/modules/tasks/TaskDetailsCtrl.js modal form.
     * // Similar to saveChanges but instead we only save
     * // specified fields instead of pushing everything.
     * $scope.updateStatus = function(task) {
     *      task.saveFields(['status', 'notes'])
     *          .then(function(updatedListItem) {
     *              // Successfully updated the status and
     *              // notes fields for the given task
     *
     *          })
     *          .catch(function(err) {
     *              // Failure to update the field
     *
     *          });
     * }
     * </pre>
     */
    saveFields(fieldArray:string[], { target = this.getCache ? this.getCache() : new IndexedCache<T>() } = {}):Promise<T> {

        let listItem = this;
        let model = listItem.getModel();
        let definitions:IFieldDefinition[] = [];

        if (_.isString(fieldArray)) {
            console.warn('Field names should be an array of strings instead of a single string.  This will be deperecated.');
        }
        /** Allow a string to be passed in to save a single field */
        let fieldNames = _.isString(fieldArray) ? [fieldArray] : fieldArray;

        /** Find the field definition for each of the requested fields */
        for (let fieldName of fieldNames) {
            let match = model.list.customFields.find((fieldDefinition) => fieldDefinition.mappedName === fieldName);
            if (match) {
                definitions.push(match);
            }
        }

        /** Generate value pairs for specified fields */
        let valuePairs = EncodeService.generateValuePairs(definitions, listItem);

        return this.saveChanges({
            buildValuePairs: false,
            target,
            valuePairs
        });
    }


    /**
     * @ngdoc function
     * @name ListItem.setPristine
     * @param {ListItem} [listItem] Optionally pass list item object back to the list item constructor to
     * run any initialization logic.  Otherwise we just overwrite existing values on the object with a copy from the
     * original object.
     * @description
     * Resets all list item properties back to a pristine state but doesn't update any properties added
     * manually to the list item.
     */
    setPristine(listItem?:ListItem<any>):void {
        if (!this.id || !_.isFunction(this.getPristine)) {
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
     * Given a workflow name or templateId we initiate a given workflow using DataService.startWorkflow.
     * @param {object} options Params for method and pass through options to DataService.startWorkflow.
     * @param {string} [options.templateId] Used to directly start the workflow without looking up the templateId.
     * @param {string} [options.workflowName] Use this value to lookup the templateId and then start the workflow.
     * @returns {promise} Resolves with server response.
     */
    startWorkflow(options:IStartWorkflowParams):Promise<any> {
        let listItem = this;

        /** Set the relative file reference */
        options.fileRef = listItem.fileRef.lookupValue;

        let promise = new Promise((resolve, reject) => {
            if (!options.templateId && !options.workflowName) {
                throw new Error('Either a templateId or workflowName is required to initiate a workflow.');
            } else if (options.templateId) {
                /** The templateId is already provided so we don't need to look for it */
                initiateRequest();
            } else {
                /** We first need to get the template GUID for the workflow */
                listItem.getAvailableWorkflows()
                    .then((workflows) => {
                        let targetWorklow = workflows.find((workflow) => workflow.name === options.workflowName);
                        if (!targetWorklow) {
                            throw new Error(`A workflow with the name ${options.workflowName} wasn't found.  The workflows available are [${workflows.map(workflow => workflow.name).toString() }].`);
                        }
                        /** Create an extended set of options to pass any overrides to DataService */
                        options.templateId = targetWorklow.templateId;
                        initiateRequest();
                    });
            }

            function initiateRequest() {
                DataService.startWorkflow(options)
                    .then((xmlResponse) => {
                        resolve(xmlResponse);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }

        });

        return promise;

    }


    /**
     * @ngdoc function
     * @name ListItem.validateEntity
     * @description
     * Helper function that passes the current item to Model.validateEntity
     * @returns {boolean} Evaluation of validity.
     */
    validateEntity():boolean {
        let listItem = this,
            model = listItem.getModel();
        return model.validateEntity(listItem);
    }

}


/** In the event that a factory isn't specified, just use a
 * standard constructor to allow it to inherit from ListItem
 */
export class StandardListItem {
    constructor(obj?:Object) {
        Object.assign(this, obj);
    }
}
