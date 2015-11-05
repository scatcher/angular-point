/// <reference path="../../mock/app.module.mock.ts" />
module ap.test {
    'use strict';

    describe('Factory: apModelFactory', function() {

        beforeEach(module("angularPoint"));

        var factory: ModelFactory, mockModel: MockModel, mockEntityCache, mockXMLService, $rootScope: ng.IRootScopeService, $q:ng.IQService, apDataService: DataService, $httpBackend;

        beforeEach(inject(function(_mockModel_, _apModelFactory_, _mockXMLService_, _$rootScope_, _$q_, _apDataService_, _$httpBackend_) {
            mockModel = _mockModel_;
            factory = _apModelFactory_;
            mockXMLService = _mockXMLService_;
            apDataService = _apDataService_;
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            mockModel.importMocks();
            mockEntityCache = mockModel.getCache('primary');
        }));

        describe('addNewItem', function() {
            it('adds the new entity to the cacheService', function() {
                mockModel.addNewItem({ title: 'I am a Mock' })
                    .then(function(response) {
                        expect(mockModel.getCachedEntity(response.id)).toBeDefined();
                        expect(response.title).toEqual('I am a Mock');
                    });
                $httpBackend.flush();
            });
        });


        describe('createEmptyItem', function() {

            it('should return an object', function() {
                var emptyItem = mockModel.createEmptyItem();
                expect(emptyItem).toBeTruthy();
            });

            it('should have an attribute for each of the mocked fields except for "ReadOnly"', function() {
                var emptyItem = mockModel.createEmptyItem();
                var fieldsOnModel = mockModel.list.customFields.length;
                var attributesOnEmptyItem = _.keys(emptyItem).length;
                expect(fieldsOnModel - 1).toBe(attributesOnEmptyItem);
            });
        });

        //DEPRECATED
        //describe('searchLocalCache', function () {
        //
        //    it('returns the correct object when using an attribute directly on the object', function () {
        //        var searchResults = mockModel.searchLocalCache(1);
        //        expect(searchResults).toEqual(mockEntityCache[1]);
        //    });
        //
        //    it('should return the correct object when a nested property path is used', function () {
        //        var searchResults = mockModel.searchLocalCache(2, {
        //            propertyPath: 'lookup.lookupId'
        //        });
        //        expect(searchResults).toEqual(mockEntityCache[2]);
        //    });
        //
        //    it('should return undefined if no match is found', function () {
        //        var searchResults = mockModel.searchLocalCache('fake id', {
        //            propertyPath: 'lookup.lookupId'
        //        });
        //        expect(searchResults).toBeUndefined();
        //    });
        //
        //    describe('count the number of times the cache is rebuilt', function () {
        //
        //        it('doesn\'t use the cache when searching by id', function () {
        //            mockModel.searchLocalCache(1);
        //            mockModel.searchLocalCache(2);
        //
        //            expect(mockModel._cachedIndexes).toBeUndefined();
        //        });
        //
        //        it('uses the cached results instead of building a new cache', function () {
        //            mockModel.searchLocalCache(1, {
        //                propertyPath: 'lookup.lookupId'
        //            });
        //            var initialBuildCount = getBuildCount();
        //            mockModel.searchLocalCache(1, {
        //                propertyPath: 'lookup.lookupId'
        //            });
        //            expect(initialBuildCount).toEqual(getBuildCount());
        //        });
        //
        //        it('rebuilds the cache when a change is made', function () {
        //            mockModel.searchLocalCache(1, {
        //                propertyPath: 'lookup.lookupId'
        //            });
        //
        //            var initialBuildCount = getBuildCount();
        //
        //            /** Add another entity to the cache */
        //            mockModel.getCache()[3] = new mockModel.factory({
        //                lookup: {lookupId: 3},
        //                id: 3
        //            });
        //
        //            mockModel.searchLocalCache(2, {
        //                propertyPath: 'lookup.lookupId'
        //            });
        //
        //            expect(initialBuildCount).not.toEqual(getBuildCount());
        //        });
        //    });
        //
        //    it('returns an array of items if an array is specified', function () {
        //
        //        expect(mockModel.searchLocalCache([1, 2]).length).toEqual(2);
        //    });
        //
        //    function getBuildCount() {
        //        return mockModel._cachedIndexes.main.lookup.lookupId.buildCount;
        //    }
        //
        //
        //});

        describe('Method: getListItemById', function() {
            it('returns a single list item', function() {
                mockModel.getListItemById(1)
                    .then(function(response) {
                        expect(response.id).toEqual(1);
                    });
                $httpBackend.flush();
            });
            //it('returns undefined if no matching record is found', function () {
            //    mockXMLService.xhrStub('emptyResponse');
            //    mockModel.getListItemById(5)
            //        .then(function (response) {
            //            expect(response).toBeUndefined();
            //        });
            //    $rootScope.$digest();
            //});
        });

        describe('Method: getAllListItems', function() {
            it('returns both expected entities', function() {
                mockModel.getAllListItems(1)
                    .then(function(response) {
                        expect(response.count()).toEqual(2);
                    });
                $httpBackend.flush();
            });
        });

        describe('Method: getQuery', function() {
            it('returns the query by name', function() {
                expect(mockModel.getQuery('primary')).toBe(mockModel.queries.primary);
            });
            it('returns undefined if a query is requested that hasn\'t been registered', function() {
                expect(mockModel.getQuery('never registered')).toBeUndefined();
            });
        });

        describe('Method: getFieldDefinition', function() {
            it('correctly looks up the field definition given the field name', function() {
                expect(mockModel.getFieldDefinition('id')).toBe(mockModel.list.fields[0]);
            });
        });

        describe('Method: extendListMetadata', function() {
            it('extends the list information from xml', function() {
                mockModel.deferredListDefinition = null;
                mockModel.extendListMetadata();
                $httpBackend.flush();
                expect(mockModel.deferredListDefinition).not.toBeNull();
            });

            it('only fetches the list definition once although it\'s requested multiple times', function() {
                spyOn(apDataService, 'getList').and.callThrough();
                mockModel.deferredListDefinition = null;
                mockModel.extendListMetadata();
                mockModel.extendListMetadata();
                $httpBackend.flush();
                expect(apDataService.getList.calls.count()).toEqual(1);
            });
        });

        describe('Method: isInitialized', function() {
            it('should return true if an initial query has been made', function() {
                mockModel.executeQuery('primary');
                expect(mockModel.isInitialised()).toBe(true);
            });
        });

        describe('Method: generateMockData', function() {
            it('creates n mock records', function() {
                expect(mockModel.generateMockData({ quantity: 12 }).length)
                    .toEqual(12);
            });
        });

        describe('Method: validateEntity', function() {
            it('validates a valid entity', function() {
                expect(mockModel.validateEntity(mockEntityCache[1])).toBe(true);
            });

            it('rejects a null value', function() {
                mockEntityCache[1].boolean = null;
                expect(mockModel.validateEntity(mockEntityCache[1])).toBe(false);
            });
        });

        describe('Method: resolvePermissions', function() {
            it('correctly identifies that the user can approve', function() {
                mockModel.list.permissions = new ap.BasePermissionObject();
                mockModel.list.permissions['ApproveItems'] = true;
                expect(mockModel.resolvePermissions().ApproveItems).toBe(true);
            });
            it('falls back to use permission from first list item to resolve', function() {
                let initialPermissions = mockModel.resolvePermissions();
                expect(initialPermissions.AddListItems).toEqual(true);
                //Make sure not to use saved permissions on list
                mockModel.list.permissions = undefined;
                //Update value on first list item which is what will be used to populate list permissions
                var firstListItemPermissions = mockModel.getCachedEntities().first().resolvePermissions();

                //Service will attempt to use same permissions as an existing list item
                expect(mockModel.resolvePermissions()).toEqual(firstListItemPermissions);
            });
            it('correctly identifies that the user doesn\'t have the required permissions', function() {
                //Clear out any list permissions
                mockModel.list.permissions = undefined;
                let firstListItem = mockModel.getCachedEntities().first();
                //Set permissions to allow approving list items
                firstListItem.permMask = '0x0000000000000010';
                let updatedPermissions = mockModel.resolvePermissions();

                expect(firstListItem.resolvePermissions()).toEqual(updatedPermissions);

                expect(updatedPermissions.EditListItems).toEqual(false);
                expect(updatedPermissions.ApproveItems).toEqual(true);

                mockModel.list.permissions = undefined;
                //Update the permMask for the first list item, giving the user only the ability to ViewListItems
                firstListItem.permMask = '0x0000000000000001';
                updatedPermissions = mockModel.resolvePermissions();

                expect(firstListItem.resolvePermissions()).toEqual(updatedPermissions);

                expect(updatedPermissions.ViewListItems).toEqual(true);
                expect(updatedPermissions.ApproveItems).toEqual(false);

            });
        });

        function getResponseXML() {
            var deferred = $q.defer();
            deferred.resolve(mockXMLService.listItemsSinceChangeToken);
            return deferred.promise;
        }

        function mockExecuteQuery() {
            var deferred = $q.defer();
            deferred.resolve(mockModel.getCache());
            return deferred.promise;
        }


        //describe('Method: getLocalEntity', function () {
        //    it('finds the correct entity using the list item id', function () {
        //        expect(mockModel.getLocalEntity(2)).toEqual(mockEntityCache[2]);
        //    });
        //});
    });
}