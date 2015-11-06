/// <reference path="../../mock/app.module.mock.ts" />

module ap.test {
    'use strict';


    describe('Service: apFormattedFieldValueService', function () {

        /** Load the main module */
        beforeEach(module('angularPoint'));

        var service: FormattedFieldValueService;

        beforeEach(inject(function (apFormattedFieldValueService) {
            service = apFormattedFieldValueService;
        }));


        describe('Method: getFormattedFieldValue', function () {
            it('converts a boolean to a string', function () {
                var projectMembers = [
                    { lookupId: 12, lookupValue: 'Joe' },
                    { lookupId: 19, lookupValue: 'Beth' }
                ];
                expect(service.getFormattedFieldValue(projectMembers, 'UserMulti'))
                    .toEqual('Joe, Beth');
                expect(service.getFormattedFieldValue(projectMembers, 'UserMulti', { delim: ' | ' }))
                    .toEqual('Joe | Beth');
            });
        });

        describe('Method: stringifyBoolean', function () {
            it('converts a boolean to a string', function () {
                expect(service.stringifyBoolean(true)).toEqual('true');
            });
        });

        describe('Method: stringifyCalc', function () {
            it('converts a calculated field value to a string', function () {
                expect(service.stringifyCalc(32)).toEqual('32');
                expect(service.stringifyCalc(new Date(2009, 7, 25, 14, 24, 48)))
                    .toEqual('8/25/09 2:24 PM');
                expect(service.stringifyCalc('Test String')).toEqual('Test String');
            });
        });

        describe('Method: stringifyCurrency', function () {
            it('converts a currency float to a string', function () {
                expect(service.stringifyCurrency(24.59)).toEqual('$24.59');
            });
        });

        describe('Method: stringifyDate', function () {
            it('converts a date to a string', function() {
                let validDate = moment('2014-04-25T01:32:21.196+0600').toDate();
                expect(service.stringifyDate(validDate, ''))
                    .toEqual('Apr 24, 2014');
                expect(service.stringifyDate(validDate, 'json'))
                    .toEqual('2014-04-24T19:32:21.196Z');
            });
        });

        describe('Method: stringifyLookup', function () {
            it('converts a lookup to a string', function () {
                expect(service.stringifyLookup({ lookupId: 5, lookupValue: 'Blue' })).toEqual('Blue');
            });
        });

        describe('Method: stringifyMultiChoice', function () {
            it('converts a multi-choice to a string', function () {
                expect(service.stringifyMultiChoice(['Sprocket', 'Widget'], ' + ')).toEqual('Sprocket + Widget');
            });
        });

        describe('Method: stringifyMultiLookup', function () {
            it('converts a multi-lookup to a string', function () {
                expect(service.stringifyMultiLookup([
                    { lookupId: 4, lookupValue: 'Red' },
                    { lookupId: 5, lookupValue: 'Purple' }
                ], ' & ')).toEqual('Red & Purple');
            });
        });

        describe('Method: stringifyNumber', function () {
            it('converts a number to a string', function () {
                expect(service.stringifyNumber(23)).toEqual('23');
                expect(service.stringifyNumber(123.45)).toEqual('123.45');
            });
        });

    });
}