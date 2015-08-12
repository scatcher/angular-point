/// <reference path="../../mock/app.module.mock.ts" />
module ap {
    'use strict';

    describe("Factory: apListItemFactory", function() {

        beforeEach(module("angularPoint"));

        var factory: ListItemFactory,
            mockModel: MockModel,
            mockLookupModel: MockLookupModel,
            mockListItem: MockListItem,
            apCachedXML: ICachedXML,
            $httpBackend: ng.IHttpBackendService,
            utils: MockUtils;

        beforeEach(inject(function(_apListItemFactory_, _mockModel_, _mockLookupModel_, _$httpBackend_, _apCachedXML_
            , apMockUtils) {
            factory = _apListItemFactory_;
            mockModel = _mockModel_;
            mockLookupModel = _mockLookupModel_;
            $httpBackend = _$httpBackend_;
            apCachedXML = _apCachedXML_;
            mockModel.importMocks();
            mockListItem = mockModel.getCache<MockListItem>('primary').first();
            if (!mockListItem) throw new Error("List item not found");
            utils = apMockUtils;

        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('Function create', function() {
            it("instantiates a new List item using constructor", function() {
                expect(factory.create()).toEqual(new factory.ListItem);
            })
        });

        describe('Method: deleteItem', function() {
            it('removes entity with ID of 1 from the cache', function() {
                mockListItem.deleteItem()
                    .then(function() {
                        expect(mockModel.getCache('primary')[1]).toBeUndefined();
                    });
                $httpBackend.flush();
            });
        });

        describe('Method: validateEntity', function() {
            it('validates a valid entity.', function() {
                mockListItem.boolean = false;
                expect(mockListItem.validateEntity()).toBe(true);

            });

            it('rejects an invalid entity.', function() {
                mockListItem.boolean = 'this is a test';
                expect(mockListItem.validateEntity()).toBe(false);
            });
        });

        describe('Method: getFieldDefinition', function() {
            it('returns the field definition.', function() {
                expect(mockListItem.getFieldDefinition('json').objectType).toEqual('JSON');
            });

            it('returns undefined if a valid field isn\'t provided.', function() {
                expect(mockListItem.getFieldDefinition('invalidField')).toBeUndefined();
            })

        });

        describe('Method: getFieldLabel', function() {
            it('defaults to title case.', function() {
                expect(mockListItem.getFieldLabel('dateTime')).toEqual('DateTime');
            });
            it('uses the DisplayName from the server if available', function() {
                var fieldDefinition = mockListItem.getFieldDefinition('dateTime');
                fieldDefinition.DisplayName = 'My Date Field';
                expect(mockListItem.getFieldLabel('dateTime')).toEqual('My Date Field');
            });
            it('uses the label attribute to override anything else', function() {
                var fieldDefinition = mockListItem.getFieldDefinition('dateTime');
                fieldDefinition.DisplayName = 'My Date Field';
                fieldDefinition.label = 'My Manually Set Field Label';
                expect(mockListItem.getFieldLabel('dateTime')).toEqual('My Manually Set Field Label');
            });

        });

        describe('Method: getFieldDescription', function() {
            it('defaults to an empty string', function() {
                expect(mockListItem.getFieldDescription('title')).toEqual('');
            });
            it('uses the Description from the server if available', function() {
                var fieldDefinition = mockListItem.getFieldDefinition('title');
                fieldDefinition.Description = 'My server description.';
                expect(mockListItem.getFieldDescription('title')).toEqual('My server description.');
            });
            it('uses the description attribute to override anything else', function() {
                var fieldDefinition = mockListItem.getFieldDefinition('title');
                fieldDefinition.Description = 'My Title Field';
                fieldDefinition.description = 'My Manually Set Title Label';
                expect(mockListItem.getFieldDescription('title')).toEqual('My Manually Set Title Label');
            });

        });

        describe('Method: getFieldChoices', function() {
            var fakeDefinition = {
                Choices: ['one', 'two', 'three'],
                choices: ['four', 'five']
            };
            it('defaults to an empty array', function() {
                var fieldDefinition = mockListItem.getFieldDefinition('choice');
                delete fieldDefinition.Choices;
                expect(mockListItem.getFieldChoices('choice')).toEqual([]);
            });
            it('uses the Choices from the server if available', function() {
                var fieldDefinition = mockListItem.getFieldDefinition('choice');
                fieldDefinition.Choices = fakeDefinition.Choices;
                expect(mockListItem.getFieldChoices('choice')).toEqual(fakeDefinition.Choices);
            });
            it('uses the choices attribute to override anything else', function() {
                var fieldDefinition = mockListItem.getFieldDefinition('choice');
                fieldDefinition.choices = fakeDefinition.choices;
                fieldDefinition.Choices = fakeDefinition.Choices;
                expect(mockListItem.getFieldChoices('choice')).toEqual(fakeDefinition.choices);
            });
        });

        describe('Method: getFormattedValue', function() {
            it('throws an error if the provided field name isn\'t valid', function() {
                expect(function() {
                    mockListItem.getFormattedValue('invalidField');
                }).toThrow();
            });

            it('returns a stringified date without params', function() {
                expect(mockListItem.getFormattedValue('date')).toEqual('8/19/14 12:00 AM');
            });

            it('returns a stringified json date with params', function() {
                expect(mockListItem.getFormattedValue('date', { dateFormat: 'json' }))
                    .toEqual('2014-08-19T07:00:00.000Z');
                //.toEqual('2014-08-19T' + utils.getTimezoneOffsetString() + ':00.000Z');
            });
        });

        describe('Method: getLookupReference', function() {
            var mockLookupItem,
                mockLookupReference;

            beforeEach(function() {
                mockLookupModel.importMocks();
                mockLookupItem = mockLookupModel.getCache('primary')[1];
                mockLookupReference = mockListItem.getLookupReference('lookup');
            });

            it('returns the entity a lookup item is referencing', function() {
                expect(mockLookupReference).toEqual(mockLookupItem);
            });

            it('should throw an error if a field name isn\'t provided', function() {
                expect(function() {
                    mockListItem.getLookupReference<MockLookup>();
                }).toThrow();
            });

            it('returns an empty string if the lookup is empty', function() {
                mockListItem.lookup = undefined;
                expect(mockListItem.getLookupReference('lookup')).toEqual('');
            });

            it('throws an error if the fieldDefinition.List isn\'t available', function() {
                delete mockListItem.getFieldDefinition('lookup').List;
                expect(function() {
                    mockListItem.getLookupReference('lookup');
                }).toThrow();
            });

        });

        describe('Method: resolvePermissions', function() {

            it('allows admin to approve.', function() {
                //Full rights mask
                mockListItem.permMask = '0x7FFFFFFFFFFFFFFF';
                var adminUserPermissions = mockListItem.resolvePermissions();
                expect(adminUserPermissions.ApproveItems).toBe(true);
            });
            it('prevents read-only user from approving.', function() {
                //Limited user (view only)
                mockListItem.permMask = '0x0000000000000001';
                var standardUserPermissions = mockListItem.resolvePermissions();
                expect(standardUserPermissions.ApproveItems).toBe(false);
            });
            it('allows a user with edit rights to edit.', function() {
                //User can edit
                mockListItem.permMask = '0x0000000000000004';
                var standardUserPermissions = mockListItem.resolvePermissions();
                expect(standardUserPermissions.EditListItems).toBe(true);
            });

        });

        describe('Method: saveChanges', function() {
            describe('successful calls', function() {
                beforeEach(function() {
                    expect(mockListItem.integer).toEqual(12);
                    mockListItem.integer = 13;
                    mockListItem.saveChanges()
                        .then(function(response) {
                            expect(response.integer).toEqual(13);
                        });
                    $httpBackend.flush();
                });
                it('has the updated value', function() {
                    expect(mockListItem.integer).toEqual(13);
                });
                it('is also updated in the other caches because they should be referencing the same object', function() {
                    expect(mockModel.getCache('secondary')[1]).toEqual(mockListItem);
                });
            });

            //describe('the ability to identity an error', function () {
            //    it('rejects the promise with an error message', function () {
            //        mockXMLService.xhrStub('errorUpdatingListItem');
            //        mockListItem.saveChanges()
            //            .then(function (response) {
            //
            //            }, function (err) {
            //                expect(_.isString(err)).toBeTrue();
            //            });
            //        $rootScope.$digest();
            //    });
            //});
        });

        describe('Method: saveFields', function() {
            it('has the initial value before updating', function() {
                expect(mockListItem.integer).toEqual(12);
            });
            it('has the updated value after updating', function() {
                mockListItem.integer = 29;
                mockListItem.saveFields(['integer'])
                    .then(function(response) {
                        expect(response.integer).toEqual(29);
                    });
                $httpBackend.flush();
            });
            it('shows the updating value in the secondary cache', function() {
                mockListItem.integer = 41;
                mockListItem.saveFields(['integer'])
                    .then(function(response) {
                        expect(mockModel.getCache<MockListItem>('secondary')[1].integer).toEqual(41);
                    });
                $httpBackend.flush();
            });
            //it('resolves the promise with the updated entity', function () {
            //    mockXMLService.xhrStub('UpdateListItem');
            //    mockListItem.saveFields('integer')
            //        .then(function (response) {
            //            expect(response.integer).toEqual(13);
            //        });
            //    $rootScope.$digest();
            //});
            //it('rejects the promise with an error message', function () {
            //    $httpBackend.whenPOST('/test/_vti_bin/Lists.asmx')
            //        .respond(function (method, url, data) {
            //            return [200, apCachedXML.ErrorUpdatingListItem];
            //        });
            //    mockListItem.saveFields('integer')
            //        .then(function (response) {
            //
            //        }, function (err) {
            //            expect(_.isString(err)).toBeTrue();
            //        });
            //    $httpBackend.flush();
            //});

        });

        describe('Method: setPristine', function() {
            var initialLookupValue = '[{"lookupId":2,"lookupValue":"Lookup 2"},{"lookupId":3,"lookupValue":"Lookup 3"}]';

            it('restores any changes of primative back to the pristine state', function() {
                //mockXMLService.xhrStub('getAttachmentCollection');
                expect(mockListItem.integer).toEqual(12);
                mockListItem.integer = 101;
                mockListItem.setPristine(mockListItem);
                expect(mockListItem.integer).toEqual(12);
            });


            it('restores any changes of a referenced object back to the pristine state', function() {
                expect(JSON.stringify(mockListItem.lookupMulti)).toEqual(initialLookupValue);
                mockListItem.lookupMulti.splice(0, 1);
                expect(mockListItem.lookupMulti.length === 1);
                mockListItem.setPristine(mockListItem);
                expect(JSON.stringify(mockListItem.lookupMulti)).toEqual(initialLookupValue);
            });

            it('restores any changes of a referenced object back to the pristine state when optional list item is not provided', function() {
                expect(JSON.stringify(mockListItem.lookupMulti)).toEqual(initialLookupValue);
                mockListItem.lookupMulti.splice(0, 1);
                expect(mockListItem.lookupMulti.length === 1);
                mockListItem.setPristine();
                expect(JSON.stringify(mockListItem.lookupMulti)).toEqual(initialLookupValue);
            });
        });

        describe('Method: getAttachmentCollection', function() {
            it('returns an array of attachments for the list item', function() {
                //mockXMLService.xhrStub('getAttachmentCollection');
                mockListItem.getAttachmentCollection()
                    .then(function(response) {
                        expect(response.length).toEqual(1);
                    });
                $httpBackend.flush();
            });
        });

        describe('Method: deleteAttachment', function() {
            it('resolves the promise when deleted', function() {
                //mockXMLService.xhrStub('deleteAttachment');
                mockListItem.deleteAttachment(mockListItem.attachments[0])
                    .then(function(response) {
                        expect(response).toBeDefined();
                    });
                $httpBackend.flush();
            });
        });

        describe('Method: getFieldVersionHistory', function() {
            it('parses the version history for a field and returns all 3 versions', () => {
                mockListItem.getFieldVersionHistory('integer')
                    .then(function(response) {
                        expect(response.count()).toEqual(3);
                    });
                $httpBackend.flush();
            });
            it('works without passing any any fields to dynamically build field array', () => {
                mockListItem.getFieldVersionHistory()
                    .then(function(response) {
                        expect(response.count()).toEqual(3);
                    });
                $httpBackend.flush();
            });
        });

        describe('Method: registerPreDeleteAction', function() {
            let unregister;

            afterEach(function() {
                if (_.isFunction(unregister)) {
                    //Cleanup
                    unregister();
                }
            });

            it('prevents delete if validation action returns false', function() {
                unregister = MockListItem.prototype.registerPreDeleteAction(function() {
                    //this should be the list item in question
                    expect(this).toEqual(mockListItem);
                    return false;
                });
                unregister = mockListItem.deleteItem()
                    .then(function(response) { }, function(response) {
                        expect(mockModel.getCachedEntity(mockListItem.id)).toBeDefined();
                        console.log(response);
                    });
            });

            it('deletes if validation action returns true', function() {
                unregister = MockListItem.prototype.registerPreDeleteAction(function() {
                    expect(this).toEqual(mockListItem);
                    return true;
                });
                mockListItem.deleteItem()
                    .then(function(response) {
                        expect(mockModel.getCachedEntity(mockListItem.id)).toBeUndefined();
                    });
                $httpBackend.flush();

            });

            it('returns an unregister function', function() {
                unregister = MockListItem.prototype.registerPreDeleteAction(function() {
                    //Would prevent delete but gets unregistered
                    return false;
                });
                unregister();
                expect(mockModel.getCachedEntity(mockListItem.id)).toBeDefined();
                mockListItem.deleteItem()
                    .then(function(response) {
                        expect(mockModel.getCachedEntity(mockListItem.id)).toBeUndefined();
                    });
                $httpBackend.flush();

            });

        });

        describe('Method: registerPreSaveAction', function() {

            let unregister;

            afterEach(function() {
                if (_.isFunction(unregister)) {
                    //Cleanup
                    unregister();
                }
            });

            it('saves if validation action returns true', function() {
                mockListItem.currency = 777;
                unregister = MockListItem.prototype.registerPreSaveAction(function() {
                    expect(this).toEqual(mockListItem);
                    return true;
                });

                mockListItem.saveChanges()
                    .then(function(response) {
                        //Saved correctly
                        expect(response.currency).toEqual(777);
                    });
                $httpBackend.flush();

            });

            it('prevents save if validation action returns false', function() {
                unregister = MockListItem.prototype.registerPreSaveAction(function() {
                    //this should be the list item in question
                    expect(this).toEqual(mockListItem);
                    return false;
                });

                mockListItem.saveChanges()
                    .then(function(response) { /*should only error */ }, function(response) {
                        //Resolve with error string
                        expect(_.isString(response)).toBeTruthy();
                    });

            });

            it('returns an unregister function that serves to remove logic', function() {
                mockListItem.currency = 888;
                unregister = MockListItem.prototype.registerPreSaveAction(function() {
                    //Would prevent save but gets unregistered
                    return false;
                });
                unregister();

                mockListItem.saveChanges()
                    .then(function(response) {
                        //Saved correctly and didn't hit validation because it was unregistered
                        expect(response.currency).toEqual(888);
                    });
                $httpBackend.flush();
            });

        });

        describe('Method: registerPostSaveAction', function() {

            it('exectues callback after save event', function() {
                mockListItem.currency = 999;
                MockListItem.prototype.registerPostSaveAction(function() {
                    expect(this).toEqual(mockListItem);
                    expect(this.currency).toEqual(999);
                });

                mockListItem.saveChanges()
                    .then(function(response) {
                        //Saved correctly
                        expect(this.currency).toEqual(999);
                    });
                $httpBackend.flush();

            });

        });


    });
}