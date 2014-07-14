"use strict";

describe("Factory: apListItemFactory", function () {

    beforeEach(module("angularPoint"));

    var apListItemFactory, apDataService, mockModel, testListItem;

    beforeEach(module("ui.bootstrap"));
    beforeEach(inject(function(_apListItemFactory_, _mockModel_, _apDataService_) {
        apListItemFactory = _apListItemFactory_;
        apDataService = _apDataService_;
        mockModel = _mockModel_;
        testListItem = mockModel.createEmptyItem({id: 1});
    }));

    describe('create', function() {
        it("should instantiate a new List", function() {
            expect(apListItemFactory.create()).toEqual(new apListItemFactory.ListItem);
        })
    });

    describe('validateEntity', function () {
        it('Should validate a valid entity.', function () {
            testListItem.boolean = false;
            expect(testListItem.validateEntity()).toBe(true);

        });

        it('Should reject an invalid entity.', function () {
            testListItem.boolean = 'this is a test';
            expect(testListItem.validateEntity()).toBe(false);
        });
    });


    describe('getDataService', function () {
        it("should return a reference to the service", function() {
            expect(testListItem.getDataService()).toEqual(apDataService);
        });
    });

    describe('getFieldDefinition', function () {
        it('Should return the field definition.', function () {
            expect(testListItem.getFieldDefinition('json').objectType).toEqual('JSON');
        });

        it('Should return undefined if a valid field isn\'t provided.', function () {
            expect(testListItem.getFieldDefinition('invalidField')).toBeUndefined();
        })

    });

    describe('resolvePermissions', function () {

        it('Should allow admin to approve.', function () {
            //Full rights mask
            testListItem.permMask = '0x7FFFFFFFFFFFFFFF';
            var adminUserPermissions = testListItem.resolvePermissions();
            expect(adminUserPermissions.ApproveItems).toBe(true);
        });
        it('Should prevent read-only user from approving.', function () {
            //Limited user (view only)
            testListItem.permMask = '0x0000000000000001';
            var standardUserPermissions = testListItem.resolvePermissions();
            expect(standardUserPermissions.ApproveItems).toBe(false);
        });
        it('Should allow a user with edit rights to edit.', function () {
            //User can edit
            testListItem.permMask = '0x0000000000000004';
            var standardUserPermissions = testListItem.resolvePermissions();
            expect(standardUserPermissions.EditListItems).toBe(true);
        });

    });

    //TODO: Add tests for all of the other async methods for the ListItem prototype


//    describe('save changes', function () {
//        $timeout(function () {
//
//        },1000);
////        it('should save changes', function () {
//            testListItem.boolean = true;
//            testListItem.saveChanges()
//                .then(function (listItem) {
//                    it('should have the updated value saved', function () {
//                        expect(listItem.boolean).toEqual(false);
//                    })
//                });
////        })
//        $timeout.flush();
//
//    })




});