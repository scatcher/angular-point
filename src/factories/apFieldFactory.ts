/// <reference path="../../typings/ap.d.ts" />

module ap {
    'use strict';

    var apFieldService: FieldService, apUtilityService: UtilityService;

    export interface IFieldDefinition {
        choices?: string[];
        Choices?: string[];
        description?: string;
        Description?: string;
        displayName?: string;
        DisplayName?: string;
        getDefaultValueForType?(): string;
        getDefinition?(): string;
        getMockData?(options?: Object): any;
        label: string;
        mappedName: string;
        objectType: string;
        readOnly?: boolean;
        required?: boolean;
        Required?: boolean;
        staticName: string;
        List?:string;
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
    export class Field implements IFieldDefinition{
        displayName;
        internalName;
        label;
        mappedName;
        objectType;
        staticName;
        constructor(obj) {
            var self = this;
            var defaults = {
                readOnly: false,
                objectType: 'Text'
            };
            _.extend(self, defaults, obj);
            self.displayName = self.displayName ? self.displayName : apUtilityService.fromCamelCase(self.mappedName);
            /** Deprecated internal name and replace with staticName but maintain compatibility */
            self.staticName = self.staticName || self.internalName;
        }

        /**
         * @ngdoc function
         * @name Field:getDefaultValueForType
         * @methodOf Field
         * @description
         * Returns an object defining a specific field type
         * @returns {object} { defaultValue: '...':string, staticMock: '...':string, dynamicMock: ...:Function}
         */
        getDefinition() {
            return apFieldService.getDefinition(this.objectType);
        }

        /**
         * @ngdoc function
         * @name Field:getDefaultValueForType
         * @methodOf Field
         * @description
         * Can return mock data appropriate for the field type, by default it dynamically generates data but
         * the staticValue param will instead return a hard coded type specific value.
         */
        getDefaultValueForType() {
            return apFieldService.getDefaultValueForType(this.objectType);
        }

        /**
         * @ngdoc function
         * @name Field:getMockData
         * @methodOf Field
         * @param {object} [options] Optional params passed to apFieldService.getMockData.
         * @param {boolean} [options.staticValue=false] Default to dynamically build mock data.
         * @returns {*} mockData
         */
        getMockData (options) {
            return apFieldService.getMockData(this.objectType, options);
        }
    }

    /**
     * @ngdoc service
     * @name angularPoint.apFieldFactory
     * @description
     * Contains the Field constructor and prototype definitions.
     * @property {constructor} Field The Field constructor.
     *
     * @requires angularPoint.apFieldService
     * @requires angularPoint.apUtilityService
     *
     */
    export class FieldFactory{
        Field = Field;
        constructor($injector) {
            apFieldService = $injector.get('apFieldService');
            apUtilityService = $injector.get('apUtilityService');
        }
    }


    angular
        .module('angularPoint')
        .service('apFieldFactory', FieldFactory);

}
