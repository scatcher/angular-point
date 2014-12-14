'use strict';

/**
 * @ngdoc directive
 * @name angularPoint.directive:apSelect
 * @element span
 * @function
 *
 * @description
 * A SharePoint lookup value is represented as an object containing a lookupId and lookupValue.
 * ```
 * Lookup = {
 *     lookupId: 1,
 *     lookupValue: 'Typically the Title of the Item we're referencing'
 * }
 * ```
 * With that in mind, we know that the list providing lookup options is made up of SharePoint list items.  This
 * directive attempts to create a select using the array of lookup options and once selected, sets field referencing
 * the target object with the applicable `lookupValue` and `lookupId`.
 *
 *
 * @param {object} target Reference to the target attribute on the list item.
 * @param {object[]} arr Array of list items used to populate the options for the select.
 * @param {string} [lookupValue='title'] Name of the attribute to use as the display value for each item
 * in `arr` array.
 * @param {boolean} [multi=false] Allows us to use a multi-select using Select2.
 *
 * @example
 * Form field below allows us to display a multi-select with options coming
 * from a taskCategories array.  Each item selected pushes an object into
 * the activeTask.categories array.  Each of these objects will have a
 * lookupId = category.id and lookupValue = category.acronym.
 * <pre>
 * <div class="form-group">
 *      <label class="control-label">Task Categories</label>
 *      <span data-ap-select data-multi="true"
 *          data-arr="taskCategories"
 *          data-target="activeTask.categories"
 *          data-lookup-value="'acronym'"></span>
 *  </div>
 * </pre>
 */
angular.module('angularPoint')
    .directive('apSelect', function (_) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'src/directives/ap_select/ap_select_tmpl.html',
            scope: {
                target: '=',   //The field on the model to bind to
                bindedField: '=',   //Deprecated....why did I use binded instead of bound?
                multi: '=',         //Single select if not set or set to false
                arr: '=',           //Array of lookup options
                lookupValue: '=',   //Field name to map the lookupValue to (default: 'title')
                ngDisabled: '='     //Pass through to disable control using ng-disabled on element if set
            },
            link: function (scope) {
                if (scope.bindedField && !scope.target) {
                    //Todo remove all references to "bindedField" and change to target
                    scope.target = scope.bindedField;
                }
                scope.state = {
                    multiSelectIDs: [],
                    singleSelectID: ''
                };

                /** Default to title field if not provided */
                scope.state.lookupField = scope.lookupValue || 'title';

                var buildLookupObject = function (stringId) {
                    var intID = parseInt(stringId, 10);
                    var match = _.findWhere(scope.arr, {id: intID});
                    return {lookupId: intID, lookupValue: match[scope.state.lookupField]};
                };

                //Todo: Get this hooked up to allow custom function to be passed in instead of property name
                scope.generateDisplayText = function (item) {
                    if (_.isFunction(scope.state.lookupField)) {
                        //Passed in a reference to a function to generate the select display text
                        return scope.state.lookupField(item);
                    } else if (_.isString(scope.state.lookupField)) {
                        //Passed in a property name on the item to use
                        return item[scope.state.lookupField];
                    } else {
                        //Default to the title property of the object
                        return item.title;
                    }
                };

                scope.updateMultiModel = function () {
                    /** Ensure field being binded against is array */
                    if (!_.isArray(scope.target)) {
                        scope.target = [];
                    }
                    /** Clear out existing contents */
                    scope.target.length = 0;
                    /** Push formatted lookup object back */
                    _.each(scope.state.multiSelectIDs, function (stringId) {
                        scope.target.push(buildLookupObject(stringId));
                    });
                };

                scope.updateSingleModel = function () {
                    /** Create an object with expected lookupId/lookupValue properties */
                    scope.target = buildLookupObject(scope.state.singleSelectID);
                };

                /** Process initially and whenever the underlying value is changed */
                scope.$watch('target', function () {
                    if (scope.multi) {
                        /** Multi Select Mode
                         *  Set the string version of id's to allow multi-select control to work properly */
                        _.each(scope.target, function (selectedLookup) {
                            /** Push id as a string to match what Select2 is expecting */
                            scope.state.multiSelectIDs.push(selectedLookup.lookupId.toString());
                        });
                    } else {
                        /** Single Select Mode */
                        if (_.isObject(scope.target) && scope.target.lookupId) {
                            /** Set the selected id as string */
                            scope.state.singleSelectID = scope.target.lookupId;
                        }
                    }
                });

            }
        };
    });
