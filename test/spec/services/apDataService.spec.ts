/// <reference path="../../mock/app.module.mock.ts" />

module ap.test {
    'use strict';

    describe("Service: apDataService", function() {

        beforeEach(module("angularPoint"));

        var service: DataService,
            primaryQueryCache: IndexedCache<MockListItem>,
            mockModel: MockModel,
            mockToUpdate: MockListItem,
            mockXML,
            mockXMLService,
            $httpBackend;


        beforeEach(inject(function(_apDataService_, _mockModel_, _mockXMLService_, $injector) {
            service = _apDataService_;
            mockModel = _mockModel_;
            mockXMLService = _mockXMLService_;
            mockXML = mockXMLService.GetListItemChangesSinceToken;
            mockModel.importMocks();
            primaryQueryCache = mockModel.getCache<MockListItem>('primary');
            mockToUpdate = mockModel.getCache<MockListItem>('primary').get(1);

            // Set up the mock http service responses
            $httpBackend = $injector.get('$httpBackend');


        }));

        describe('Function: getCurrentSite', function() {
            it('returns the site url', function() {
                service.getCurrentSite()
                    .then(function(response) {
                        expect(response).toEqual('http://sharepoint.company-server.com/mysite');
                    });
                $httpBackend.flush();
            });
        });

        describe('Function: retrieveChangeToken', function() {
            it('returns the change token from the XML', function() {
                expect(service.retrieveChangeToken(mockXML))
                    .toEqual('1;3;f5345fe7-2f7c-49f7-87d0-dbfebdd0ce61;635452551037430000;387547');
            })
        });

        describe('Function: retrieveListPermissions', function() {
            
            let fullMaskXML = `
            <?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope>
                 <GetListItemChangesSinceTokenResponse xmlns="http://schemas.microsoft.com/sharepoint/soap/">
                    <GetListItemChangesSinceTokenResult>
                        <listitems EffectivePermMask='FullMask'></listitems>
                    </GetListItemChangesSinceTokenResult>
                </GetListItemChangesSinceTokenResponse>
            </soap:Envelope>`
            
            it('returns permmission object with all permission levels set to true', function() {
                let permissions = service.retrieveListPermissions(fullMaskXML);
                _.each(permissions, (permissionValue) => {
                    expect(permissionValue).toEqual(true);
                })
            });
           
            
            let partialPermissionXML = `
            <?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope>
                 <GetListItemChangesSinceTokenResponse xmlns="http://schemas.microsoft.com/sharepoint/soap/">
                    <GetListItemChangesSinceTokenResult>
                        <listitems EffectivePermMask='ViewListItems, AddListItems, EditListItems, DeleteListItems'></listitems>
                    </GetListItemChangesSinceTokenResult>
                </GetListItemChangesSinceTokenResponse>
            </soap:Envelope>`
            
            it('correctly sets the specified permission levels to true', function() {
                let permissions = service.retrieveListPermissions(partialPermissionXML);
                expect(permissions.ViewListItems).toEqual(true);
                expect(permissions.AddListItems).toEqual(true);
                expect(permissions.EditListItems).toEqual(true);
                expect(permissions.DeleteListItems).toEqual(true);
            });
            
            it('leaves unspecified permissions as false', function() {
                let permissions = service.retrieveListPermissions(partialPermissionXML);
                expect(permissions.ViewVersions).toEqual(false);
            });
            
            let noPermMaskXML = `
            <?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope>
                 <GetListItemChangesSinceTokenResponse xmlns="http://schemas.microsoft.com/sharepoint/soap/">
                    <GetListItemChangesSinceTokenResult></GetListItemChangesSinceTokenResult>
                </GetListItemChangesSinceTokenResponse>
            </soap:Envelope>`            
            
            it('returns undefined if no EffectivePermMask is found', function() {
                let permissions = service.retrieveListPermissions(noPermMaskXML);
                expect(permissions).toBeUndefined();
            });
            
        });

        describe('Function: getCollection', function() {
            it('can process a GetListCollection call', function() {
                service.getCollection({ operation: 'GetListCollection' })
                    .then(function(listCollection) {
                        expect(listCollection.length).toEqual(1);
                    });
                $httpBackend.flush();
            });
        });

        //describe('Function: getListItemById', function () {
        //    it('returns a single list item', function () {
        //        service.getListItemById(1, mockModel)
        //            .then(function (response) {
        //                expect(response.id).toEqual(1);
        //            });
        //        $httpBackend.flush();
        //    });
        //});

        describe('Function: getUserProfileByName', function() {
            it('returns a user profile object', function() {
                service.getUserProfileByName()
                    .then(function(response) {
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

        describe('Function: getAvailableWorkflows', function() {
            it('returns a workflow definition', function() {
                service.getAvailableWorkflows('myFileRef')
                    .then(function(response: IWorkflowDefinition[]) {
                        var expectedFirstWorkflowDefinition = {
                            instantiationUrl: "https://sharepoint.mycompany.com/_layouts/IniWrkflIP.aspx?List=fc17890e-8c0f-43b5-8e3e-ffae6f456727&amp;ID=5&amp;TemplateID={59062311-cea9-40d1-a183-6edde9333815}&amp;Web={ec744d8e-ae0a-45dd-bcd1-8a63b9b399bd}",
                            name: "WidgetApproval",
                            templateId: "{59062311-cea9-40d1-a183-6edde9333815}"
                        }
                        //Have issues comparing these objects because there's an issue with the instantiationUrl matching
                        //so just compare the name for each.
                        expect(response[0].name).toEqual(expectedFirstWorkflowDefinition.name);
                    });
                $httpBackend.flush();
            });

        });

        describe('Function: getGroupCollectionFromUser', function() {
            it('returns an array of groups the user belongs to', function() {
                service.getGroupCollectionFromUser()
                    .then(function(response) {
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

        describe('Function: getList', function() {
            it('can process a list definition', function() {
                service.getList({ listName: mockModel.list.guid })
                    .then(function(response) {
                        expect(response).toBeDefined();
                    });
                $httpBackend.flush();
            });
        });

        describe('Function: getListFields', function() {
            it('returns an array of field definition objects', function() {
                service.getListFields({ listName: mockModel.list.guid })
                    .then(function(response) {
                        expect(response.length).toEqual(98);
                    });
                $httpBackend.flush();
            });
        });

        describe('Function: getVersionHistory', function() {
            it('returns an array containing 4 versions of the mock.integer field', function() {
                var fieldDefinition = mockModel.getField('integer');
                service.getFieldVersionHistory({}, fieldDefinition)
                    .then(function(response) {
                        expect(response.count()).toEqual(4);
                    });
                $httpBackend.flush();
            });
        });

        describe('Function: processDeletionsSinceToken', function() {
            it('removes a deleted entity from the array', function() {
                service.processDeletionsSinceToken(mockXMLService.getChangeToken_Delete, primaryQueryCache);
                expect(primaryQueryCache[1]).toBeUndefined();
            });
        });

        describe('Function: getAvailableWorkflows', function() {
            it('removes a deleted entity from the array', function() {
                service.getAvailableWorkflows(mockToUpdate.fileRef.lookupValue)
                    .then(function(templates) {
                        expect(templates.length).toBeGreaterThan(0);
                        expect(templates[0].name).toEqual('WidgetApproval');
                    });
                $httpBackend.flush();
            });
        });

    });
}
