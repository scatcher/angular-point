'use strict';

/**
 * @ngdoc object
 * @name angularPoint.apListFactory
 * @description
 * Exposes the List prototype and a constructor to instantiate a new List.
 *
 * @requires angularPoint.apConfig
 * @requires angularPoint.apFieldService
 */
angular.module('angularPoint')
    .factory('apListFactory', function (_, apConfig, apFieldService) {

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
         * See [List.customFields](#/api/List.FieldDefinition) for additional info on how to define a field type.
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
         * @constructor
         */
        function List(config) {
            var list = this;
            var defaults = {
                viewFields: '',
                customFields: [],
                isReady: false,
                fields: [],
                guid: '',
                mapping: {},
                title: '',
                webURL: apConfig.defaultUrl
            };

            _.extend(list, defaults, config);

            list.environments = list.environments || {production: list.guid};

            apFieldService.extendFieldDefinitions(list);
        }

        List.prototype.getListId = getListId;


        function getListId() {
            var list = this;
            if (_.isString(list.environments[apConfig.environment])) {
                /**
                 * For a multi-environment setup, we accept a list.environments object with a property for each named
                 * environment with a corresponding value of the list guid.  The active environment can be selected
                 * by setting apConfig.environment to the string name of the desired environment.
                 */
                return list.environments[apConfig.environment];
            } else {
                throw new Error('There isn\'t a valid environment definition for apConfig.environment=' + apConfig.environment + '  ' +
                'Please confirm that the list "' + list.title + '" has the necessary environmental configuration.');
            }
        }

        /**
         * @ngdoc object
         * @name List.FieldDefinition
         * @property {string} staticName The actual SharePoint field name.
         * @property {string} [objectType='Text']
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
         * @property {string} mappedName The attribute name we'd like to use
         * for this field on the newly created JS object.
         * @property {boolean} [readOnly=false] When saving, we only push fields
         * that are mapped and not read only.
         * @property {boolean} [required=false] Allows us to validate the field to ensure it is valid based
         * on field type.

         * @description
         * Defined in the MODEL.list.fieldDefinitions array.  Each field definition object maps an internal field
         * in a SharePoint list/library to a JavaScript object using the internal SharePoint field name, the field
         * type, and the desired JavaScript property name to add onto the parsed list item object. Ignore shown usage,
         * each field definition is just an object within the fieldDefinitions array.
         *
         * @example
         * <pre>
         * angular.module('App')
         *  .service('taskerModel', function (apModelFactory) {
         *     // Object Constructor (class)
         *     // All list items are passed to the below constructor which inherits from
         *     // the ListItem prototype.
         *     function Task(obj) {
         *         var self = this;
         *         _.extend(self, obj);
         *     }
         *
         *     // Model Constructor
         *     var model = apModelFactory.create({
         *         factory: Task,
         *         list: {
         *             // Maps to the offline XML file in dev folder (no spaces)
         *             name: 'Tasks',
         *             // List GUID can be found in list properties in SharePoint designer
         *             guid: '{CB1B965E-D952-4ED5-86FD-FF8DA770F871}',
         *             customFields: [
         *                 // Array of objects mapping each SharePoint field to a
         *                 // property on a list item object
         *                 {
         *                  staticName: 'Title',
         *                  objectType: 'Text',
         *                  mappedName: 'title',
         *                  readOnly:false
         *                 },
         *                 {
         *                  staticName: 'Project',
         *                  objectType: 'Lookup',
         *                  mappedName: 'project',
         *                  readOnly:false
         *                 },
         *                 {
         *                  staticName: 'Priority',
         *                  objectType: 'Choice',
         *                  mappedName: 'priority',
         *                  readOnly:false
          *                },
         *                 {
         *                  staticName: 'Description',
         *                  objectType: 'Text',
         *                  mappedName: 'description',
         *                  readOnly:false
         *                 },
         *                 {
         *                  staticName: 'Manager',
         *                  objectType: 'Lookup',
         *                  mappedName: 'requirement',
         *                  readOnly:false
         *                 }
         *             ]
         *         }
         *     });
         *
         *     // Fetch data (pulls local xml if offline named model.list.title + '.xml')
         *     // Initially pulls all requested data.  Each subsequent call just pulls
         *     // records that have been changed, updates the model, and returns a reference
         *    // to the updated data array
         *     // @returns {Array} Requested list items
         *     model.registerQuery({name: 'primary'});
         *
         *     return model;
         * });
         * </pre>
         *
         */


        /**
         * @ngdoc function
         * @name angularPoint.apListFactory:create
         * @methodOf angularPoint.apListFactory
         * @param {object} config Options object.
         * @description
         * Instantiates and returns a new List.
         */
        var create = function (config) {
            return new List(config);
        };


        return {
            create: create,
            List: List
        }
    });
