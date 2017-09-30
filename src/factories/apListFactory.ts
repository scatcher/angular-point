import * as _ from 'lodash';
import { FieldFactory, FieldConfigurationObject, FieldDefinition } from './apFieldFactory';
import { UserPermissionsObject } from '../constants/apPermissionObject';
import { DefaultFields } from '../constants/apDefaultFields';
import { ListItem } from './apListItemFactory';
import { $AP_INJECTOR, ENV } from '../angular-point';

export interface UninstantiatedList {
    customFields: FieldConfigurationObject[];
    environments?: { [key: string]: string };
    guid?: string;
    title: string;
    viewFields?: string;
    webURL?: string;
}

export interface ListFieldMapping {
    [key: string]: {
        mappedName: string;
        objectType: string;
    };
}

/**
 * XML List Object gets converted into JSON object with the following properties.
 */
export interface XMLList {
    AllowDeletion?: string;
    AllowMultiResponses?: string;
    AnonymousPermMask?: string;
    Author?: string;
    BaseType?: string;
    Created?: string;
    DefaultViewUrl?: string;
    Description?: string;
    Direction?: string;
    DocTemplateUrl?: string;
    EmailAlias?: string;
    EnableAttachments?: string;
    EnableFolderCreation?: string;
    EnableMinorVersion?: string;
    EnableModeration?: string;
    EnablePeopleSelector?: string;
    EnableResourceSelector?: string;
    EnableVersioning?: string;
    EnforceDataValidation?: string;
    EventSinkAssembly?: string;
    EventSinkClass?: string;
    EventSinkData?: string;
    ExcludeFromOfflineClient?: string;
    FeatureId?: string;
    Flags?: string;
    HasExternalDataSource?: string;
    HasRelatedLists?: string;
    HasUniqueScopes?: string;
    Hidden?: string;
    ID?: string;
    ImageUrl?: string;
    IrmEnabled?: string;
    IsApplicationList?: string;
    ItemCount?: string;
    LastDeleted?: string;
    MajorVersionLimit?: string;
    MajorWithMinorVersionsLimit?: string;
    MaxItemsPerThrottledOperation?: string;
    Modified?: string;
    MultipleDataList?: string;
    Name?: string;
    NoThrottleListOperations?: string;
    Ordered?: string;
    PreserveEmptyValues?: string;
    ReadSecurity?: string;
    RequireCheckout?: string;
    RootFolder?: string;
    ScopeId?: string;
    SendToLocation?: string;
    ServerTemplate?: string;
    ShowUser?: string;
    StrictTypeCoercion?: string;
    ThrottleListOperations?: string;
    ThumbnailSize?: string;
    Title?: string;
    Version?: string;
    WebFullUrl?: string;
    WebId?: string;
    WebImageHeight?: string;
    WebImageWidth?: string;
    WorkFlowId?: string;
    WriteSecurity?: string;
}

/**
 * @ngdoc object
 * @name List
 * @description
 * List Object Constructor.  This is handled automatically when creating a new model so there shouldn't be
 * any reason to manually call.
 * @param {object} config Initialization parameters.
 * @param {string} config.guid Unique SharePoint GUID for the list we'll be basing the model on
 * ex:'{4D74831A-42B2-4558-A67F-B0B5ADBC0EAC}'
 * @param {string} config.title Maps to the offline XML file in dev folder (no spaces)
 * ex: 'ProjectsList' so the offline XML file would be located at apConfig.offlineXML + 'ProjectsList.xml'
 * @param {object[]} [config.customFields] Mapping of SharePoint field names to the internal names we'll be using
 * in our application.  Also contains field type, readonly attribute, and any other non-standard settings.
 * <pre>
 * [
 *   {
         *       staticName: "Title",
         *       objectType: "Text",
         *       mappedName: "lastName",
         *       readOnly:false
         *   },
 *   {
         *       staticName: "FirstName",
         *       objectType: "Text",
         *       mappedName: "firstName",
         *       readOnly:false
         *   },
 *   {
         *       staticName: "Organization",
         *       objectType: "Lookup",
         *       mappedName: "organization",
         *       readOnly:false
         *   },
 *   {
         *       staticName: "Account",
         *       objectType: "User",
         *       mappedName: "account",
         *       readOnly:false
         *   },
 *   {
         *       staticName: "Details",
         *       objectType: "Text",
         *       mappedName: "details",
         *       readOnly:false
         *   }
 * ]
 * </pre>
 * @property {string} viewFields XML string defining each of the fields to include in all CRUD requests,
 * generated when the Model.List is instantiated.
 * <pre>
 *     <ViewFields>...</ViewFields>
 * </pre>
 * @property {Field[]} fields Generated when the Model.List is instantiated.  Combines the standard
 * default fields for all lists with the fields identified in the config.customFields and instantiates each
 * with the Field constructor.
 * @requires angularPoint.apListFactory
 * @constructor
 */
export class List implements UninstantiatedList, XMLList {
    BaseType?: string; // Only added once a list has been extended with list definition from server
    customFields: FieldDefinition[] = [];
    environments: { [key: string]: string };
    fields: FieldDefinition[] = [];
    guid: string;
    isReady = false;
    mapping: ListFieldMapping = {};
    permissions: UserPermissionsObject;
    title: string;
    viewFields: string;
    WebFullUrl; // Only appears if extended from list definition
    webURL: string;

    constructor(config: UninstantiatedList) {
        this.webURL = ENV.site;
        _.assign(this, config);
        this.environments = this.environments || { production: this.guid };
        this.extendFieldDefinitions();
    }

    /**
     * @description
     * 1. Populates the fields array which uses the Field constructor to combine the default
     * SharePoint fields with those defined in the list definition on the model
     * 2. Creates the list.viewFields XML string that defines the fields to be requested on a query
     *
     * @param {object} list Reference to the list within a model.
     */
    extendFieldDefinitions() {
        // Clear out
        this.viewFields = '';

        const apFieldFactory = $AP_INJECTOR.get<FieldFactory>('apFieldFactory');

        /**
         * Constructs the field
         * - adds to viewField
         * - create ows_ mapping
         * @param fieldDefinition
         */
        const buildField = fieldDefinition => {
            const field = new apFieldFactory.FieldDefinition(fieldDefinition);
            this.fields.push(field);
            this.viewFields += '<FieldRef Name="' + field.staticName + '"/>';
            this.mapping['ows_' + field.staticName] = {
                mappedName: field.mappedName,
                objectType: field.objectType,
            };
        };

        /** Open viewFields */
        this.viewFields += '<ViewFields>';

        /** Add the default fields */
        _.each(DefaultFields, field => buildField(field));

        /** Add each of the fields defined in the model */
        _.each(this.customFields, field => buildField(field));

        /** Close viewFields */
        this.viewFields += '</ViewFields>';
    }

    /**
     * @ngdoc function
     * @name List:extendPermissionsFromListItem
     * @methodOf List
     * @param {ListItem} listItem List item to use as sample of user's permisssions for list.
     * @description
     * If the user permissions haven't been resolved for the list, use the permissions from a
     * sample list item and assume they're the same for the entire list
     * @returns {IUserPermissionsObject} Resolved permissions for the list item.
     */
    extendPermissionsFromListItem(listItem: ListItem<any>): UserPermissionsObject {
        if (!listItem) {
            throw new Error('A valid list item is required in order to extend list permissions.');
        }
        this.permissions = listItem.resolvePermissions();
        return this.permissions;
    }

    /**
     * @ngdoc function
     * @name List:getListId
     * @methodOf List
     * @description
     * Defaults to list.guid.  For a multi-environment setup, we accept a list.environments object with a property for each named
     * environment with a corresponding value of the list guid.  The active environment can be selected
     * by setting apConfig.environment to the string name of the desired environment.
     * @returns {string} List ID.
     */
    getListId(): string {
        return ENV.LIST_IDS[this.title];
    }

    /**
     * @ngdoc function
     * @name List:identifyWebURL
     * @methodOf List
     * @description
     * If a list is extended, use the provided webURL, otherwise use list.webURL.  If never set it will default
     * to apConfig.defaultUrl.
     * @returns {string} webURL param.
     */
    identifyWebURL(): string {
        return this.webURL;
        // return this.WebFullUrl ? this.WebFullUrl : this.webURL;
    }
}

/**
 * @ngdoc service
 * @name angularPoint.apListFactory
 * @description
 * Exposes the List prototype and a constructor to instantiate a new List.
 *
 * @property {constructor} List The List constructor.
 *
 * @requires angularPoint.apConfig
 * @requires angularPoint.apDefaultFields
 * @requires angularPoint.apFieldFactory
 */
export class ListFactory {
    List = List;

    /**
     * @ngdoc function
     * @name angularPoint.apListFactory:create
     * @methodOf angularPoint.apListFactory
     * @param {object} config Options object.
     * @description
     * Instantiates and returns a new List.
     */
    create(config) {
        return new List(config);
    }
}
