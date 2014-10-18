describe("Service: apUtilityService", function () {

    var service,
        mockModel,
        $rootScope;
    beforeEach(module("angularPoint"));

    beforeEach(inject(function(_apUtilityService_, _mockModel_, _$rootScope_) {
        service = _apUtilityService_;
        mockModel = _mockModel_;
        $rootScope = _$rootScope_;
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

    describe('_.isDefined', function() {
        it('returns true for an undefined value', function () {
            var someValue;
            expect(_.isDefined(someValue)).toBe(false);
        });
        it('returns false for a defined value', function () {
            var someValue = 2;
            expect(_.isDefined(someValue)).toBe(true);
        });
        it('returns true for a null value', function () {
            var someValue = null;
            expect(_.isDefined(someValue)).toBe(true);
        });
    });

    describe('doubleDigit', function () {
        it("Should add a leading 0 for a single digit.", function() {
            expect(service.doubleDigit(3)).toEqual('03');
        });
        it("Should return a 2 digit string for a double digit.", function() {
            expect(service.doubleDigit(11)).toEqual('11');
        });
        it("Should work when a number represented by string is used.", function() {
            expect(service.doubleDigit('3')).toEqual('03');
        });
    });

    describe('yyyymmdd', function () {
        it("Should convert a date.", function() {
            var testDate = service.yyyymmdd(new Date(2012, 0, 1));
            expect(testDate).toEqual(20120101);
        });
    });

    describe('dateWithinRange', function () {
        it("works with a valid start and end with date in middle.", function() {
            var start = new Date(2012,1,1),
                end = new Date(2012,1,3),
                date = new Date(2012,1,2);
            expect(service.dateWithinRange(start, end, date)).toBe(true);
        });
        it("works without a date to check.", function() {
            var start = new Date(2014,1,1),
                end = new Date(2014,1,2);
            //Current date is in the future so it is not within the range.
            expect(service.dateWithinRange(start, end)).toBe(false);
        });
        it('returns false if a start date is missing', function () {
            var start,
                end = new Date(2014,1,2);
            expect(service.dateWithinRange(start, end)).toBe(false);
        });
        it('returns false if a end date is missing', function () {
            var start = new Date(2014,1,1),
                end;
            expect(service.dateWithinRange(start, end)).toBe(false);
        });
    });

    describe('Function: batchProcess', function () {
        //Create simple array of integers to loop through
        var entities = _.times(1000, function(n) { return n}),
            output = [],
            batchCount = 0;

        function someBigTask(entity, index, batchIndex) {
            output.push(mockModel.createEmptyItem({id:entity}));
            if(batchIndex > batchCount) {
                batchCount = batchIndex;
            }
        }

        afterEach(function () {
            output.length = 0;
        });

        it('resolves with the expected outcome in a single batch', function () {
            service.batchProcess(entities, someBigTask, this, 25, 2000)
                .then(function (entityArray) {
                    expect(output.length).toEqual(1000);
                    expect(batchCount).toEqual(1);
                });
            $rootScope.$digest();
        });

        //TODO Get this working after the first timeout is triggered
        //it('splits the request into multiple batches if we exceed the max items', function () {
        //    apUtilityService.batchProcess(entities, someBigTask, this, 25, 750)
        //        .then(function (entityArray) {
        //            expect(batchCount).toEqual(1);
        //        });
        //    $rootScope.$digest();
        //});
    });

    describe('resolvePermissions', function () {
        it('Should allow admin to approve.', function () {
            //Full rights mask
            expect(service.resolvePermissions('0x7FFFFFFFFFFFFFFF').ApproveItems).toBe(true);
        });
        it('Should prevent read-only user from approving.', function () {
            //Limited user (view only)
            expect(service.resolvePermissions('0x0000000000000001').ApproveItems).toBe(false);
        });
        it('Should allow a user with edit rights to edit.', function () {
            //User can edit
            expect(service.resolvePermissions('0x0000000000000004').EditListItems).toBe(true);
        });
    });

    describe('Function convertEffectivePermMask', function () {
        it('returns the mask for \'FullMask\'', function () {
            expect(service.convertEffectivePermMask('FullMask')).toEqual('0x7FFFFFFFFFFFFFFF');
        });
        it('returns null when a matching permission name isn\'t found', function () {
            expect(service.convertEffectivePermMask('Some Unknown Mask')).toBeNull();
        });
    });

    describe('toCamlCase', function () {
        it("Convert multiple words with spaces.", function() {
            expect(service.toCamelCase('This is a test')).toEqual('thisIsATest');
        });
    });

//    describe('fromCamelCase', function () {
//        it("Convert CAML case to multiple words.", function() {
//            expect(apUtilityService.fromCamelCase('thisIsATest')).toEqual('This is a test');
//        });
//    });

    describe('SplitIndex', function () {
        it("Converts delimited string into object", function() {
            var splitObj = new service.SplitIndex('12;#TestValue');
            expect(JSON.stringify(splitObj)).toEqual(JSON.stringify({id: 12, value: 'TestValue'}));
        });
    });


});
