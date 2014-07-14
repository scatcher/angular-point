'use strict';

/** Angular will instantiate this singleton by calling "new" on this function the first time it's referenced
 /*  State will persist throughout life of session
 */
angular.module('angularPoint')
    .service('mockModel', function (apModelFactory, apModalService) {

        /**
         * Entity Constructor
         * @param obj
         * @constructor
         */
        function Mock(obj) {
            var self = this;
            _.extend(self, obj);
        }

        /********************* Model Definition ***************************************/

        /** Model Constructor
         *  Also passes list to List constructor to build viewFields (XML definition of fields to return) */
        var model = apModelFactory.create({
            factory: Mock,
            list: {
                title: 'MockList', /**Maps to the offline XML file in dev folder (no spaces) */
                guid: '{}', /**List GUID can be found in list properties in SharePoint designer */
                customFields: [
                    { internalName: "Text", objectType: "Text", mappedName: "text", readOnly:false },
                    // Has required = true to test field validation.
                    { internalName: "Boolean", objectType: "Boolean", mappedName: "boolean", readOnly:false, required: true},
                    { internalName: "Currency", objectType: "Currency", mappedName: "currency", readOnly:false },
                    { internalName: "DateTime", objectType: "DateTime", mappedName: "dateTime", readOnly:false },
                    { internalName: "Integer", objectType: "Integer", mappedName: "integer", readOnly:false },
                    { internalName: "JSON", objectType: "JSON", mappedName: "json", readOnly:false },
                    { internalName: "Lookup", objectType: "Lookup", mappedName: "lookup", readOnly:false },
                    { internalName: "LookupMulti", objectType: "LookupMulti", mappedName: "lookupMulti", readOnly:false },
                    { internalName: "User", objectType: "User", mappedName: "user", readOnly:false },
                    { internalName: "UserMulti", objectType: "UserMulti", mappedName: "userMulti", readOnly:false },
                    { internalName: "ReadOnly", objectType: "Text", mappedName: "readOnly", readOnly:true }
                ]
            }
        });

        /*********************************** Queries ***************************************/

        /** Fetch data (pulls local xml if offline named model.list.title + '.xml')
         *  Initially pulls all requested data.  Each subsequent call just pulls records that have been changed,
         *  updates the model, and returns a reference to the updated data array
         * @returns {Array} Requested list items
         */
        model.registerQuery({
            name: 'primary',
            query: '' +
                '<Query>' +
                '   <OrderBy>' +
                '       <FieldRef Name="ID" Ascending="TRUE"/>' +
                '   </OrderBy>' +
                '</Query>'
        });

        /********************* Model Specific Shared Functions ***************************************/

        /** Optionally add a modal form **/
        model.openModal = apModalService.modalModelProvider({
            templateUrl: '',
            controller: '',
            expectedArguments: ['entity']
        });

        Mock.prototype.openModal = function () {
            return model.openModal(this);
        };


        return model;
    });