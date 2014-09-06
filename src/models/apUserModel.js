'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apUserModel
 * @description
 * Simple service that allows us to request and cache both the current user and their group memberships.
 *
 * @requires apDataService
 * @requires apConfig
 *
 */
angular.module('angularPoint')
    .service('apUserModel', function ($q, _, apDataService, apConfig) {

        var model = {
                checkIfMember: checkIfMember,
                getGroupCollection: getGroupCollection,
                getUserProfile: getUserProfile
            },
            /** Local references to cached promises */
            _getGroupCollection,
            _getUserProfile;

        return model;


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
        function getUserProfile(force) {
            if (!_getUserProfile || force) {
                /** Create a new deferred object if not already defined */
                _getUserProfile = apDataService.getUserProfileByName();
            }
            return _getUserProfile;
        }


        /**
         * @ngdoc function
         * @name angularPoint.apUserModel:getGroupCollection
         * @methodOf angularPoint.apUserModel
         * @description
         * Returns the group names for the current user and caches results.
         * @param {boolean} [force=false] Ignore any cached value.
         * @returns {string[]} Promise which resolves with the array of groups the user belongs to.
         */
        function getGroupCollection(force) {
            if (!_getGroupCollection || force) {
                /** Create a new deferred object if not already defined */
                var deferred = $q.defer();
                getUserProfile(force).then(function (userProfile) {
                    apDataService.getGroupCollectionFromUser(userProfile.userLoginName)
                        .then(function (groupCollection) {
                            deferred.resolve(groupCollection);
                        });
                });
                _getGroupCollection = deferred.promise;
            }
            return _getGroupCollection;
        }


        /**
         * @ngdoc function
         * @name angularPoint.apUserModel:checkIfMember
         * @methodOf angularPoint.apUserModel
         * @description
         * Checks to see if current user is a member of the specified group.
         * @param {string} groupName Name of the group.
         * @param {boolean} [force=false] Ignore any cached value.
         * @returns {boolean} Is the user a member of the group?
         */
        function checkIfMember(groupName, force) {
            //Allow function to be called before group collection is ready
            var deferred = $q.defer();
            var self = this;

            //Initially ensure groups are ready, any future calls will receive the return
            model.getGroupCollection(force).then(function (groupCollection) {
                //Data is ready
                //Map the group names to cache results for future calls, rebuild if data has changed
                if (!self.groupMap || self.groupMap.length !== groupCollection.length) {
                    self.groupMap = [];
                    _.each(groupCollection, function (group) {
                        self.groupMap.push(group.Name);
                    });
                }
                deferred.resolve(_.isObject(groupCollection[self.groupMap.indexOf(groupName)]));
            });

            return deferred.promise;
        }

    });