import {it, describe, expect} from "@angular/core/testing";
import {
    convertEffectivePermMask,
    dateWithinRange,
    doubleDigit,
    fromCamelCase,
    isGuid,
    resolvePermissions,
    splitIndex,
    yyyymmdd
} from "./utility.service";
import {each} from 'lodash';


describe('Utility Service', () => {

    describe('Function convertEffectivePermMask', () => {
        it('returns the mask for \'FullMask\'', () => {
            expect(convertEffectivePermMask('FullMask')).toEqual('0x7FFFFFFFFFFFFFFF');
        });
        it('returns null when a matching permission name isn\'t found', () => {
            expect(convertEffectivePermMask('Some Unknown Mask')).toBeNull();
        });
    });


    describe('Function: dateWithinRange', () => {
        it("works with a valid start and end with date in middle.", () => {
            var start = new Date(2012, 1, 1),
                end = new Date(2012, 1, 3),
                date = new Date(2012, 1, 2);
            expect(dateWithinRange(start, end, date)).toBe(true);
        });
        it("works without a date to check.", () => {
            var start = new Date(2014, 1, 1),
                end = new Date(2014, 1, 2);
            //Current date is in the future so it is not within the range.
            expect(dateWithinRange(start, end)).toBe(false);
        });
        it('returns false if a start date is missing', () => {
            var start,
                end = new Date(2014, 1, 2);
            expect(dateWithinRange(start, end)).toBe(false);
        });
        it('returns false if a end date is missing', () => {
            var start = new Date(2014, 1, 1),
                end;
            expect(dateWithinRange(start, end)).toBe(false);
        });
    });

    describe('Function: doubleDigit', () => {
        it("Should add a leading 0 for a single digit.", () => {
            expect(doubleDigit(3)).toEqual('03');
        });
        it("Should return a 2 digit string for a double digit.", () => {
            expect(doubleDigit(11)).toEqual('11');
        });
        it("Should work when a number represented by string is used.", () => {
            expect(doubleDigit('3')).toEqual('03');
        });
    });

    describe('Function: fromCamelCase', () => {
        it("Convert camel cased text to space delimited words.", () => {
            expect(fromCamelCase('thisIsATest')).toEqual('This Is A Test');
        });
    });


    describe('Function: isGuid', () => {
        it("Should detect when a GUID is valid.", () => {
            expect(isGuid('{00A69513-BB63-4333-9639-EB14C08269DB}')).toBe(true);
        });
        it("Should reject a missing GUID", () => {
            expect(isGuid('')).toBe(false);
        });
        it("Should detect GUID without curly brackets.", () => {
            expect(isGuid('00A69513-BB63-4333-9639-EB14C08269DB')).toBe(true);
        })
    });


    describe('Function: resolvePermissions', () => {

        it('allows user with FullMask to have all permissions set to true.', () => {
            //Full rights mask
            let permissions = resolvePermissions('0x7FFFFFFFFFFFFFFF');

            for (let permissionName in permissions) {
                expect(permissions[permissionName]).toBe(true);
            }
        });
        it('Should prevent read-only user from approving.', () => {
            //Limited user (view only)
            let permissions = resolvePermissions('0x0000000000000001');
            let rejectedPermissions = [
                'AddListItems',
                'EditListItems',
                'DeleteListItems',
                'ApproveItems',
                'OpenItems',
                'ViewVersions',
                'DeleteVersions',
                'CancelCheckout',
                'ManageLists',
                'ViewFormPages'
            ];
            //Should only be able to view
            expect(permissions.ViewListItems).toBe(true);
            //All others should be rejected
            rejectedPermissions.forEach(permissionName => expect(permissions[permissionName]).toBe(false));

        });
        it('Should allow a user with edit rights to edit.', () => {
            //0x0000000000000007 combines View (0x0000000000000001), Add (0x0000000000000002), and Edit (0x0000000000000004)
            let permissions = resolvePermissions('0x0000000000000007');
            //User can view, add, and edit
            expect(permissions.ViewListItems).toBe(true);
            expect(permissions.AddListItems).toBe(true);
            expect(permissions.EditListItems).toBe(true);
            //But can't do anything else
            expect(permissions.DeleteListItems).toBe(false);
            expect(permissions.ApproveItems).toBe(false);
            expect(permissions.OpenItems).toBe(false);
            expect(permissions.ViewVersions).toBe(false);
            expect(permissions.DeleteVersions).toBe(false);
            expect(permissions.CancelCheckout).toBe(false);
            expect(permissions.DeleteVersions).toBe(false);
            expect(permissions.ManageLists).toBe(false);
            expect(permissions.ViewFormPages).toBe(false);
        });
    });


    describe('Function: splitIndex', () => {
        it("Converts delimited string into object", () => {
            expect(splitIndex('25;#Some Text')).toEqual({id: 25, value: 'Some Text'});
        });
    });


    describe('Function: yyyymmdd', () => {
        it("Should convert a date.", () => {
            var testDate = yyyymmdd(new Date(2012, 0, 1));
            expect(testDate).toEqual(20120101);
        });
    });

});
