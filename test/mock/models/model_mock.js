'use strict';

/**Angular will instantiate this singleton by calling "new" on this function the first time it's referenced
 /* State will persist throughout life of session*/
angular.module('angularPoint')
    .service('mockModel', function ($rootScope, $q, modelFactory, configService, dataService) {

        /** Object Constructor (class)*/
        function Mock(obj) {
            var self = this;
            _.extend(self, obj);
        }

        /********************* Model Definition ***************************************/

        /** Model Constructor */
        /** Adds "addNewItem" and "getAllListItems" to the model and ensures "data", "queries", and "ready" have been added */
        /** Also passes list to List constructor to build viewFields (XML definition of fields to return) */
        var model = new modelFactory.Model({
            data: [], /** By default, all newly constructed list items are pushed to this array */
            queries: {}, /** Stored queries for this data source */
            ready: $q.defer(),
            list: {
                title: 'Mock', /**Maps to the offline XML file in dev folder (no spaces) */
                guid: '', /**List GUID can be found in list properties in SharePoint designer */
                customFields: [
                /** Array of objects mapping each SharePoint field to a property on a list item object */
                /** If angularPoint live templates have been imported type "oafield" followed by the tab key for
                 /*  each field to quickly map with available options */
                    //Ex: {internalName: "Title", objectType: "Text", mappedName: "title", readOnly: false}
                    { internalName: "Text", objectType: "Text", mappedName: "text", readOnly:false },
                    { internalName: "Boolean", objectType: "Boolean", mappedName: "boolean", readOnly:false },
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

        /** New List item is then passed to the object constructor for this data source to allow the addition
         /*  of any other custom methods or properties */
        model.factory = function (listItem) {
            return new Mock(listItem);
        };

        /*********************************** Prototype Construction ***************************************/

        /** Inherit from master list item prototype */
        Mock.prototype = new modelFactory.ListItem();
        /** Make the model directly accessible from the list item */
        Mock.prototype.getModel = function () {
            return model;
        };

        /*********************************** Queries ***************************************/

        /** Main Query that will be executed when model is instantiated */
        model.queries.primary = new modelFactory.Query({
            operation: "GetListItemChangesSinceToken",
            listName: model.list.guid,
            viewFields: model.list.viewFields,
            queryOptions: '<QueryOptions><IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns></QueryOptions>',
            query: '' +
                '<Query>' +
                '   <OrderBy>' +
                '       <FieldRef Name="ID" Ascending="TRUE"/>' +
                '   </OrderBy>' +
                '</Query>'
        });

        /** Fetch data (pulls local xml if offline named model.list.title + '.xml')
         *  Initially pulls all requested data.  Each subsequent call just pulls records that have been changed,
         *  updates the model, and returns a reference to the updated data array
         * @returns {Array} Requested list items
         */
        model.updateData = function () {
            model.ready = $q.defer();
            dataService.executeQuery(model, model.queries.primary, {deferred: model.ready}).then(function (results) {
                /** Return model.data instead of results because for subsequent calls, results
                 * is only the list items that have changed since the last request */
                model.ready.resolve(model.data);
            });
            return model.ready.promise;
        };

        model.updateData();

        /********************* Model Specific Shared Functions ***************************************/

        return model;
    });