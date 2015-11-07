/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    let apUtilityService: UtilityService;

    /**
     * Represents a reference to a site collection user.  This is
     * very similar to an ap.ILookup except additional properties
     * can be provided if setup to include them in the request.
     * The site collection user is created the first time a user
     * accesses a site collection.  The downside is a user will have
     * different site collection ID's for each site collection.
     */
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
    class User implements IUser {
        lookupValue: string;
        lookupId: number;
        loginName: string;
        email: string;
        sipAddress: string;
        title: string;

        constructor(str: string) {
            let thisUser = new apUtilityService.SplitIndex(str);

            let thisUserExpanded = thisUser.value.split(',#');
            if (thisUserExpanded.length === 1) {
                //Standard user columns only return a id,#value pair
                this.lookupId = thisUser.id;
                this.lookupValue = thisUser.value;
            } else {
                //Allow for case where user adds additional properties when setting up field
                this.lookupId = thisUser.id;
                this.lookupValue = thisUserExpanded[0].replace(/(,,)/g, ',');
                this.loginName = thisUserExpanded[1].replace(/(,,)/g, ',');
                this.email = thisUserExpanded[2].replace(/(,,)/g, ',');
                this.sipAddress = thisUserExpanded[3].replace(/(,,)/g, ',');
                this.title = thisUserExpanded[4].replace(/(,,)/g, ',');
            }
        }
    }


    export class UserFactory {
        User = User;
        static $inject = ['apUtilityService'];

        constructor(_apUtilityService_) {
            apUtilityService = _apUtilityService_;
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
