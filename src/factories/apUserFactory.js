'use strict';

/**
 * @ngdoc function
 * @name angularPoint.apUserFactory
 * @description
 * Tools to assist with the creation of CAML queries.
 *
 */
angular.module('angularPoint')
    .factory('apUserFactory', function (apUtilityService) {


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
        function User(s) {
            var self = this;
            var thisUser = new apUtilityService.SplitIndex(s);

            var thisUserExpanded = thisUser.value.split(',#');
            if (thisUserExpanded.length === 1) {
                //Standard user columns only return a id,#value pair
                self.lookupId = thisUser.id;
                self.lookupValue = thisUser.value;
            } else {
                //Allow for case where user adds additional properties when setting up field
                self.lookupId = thisUser.id;
                self.lookupValue = thisUserExpanded[0].replace(/(,,)/g, ',');
                self.loginName = thisUserExpanded[1].replace(/(,,)/g, ',');
                self.email = thisUserExpanded[2].replace(/(,,)/g, ',');
                self.sipAddress = thisUserExpanded[3].replace(/(,,)/g, ',');
                self.title = thisUserExpanded[4].replace(/(,,)/g, ',');
            }
        }

        /**
         * @ngdoc function
         * @name angularPoint.apUserFactory:create
         * @methodOf angularPoint.apUserFactory
         * @description
         * Instantiates and returns a new User field.
         */
        var create = function (s) {
            return new User(s);
        };

        return {
            create: create,
            User: User
        }
    });