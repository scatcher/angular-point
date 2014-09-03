"use strict";

describe("Factory: apListItemFactory", function () {

    beforeEach(module("angularPoint"));

    var apListItemFactory,
        mockModel,
        mockLookupModel,
        mockListItem,
        $rootScope;


    beforeEach(module("ui.bootstrap"));
    beforeEach(inject(function(_apListItemFactory_, _mockModel_, _mockLookupModel_, _$rootScope_) {
        apListItemFactory = _apListItemFactory_;
        mockModel = _mockModel_;
        mockLookupModel = _mockLookupModel_;
        $rootScope = _$rootScope_;
        mockModel.importMocks();
        mockListItem = mockModel.getCache()[1];
    }));

    describe('Function create', function() {
        it("instantiates a new List item using constructor", function() {
            expect(apListItemFactory.create()).toEqual(new apListItemFactory.ListItem);
        })
    });

    describe('Method: deleteItem', function() {
        beforeEach(function () {
            mockListItem.deleteItem();
            $rootScope.$digest();
        });
        it('removes entity with ID of 0 from the cache', function () {
            expect(mockModel.getCache('primary')[1]).toBeUndefined();
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
            expect(function (){ mockListItem.getLookupReference();}).toThrow();
        });

        it('returns an empty string if the lookup is empty', function () {
            mockListItem.lookup = '';
            expect(mockListItem.getLookupReference('lookup')).toEqual('');
        });

        it('throws an error if the fieldDefinition.List isn\'t available', function () {
            delete mockListItem.getFieldDefinition('lookup').List;
            expect(function (){ mockListItem.getLookupReference('lookup');}).toThrow();
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

    describe('Method: saveChanges', function() {
        beforeEach(function () {
            mockListItem.boolean = true;
            mockListItem.saveChanges();
            $rootScope.$digest();
        });
        it('has the updated value', function () {
            expect(mockModel.getCache('primary')[1].boolean).toEqual(true);
        });
        it('the other caches also contain the same data because they should be referencing the same object', function () {
            expect(mockModel.getCache('secondary')[1].boolean).toEqual(true);
        });
    });

    describe('Method: saveFields', function() {
        beforeEach(function () {
            mockListItem.currency = 1337;
            mockListItem.saveFields('currency');
            $rootScope.$digest();
        });
        it('has the updated value', function () {
            expect(mockModel.getCache('primary')[1].currency).toEqual(1337);
        });
        it('the other caches also contain the same data because they should be referencing the same object', function () {
            expect(mockModel.getCache('secondary')[1].currency).toEqual(1337);
        });
    });



    //TODO: Add tests for all of the other async methods for the ListItem prototype


});