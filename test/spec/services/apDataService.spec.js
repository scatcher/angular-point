"use strict";

describe("Service: apDataService", function () {

    beforeEach(module("angularPoint"));

    var apDataService,
        primaryQueryCache,
        secondaryQueryCache,
        mockModel,
        mockToUpdate,
        mockXML,
        mockXMLService,
        $rootScope,
        $httpBackend;


    beforeEach(inject(function (_apDataService_, _mockModel_, _mockXMLService_, _$rootScope_, $injector) {
        apDataService = _apDataService_;
        mockModel = _mockModel_;
        $rootScope = _$rootScope_;
        mockXMLService = _mockXMLService_;
        mockXML = mockXMLService.GetListItemChangesSinceToken;
        mockModel.importMocks();
        primaryQueryCache = mockModel.getCache('primary');
        secondaryQueryCache = mockModel.getCache('secondary');

        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');




    }));

    describe('Function: addUpdateItemModel', function () {
        describe('add item', function () {
            it('the cache to have the new item', function () {
                mockXMLService.xhrStub('CreateListItem');

                apDataService.addUpdateItemModel(mockModel, {text: 'New Entity'})
                    .then(function (response) {
                        expect(response.id).toEqual(4);
                        expect(primaryQueryCache[4]).toBeDefined();
                        expect(secondaryQueryCache[4]).toBeUndefined();
                    });
                $rootScope.$digest();
            });
        });
        describe('update item', function () {
            beforeEach(function () {
                mockXMLService.xhrStub('UpdateListItem');
                mockToUpdate = mockModel.getCache('primary')[1];
            });
            it('has the updated value', function () {
                apDataService.addUpdateItemModel(mockModel, mockToUpdate)
                    .then(function (response) {
                        expect(mockToUpdate.integer).toEqual(13);
                        expect(response.integer).toEqual(13);
                    });
                $rootScope.$digest();
            });
            it('the other caches also contain the same data because they should be referencing the same object', function () {
                apDataService.addUpdateItemModel(mockModel, mockToUpdate)
                    .then(function (response) {
                        expect(secondaryQueryCache[1].integer).toEqual(response.integer);
                    });
                $rootScope.$digest();

            });
        });
    });

    describe('Function: cleanCache', function () {
        beforeEach(function () {
            apDataService.cleanCache(primaryQueryCache[1]);
        });
        it('removes 1 of the entities from the cache', function () {
            expect(primaryQueryCache.count()).toEqual(1);
        });
        it('leaves a reference in the secondary cache', function () {
            expect(secondaryQueryCache.count()).toEqual(2);
        });

    });

    describe('Function: deleteItemModel', function () {
        describe('delete from single cache', function () {
            it('removes entity with ID of 1 from the primary cache', function () {
                mockXMLService.xhrStub('DeleteListItem');
                apDataService.deleteItemModel(mockModel, primaryQueryCache[1])
                    .then(function (response) {
                        expect(primaryQueryCache[1]).toBeUndefined();
                        expect(secondaryQueryCache[1]).toBeDefined();
                    });
                $rootScope.$digest();
            });
        });
        describe('delete from all query caches', function () {
            it('removes entity with ID of 1 from all cache objects', function () {
                mockXMLService.xhrStub('DeleteListItem');
                apDataService.deleteItemModel(mockModel, primaryQueryCache[1], {updateAllCaches: true})
                    .then(function (response) {
                        expect(primaryQueryCache[1]).toBeUndefined();
                        expect(secondaryQueryCache[1]).toBeUndefined();
                    });
                $rootScope.$digest();
            });
        });
        describe('rejects promise if there\'s an error deleting', function () {
            it('removes entity with ID of 1 from all cache objects', function () {
                mockXMLService.xhrStub('errorUpdatingListItem');
                apDataService.deleteItemModel(mockModel, primaryQueryCache[1])
                    .then(function (response) {
                        expect(primaryQueryCache[1]).toBeDefined();
                        expect(secondaryQueryCache[1]).toBeDefined();
                    }, function (err) {
                        expect(err).toBeDefined();
                    });
                $rootScope.$digest();
            });
        });
    });


    describe('Function: deleteAttachment', function () {
        it('resolves the deleteAttachment request', function () {
            mockXMLService.xhrStub('deleteAttachment');
            apDataService.deleteAttachment({})
                .then(function (response) {
                    expect(response).toBeDefined();
                });
        })
    });

    describe('Function: retrieveChangeToken', function () {
        it('returns the change token from the XML', function () {
            expect(apDataService.retrieveChangeToken(mockXML)).toEqual('1;3;f5345fe7-2f7c-49f7-87d0-dbfebdd0ce61;635452551037430000;387547');
        })
    });

    describe('Function: retrievePermMask', function () {
        it('returns perm mask for the current user on this lsit', function () {
            expect(apDataService.retrievePermMask(mockXML)).toEqual('FullMask');
        })
    });

    describe('Function: removeEntityFromLocalCache', function () {
        beforeEach(function () {
            apDataService.removeEntityFromLocalCache(primaryQueryCache, 1);
        });
        it('removes 1 of the entities from the cache', function () {
            expect(primaryQueryCache.count()).toEqual(1);
        });
    });

    describe('Function: getCollection', function () {
        it('can process a GetListCollection call', function () {
            mockXMLService.xhrStub('getListCollection');
            apDataService.getCollection({operation: 'GetListCollection'})
                .then(function (listCollection) {
                    expect(listCollection.length).toEqual(1);
                });
            $rootScope.$digest();
        });
    });

    describe('Function: getListItemById', function () {
        it('returns a single list item', function () {
            mockXMLService.xhrStub('getListItemById');
            apDataService.getListItemById(1, mockModel)
                .then(function (response) {
                    expect(response.id).toEqual(1);
                });
            $rootScope.$digest();
        });
    });

    describe('Function: getUserProfileByName', function () {
        it('returns a user profile object', function () {
            mockXMLService.xhrStub('getUserProfileByName');
            apDataService.getUserProfileByName()
                .then(function (response) {
                    expect(response).toEqual({
                        UserProfile_GUID: 'e1234f12-6992-42eb-9bbc-b3a123b29295',
                        AccountName: 'DOMAINJohn.Doe',
                        PreferredName: 'DOMAINJohn.Doe',
                        UserName: 'John.Doe',
                        userLoginName: 'DOMAINJohn.Doe'
                    });
                });
            $rootScope.$digest();
        });
    });

    describe('Function: getGroupCollectionFromUser', function () {
        it('returns an array of groups the user belongs to', function () {
            mockXMLService.xhrStub('getGroupCollectionFromUser');
            apDataService.getGroupCollectionFromUser()
                .then(function (response) {
                    expect(response).toEqual([{
                        ID: '385',
                        Name: 'Super Duper Admins',
                        Description: '',
                        OwnerID: '338',
                        OwnerIsUser: 'True'
                    }, {
                        ID: '396',
                        Name: 'Super Duper Contributors',
                        Description: 'Members of this group are able to contribute to create and edit project records.',
                        OwnerID: '385',
                        OwnerIsUser: 'False'
                    }, {
                        ID: '398',
                        Name: 'Super Duper Viewers',
                        Description: 'Members of this group are able to view project specific information.',
                        OwnerID: '385',
                        OwnerIsUser: 'False'
                    }]);
                });
            $rootScope.$digest();
        });
    });


    //TODO Get $httpBackend working
    //describe('Function: getCurrentSite', function () {
    //    it('returns the site url', function () {
    //
    //        /** Mock response for apDataService.getCurrentSite */
    //        $httpBackend.when('POST', '/_vti_bin/Webs.asmx')
    //            .respond(function (method, url, data) {
    //                return [200, mockXMLService.getWebUrlFromPageUrl];
    //            });
    //
    //        apDataService.getCurrentSite()
    //            .then(function (response) {
    //                expect(response).toEqual('');
    //            });
    //
    //        $httpBackend.flush();
    //    });
    //});

    describe('Function: getView', function () {
        it('can process a list definition', function () {
            mockXMLService.xhrStub('GetView');
            apDataService.getView({listName: mockModel.list.guid})
                .then(function (response) {
                    expect(response.viewFields).toBeDefined();
                });
            $rootScope.$digest();
        });
    });

    describe('Function: getList', function () {
        it('can process a list definition', function () {
            mockXMLService.xhrStub('GetList');
            apDataService.getList({listName: mockModel.list.guid})
                .then(function (response) {
                    expect(response).toEqual(mockXMLService.GetList);
                });
            $rootScope.$digest();
        });
    });

    describe('Function: getListFields', function () {
        it('can extend the list fields', function () {
            mockXMLService.xhrStub('GetList');
            apDataService.getListFields({listName: mockModel.list.guid})
                .then(function (response) {
                    expect(response.length).toEqual(98);
                });
            $rootScope.$digest();
        });
    });

    describe('Function: getFieldVersionHistory', function () {
        it('returns an array containing 3 versions of the mock.integer field', function () {
            mockXMLService.xhrStub('GetVersionCollection');
            var fieldDefinition = mockModel.getField('integer');

            apDataService.getFieldVersionHistory({}, fieldDefinition)
                .then(function (response) {
                    expect(response.length).toEqual(3);
                });
            $rootScope.$digest();
        });
    });

    describe('Function: executeQuery', function () {
        it('can complete a query form a known model', function () {
            mockXMLService.xhrStub('GetListItemChangesSinceToken');
            primaryQueryCache.clear();
            //Ensure there's nothing left in the cache
            expect(primaryQueryCache.count()).toEqual(0);
            apDataService.executeQuery(mockModel, mockModel.getQuery())
                .then(function (response) {
                    expect(response.count()).toEqual(2);
                });
            $rootScope.$digest();
        });
    });

    describe('Function: processDeletionsSinceToken', function () {
        it('removes a deleted entity from the array', function () {
            apDataService.processDeletionsSinceToken(mockXMLService.getChangeToken_Delete, primaryQueryCache);
            expect(primaryQueryCache[1]).toBeUndefined();
        });
    });

});