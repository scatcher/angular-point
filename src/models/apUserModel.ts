import * as _ from 'lodash';
import { DataService } from '../services/apDataService';
import { XMLGroup, XMLUserProfile } from '../interfaces/index';
/** Local references to cached promises */
let _getGroupCollection, _getUserProfile;

export interface IUserModel {
    checkIfMember(groupName: string, force?: boolean): angular.IPromise<XMLGroup>;
    getGroupCollection(force?: boolean): angular.IPromise<XMLGroup[]>;
    getUserProfile(force?: boolean): ng.IPromise<XMLUserProfile>;
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
export class UserModel {
    static $inject = ['$q', 'apDataService'];

    constructor(private $q: ng.IQService, private apDataService: DataService) {}

    /**
     * @ngdoc function
     * @name angularPoint.apUserModel:checkIfMember
     * @methodOf angularPoint.apUserModel
     * @description
     * Checks to see if current user is a member of the specified group.
     * @param {string} groupName Name of the group.
     * @param {boolean} [force=false] Ignore any cached value.
     * @returns {object} Returns the group definition if the user is a member.
     * {ID:string, Name:string, Description:string, OwnerId:string, OwnerIsUser:string}
     * @example
     * <pre>{ID: "190", Name: "Blog Contributors", Description: "We are bloggers...", OwnerID: "126", OwnerIsUser: "False"}</pre>
     */
    checkIfMember(groupName: string, force = false) {
        // Allow function to be called before group collection is ready
        const deferred = this.$q.defer();

        // Initially ensure groups are ready, any future calls will receive the return
        this.getGroupCollection(force).then(groupCollection => {
            const groupDefinition = _.find(groupCollection, { Name: groupName });
            deferred.resolve(groupDefinition);
        });

        return deferred.promise as ng.IPromise<XMLGroup>;
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
    getGroupCollection(force = false): angular.IPromise<XMLGroup[]> {
        if (!_getGroupCollection || force) {
            /** Create a new deferred object if not already defined */
            const deferred = this.$q.defer();
            this.getUserProfile(force).then(userProfile => {
                this.apDataService.getGroupCollectionFromUser(userProfile.userLoginName).then(groupCollection => {
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
    getUserProfile(force = false): ng.IPromise<XMLUserProfile> {
        if (!_getUserProfile || force) {
            /** Create a new deferred object if not already defined */
            _getUserProfile = this.apDataService.getUserProfileByName();
        }
        return _getUserProfile;
    }
}
