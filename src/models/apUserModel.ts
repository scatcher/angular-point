/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    /** Local references to cached promises */
    var _getGroupCollection, _getUserProfile;

    export interface IUserModel {
        checkIfMember(groupName: string, force?: boolean): angular.IPromise<IGroupDefinition>;
        getGroupCollection(force?: boolean): angular.IPromise<IGroupDefinition[]>;
        getUserProfile(force?: boolean): ng.IPromise<IUserProfile>;
    }

    export interface IGroupDefinition {
        ID: string;
        Name: string;
        Description: string;
        OwnerId: string;
        OwnerIsUser: string;
    }

    export interface IUserProfile {
        userLoginName: string; //Added to allow us to optionally add a prefix if necessary from apConfig
        UserProfile_GUID: string;
        AccountName: string;
        FirstName: string;
        "SPS-PhoneticFirstName": string;
        LastName: string;
        "SPS-PhoneticLastName": string;
        PreferredName: string;
        "SPS-PhoneticDisplayName": string;
        WorkPhone: string;
        Department: string;
        Title: string;
        "SPS-JobTitle": string;
        Manager: string;
        AboutMe: string;
        PersonalSpace: string;
        PictureURL: string;
        UserName: string;
        QuickLinks: string;
        WebSite: string;
        PublicSiteRedirect: string;
        "SPS-Dotted-line": string;
        "SPS-Peers": string;
        "SPS-Responsibility": string;
        "SPS-SipAddress": string;
        "SPS-MySiteUpgrade": string;
        "SPS-DontSuggestList": string;
        "SPS-ProxyAddresses": string;
        "SPS-HireDate": string;
        "SPS-DisplayOrder": string;
        "SPS-ClaimID": string;
        "SPS-ClaimProviderID": string;
        "SPS-ClaimProviderType": string;
        "SPS-LastColleagueAdded": string;
        "SPS-OWAUrl": string;
        "SPS-SavedAccountName": string;
        "SPS-ResourceAccountName": string;
        "SPS-ObjectExists": string;
        "SPS-MasterAccountName": string;
        "SPS-DistinguishedName": string;
        "SPS-SourceObjectDN": string;
        "SPS-LastKeywordAdded": string;
        WorkEmail: string;
        CellPhone: string;
        Fax: string;
        HomePhone: string;
        Office: string;
        "SPS-Location": string;
        "SPS-TimeZone": string;
        Assistant: string;
        "SPS-PastProjects": string;
        "SPS-Skills": string;
        "SPS-School": string;
        "SPS-Birthday": string;
        "SPS-StatusNotes": string;
        "SPS-Interests": string;
        "SPS-EmailOptin": string;
    }

    class UserModel {
        constructor(private $q: ng.IQService, private apDataService: DataService) {

        }

        /**
         * @ngdoc function
         * @name angularPoint.apUserModel:checkIfMember
         * @methodOf angularPoint.apUserModel
         * @description
         * Checks to see if current user is a member of the specified group.
         * @param {string} groupName Name of the group.
         * @param {boolean} [force=false] Ignore any cached value.
         * @returns {{ID:string, Name:string, Description:string, OwnerId:string, OwnerIsUser:string}} Returns the group definition if the user is a member.
         * @example
         * <pre>{ID: "190", Name: "Blog Contributors", Description: "We are bloggers...", OwnerID: "126", OwnerIsUser: "False"}</pre>
         */
        checkIfMember(groupName: string, force: boolean = false): angular.IPromise<IGroupDefinition> {
            //Allow function to be called before group collection is ready
            var deferred = this.$q.defer();

            //Initially ensure groups are ready, any future calls will receive the return
            this.getGroupCollection(force).then((groupCollection) => {
                var groupDefinition = _.find(groupCollection, { Name: groupName });
                deferred.resolve(groupDefinition);
            });

            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apUserModel:getGroupCollection
         * @methodOf angularPoint.apUserModel
         * @description
         * Returns the group definitions for the current user and caches results.
         * @param {boolean} [force=false] Ignore any cached value.
         * @returns {IGroupDefinition[]} Promise which resolves with the array of groups the user belongs to.
         */
        getGroupCollection(force: boolean = false): angular.IPromise<IGroupDefinition[]> {
            if (!_getGroupCollection || force) {
                /** Create a new deferred object if not already defined */
                var deferred = this.$q.defer();
                this.getUserProfile(force).then((userProfile) => {
                    this.apDataService.getGroupCollectionFromUser(userProfile.userLoginName)
                        .then((groupCollection) => {
                        deferred.resolve(groupCollection);
                    });
                });
                _getGroupCollection = deferred.promise;
            }
            return _getGroupCollection;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apUserModel:getUserProfile
         * @methodOf angularPoint.apUserModel
         * @description
         * Returns the user profile for the current user and caches results.
         * Pull user profile info and parse into a profile object
         * http://spservices.codeplex.com/wikipage?title=GetUserProfileByName
         * @param {boolean} [force=false] Ignore any cached value.
         * @returns {object} Promise which resolves with the requested user profile.
         */
        getUserProfile(force: boolean = false): ng.IPromise<IUserProfile> {
            if (!_getUserProfile || force) {
                /** Create a new deferred object if not already defined */
                _getUserProfile = this.apDataService.getUserProfileByName();
            }
            return _getUserProfile;
        }


    }

    /**
     * @ngdoc service
     * @name angularPoint.apUserModel
     * @description
     * Simple service that allows us to request and cache both the current user and their group memberships.
     *
     * @requires apDataService
     *
     */
    angular.module('angularPoint')
        .service('apUserModel', UserModel);

}
