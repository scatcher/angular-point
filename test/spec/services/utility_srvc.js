describe("Service: apUtilityService", function () {

    var apUtilityService;
    beforeEach(module("angularPoint"));
    beforeEach(inject(function(_apUtilityService_) {
        "use strict";
        apUtilityService = _apUtilityService_;
    }));

    describe('_.isGuid', function() {
        it("Should detect when a GUID is valid.", function() {
            expect(_.isGuid('{00A69513-BB63-4333-9639-EB14C08269DB}')).toBe(true);
        });
        it("Should reject a missing GUID", function() {
            expect(_.isGuid('')).toBe(false);
        });
        it("Should detect GUID without curly brackets.", function() {
            expect(_.isGuid('00A69513-BB63-4333-9639-EB14C08269DB')).toBe(true);
        })
    });
    
    describe('doubleDigit', function () {
        it("Should add a leading 0 for a single digit.", function() {
            expect(apUtilityService.doubleDigit(3)).toEqual('03');
        });
        it("Should return a 2 digit string for a double digit.", function() {
            expect(apUtilityService.doubleDigit(11)).toEqual('11');
        });
        it("Should work when a number represented by string is used.", function() {
            expect(apUtilityService.doubleDigit('3')).toEqual('03');
        });
    });

    describe('yyyymmdd', function () {
        it("Should convert a date.", function() {
            var testDate = apUtilityService.yyyymmdd(new Date(2012, 0, 1));
            expect(testDate).toEqual(20120101);
        });
    });

    describe('dateWithinRange', function () {
        it("Should work with a valid start and end with date in middle.", function() {
            var start = new Date(2012,1,1),
                end = new Date(2012,1,3),
                date = new Date(2012,1,2);
            expect(apUtilityService.dateWithinRange(start, end, date)).toBe(true);
        });
        it("Should work without a date to check.", function() {
            var start = new Date(2014,1,1),
                end = new Date(2014,1,2);
            //Current date is in the future so it is not within the range.
            expect(apUtilityService.dateWithinRange(start, end)).toBe(false);
        });
    });

    describe('resolvePermissions', function () {
        it('Should allow admin to approve.', function () {
            //Full rights mask
            expect(apUtilityService.resolvePermissions('0x7FFFFFFFFFFFFFFF').ApproveItems).toBe(true);
        });
        it('Should prevent read-only user from approving.', function () {
            //Limited user (view only)
            expect(apUtilityService.resolvePermissions('0x0000000000000001').ApproveItems).toBe(false);
        });
        it('Should allow a user with edit rights to edit.', function () {
            //User can edit
            expect(apUtilityService.resolvePermissions('0x0000000000000004').EditListItems).toBe(true);
        });
    });

    describe('toCamlCase', function () {
        it("Convert multiple words with spaces.", function() {
            expect(apUtilityService.toCamelCase('This is a test')).toEqual('thisIsATest');
        });
    });

//    describe('fromCamelCase', function () {
//        it("Convert CAML case to multiple words.", function() {
//            expect(apUtilityService.fromCamelCase('thisIsATest')).toEqual('This is a test');
//        });
//    });

    describe('SplitIndex', function () {
        it("Converts delimited string into object", function() {
            var splitObj = new apUtilityService.SplitIndex('12;#TestValue');
            expect(JSON.stringify(splitObj)).toEqual(JSON.stringify({id: 12, value: 'TestValue'}));
        });
    });


});