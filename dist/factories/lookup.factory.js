"use strict";
var utility_service_1 = require('../services/utility.service');
/**
 * @ngdoc function
 * @name Lookup
 * @description
 * Allows for easier distinction when debugging if object type is shown as either Lookup or User.  Also allows us
 * to create an async request for the entity being referenced by the lookup
 * @param {string} s String to split into lookupValue and lookupId
 * @param {object} options Contains a reference to the parent list item and the property name.
 * @param {object} options.entity Reference to parent list item.
 * @param {object} options.propertyName Key on list item object.
 * @constructor
 */
var Lookup = (function () {
    function Lookup(str) {
        var _a = utility_service_1.splitIndex(str), id = _a.id, value = _a.value;
        this.lookupId = id;
        this.lookupValue = value || '';
    }
    return Lookup;
}());
exports.Lookup = Lookup;
//# sourceMappingURL=lookup.factory.js.map