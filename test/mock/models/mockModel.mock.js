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
        var MockListItem = (function (_super) {
            __extends(MockListItem, _super);
            function MockListItem(obj) {
                _super.call(this);
                _.assign(this, obj);
            }
            return MockListItem;
        }(ap.ListItem));
        test.MockListItem = MockListItem;
        var MockModel = (function (_super) {
            __extends(MockModel, _super);
            function MockModel($httpBackend, apCacheService) {
                /********************* Model Definition ***************************************/
                /** Model Constructor
                 *  Also passes list to List constructor to build viewFields (XML definition of fields to return) */
                _super.call(this, {
                    factory: MockListItem,
                    list: {
                        title: 'MockList',
                        /**Maps to the offline XML file in dev folder (no spaces) */
                        guid: '{F5345FE7-2F7C-49F7-87D0-DBFEBDD0CE61}',
                        /**List GUID can be found in list properties in SharePoint designer */
                        customFields: [
                            { staticName: "Title", objectType: "Text", mappedName: "title", readOnly: false },
                            // Has required = true to test field validation.
                            {
                                staticName: "Boolean",
                                objectType: "Boolean",
                                mappedName: "boolean",
                                readOnly: false,
                                required: true
                            },
                            { staticName: "Calculated", objectType: "Calculated", mappedName: "calculated", readOnly: true },
                            { staticName: "Choice", objectType: "Choice", mappedName: "choice", readOnly: false },
                            {
                                staticName: 'MultiChoice',
                                objectType: 'MultiChoice',
                                mappedName: 'multiChoice',
                                readOnly: false
                            },
                            { staticName: "Currency", objectType: "Currency", mappedName: "currency", readOnly: false },
                            { staticName: "Date", objectType: "DateTime", mappedName: "date", readOnly: false },
                            { staticName: "DateTime", objectType: "DateTime", mappedName: "dateTime", readOnly: false },
                            { staticName: "Integer", objectType: "Integer", mappedName: "integer", readOnly: false },
                            { staticName: 'Float', objectType: 'Float', mappedName: 'float', readOnly: false },
                            { staticName: 'HTML', objectType: 'HTML', mappedName: 'html', readOnly: false },
                            { staticName: "JSON", objectType: "JSON", mappedName: "json", readOnly: false },
                            { staticName: "Lookup", objectType: "Lookup", mappedName: "lookup", readOnly: false },
                            {
                                staticName: "LookupMulti",
                                objectType: "LookupMulti",
                                mappedName: "lookupMulti",
                                readOnly: false
                            },
                            { staticName: 'Note', objectType: 'Note', mappedName: 'note', readOnly: false },
                            { staticName: "User", objectType: "User", mappedName: "user", readOnly: false },
                            { staticName: "UserMulti", objectType: "UserMulti", mappedName: "userMulti", readOnly: false },
                            { staticName: 'Hyperlink', objectType: 'Hyperlink', mappedName: 'hyperlink', readOnly: false },
                            { staticName: 'Picture', objectType: 'Picture', mappedName: 'picture', readOnly: false },
                            { staticName: 'Attachments', objectType: 'Attachments', mappedName: 'attachments', readOnly: false }
                        ]
                    }
                });
                this.$httpBackend = $httpBackend;
                this.apCacheService = apCacheService;
                var model = this;
                /*********************************** Queries ***************************************/
                /** Fetch data (pulls local xml if offline named model.list.title + '.xml')
                 *  Initially pulls all requested data.  Each subsequent call just pulls records that have been changed,
                 *  updates the model, and returns a reference to the updated data array
                 * @returns {Array} Requested list items
                 */
                model.registerQuery({
                    name: 'primary'
                });
                model.registerQuery({
                    name: 'secondary'
                });
            }
            MockModel.prototype.getField = function (name) {
                return _.find(this.list.fields, { mappedName: name });
            };
            MockModel.prototype.importMocks = function () {
                var _this = this;
                var primaryCache = this.getCache('primary');
                var secondaryCache = this.getCache('secondary');
                primaryCache.clear();
                secondaryCache.clear();
                /** Clear out model cache */
                _.each(this.apCacheService.entityCache, function (val, key) {
                    delete _this.apCacheService.entityCache[key];
                });
                this.executeQuery('primary')
                    .then(function (data) {
                    //placeholder
                });
                this.executeQuery('secondary')
                    .then(function (data) {
                    //placeholder
                });
                this.$httpBackend.flush();
            };
            return MockModel;
        }(ap.Model));
        test.MockModel = MockModel;
        angular.module('angularPoint')
            .service('mockModel', MockModel);
    })(test = ap.test || (ap.test = {}));
})(ap || (ap = {}));

//# sourceMappingURL=mockModel.mock.js.map
