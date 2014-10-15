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
        $httpBackend;


    beforeEach(inject(function (_apDataService_, _mockModel_, _mockXMLService_, $injector) {
        apDataService = _apDataService_;
        mockModel = _mockModel_;
        mockXMLService = _mockXMLService_;
        mockXML = mockXMLService.GetListItemChangesSinceToken;
        mockModel.importMocks();
        primaryQueryCache = mockModel.getCache('primary');
        secondaryQueryCache = mockModel.getCache('secondary');
        mockToUpdate = mockModel.getCache('primary')[1];

        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');


    }));

    describe('Function: getCurrentSite', function () {
        it('returns the site url', function () {
            apDataService.getCurrentSite()
                .then(function (response) {
                    expect(response).toEqual('http://sharepoint.company-server.com/mysite');
                });
            $httpBackend.flush();
        });
    });

    describe('Function: updateListItem', function () {
        it('updates the list item', function () {
            mockToUpdate.integer = 44;
            apDataService.updateListItem(mockModel, mockToUpdate)
                .then(function (response) {
                    expect(mockToUpdate.integer).toEqual(44);
                    expect(response.integer).toEqual(44);
                });
            $httpBackend.flush();
        });
        it('updates all cache\'s because they are be referencing the same object', function () {
            apDataService.updateListItem(mockModel, primaryQueryCache[1])
                .then(function (response) {
                    expect(primaryQueryCache[1]).toEqual(secondaryQueryCache[1]);
                    expect(secondaryQueryCache[1].integer).toEqual(response.integer);
                });
            $httpBackend.flush();
        });
    });

    describe('Function: createListItem', function () {
        it('creates a new list item', function () {
            apDataService.createListItem(mockModel, {integer: 11})
                .then(function (response) {
                    expect(response.integer).toEqual(11);
                    expect(response.id).toEqual(3);
                });
            $httpBackend.flush();
        });
        it('doesn\'t add it to existing caches', function () {
            apDataService.createListItem(mockModel, {integer: 11})
                .then(function (response) {
                    expect(response.id).toEqual(3);
                    expect(secondaryQueryCache[3]).toBeUndefined()
                });
            $httpBackend.flush();
        });
    });

    describe('Function: deleteListItem', function () {
        it('removes entity with ID of 1 from all cache objects', function () {
            apDataService.deleteListItem(mockModel, primaryQueryCache[1], {updateAllCaches: true})
                .then(function () {
                    expect(primaryQueryCache[1]).toBeUndefined();
                    expect(secondaryQueryCache[1]).toBeUndefined();
                });
            $httpBackend.flush();
        });
    });


    describe('Function: deleteAttachment', function () {
        it('resolves the deleteAttachment request', function () {
            apDataService.deleteAttachment({})
                .then(function (response) {
                    /** If an error isn't returned, the operation was successful */
                    expect(response).toBeDefined();
                });
        })
    });

    describe('Function: retrieveChangeToken', function () {
        it('returns the change token from the XML', function () {
            expect(apDataService.retrieveChangeToken(mockXML))
                .toEqual('1;3;f5345fe7-2f7c-49f7-87d0-dbfebdd0ce61;635452551037430000;387547');
        })
    });

    describe('Function: retrievePermMask', function () {
        it('returns perm mask for the current user on this lsit', function () {
            expect(apDataService.retrievePermMask(mockXML)).toEqual('FullMask');
        })
    });

    describe('Function: getCollection', function () {
        it('can process a GetListCollection call', function () {
            apDataService.getCollection({operation: 'GetListCollection'})
                .then(function (listCollection) {
                    expect(listCollection.length).toEqual(1);
                });
            $httpBackend.flush();
        });
    });

    describe('Function: getListItemById', function () {
        it('returns a single list item', function () {
            apDataService.getListItemById(1, mockModel)
                .then(function (response) {
                    expect(response.id).toEqual(1);
                });
            $httpBackend.flush();
        });
    });

    describe('Function: getUserProfileByName', function () {
        it('returns a user profile object', function () {
            apDataService.getUserProfileByName()
                .then(function (response) {
                    expect(response).toEqual({
                        UserProfile_GUID: 'e1234f12-6992-42eb-9bbc-b3a123b29295',
                        AccountName: 'DOMAIN\\John.Doe',
                        PreferredName: 'DOMAIN\\John.Doe',
                        UserName: 'John.Doe',
                        userLoginName: 'DOMAIN\\John.Doe'
                    });
                });
            $httpBackend.flush();
        });
    });

    describe('Function: getGroupCollectionFromUser', function () {
        it('returns an array of groups the user belongs to', function () {
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
            $httpBackend.flush();
        });
    });

    //ddescribe('Function: getView', function () {
    //    it('can process a list definition', function () {
    //        apDataService.getView({listName: mockModel.list.guid})
    //            .then(function (response) {
    //                expect(response.viewFields).toBeDefined();
    //            });
    //        $httpBackend.flush();
    //    });
    //});

    describe('Function: getList', function () {
        it('can process a list definition', function () {
            apDataService.getList({listName: mockModel.list.guid})
                .then(function (response) {
                    expect(response).toBeDefined();
                });
            $httpBackend.flush();
        });
    });

    describe('Function: getListFields', function () {
        it('returns an array of field definition objects', function () {
            apDataService.getListFields({listName: mockModel.list.guid})
                .then(function (response) {
                    expect(response.length).toEqual(98);
                });
            $httpBackend.flush();
        });
    });

    describe('Function: getFieldVersionHistory', function () {
        it('returns an array containing 3 versions of the mock.integer field', function () {
            var fieldDefinition = mockModel.getField('integer');
            apDataService.getFieldVersionHistory({}, fieldDefinition)
                .then(function (response) {
                    expect(response.length).toEqual(3);
                });
            $httpBackend.flush();
        });
    });

    describe('Function: executeQuery', function () {
        it('can complete a query form a known model', function () {
            primaryQueryCache.clear();
            ////Ensure there's nothing left in the cache and we remove any existing change token
            expect(primaryQueryCache.count()).toEqual(0);
            mockModel.getQuery().changeToken = undefined;
            apDataService.executeQuery(mockModel, mockModel.getQuery())
                .then(function (response) {
                    expect(response.count()).toEqual(2);
                });
            $httpBackend.flush();
        });
    });

    describe('Function: processDeletionsSinceToken', function () {
        it('removes a deleted entity from the array', function () {
            apDataService.processDeletionsSinceToken(mockXMLService.getChangeToken_Delete, primaryQueryCache);
            expect(primaryQueryCache[1]).toBeUndefined();
        });
    });

    describe('Function: getAvailableWorkflows', function () {
        it('removes a deleted entity from the array', function () {
            apDataService.getAvailableWorkflows(mockToUpdate.fileRef.lookupValue)
                .then(function (templates) {
                    expect(templates.length).toBeGreaterThan(0);
                    expect(templates[0].name).toEqual('WidgetApproval');
                });
            $httpBackend.flush();
        });
    });

});
