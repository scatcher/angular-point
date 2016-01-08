/// <reference path="../app.module.mock.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ap;
(function (ap) {
    var test;
    (function (test) {
        'use strict';
        var MockLookup = (function (_super) {
            __extends(MockLookup, _super);
            function MockLookup(obj) {
                _super.call(this);
                _.assign(this, obj);
            }
            return MockLookup;
        })(ap.ListItem);
        test.MockLookup = MockLookup;
        var MockLookupModel = (function (_super) {
            __extends(MockLookupModel, _super);
            function MockLookupModel(apDecodeService, mockXMLService) {
                /********************* Model Definition ***************************************/
                /** Model Constructor
                 *  Also passes list to List constructor to build viewFields (XML definition of fields to return) */
                _super.call(this, {
                    factory: MockLookup,
                    list: {
                        title: 'MockLookupList',
                        guid: '{D2448413-D9AE-4FE4-A499-1D8FE7201FDA}',
                        customFields: [
                            { staticName: "Title", objectType: "Text", mappedName: "title", readOnly: false }
                        ]
                    }
                });
                this.apDecodeService = apDecodeService;
                this.mockXMLService = mockXMLService;
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
            MockLookupModel.prototype.importMocks = function () {
                var primaryCache = this.getCache('primary');
                primaryCache.clear();
                this.apDecodeService.processListItems(this, this.getQuery('primary'), this.mockXMLService.lookupItemsSinceChangeToken, {
                    target: primaryCache
                });
                return primaryCache;
            };
            return MockLookupModel;
        })(ap.Model);
        test.MockLookupModel = MockLookupModel;
        angular.module('angularPoint')
            .service('mockLookupModel', MockLookupModel);
    })(test = ap.test || (ap.test = {}));
})(ap || (ap = {}));

//# sourceMappingURL=lookupModel.mock.js.map
