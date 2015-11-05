/// <reference path="../app.module.mock.ts" />

module ap.test {
    'use strict';

    export class MockLookup extends ap.ListItem<MockLookup>{
        constructor(obj) {
            super();
            _.assign(this, obj);
        }
    }

    export class MockLookupModel extends ap.Model {
        constructor(private apDecodeService, private mockXMLService) {

            /********************* Model Definition ***************************************/

            /** Model Constructor
             *  Also passes list to List constructor to build viewFields (XML definition of fields to return) */
            super({
                factory: MockLookup,
                list: {
                    title: 'MockLookupList', /**Maps to the offline XML file in dev folder (no spaces) */
                    guid: '{D2448413-D9AE-4FE4-A499-1D8FE7201FDA}', /**List GUID can be found in list properties in SharePoint designer */
                    customFields: [
                        { staticName: "Title", objectType: "Text", mappedName: "title", readOnly: false }
                    ]
                }
            });

            var model = this;

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


        }
        importMocks() {
            var primaryCache = this.getCache('primary');
            primaryCache.clear();
            this.apDecodeService.processListItems(this, this.getQuery('primary'), this.mockXMLService.lookupItemsSinceChangeToken, {
                target: primaryCache
            });
            return primaryCache;
        }
    }

    angular.module('angularPoint')
        .service('mockLookupModel', MockLookupModel);

} 