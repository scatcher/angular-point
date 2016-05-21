// import {
//     it,
//     iit,
//     describe,
//     ddescribe,
//     expect,
//     inject,
//     injectAsync,
//     TestComponentBuilder,
//     beforeEachProviders,
//     beforeEach
// } from '@angular/core/testing';
// import {provide, Injector} from '@angular/core';
// import {DataService} from "./dataservice.service";
// import {Http, ConnectionBackend, HTTP_PROVIDERS, BaseRequestOptions} from "@angular/http";
// import {MockBackend, MockConnection} from "@angular/http/testing";
// import {getListItemChangesSinceToken, parseXML} from '../../../assets/e2e/mock_responses';
// import * as mockServicesXML from '../../../assets/e2e/mock_services_xml';

// import {generateMockResponse} from '../../../assets/e2e/mock_backend';
// import {each} from 'lodash';

// describe('DataService Service', () => {

//     beforeEachProviders(() => [
//         DataService,
//         HTTP_PROVIDERS,
//         BaseRequestOptions,
//         MockBackend,
//         provide(Http, {
//             useFactory: function (backend: MockBackend, defaultOptions) {
//                 backend.connections.subscribe((mockConnection: MockConnection) => generateMockResponse(mockConnection));
//                 return new Http(backend, defaultOptions);
//             },
//             deps: [MockBackend, BaseRequestOptions]
//         }),
//     ]);

//     describe('Observable: currentSite$', () => {
//         it('returns the site url', injectAsync([DataService], (service: DataService) => {
//             return new Promise((resolve, reject) => {
//                 service.currentSite$
//                     .subscribe(url => {
//                         resolve(expect(url).toEqual('http://sharepoint.company-server.com/mysite'));
//                     })
//             });
//         }));
//     });

//     describe('Function: requestData', () => {
//         it('returns the site url', injectAsync([DataService], (service: DataService) => {
//             return new Promise((resolve, reject) => {
//                 //Dummy Request
//                 service.requestData({ operation: 'AddAttachment' })
//                     .subscribe(responseXML => {
//                         let parser = new DOMParser();
//                         let expectedXML = parser.parseFromString(mockServicesXML.AddAttachment, 'application/xml');
//                         // Not easy to compare xml documents so just ensure they have the same number of child elements
//                         // and we get a valid response
//                         resolve(expect(responseXML.childElementCount).toEqual(expectedXML.childElementCount));
//                     })
//             });
//         }));
//     });

//     describe('Function: retrieveChangeToken', () => {
//         it('returns the change token from the XML', inject([DataService], (service: DataService) => {
//             const changeToken = service.retrieveChangeToken(getListItemChangesSinceToken());
//             expect(changeToken)
//                 .toEqual('1;3;f5345fe7-2f7c-49f7-87d0-dbfebdd0ce61;635452551037430000;387547');
//         }));
//     });

//     describe('Function: retrieveListPermissions', () => {

//         const fullMaskXML =
//             `<?xml version="1.0" encoding="utf-8"?>
//             <soap:Envelope>
//                  <GetListItemChangesSinceTokenResponse xmlns="http://schemas.microsoft.com/sharepoint/soap/">
//                     <GetListItemChangesSinceTokenResult>
//                         <listitems EffectivePermMask='FullMask'></listitems>
//                     </GetListItemChangesSinceTokenResult>
//                 </GetListItemChangesSinceTokenResponse>
//             </soap:Envelope>`;

//         it('returns permmission object with all permission levels set to true', inject([DataService], (service: DataService) => {
//             const xml = parseXML(fullMaskXML);
//             const permissions = service.retrieveListPermissions(xml);
//             each(permissions, (permissionValue) => {
//                 expect(permissionValue).toEqual(true);
//             })
//         }));


//         const partialPermissionXML = `<?xml version="1.0" encoding="utf-8"?>
//             <soap:Envelope>
//                  <GetListItemChangesSinceTokenResponse xmlns="http://schemas.microsoft.com/sharepoint/soap/">
//                     <GetListItemChangesSinceTokenResult>
//                         <listitems EffectivePermMask='ViewListItems, AddListItems, EditListItems, DeleteListItems'></listitems>
//                     </GetListItemChangesSinceTokenResult>
//                 </GetListItemChangesSinceTokenResponse>
//             </soap:Envelope>`;

//         it('correctly sets the specified permission levels to true', inject([DataService], (service: DataService) => {
//             const xml = parseXML(partialPermissionXML);
//             const permissions = service.retrieveListPermissions(xml);
//             expect(permissions.ViewListItems).toEqual(true);
//             expect(permissions.AddListItems).toEqual(true);
//             expect(permissions.EditListItems).toEqual(true);
//             expect(permissions.DeleteListItems).toEqual(true);
//         }));

//         it('leaves unspecified permissions as false', inject([DataService], (service: DataService) => {
//             const xml = parseXML(partialPermissionXML);
//             const permissions = service.retrieveListPermissions(xml);
//             expect(permissions.ViewVersions).toEqual(false);
//         }));

//         const noPermMaskXML = `<?xml version="1.0" encoding="utf-8"?>
//             <soap:Envelope>
//                  <GetListItemChangesSinceTokenResponse xmlns="http://schemas.microsoft.com/sharepoint/soap/">
//                     <GetListItemChangesSinceTokenResult></GetListItemChangesSinceTokenResult>
//                 </GetListItemChangesSinceTokenResponse>
//             </soap:Envelope>`;

//         it('returns undefined if no EffectivePermMask is found', inject([DataService], (service: DataService) => {
//             const xml = parseXML(noPermMaskXML);
//             const permissions = service.retrieveListPermissions(xml);
//             expect(permissions).toBeUndefined();
//         }));

//     });


//     describe('Function: getCollection', () => {

//         it('can process a GetListCollection call', injectAsync([DataService], (service: DataService) => {
//             return new Promise((resolve, reject) => {
//                 service.getCollection({ operation: 'GetListCollection' })
//                     .subscribe(listCollection => resolve(expect(listCollection.length).toEqual(1)));
//             });
//         }));
//     });

//     describe('Function: getUserProfileByName', () => {
//         it('returns a user profile object', injectAsync([DataService], (service: DataService) => {
//             return new Promise((resolve, reject) => {
//                 service.getUserProfileByName()
//                     .subscribe(response => {
//                         resolve(expect(response).toEqual({
//                             UserProfile_GUID: 'e1234f12-6992-42eb-9bbc-b3a123b29295',
//                             AccountName: 'DOMAIN\John.Doe',
//                             PreferredName: 'DOMAIN\John.Doe',
//                             UserName: 'John.Doe',
//                             userLoginName: 'DOMAIN\John.Doe'
//                         }));
//                     })
//             });
//         }));
//     });

//     describe('Function: getAvailableWorkflows', () => {
//         it('returns a workflow definition', injectAsync([DataService], (service: DataService) => {
//             return new Promise((resolve, reject) => {
//                 service.getAvailableWorkflows('SOME_LIST_ITEM_REF')
//                     .subscribe((response: IWorkflowDefinition[]) => {
//                         var expectedFirstWorkflowDefinition = {
//                             instantiationUrl: "https://sharepoint.mycompany.com/_layouts/IniWrkflIP.aspx?List=fc17890e-8c0f-43b5-8e3e-ffae6f456727&amp;ID=5&amp;TemplateID={59062311-cea9-40d1-a183-6edde9333815}&amp;Web={ec744d8e-ae0a-45dd-bcd1-8a63b9b399bd}",
//                             name: "WidgetApproval",
//                             templateId: "{59062311-cea9-40d1-a183-6edde9333815}"
//                         }
//                         //Have issues comparing these objects because there's an issue with the instantiationUrl matching
//                         //so just compare the name for each.
//                         return resolve(expect(response[0].name).toEqual(expectedFirstWorkflowDefinition.name));
//                     });
//             });

//         }));

//     });

//     describe('Function: getGroupCollectionFromUser', () => {
//         it('returns an array of groups the user belongs to', injectAsync([DataService], (service: DataService) => {
//             return new Promise((resolve, reject) => {
//                 service.getGroupCollectionFromUser()
//                     .subscribe(response => {
//                         return resolve(expect(response).toEqual([
//                             {
//                                 ID: '385',
//                                 Name: 'Super Duper Admins',
//                                 Description: '',
//                                 OwnerID: '338',
//                                 OwnerIsUser: 'True'
//                             }, {
//                                 ID: '396',
//                                 Name: 'Super Duper Contributors',
//                                 Description: 'Members of this group are able to contribute to create and edit project records.',
//                                 OwnerID: '385',
//                                 OwnerIsUser: 'False'
//                             }, {
//                                 ID: '398',
//                                 Name: 'Super Duper Viewers',
//                                 Description: 'Members of this group are able to view project specific information.',
//                                 OwnerID: '385',
//                                 OwnerIsUser: 'False'
//                             }]));
//                     });
//             });
//         }));
//     });

//     describe('Function: getAvailableWorkflows', () => {
//         it('removes a deleted entity from the array', injectAsync([DataService], (service: DataService) => {
//             return new Promise((resolve, reject) => {
//                 service.getAvailableWorkflows('SOME_LIST_ITEM_REF')
//                     .subscribe(templates => {
//                         expect(templates.length).toBeGreaterThan(0);
//                         return resolve(expect(templates[0].name).toEqual('WidgetApproval'));
//                     });
//             });
//         }));
//     });


//     //     //ddescribe('Function: getView', function () {
//     //     //    it('can process a list definition', function () {
//     //     //        apDataService.getView({listName: mockModel.list.guid})
//     //     //            .then(function (response) {
//     //     //                expect(response.viewFields).toBeDefined();
//     //     //            });
//     //     //        $httpBackend.flush();
//     //     //    });
//     //     //});

//     //TODO: Currently requires a model to be instantiated to lookup so will need to either do so to get to work
//     // describe('Function: getList', () => {
//     //     iit('can process a list definition', injectAsync([DataService], (service: DataService) => {
//     //         return service.getList({ listName: '{F5345FE7-2F7C-49F7-87D0-DBFEBDD0CE61}' })
//     //             .then(response => {
//     //                 console.log(response);

//     //                 return expect(response).toBeDefined();
//     //             });
//     //     }));
//     // });

//     //     describe('Function: getListFields', () => {
//     //         it('returns an array of field definition objects', () => {
//     //             service.getListFields({ listName: mockModel.list.guid })
//     //                 .then(function (response) {
//     //                     expect(response.length).toEqual(98);
//     //                 });
//     //             $httpBackend.flush();
//     //         });
//     //     });

//     //     describe('Function: getVersionHistory', () => {
//     //         it('returns an array containing 4 versions of the mock.integer field', () => {
//     //             var fieldDefinition = mockModel.getField('integer');
//     //             service.getFieldVersionHistory({}, fieldDefinition)
//     //                 .then(function (response) {
//     //                     expect(response.count()).toEqual(4);
//     //                 });
//     //             $httpBackend.flush();
//     //         });
//     //     });

//     // describe('Function: processDeletionsSinceToken', () => {
//     //     it('removes a deleted entity from the array', () => {
//     //         service.processDeletionsSinceToken(mockXMLService.getChangeToken_Delete, primaryQueryCache);
//     //         expect(primaryQueryCache[1]).toBeUndefined();
//     //     });
//     // });



// });