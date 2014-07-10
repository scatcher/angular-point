'use strict';

/**
 * @ngdoc object
 * @name List
 * @description
 */
angular.module('angularPoint')
    .factory('apListFactory', function (apConfig, apFieldService) {

        /**
         * @ngdoc function
         * @name List
         * @description
         * List Object Constructor.  This is handled automatically when creating a new model so there shouldn't be
         * any reason to manually call.
         * @param {object} obj Initialization parameters.
         * @param {string} obj.guid Unique SharePoint GUID for the list we'll be basing the model on
         * ex:'{4D74831A-42B2-4558-A67F-B0B5ADBC0EAC}'
         * @param {string} obj.title Maps to the offline XML file in dev folder (no spaces)
         * ex: 'ProjectsList' so the offline XML file would be located at dev/ProjectsList.xml
         * @param {object[]} [obj.customFields] Mapping of SharePoint field names to the internal names we'll be using
         * in our application.  Also contains field type, readonly attribute, and any other non-standard settings.
         * <pre>
         * [
         *   {
         *       internalName: "Title",
         *       objectType: "Text",
         *       mappedName: "lastName",
         *       readOnly:false
         *   },
         *   {
         *       internalName: "FirstName",
         *       objectType: "Text",
         *       mappedName: "firstName",
         *       readOnly:false
         *   },
         *   {
         *       internalName: "Organization",
         *       objectType: "Lookup",
         *       mappedName: "organization",
         *       readOnly:false
         *   },
         *   {
         *       internalName: "Account",
         *       objectType: "User",
         *       mappedName: "account",
         *       readOnly:false
         *   },
         *   {
         *       internalName: "Details",
         *       objectType: "Text",
         *       mappedName: "details",
         *       readOnly:false
         *   }
         * ]
         * </pre>
         * @constructor
         */
        function List(obj) {
            var defaults = {
                viewFields: '',
                customFields: [],
                isReady: false,
                fields: [],
                guid: '',
                mapping: {},
                title: ''
            };

            /** Manually set site url if defined, prevents SPServices from making a blocking call to fetch it. */
            if (apConfig.defaultUrl) {
                defaults.webURL = apConfig.defaultUrl;
            }


            var list = _.extend({}, defaults, obj);

            apFieldService.extendFieldDefinitions(list);

            return list;
        }

        return {
            List: List
        }
    });