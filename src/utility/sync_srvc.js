'use strict';

/**
 * @ngdoc service
 * @name syncService
 * @description
 * Supports 3-way data binding if you decide to incorporate firebase (any change by any user
 * to a list item is mirrored across users). The data isn't saved to firebase but the change
 * event is so all subscribers are notified to request an update from SharePoint.
 */
angular.module('angularPoint')
  .factory('apSyncService', function ($q, $timeout, $firebase, apConfig) {

    /**
     * @ngdoc method
     * @name syncService#synchronizeData
     * @description
     * Constructor to handle notifying models when data is updated
     *
     * @param model
     * @param updateQuery
     * @returns {object} sync
     */
    function synchronizeData(model, updateQuery) {
      var sync = {};
      sync.updateQuery = updateQuery;
      sync.changeNotifier = new Firebase(apConfig.firebaseURL + '/changes/' + model.list.title);
      sync.lastUpdate = $firebase(sync.changeNotifier);

      /** Notify all other users listening to this model that a change has been made */
      sync.registerChange = function () {
        console.log("Change detected in " + model.list.title + ' list.');
        var timeStamp = Firebase.ServerValue.TIMESTAMP;
        /** Reset counter so change made by current user won't also cause a refresh */
        sync.changeCount = 0;
        sync.lastUpdate.$set(timeStamp);
      };

      /** Container to hold all current subscriptions for the model */
      sync.subscriptions = [];

      /** Running counter of the number of changes */
      sync.changeCount = 0;

      sync.processChanges = function () {
        /** Prevent from running the first time and when most recent change was made by current user */
        if (sync.changeCount > 0) {
          _.each(sync.subscriptions, function (callback) {
            console.log("Processing callback");
            if (_.isFunction(callback)) {
              callback();
            }
          });
        }

        sync.changeCount += 1;
      };

      /** Don't make a call more than once every second */
      sync.throttleRequests = _.throttle(function () {
        return sync.processChanges()
      }, 1000, {leading: false});

      /** Fired when anyone updates a list item */
      sync.lastUpdate.$on("change", function (newVal, oldVal) {
        sync.throttleRequests();
      });


      /** Allows subscribers (controllers) to be notified when change is made */
      sync.subscribeToChanges = function (callback) {
        if (sync.subscriptions.indexOf(callback) === -1) {
          /** Only register new subscriptions, ignore if subscription already exists */
          sync.subscriptions.push(callback);
        }
      };

      return sync;
    }

    return {
      synchronizeData: synchronizeData
    };
  });