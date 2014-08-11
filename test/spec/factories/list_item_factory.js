"use strict";

describe("Factory: apListItemFactory", function () {

    beforeEach(module("angularPoint"));

    var apListItemFactory, apDataService, mockModel, mockListItems, mockListItem;

    beforeEach(module("ui.bootstrap"));
    beforeEach(inject(function(_apListItemFactory_, _mockModel_, _apDataService_, $rootScope) {
        apListItemFactory = _apListItemFactory_;
        apDataService = _apDataService_;
        mockModel = _mockModel_;
        mockListItems = mockModel.generateMockData({staticValue: true, quantity: 10});
//        _.each(mockListItems, function(listItem) {
//            mockModel.addNewItem(listItem);
//            $rootScope.$apply();
//        });
//        mockListItems = mockModel.getCache();
        mockListItem = mockListItems[0];


//        mockModel.addNewItem(mockModel.createEmptyItem({id: 1}))
//            .then(function (entity) {
//                mockListItem = entity;
//            });
//        $rootScope.$apply();
    }));

    describe('create', function() {
        it("should instantiate a new List", function() {
            expect(apListItemFactory.create()).toEqual(new apListItemFactory.ListItem);
        })
    });

    describe('validateEntity', function () {
        it('Should validate a valid entity.', function () {
            mockListItem.boolean = false;
            expect(mockListItem.validateEntity()).toBe(true);

        });

        it('Should reject an invalid entity.', function () {
            mockListItem.boolean = 'this is a test';
            expect(mockListItem.validateEntity()).toBe(false);
        });
    });


    describe('getDataService', function () {
        it("should return a reference to the service", function() {
            expect(mockListItem.getDataService()).toEqual(apDataService);
        });
    });

    describe('getFieldDefinition', function () {
        it('Should return the field definition.', function () {
            expect(mockListItem.getFieldDefinition('json').objectType).toEqual('JSON');
        });

        it('Should return undefined if a valid field isn\'t provided.', function () {
            expect(mockListItem.getFieldDefinition('invalidField')).toBeUndefined();
        })

    });

    describe('resolvePermissions', function () {

        it('Should allow admin to approve.', function () {
            //Full rights mask
            mockListItem.permMask = '0x7FFFFFFFFFFFFFFF';
            var adminUserPermissions = mockListItem.resolvePermissions();
            expect(adminUserPermissions.ApproveItems).toBe(true);
        });
        it('Should prevent read-only user from approving.', function () {
            //Limited user (view only)
            mockListItem.permMask = '0x0000000000000001';
            var standardUserPermissions = mockListItem.resolvePermissions();
            expect(standardUserPermissions.ApproveItems).toBe(false);
        });
        it('Should allow a user with edit rights to edit.', function () {
            //User can edit
            mockListItem.permMask = '0x0000000000000004';
            var standardUserPermissions = mockListItem.resolvePermissions();
            expect(standardUserPermissions.EditListItems).toBe(true);
        });

    });



    describe('ListItem.saveChanges', function() {
        var updatedListItem;
        it('should save changes', inject(function($rootScope) {
            mockListItem.boolean = true;
            mockListItem.saveChanges()
                .then(function (listItem) {
                    updatedListItem = angular.copy(listItem);
                });
            $rootScope.$apply();
            expect(updatedListItem.boolean).toEqual(true);
        }));
    });

    describe('ListItem.saveFields', function() {
        var updatedListItem;

        it('should save just the specified fields', inject(function($rootScope) {
            mockListItem.text = 'Updated Value';
            mockListItem.saveFields(['text'])
                .then(function (listItem) {
                    updatedListItem = angular.copy(listItem);
                });
            $rootScope.$apply();
            expect(updatedListItem.text).toEqual('Updated Value');
        }));
    });

//    ddescribe('ListItem.deleteItem', function() {
//        it('should delete the list item', inject(function($rootScope) {
//            mockListItem.deleteItem();
//            $rootScope.$apply();
//            expect(mockListItems.length).toEqual(9);
//
//        }));
//    });

    //TODO: Add tests for all of the other async methods for the ListItem prototype


});