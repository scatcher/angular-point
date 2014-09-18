'use strict';

describe('Service: apFieldService', function () {

    /** Load the main module */
    beforeEach(module('angularPoint'));

    var apFieldService;

    beforeEach(inject(function (_apFieldService_) {
        apFieldService = _apFieldService_;
    }));


    describe('getDefaultValueByFieldType', function () {

        it('should return boolean as null', function () {
            var defaultValue = apFieldService.getDefaultValueForType('Boolean');
            expect(defaultValue).toBe(null);
        });

        it('should return a undefined parameter as an empty string', function () {
            var defaultValue = apFieldService.getDefaultValueForType();
            expect(defaultValue).toBe('');
        });

        it('should return a text as an empty string', function () {
            var defaultValue = apFieldService.getDefaultValueForType('Text');
            expect(defaultValue).toBe('');
        });

        it('should return a multi lookup as an empty array', function () {
            var defaultValue = apFieldService.getDefaultValueForType('LookupMulti');
            expect(defaultValue).toEqual([]);
        });
    });
});