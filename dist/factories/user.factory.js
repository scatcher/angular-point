"use strict";
var utility_service_1 = require('../services/utility.service');
/**
 * @ngdoc function
 * @name User
 * @description
 * Allows for easier distinction when debugging if object type is shown as a User.  Turns a delimited ";#"
 * string into an object shown below depeinding on field settings:
 * <pre>
 * {
 *      lookupId: 1,
 *      lookupValue: 'Joe User'
 * }
 * </pre>
 * or
 * <pre>
 * {
 *      lookupId: 1,
 *      lookupValue: 'Joe User',
 *      loginName: 'joe.user',
 *      email: 'joe@company.com',
 *      sipAddress: 'whatever',
 *      title: 'Sr. Widget Maker'
 * }
 * </pre>
 * @param {string} s Delimited string used to create a User object.
 * @constructor
 */
var User = (function () {
    function User(str) {
        var _a = utility_service_1.splitIndex(str), id = _a.id, value = _a.value;
        var thisUserExpanded = value.split(',#');
        if (thisUserExpanded.length === 1) {
            //Standard currentPerson columns only return a id,#value pair
            this.lookupId = id;
            this.lookupValue = value;
        }
        else {
            //Allow for case where currentPerson adds additional properties when setting up field
            this.lookupId = id;
            this.lookupValue = thisUserExpanded[0].replace(/(,,)/g, ',');
            this.loginName = thisUserExpanded[1].replace(/(,,)/g, ',');
            this.email = thisUserExpanded[2].replace(/(,,)/g, ',');
            this.sipAddress = thisUserExpanded[3].replace(/(,,)/g, ',');
            this.title = thisUserExpanded[4].replace(/(,,)/g, ',');
        }
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.factory.js.map