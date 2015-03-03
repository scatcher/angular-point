'use strict';

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
angular.module('angularPoint')
    .factory('apListFactory', function (_, apConfig, apDefaultFields, apFieldFactory) {

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

            extendFieldDefinitions(list);
        }

        List.prototype.getListId = getListId;
        List.prototype.identifyWebURL = identifyWebURL;


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
         * @ngdoc function
         * @name List:identifyWebURL
         * @methodOf List
         * @description
         * If a list is extended, use the provided webURL, otherwise use list.webURL.  If never set it will default
         * to apConfig.defaultUrl.
         * @returns {string} webURL param.
         */
        function identifyWebURL() {
            var list = this;
            return list.WebFullUrl ? list.WebFullUrl : list.webURL;
        }

        /**
         * @description
         * 1. Populates the fields array which uses the Field constructor to combine the default
         * SharePoint fields with those defined in the list definition on the model
         * 2. Creates the list.viewFields XML string that defines the fields to be requested on a query
         *
         * @param {object} list Reference to the list within a model.
         */
        function extendFieldDefinitions(list) {
            /**
             * Constructs the field
             * - adds to viewField
             * - create ows_ mapping
             * @param fieldDefinition
             */
            var buildField = function (fieldDefinition) {
                var field = new apFieldFactory.Field(fieldDefinition);
                list.fields.push(field);
                list.viewFields += '<FieldRef Name="' + field.staticName + '"/>';
                list.mapping['ows_' + field.staticName] = {
                    mappedName: field.mappedName,
                    objectType: field.objectType
                };
            };

            /** Open viewFields */
            list.viewFields += '<ViewFields>';

            /** Add the default fields */
            _.each(apDefaultFields, function (field) {
                buildField(field);
            });

            /** Add each of the fields defined in the model */
            _.each(list.customFields, function (field) {
                buildField(field);
            });

            /** Close viewFields */
            list.viewFields += '</ViewFields>';
        }

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
