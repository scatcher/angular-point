/// <reference path="../../mock/app.module.mock.ts" />

module ap {
    'use strict';

    describe('Service: apFieldService', function() {

        /** Load the main module */
        beforeEach(module('angularPoint'));

        var service: FieldService;

        beforeEach(inject(function(_apFieldService_) {
            service = _apFieldService_;
        }));


        describe('getDefaultValueByFieldType', function() {

            it('should return boolean as null', function() {
                var defaultValue = service.getDefaultValueForType('Boolean');
                expect(defaultValue).toBe(null);
            });

            it('should return a undefined parameter as an empty string', function() {
                var defaultValue = service.getDefaultValueForType();
                expect(defaultValue).toBe('');
            });

            it('should return a text as an empty string', function() {
                var defaultValue = service.getDefaultValueForType('Text');
                expect(defaultValue).toBe('');
            });

            it('should return a multi lookup as an empty array', function() {
                var defaultValue = service.getDefaultValueForType('LookupMulti');
                expect(defaultValue).toEqual([]);
            });
        });
    });
}