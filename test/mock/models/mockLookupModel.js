'use strict';

/** Angular will instantiate this singleton by calling "new" on this function the first time it's referenced
 /*  State will persist throughout life of session
 */
angular.module('angularPoint')
    .service('mockLookupModel', function (apModelFactory, apDecodeService, mockXMLService) {

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
                title: 'MockLookupList', /**Maps to the offline XML file in dev folder (no spaces) */
                guid: '{D2448413-D9AE-4FE4-A499-1D8FE7201FDA}', /**List GUID can be found in list properties in SharePoint designer */
                customFields: [
                    { internalName: "Title", objectType: "Text", mappedName: "title", readOnly:false }
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
            offlineXML: '../MockLookup.xml',
            query: '' +
            '<Query>' +
            '   <OrderBy>' +
            '       <FieldRef Name="ID" Ascending="TRUE"/>' +
            '   </OrderBy>' +
            '</Query>'
        });


        /********************* Model Specific Shared Functions ***************************************/

        /** Simulate mock query */
        model.importMocks = function () {
            var primaryCache = model.getCache('primary');
            primaryCache.clear();
            apDecodeService.processListItems(model, model.getQuery('primary'), mockXMLService.lookupItemsSinceChangeToken, {
                target: primaryCache
            });
            return primaryCache;
        };

        return model;
    });