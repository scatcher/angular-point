"use strict";

describe("Factory: apDecodeService", function () {

    beforeEach(module("angularPoint"));

    var apDecodeService;

    beforeEach(module("ui.bootstrap"));
    beforeEach(inject(function (_apDecodeService_) {
        apDecodeService = _apDecodeService_;
    }));
    
    describe('attrToJson', function () {
        //Boolean
        describe('Boolean', function () {
            it('Should convert the string representation.', function () {
                expect(apDecodeService.attrToJson('1', 'Boolean'))
                    .toEqual(true);
            });
        });

        //Calc
        describe('Calc', function () {
            it('Should parse a calculated string.', function () {
                expect(apDecodeService.attrToJson('99;#Test', 'Calc'))
                    .toEqual('Test');
            });
        });

        describe('DateTime', function () {
            it('Should properly handle a date string.', function () {
                expect(apDecodeService.attrToJson('2009-08-25 14:24:48', 'DateTime'))
                    .toEqual(new Date(2009, 7, 25,14,24,48));
            });
            it('Should handle a date with a "T" delimiter instead of a space.', function () {
                expect(apDecodeService.attrToJson('2009-08-25T14:24:48', 'DateTime'))
                    .toEqual(new Date(2009, 7, 25,14,24,48));
            });
        });
    });

    describe('create', function () {
        it("should instantiate a new List", function () {

        })
    });
});