import {Injectable} from '@angular/core';
import {DataService} from './dataservice.service';
import {Observable} from 'rxjs/Observable';

/** Local references to cached observabless */
var _getGroupCollection$, _getUserProfile$;


/**
 * @ngdoc service
 * @name angularPoint.UserProfileService
 * @description
 * Simple service that allows us to request and cache both the current user and their group memberships.
 *
 * @requires DataService
 *
 */
@Injectable()
export class UserProfileService {
    constructor(private dataService: DataService) { }
    /**
     * @ngdoc function
     * @name angularPoint.UserProfileService:checkIfMember
     * @methodOf angularPoint.UserProfileService
     * @description
     * Checks to see if current user is a member of the specified group.
     * @param {string} groupName Name of the group.
     * @returns {Observable<IXMLGroup>} Returns the group definition if the user is a member. {ID:string, Name:string, Description:string, OwnerId:string, OwnerIsUser:string}
     * @example
     * <pre>{ID: "190", Name: "Blog Contributors", Description: "We are bloggers...", OwnerID: "126", OwnerIsUser: "False"}</pre>
     */
    checkIfMember(groupName: string): Observable<IXMLGroup> {
        //Initially ensure groups are ready, any future calls will receive the return
        return this
            .getGroupCollection()
            .map(groupCollection => {
                var groupDefinition = groupCollection.find(group => group.Name === groupName);
                return groupDefinition;
            });
    }

    /**
     * @ngdoc function
     * @name angularPoint.UserProfileService:getGroupCollection
     * @methodOf angularPoint.UserProfileService
     * @description
     * Returns the group definitions for the current user and caches results.
     * @returns {Observable<IXMLGroup[]>} Observable which resolves with the array of groups the user belongs to.
     */
    getGroupCollection(): Observable<IXMLGroup[]> {
        if (!_getGroupCollection$) {
            /** Create a new deferred object if not already defined */
            _getGroupCollection$ = this
                .getUserProfile()
                .map(userProfile => {
                    return this.dataService.getGroupCollectionFromUser(userProfile.userLoginName);
                })
                .flatMap(groupCollection => groupCollection);
        }
        return _getGroupCollection$;
    }

    /**
     * @ngdoc function
     * @name angularPoint.UserProfileService:getUserProfile
     * @methodOf angularPoint.UserProfileService
     * @description
     * Returns the user profile for the current user and caches results.
     * Pull user profile info and parse into a profile object
     * http://spservices.codeplex.com/wikipage?title=GetUserProfileByName
     * @returns {Observable<IXMLUserProfile>} Observable which resolves with the requested user profile.
     */
    getUserProfile(): Observable<IXMLUserProfile> {
        if (!_getUserProfile$) {
            /** Create a new deferred object if not already defined */
            _getUserProfile$ = this.dataService.getUserProfileByName();
        }
        return _getUserProfile$;
    }


}

export interface IXMLGroup {
    Description: string;
    ID: string;
    Name: string;
    OwnerID: string;
    OwnerIsUser: string;
}

export interface IXMLUser {
    Email: string;
    Flags: string;
    ID: string;
    IsDomainGroup: string;
    IsSiteAdmin: string;
    LoginName: string;
    Name: string;
    Notes: string;
    Sid: string;
}

export interface IXMLUserProfile {
    userLoginName: string; // added to allow us to optionally add a prefix if necessary from apConfig
    UserProfile_GUID: string;
    AccountName: string;
    FirstName: string;
    'SPS-PhoneticFirstName': string;
    LastName: string;
    'SPS-PhoneticLastName': string;
    PreferredName: string;
    'SPS-PhoneticDisplayName': string;
    WorkPhone: string;
    Department: string;
    Title: string;
    'SPS-JobTitle': string;
    Manager: string;
    AboutMe: string;
    PersonalSpace: string;
    PictureURL: string;
    UserName: string;
    QuickLinks: string;
    WebSite: string;
    PublicSiteRedirect: string;
    'SPS-Dotted-line': string;
    'SPS-Peers': string;
    'SPS-Responsibility': string;
    'SPS-SipAddress': string;
    'SPS-MySiteUpgrade': string;
    'SPS-DontSuggestList': string;
    'SPS-ProxyAddresses': string;
    'SPS-HireDate': string;
    'SPS-DisplayOrder': string;
    'SPS-ClaimID': string;
    'SPS-ClaimProviderID': string;
    'SPS-ClaimProviderType': string;
    'SPS-LastColleagueAdded': string;
    'SPS-OWAUrl': string;
    'SPS-SavedAccountName': string;
    'SPS-ResourceAccountName': string;
    'SPS-ObjectExists': string;
    'SPS-MasterAccountName': string;
    'SPS-DistinguishedName': string;
    'SPS-SourceObjectDN': string;
    'SPS-LastKeywordAdded': string;
    WorkEmail: string;
    CellPhone: string;
    Fax: string;
    HomePhone: string;
    Office: string;
    'SPS-Location': string;
    'SPS-TimeZone': string;
    Assistant: string;
    'SPS-PastProjects': string;
    'SPS-Skills': string;
    'SPS-School': string;
    'SPS-Birthday': string;
    'SPS-StatusNotes': string;
    'SPS-Interests': string;
    'SPS-EmailOptin': string;
}