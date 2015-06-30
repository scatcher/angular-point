/// <reference path="../../../src/app.module.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function () {
    'use strict';
    var Mock = (function (_super) {
        __extends(Mock, _super);
        function Mock(obj) {
            _super.call(this);
            _.assign(this, obj);
        }
        return Mock;
    })(ap.ListItem);
    exports.Mock = Mock;
    var MOCKMODEL = (function (_super) {
        __extends(MOCKMODEL, _super);
        function MOCKMODEL(apModelFactory, apListItemFactory, apDecodeService, mockXMLService, $httpBackend, apCacheService) {
            /********************* Model Definition ***************************************/
            /** Model Constructor
             *  Also passes list to List constructor to build viewFields (XML definition of fields to return) */
            _super.call(this, {
                factory: Mock,
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
        MOCKMODEL.prototype.getField = function (name) {
            return _.find(this.list.fields, { mappedName: name });
        };
        MOCKMODEL.prototype.importMocks = function () {
            var _this = this;
            var primaryCache = this.getCache('primary');
            var secondaryCache = this.getCache('secondary');
            primaryCache.clear();
            secondaryCache.clear();
            /** Clear out model cache */
            _.each(this.apCacheService.entityCache, function (val, key) {
                delete _this.apCacheService.entityCache[key];
            });
            this.executeQuery('primary');
            this.executeQuery('secondary');
            this.$httpBackend.flush();
        };
        return MOCKMODEL;
    })(ap.Model);
    exports.MOCKMODEL = MOCKMODEL;
    angular.module('angularPoint')
        .service('mockModel', MOCKMODEL);
})();

//# sourceMappingURL=../../mock/models/MOCKMODEL.js.map