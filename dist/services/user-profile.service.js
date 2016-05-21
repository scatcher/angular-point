"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var dataservice_service_1 = require('./dataservice.service');
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
var UserProfileService = (function () {
    function UserProfileService(dataService) {
        this.dataService = dataService;
    }
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
    UserProfileService.prototype.checkIfMember = function (groupName) {
        //Initially ensure groups are ready, any future calls will receive the return
        return this
            .getGroupCollection()
            .map(function (groupCollection) {
            var groupDefinition = groupCollection.find(function (group) { return group.Name === groupName; });
            return groupDefinition;
        });
    };
    /**
     * @ngdoc function
     * @name angularPoint.UserProfileService:getGroupCollection
     * @methodOf angularPoint.UserProfileService
     * @description
     * Returns the group definitions for the current user and caches results.
     * @returns {Observable<IXMLGroup[]>} Observable which resolves with the array of groups the user belongs to.
     */
    UserProfileService.prototype.getGroupCollection = function () {
        var _this = this;
        if (!_getGroupCollection$) {
            /** Create a new deferred object if not already defined */
            _getGroupCollection$ = this
                .getUserProfile()
                .map(function (userProfile) {
                return _this.dataService.getGroupCollectionFromUser(userProfile.userLoginName);
            })
                .flatMap(function (groupCollection) { return groupCollection; });
        }
        return _getGroupCollection$;
    };
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
    UserProfileService.prototype.getUserProfile = function () {
        if (!_getUserProfile$) {
            /** Create a new deferred object if not already defined */
            _getUserProfile$ = this.dataService.getUserProfileByName();
        }
        return _getUserProfile$;
    };
    UserProfileService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [dataservice_service_1.DataService])
    ], UserProfileService);
    return UserProfileService;
}());
exports.UserProfileService = UserProfileService;
//# sourceMappingURL=user-profile.service.js.map