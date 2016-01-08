import {DataService} from '../services';
import {Promise} from 'es6-promise';
import {IXMLGroup, IXMLUserProfile} from '../interfaces/main';
import _ from 'lodash';

/** Local references to cached promises */
var _getGroupCollection, _getUserProfile;

export interface ISiteCollectionUserService {
    checkIfMember(groupName: string, force?: boolean): Promise<IXMLGroup>;
    getGroupCollection(force?: boolean): Promise<IXMLGroup[]>;
    getUserProfile(force?: boolean): Promise<IXMLUserProfile>;
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
export class SiteCollectionUserServiceClass {
    /**
     * @ngdoc function
     * @name angularPoint.apUserModel:checkIfMember
     * @methodOf angularPoint.apUserModel
     * @description
     * Checks to see if current user is a member of the specified group.
     * @param {string} groupName Name of the group.
     * @param {boolean} [force=false] Ignore any cached value.
     * @returns {object} Returns the group definition if the user is a member. {ID:string, Name:string, Description:string, OwnerId:string, OwnerIsUser:string}
     * @example
     * <pre>{ID: "190", Name: "Blog Contributors", Description: "We are bloggers...", OwnerID: "126", OwnerIsUser: "False"}</pre>
     */
    checkIfMember(groupName: string, force: boolean = false): Promise<IXMLGroup> {
        let promise = new Promise((resolve, reject) => {
            //Initially ensure groups are ready, any future calls will receive the return
            this.getGroupCollection(force)
                .then((groupCollection) => {
                    var groupDefinition = _.find(groupCollection, {Name: groupName});
                    resolve(groupDefinition);
                })
                .catch(err => reject(err));
        });

        return promise;
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
    getGroupCollection(force: boolean = false): Promise<IXMLGroup[]> {
        if (!_getGroupCollection || force) {
            /** Create a new deferred object if not already defined */
            let promise = new Promise((resolve, reject) => {
                this.getUserProfile(force).then((userProfile) => {
                    DataService.getGroupCollectionFromUser(userProfile.userLoginName)
                        .then((groupCollection) => {
                            resolve(groupCollection);
                        })
                        .catch(err => reject(err));
                });
                _getGroupCollection = promise;
            });
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
    getUserProfile(force: boolean = false): Promise<IXMLUserProfile> {
        if (!_getUserProfile || force) {
            /** Create a new deferred object if not already defined */
            _getUserProfile = DataService.getUserProfileByName();
        }
        return _getUserProfile;
    }


}

export let SiteCollectionUserService = new SiteCollectionUserServiceClass();
