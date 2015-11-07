/// <reference path="../../mock/app.module.mock.ts" />
module ap.test {
    'use strict';

    describe('Factory: apModelFactory', function() {

        beforeEach(module("angularPoint"));

        var factory: ModelFactory, mockModel: MockModel, mockEntityCache, mockXMLService, $rootScope: ng.IRootScopeService,
            $q: ng.IQService, apDataService: DataService, $httpBackend,
            secondaryQueryCache: IndexedCache<MockListItem>;

        beforeEach(inject(function(_mockModel_, _apModelFactory_, _mockXMLService_, _$rootScope_, _$q_, _apDataService_, _$httpBackend_) {
            mockModel = _mockModel_;
            factory = _apModelFactory_;
            mockXMLService = _mockXMLService_;
            apDataService = _apDataService_;
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            secondaryQueryCache = mockModel.getCache<MockListItem>('secondary');
            mockModel.importMocks();
            mockEntityCache = mockModel.getCache('primary');
        }));

        describe('addNewItem', function() {
            it('adds the new entity to the cacheService', function() {
                mockModel.addNewItem<MockListItem>({ title: 'I am a Mock' })
                    .then(function(response) {
                        expect(mockModel.getCachedEntity(response.id)).toBeDefined();
                        expect(response.title).toEqual('I am a Mock');
                    });
                $httpBackend.flush();
            });
            it('creates a new list item', function() {
                mockModel.addNewItem<MockListItem>({ integer: 11 })
                    .then(function(response) {
                        expect(response.integer).toEqual(11);
                    });
                $httpBackend.flush();
            });
            it('doesn\'t add it to existing caches', function() {
                mockModel.addNewItem<MockListItem>({ integer: 11 })
                    .then(function(response) {
                        expect(secondaryQueryCache[response.id]).toBeUndefined();
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

    });
}