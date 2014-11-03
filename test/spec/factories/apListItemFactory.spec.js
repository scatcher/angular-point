"use strict";

describe("Factory: apListItemFactory", function () {

    beforeEach(module("angularPoint"));

    var factory,
        mockModel,
        mockLookupModel,
        mockListItem,
        apCachedXML,
        $httpBackend,
        utils;

    beforeEach(inject(function (_apListItemFactory_, _mockModel_, _mockLookupModel_, _$httpBackend_, _apCachedXML_
        , apMockUtils) {
        factory = _apListItemFactory_;
        mockModel = _mockModel_;
        mockLookupModel = _mockLookupModel_;
        $httpBackend = _$httpBackend_;
        apCachedXML = _apCachedXML_;
        mockModel.importMocks();
        mockListItem = mockModel.getCache()[1];
        utils = apMockUtils;

    }));

    describe('Function create', function () {
        it("instantiates a new List item using constructor", function () {
            expect(factory.create()).toEqual(new factory.ListItem);
        })
    });

    describe('Method: deleteItem', function () {
        it('removes entity with ID of 1 from the cache', function () {
            mockListItem.deleteItem()
                .then(function () {
                    expect(mockModel.getCache('primary')[1]).toBeUndefined();
                });
            $httpBackend.flush();
        });
    });

    describe('Method: validateEntity', function () {
        it('validates a valid entity.', function () {
            mockListItem.boolean = false;
            expect(mockListItem.validateEntity()).toBe(true);

        });

        it('rejects an invalid entity.', function () {
            mockListItem.boolean = 'this is a test';
            expect(mockListItem.validateEntity()).toBe(false);
        });
    });

    describe('Method: getFieldDefinition', function () {
        it('returns the field definition.', function () {
            expect(mockListItem.getFieldDefinition('json').objectType).toEqual('JSON');
        });

        it('returns undefined if a valid field isn\'t provided.', function () {
            expect(mockListItem.getFieldDefinition('invalidField')).toBeUndefined();
        })

    });

    describe('Method: getFormattedValue', function () {
        it('throws an error if the provided field name isn\'t valid', function () {
            expect(function () {
                mockListItem.getFormattedValue('invalidField');
            }).toThrow();
        });

        it('returns a stringified date without params', function () {
            expect(mockListItem.getFormattedValue('date')).toEqual('8/19/14 12:00 AM');
        });

        it('returns a stringified json date with params', function () {
            expect(mockListItem.getFormattedValue('date', {dateFormat: 'json'}))
                .toEqual('2014-08-19T07:00:00.000Z');
                //.toEqual('2014-08-19T' + utils.getTimezoneOffsetString() + ':00.000Z');
        });
    });

    describe('Method: getLookupReference', function () {
        var mockLookupItem,
            mockLookupReference;

        beforeEach(function () {
            mockLookupModel.importMocks();
            mockLookupItem = mockLookupModel.getCache('primary')[1];
            mockLookupReference = mockListItem.getLookupReference('lookup');
        });

        it('returns the entity a lookup item is referencing', function () {
            expect(mockLookupReference).toEqual(mockLookupItem);
        });

        it('should throw an error if a field name isn\'t provided', function () {
            expect(function () {
                mockListItem.getLookupReference();
            }).toThrow();
        });

        it('returns an empty string if the lookup is empty', function () {
            mockListItem.lookup = '';
            expect(mockListItem.getLookupReference('lookup')).toEqual('');
        });

        it('throws an error if the fieldDefinition.List isn\'t available', function () {
            delete mockListItem.getFieldDefinition('lookup').List;
            expect(function () {
                mockListItem.getLookupReference('lookup');
            }).toThrow();
        });

    });

    describe('Method: resolvePermissions', function () {

        it('allows admin to approve.', function () {
            //Full rights mask
            mockListItem.permMask = '0x7FFFFFFFFFFFFFFF';
            var adminUserPermissions = mockListItem.resolvePermissions();
            expect(adminUserPermissions.ApproveItems).toBe(true);
        });
        it('prevents read-only user from approving.', function () {
            //Limited user (view only)
            mockListItem.permMask = '0x0000000000000001';
            var standardUserPermissions = mockListItem.resolvePermissions();
            expect(standardUserPermissions.ApproveItems).toBe(false);
        });
        it('allows a user with edit rights to edit.', function () {
            //User can edit
            mockListItem.permMask = '0x0000000000000004';
            var standardUserPermissions = mockListItem.resolvePermissions();
            expect(standardUserPermissions.EditListItems).toBe(true);
        });

    });

    describe('Method: saveChanges', function () {
        describe('successful calls', function () {
            beforeEach(function () {
                expect(mockListItem.integer).toEqual(12);
                mockListItem.integer = 13;
                mockListItem.saveChanges()
                    .then(function (response) {
                        expect(response.integer).toEqual(13);
                    });
                $httpBackend.flush();
            });
            it('has the updated value', function () {
                expect(mockListItem.integer).toEqual(13);
            });
            it('is also updated in the other caches because they should be referencing the same object', function () {
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

    describe('Method: saveFields', function () {
        it('has the initial value before updating', function () {
            expect(mockListItem.integer).toEqual(12);
        });
        it('has the updated value after updating', function () {
            mockListItem.integer = 29;
            mockListItem.saveFields('integer')
                .then(function (response) {
                    expect(response.integer).toEqual(29);
                });
            $httpBackend.flush();
        });
        it('shows the updating value in the secondary cache', function () {
            mockListItem.integer = 41;
            mockListItem.saveFields('integer')
                .then(function (response) {

                });
            $httpBackend.flush();
            expect(mockModel.getCache('secondary')[1].integer).toEqual(41);
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

    describe('Method: getAttachmentCollection', function () {
        it('returns an array of attachments for the list item', function () {
            //mockXMLService.xhrStub('getAttachmentCollection');
            mockListItem.getAttachmentCollection()
                .then(function (response) {
                    expect(response.length).toEqual(1);
                });
            $httpBackend.flush();
        });
    });

    describe('Method: deleteAttachment', function () {
        it('resolves the promise when deleted', function () {
            //mockXMLService.xhrStub('deleteAttachment');
            mockListItem.deleteAttachment(mockListItem.attachments[0])
                .then(function (response) {
                    expect(response).toBeDefined();
                });
            $httpBackend.flush();
        });
    });

    describe('Method: getFieldVersionHistory', function () {
        it('parses the version history for a field and returns all 3 versions', function () {
            //mockXMLService.xhrStub('GetVersionCollection');
            mockListItem.getFieldVersionHistory('integer')
                .then(function (response) {
                    expect(response.length).toEqual(3);
                });
            $httpBackend.flush();
        });
        it('works without passing any any fields to dynamically build field array', function () {
            //mockXMLService.xhrStub('GetVersionCollection');
            mockListItem.getFieldVersionHistory()
                .then(function (response) {
                    expect(response.length).toEqual(3);
                });
            $httpBackend.flush();
        });
    });

});
