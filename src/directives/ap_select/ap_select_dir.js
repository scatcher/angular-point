'use strict';

angular.module('angularPoint')
    .directive('apSelect', function () {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'src/directives/ap_select/ap_select_tmpl.html',
            scope: {
                bindedField: '=',   //The field on the model to bind to
                multi: '=',         //Single select if not set or set to false
                arr: '=',           //Array of lookup options
                lookupValue: '=',   //Field name to map the lookupValue to (default: 'title')
                ngDisabled: '='     //Pass through to disable control using ng-disabled on element if set
            },
            link: function (scope) {

                scope.state = {
                    multiSelectIDs: [],
                    singleSelectID: ''
                };

                /** Default to title field if not provided */
                scope.state.lookupField = scope.lookupValue || 'title';
                
                var buildLookupObject = function(stringId) {
                    var intID = parseInt(stringId, 10);
                    var match = _.findWhere(scope.arr, {id: intID});
                    return { lookupId: intID, lookupValue: match[scope.state.lookupField] };
                };

                //Todo: Get this hooked up to allow custom function to be passed in instead of property name
                scope.generateDisplayText = function(item) {
                    if(_.isFunction(scope.state.lookupField)) {
                        //Passed in a reference to a function to generate the select display text
                        return scope.state.lookupField(item);
                    } else if(_.isString(scope.state.lookupField)){
                        //Passed in a property name on the item to use
                        return item[scope.state.lookupField];
                    } else {
                        //Default to the title property of the object
                        return item.title;
                    }
                };

                scope.updateMultiModel = function () {
                    /** Ensure field being binded against is array */
                    if (!_.isArray(scope.bindedField)) {
                        scope.bindedField = [];
                    }
                    /** Clear out existing contents */
                    scope.bindedField.length = 0;
                    /** Push formatted lookup object back */
                    _.each(scope.state.multiSelectIDs, function (stringId) {
                        scope.bindedField.push(buildLookupObject(stringId));
                    });
                };

                scope.updateSingleModel = function () {
                    /** Create an object with expected lookupId/lookupValue properties */
                    scope.bindedField = buildLookupObject(scope.state.singleSelectID);
                };

                /** Process initially and whenever the underlying value is changed */
                scope.$watch('bindedField', function() {
                    if (scope.multi) {
                        /** Multi Select Mode
                         *  Set the string version of id's to allow multi-select control to work properly */
                        _.each(scope.bindedField, function (selectedLookup) {
                            /** Push id as a string to match what Select2 is expecting */
                            scope.state.multiSelectIDs.push(selectedLookup.lookupId.toString());
                        });
                    } else {
                        /** Single Select Mode */
                        if (_.isObject(scope.bindedField) && scope.bindedField.lookupId) {
                            /** Set the selected id as string */
                            scope.state.singleSelectID = scope.bindedField.lookupId;
                        }
                    }
                });

            }
        };
    });