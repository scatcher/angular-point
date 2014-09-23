'use strict';


angular.module('angularPoint')
    .service('apMocksService', function ($q, apCacheService, apIndexedCacheFactory, toastr) {
        return {
            mockRequest: mockRequest
        };

        function mockRequest(opts, args) {
            switch (opts.operation) {
                case 'UpdateListItems':
                    return updateListItems.apply(this, args);
                case 'GetListItemChangesSinceToken':
                case 'GetListItems':
                    return processListItems(opts);
                default:
                    return defaultRequest(opts)

            }
        }

        function defaultRequest(opts) {
            var deferred = $q.defer();

            $.ajax(opts.offlineXML).then(
                function (offlineData) {
                    /** Pass back the group array */
                    deferred.resolve(offlineData);
                }, function (outcome) {
                    toastr.error('You need to have a ' + opts.offlineXML + ' file in order mock this request.');
                    deferred.reject(outcome);
                });
            return deferred.promise;
        }

        function processListItems(opts) {
            var deferred = $q.defer();

            if (opts.lastRun) {
                /** Query has already been run, resolve reference to existing data */
                opts.lastRun = new Date();
                deferred.resolve(opts.getCache());
            } else {
                defaultRequest(opts)
                    .then(function (responseXML) {
                        deferred.resolve(responseXML);
                    })
            }
            return deferred.promise;
        }

        function updateListItems(entity, model) {
            var deferred = $q.defer();

            /** Mock data */
            var offlineDefaults = {
                modified: new Date(),
                editor: {
                    lookupId: 23,
                    lookupValue: 'Generic User'
                },
                getCache: function () {
                    return apIndexedCacheFactory.create();
                }
            };

            /** New Item */
            if (!entity.id) {
                var newItem = {};

                /* Include standard mock fields for new item */
                offlineDefaults.author = {
                    lookupId: 23,
                    lookupValue: 'Generic User'
                };

                offlineDefaults.created = new Date();

                /** We don't know which query cache to push it to so add it to all */
                _.each(model.queries, function (query) {
                    /** Find next logical id to assign */
                    var maxId = 1;
                    /** Find the entity with the highest ID number */
                    var lastEntity = query.getCache().last();
                    if (lastEntity) {
                        maxId = lastEntity.id;
                    }
                    offlineDefaults.id = maxId + 1;
                    /** Add default attributes */
                    _.extend(entity, offlineDefaults);
                    /** Use factory to build new object */
                    newItem = new model.factory(entity);

                    /** Register entity in global cache and in each query cache */
                    apCacheService.registerEntity(newItem, query.getCache());
                });


                deferred.resolve(newItem);
            } else {
                /** Update existing record in local cache */
                _.extend(entity, offlineDefaults);
                deferred.resolve(entity);
            }
            return deferred.promise;
        }

    });
