/// <reference path="../../typings/ap.d.ts" />

module ap {
    'use strict';

    var apUtilityService;

    export interface IUser {
        email?:string;
        loginName?:string;
        lookupId: number;
        lookupValue: string;
        sipAddress?:string;
        title?:string;
    }

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
    class User implements IUser{
        lookupValue: string;
        lookupId: number;
        loginName:string;
        email:string;
        sipAddress:string;
        title:string;
        constructor(str:string) {
            var self = this;
            var thisUser = new apUtilityService.SplitIndex(str);

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
    }



    export class UserFactory {
        User = User;
        constructor($injector) {
            apUtilityService = $injector.get('apUtilityService');

        }

        /**
         * @ngdoc function
         * @name angularPoint.apUserFactory:create
         * @methodOf angularPoint.apUserFactory
         * @description
         * Instantiates and returns a new User field.
         */
        create(s) {
            return new User(s);
        }
    }

    /**
     * @ngdoc function
     * @name angularPoint.apUserFactory
     * @description
     * Tools to assist with the creation of CAML queries.
     *
     */
    angular.module('angularPoint')
        .service('apUserFactory', UserFactory);


}
