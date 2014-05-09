'use strict';

/**Angular will instantiate this singleton by calling "new" on this function the first time it's referenced
 /* State will persist throughout life of session*/
angular.module('angularPoint')
    .service('apUserModel', function ($q, apDataService, apConfig) {

        var model = {};

        /**
         * Pull user profile info and parse into a profile object
         * http://spservices.codeplex.com/wikipage?title=GetUserProfileByName
         */
        model._getUserProfile = function() {
            var deferred = $q.defer();
            apDataService.serviceWrapper({
                operation: 'GetUserProfileByName'
            }).then(function(serverResponse) {
                var userProfile = {};
                //Not formatted like a normal SP response so need to manually parse
                $(serverResponse).SPFilterNode('PropertyData').each(function() {
                    var nodeName = $(this).SPFilterNode('Name');
                    var nodeValue = $(this).SPFilterNode('Value');
                    if(nodeName.length > 0 && nodeValue.length > 0) {
                        userProfile[nodeName.text().trim()] = nodeValue.text().trim();
                    }
                });
                userProfile.userLoginName = apConfig.userLoginNamePrefix ? apConfig.userLoginNamePrefix + userProfile.AccountName : userProfile.AccountName;
                deferred.resolve(userProfile);
            });

            return deferred.promise;
        };

        //Make the call and create a reference for future use
        model.getUserProfile = model._getUserProfile();

        model._getGroupCollection = function() {
            var deferred = $q.defer();
            model.getUserProfile.then(function(userProfile) {
                apDataService.serviceWrapper({
                    operation: 'GetGroupCollectionFromUser',
                    userLoginName: userProfile.userLoginName,
                    filterNode: 'Group'
                }).then(function(groupCollection) {
                    deferred.resolve(groupCollection);
                });
            });
            return deferred.promise;
        };

        model.getGroupCollection = model._getGroupCollection();

        model.checkIfMember = function(groupName) {
            //Allow function to be called before group collection is ready
            var deferred = $q.defer();
            var self = this;

            //Initially ensure groups are ready, any future calls will receive the returne
            model.getGroupCollection.then(function(groupCollection) {
                //Data is ready
                //Map the group names to cache results for future calls, rebuild if data has changed
                if(!self.groupMap || self.groupMap.length !== groupCollection.length) {
                    self.groupMap = [];
                    _.each(groupCollection, function(group) {
                        self.groupMap.push(group.Name);
                    });
                }
                deferred.resolve( _.isObject(groupCollection[self.groupMap.indexOf(groupName)]) );
            });

            return deferred.promise;
        };

        return model;
    });