import {APConfig, DefaultFields, IUserPermissionsObject} from '../constants';
import {FieldDefinition, ListItem} from '../factories';
import {IFieldDefinition, FieldConfigurationObject} from './apFieldFactory';
import  * as  _ from 'lodash';

export interface IUninstantiatedList {
    customFields: FieldConfigurationObject[];
    environments?: { [key: string]: string };
    guid?: string;
    title: string;
    viewFields?: string;
    webURL?: string;
}

export interface IListFieldMapping {
    [key: string]: {
        mappedName: string;
        objectType: string;
    };
}

/**
 * XML List Object gets converted into JSON object with the following properties.
 */
export interface IXMLList {
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

export interface IList extends IUninstantiatedList, IXMLList {
    customFields: IFieldDefinition[];
    environments: { [key: string]: string };
    fields: IFieldDefinition[];
    guid: string;
    isReady: boolean;
    mapping?: IListFieldMapping;
    permissions?: IUserPermissionsObject;
    title: string;
    viewFields?: string;
    webURL?: string;
    getListId(): string;
    identifyWebURL(): string;
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
 * ex: 'ProjectsList' so the offline XML file would be located at APConfig.offlineXML + 'ProjectsList.xml'
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
export class List implements IList {
    customFields: IFieldDefinition[] = [];
    environments: { [key: string]: string };
    fields: IFieldDefinition[] = [];
    guid: string;
    isReady = false;
    mapping: IListFieldMapping = {};
    permissions: IUserPermissionsObject;
    title: string;
    viewFields: string;
    WebFullUrl; // only appears if extended from list definition
    webURL: string;

    constructor(config: IUninstantiatedList) {
        this.webURL = APConfig.defaultUrl;
        Object.assign(this, config);
        this.environments = this.environments || {production: this.guid};
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
        // clear out
        this.viewFields = '';

        /**
         * Constructs the field
         * - adds to viewField
         * - create ows_ mapping
         * @param fieldDefinition
         */
        var buildField = (fieldDefinition) => {
            var field = new FieldDefinition(fieldDefinition);
            this.fields.push(field);
            this.viewFields += '<FieldRef Name="' + field.staticName + '"/>';
            this.mapping['ows_' + field.staticName] = {
                mappedName: field.mappedName,
                objectType: field.objectType
            };
        };

        /** Open viewFields */
        this.viewFields += '<ViewFields>';

        /** Add the default fields */
        for (let field of DefaultFields) {
            buildField(field);
        }

        /** Add each of the fields defined in the model */
        for (let field of this.customFields) {
            buildField(field);
        }

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
    extendPermissionsFromListItem(listItem: ListItem<any>): IUserPermissionsObject {
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
     * by setting APConfig.environment to the string name of the desired environment.
     * @returns {string} List ID.
     */
    getListId(): string {
        if (_.isString(this.environments[APConfig.environment])) {
            /**
             * For a multi-environment setup, we accept a list.environments object with a property for each named
             * environment with a corresponding value of the list guid.  The active environment can be selected
             * by setting APConfig.environment to the string name of the desired environment.
             */
            return this.environments[APConfig.environment];
        } else {
            throw new Error('There isn\'t a valid environment definition for APConfig.environment=' + APConfig.environment + '  ' +
                'Please confirm that the list "' + this.title + '" has the necessary environmental configuration.');
        }
    }

    /**
     * @ngdoc function
     * @name List:identifyWebURL
     * @methodOf List
     * @description
     * If a list is extended, use the provided webURL, otherwise use list.webURL.  If never set it will default
     * to APConfig.defaultUrl.
     * @returns {string} webURL param.
     */
    identifyWebURL(): string {
        return this.WebFullUrl ? this.WebFullUrl : this.webURL;
    }

}
