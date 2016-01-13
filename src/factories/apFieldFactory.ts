import {FieldService, UtilityService, FormattedFieldValueService} from '../services';
import {ListItem} from '../factories';
import  * as  _ from 'lodash';

export interface XMLFieldDefinition {
    ID?: string;
    Type?: string;
    ReadOnly?: string;
    Hidden?: string;
    DisplayName?: string;
    Required?: string;
    SourceID?: string;
    ColName?: string;
    StaticName?: string;
    Choices?: string[];
    Description?: string;
    Indexed?: string;
    EnforceUniqueValues?: string;
    RowOrdinal?: string;
    Sortable?: string;
    Filterable?: string;
    RelationshipDeleteBehavior?: string;
    List?: string;
    ShowField?: string;
    ResultType?: string;
    FillInChoice?: string;
    Name?: string;
    NumLines?: string;
    RichText?: string;
    Format?: string;
}

export interface FieldConfigurationObject {
    choices?: string[];
    description?: string;
    displayName?: string;
    formatter?: (listItem: ListItem<any>, fieldDefinition: IFieldDefinition, options?: Object) => string;
    label?: string;
    //JS property name that we use to store the value for this field.
    mappedName: string;
    objectType: string;
    readOnly?: boolean;
    required?: boolean;
    staticName: string;
}

// an extended field definition combines the user defined field definition with the XML returned by SharePoint
export interface IFieldDefinition extends XMLFieldDefinition, FieldConfigurationObject {
    getDefaultValueForType(): any;
    getFormattedValue(listItem: ListItem<any>, options?: Object): string;
    getMockData(options): any;
}


/**
 * @ngdoc object
 * @name Field
 * @description
 * Defined in the MODEL.list.fieldDefinitions array.  Each field definition object maps an internal field
 * in a SharePoint list/library to a JavaScript object using the internal SharePoint field name, the field
 * type, and the desired JavaScript property name to add onto the parsed list item object. Ignore shown usage,
 * each field definition is just an object within the fieldDefinitions array.
 * @param {object} obj Field definition.
 * @param {string} obj.staticName The actual SharePoint field name.
 * @param {string} [obj.objectType='Text']
 * <dl>
 *     <dt>Boolean</dt>
 *     <dd>Used to store a TRUE/FALSE value (stored in SharePoint as 0 or 1).</dd>
 *     <dt>Calc</dt>
 *     <dd>";#" Delimited String: The first value will be the calculated column value
 *     type, the second will be the value</dd>
 *     <dt>Choice</dt>
 *     <dd>Simple text string but when processing the initial list definition, we
 *     look for a Choices XML element within the field definition and store each
 *     value.  We can then retrieve the valid Choices with one of the following:
 *     ```var fieldDefinition = LISTITEM.getFieldDefinition('CHOICE_FIELD_NAME');```
 *                                      or
 *     ```var fieldDefinition = MODELNAME.getFieldDefinition('CHOICE_FIELD_NAME');```
 *     ```var choices = fieldDefinition.Choices;```
 *     </dd>
 *     <dt>Counter</dt>
 *     <dd>Same as Integer. Generally used only for the internal ID field. Its integer
 *     value is set automatically to be unique with respect to every other item in the
 *     current list. The Counter type is always read-only and cannot be set through a
 *     form post.</dd>
 *     <dt>Currency</dt>
 *     <dd>Floating point number.</dd>
 *     <dt>DateTime</dt>
 *     <dd>Replace dashes with slashes and the "T" deliminator with a space if found.  Then
 *     converts into a valid JS date object.</dd>
 *     <dt>Float</dt>
 *     <dd>Floating point number.</dd>
 *     <dt>HTML</dt>
 *     <dd>```_.unescape(STRING)```</dd>
 *     <dt>Integer</dt>
 *     <dd>Parses the string to a base 10 int.</dd>
 *     <dt>JSON</dt>
 *     <dd>Parses JSON if valid and converts into a a JS object.  If not valid, an error is
 *     thrown with additional info on specifically what is invalid.</dd>
 *     <dt>Lookup</dt>
 *     <dd>Passes string to Lookup constructor where it is broken into an object containing
 *     a "lookupValue" and "lookupId" attribute.  Inherits additional prototype methods from
 *     Lookup.  See [Lookup](#/api/Lookup) for more information.
 *     </dd>
 *     <dt>LookupMulti</dt>
 *     <dd>Converts multiple delimited ";#" strings into an array of Lookup objects.</dd>
 *     <dt>MultiChoice</dt>
 *     <dd>Converts delimited ";#" string into an array of strings representing each of the
 *     selected choices.  Similar to the single "Choice", the XML Choices are stored in the
 *     field definition after the initial call is returned from SharePoint so we can reference
 *     later.
 *     </dd>
 *     <dt>Number</dt>
 *     <dd>Treats as a float.</dd>
 *     <dt>Text</dt>
 *     <dd>**Default** No processing of the text string from XML.</dd>
 *     <dt>User</dt>
 *     <dd>Similar to Lookup but uses the "User" prototype as a constructor to convert into a
 *     User object with "lookupId" and "lookupValue" attributes.  The lookupId is the site collection
 *     ID for the user and the lookupValue is typically the display name.
 *     See [User](#/api/User) for more information.
 *     </dd>
 *     <dt>UserMulti</dt>
 *     <dd>Parses delimited string to returns an array of User objects.</dd>
 * </dl>
 * @param {string} obj.mappedName The attribute name we'd like to use
 * for this field on the newly created JS object.
 * @param {boolean} [obj.readOnly=false] When saving, we only push fields
 * that are mapped and not read only.
 * @param {boolean} [obj.required=false] Allows us to validate the field to ensure it is valid based
 * on field type.
 * @returns {object} Field
 *
 * @requires angularPoint.apFieldFactory
 * @constructor
 */
export class FieldDefinition implements IFieldDefinition {
    displayName: string;
    formatter: (listItem: ListItem<any>, fieldDefinition: IFieldDefinition, options?: Object) => string;
    internalName: string;
    label: string;
    mappedName: string;
    objectType = 'Text';
    readOnly = false;
    staticName: string;

    constructor(obj) {
        Object.assign(this, obj);
        this.displayName = this.displayName ? this.displayName : UtilityService.fromCamelCase(this.mappedName);

        /** Deprecated internal name and replace with staticName but maintain compatibility */
        this.staticName = this.staticName || this.internalName;
    }

    /**
     * @ngdoc function
     * @name Field:getDefaultValueForType
     * @methodOf Field
     * @description
     * Can return mock data appropriate for the field type, by default it dynamically generates data but
     * the staticValue param will instead return a hard coded type specific value.
     */
    getDefaultValueForType(): any {
        return FieldService.getDefaultValueForType(this.objectType);
    }

    /**
     * @ngdoc function
     * @name Field:getFormattedValue
     * @methodOf Field
     * @description
     * By default uses the formatted field service to convert a field value into a formatted string
     * readable by user.  Optionally can override in field definition with formatter property to return
     * custom formatted value. A good example of this would be to stringify a discussion thread.
     * @param {ListItem<any>} listItem List used to generate field value.
     * @param {object} [options] Pass through to FormattedFieldValueService.getFormattedFieldValue.
     * @returns {string} Formatted field value suitable for outputting to user.
     * @example
     * <pre>
     *  //In model.list.customFields defining a field
     * {
     * 	  mappedName: 'lookup',
     * 	  objectType: 'Lookup',
     *    staticName: 'MyAwesomeLookup',
     * 	  formatter: (listItem: ListItem<any>, fieldDefinition: IFieldDefinition, options?: Object) => {
     * 	  	 return listItem[fieldDefinition.mappedName].lookupValue.toUpperCase();
     * 	  }
     * }
     * </pre>
     */
    getFormattedValue(listItem: ListItem<any>, options?: Object): string {
        //Optionally provide a custom method to convert a field value into a formatted string
        return _.isFunction(this.formatter) ? this.formatter(listItem, this, options) :
            FormattedFieldValueService
                .getFormattedFieldValue(listItem[this.mappedName], this.objectType, options);
    }

    /**
     * @ngdoc function
     * @name Field:getMockData
     * @methodOf Field
     * @param {object} [options] Optional params passed to FieldService.getMockData.
     * @param {boolean} [options.staticValue=false] Default to dynamically build mock data.
     * @returns {*} mockData
     */
    getMockData(options): any {
        return FieldService.getMockData(this.objectType, options);
    }

}
