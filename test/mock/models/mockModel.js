'use strict';

/** Angular will instantiate this singleton by calling "new" on this function the first time it's referenced
 /*  State will persist throughout life of session
 */
angular.module('angularPoint')
    .service('mockModel', function (apModelFactory, apModalService, apDecodeService, mockXMLService) {

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
                guid: '{F5345FE7-2F7C-49F7-87D0-DBFEBDD0CE61}', /**List GUID can be found in list properties in SharePoint designer */
                customFields: [
                    { internalName: "Title", objectType: "Text", mappedName: "titleText", readOnly:false },
                    // Has required = true to test field validation.
                    { internalName: "Boolean", objectType: "Boolean", mappedName: "boolean", readOnly:false, required: true},
                    { internalName: "Calculated", objectType: "Calculated", mappedName: "calculated", readOnly:true },
                    { internalName: "Choice", objectType: "Choice", mappedName: "choice", readOnly: false },
                    { internalName: 'MultiChoice', objectType: 'MultiChoice', mappedName: 'multiChoice', readOnly: false },
                    { internalName: "Currency", objectType: "Currency", mappedName: "currency", readOnly:false },
                    { internalName: "Date", objectType: "DateTime", mappedName: "date", readOnly:false },
                    { internalName: "DateTime", objectType: "DateTime", mappedName: "dateTime", readOnly:false },
                    { internalName: "Integer", objectType: "Integer", mappedName: "integer", readOnly:false },
                    { internalName: "JSON", objectType: "JSON", mappedName: "json", readOnly:false },
                    { internalName: "Lookup", objectType: "Lookup", mappedName: "lookup", readOnly:false },
                    { internalName: "LookupMulti", objectType: "LookupMulti", mappedName: "lookupMulti", readOnly:false },
                    { internalName: "User", objectType: "User", mappedName: "user", readOnly:false },
                    { internalName: "UserMulti", objectType: "UserMulti", mappedName: "userMulti", readOnly:false }
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
            offlineXML: '../mock.xml',
            query: '' +
                '<Query>' +
                '   <OrderBy>' +
                '       <FieldRef Name="ID" Ascending="TRUE"/>' +
                '   </OrderBy>' +
                '</Query>'
        });

        model.registerQuery({
            name: 'secondary',
            offlineXML: '../mock.xml',
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


        model.importMocks = function () {
            var primaryCache = model.getCache('primary');
            var secondaryCache = model.getCache('secondary');
            primaryCache.clear();
            secondaryCache.clear();
            apDecodeService.processListItems(model, model.getQuery('primary'), mockXMLService.listItemsSinceChangeToken, {
                target: primaryCache
            });
            /** Populate secondary query cache with same objects */
            _.extend(secondaryCache, primaryCache);

            return primaryCache;
        };

        return model;
    });