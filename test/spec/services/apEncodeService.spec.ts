/// <reference path="../../mock/app.module.mock.ts" />

module ap.test {
    'use strict';

    describe("Factory: apEncodeService", function() {

        beforeEach(module("angularPoint"));

        let service: EncodeService,
            mockModel: MockModel,
            mockXMLService,
            apUtilityService: UtilityService,
            utils;

        beforeEach(inject(function(_apEncodeService_, _mockXMLService_, _mockModel_, _apUtilityService_, apMockUtils) {
            service = _apEncodeService_;
            mockXMLService = _mockXMLService_;
            mockModel = _mockModel_;
            apUtilityService = _apUtilityService_;
            utils = apMockUtils;
        }));

        describe('Function: choiceMultiToString', function() {

            it('converts array of strings into delimited string', function() {
                let tempChoices = ['choice 1', 'choice 2'];
                expect(service.choiceMultiToString(tempChoices))
                    .toEqual(';#choice 1;#choice 2;#');
            });

        });

        describe('Function: apEncodeService', function() {
            it('returns an empty value if an empty value is passed in', function() {
                expect(service.createValuePair(mockDefinition('Lookup'), ''))
                    .toEqual(['Lookup', '']);
            });

            it('correctly handles a Lookup field', function() {
                let validLookup = { lookupId: 1, lookupValue: 'Test' };
                expect(service.createValuePair(mockDefinition('Lookup'), validLookup))
                    .toEqual(['Lookup', '1;#Test']);
            });

            it('correctly handles a User field', function() {
                let validUser = { lookupId: 1100, lookupValue: 'Bill' };
                expect(service.createValuePair(mockDefinition('User'), validUser))
                    .toEqual(['User', '1100;#Bill']);
            });

            it('correctly handles a UserMulti field', function() {
                let validUsers = [
                    { lookupId: 1100, lookupValue: 'Bill' },
                    { lookupId: 1101, lookupValue: 'Jane' }
                ];
                expect(service.createValuePair(mockDefinition('UserMulti'), validUsers))
                    .toEqual(['UserMulti', '1100;#Bill;#1101;#Jane']);
            });

            it('correctly handles a LookupMulti field', function() {
                let validUsers = [
                    { lookupId: 1, lookupValue: 'Cog' },
                    { lookupId: 2, lookupValue: 'Widget' }
                ];
                expect(service.createValuePair(mockDefinition('LookupMulti'), validUsers))
                    .toEqual(['LookupMulti', '1;#Cog;#2;#Widget']);
            });

            it('correctly handles a true Boolean field', function() {
                expect(service.createValuePair(mockDefinition('Boolean'), true))
                    .toEqual(['Boolean', '1']);
            });

            it('correctly handles a false Boolean field', function() {
                expect(service.createValuePair(mockDefinition('Boolean'), false))
                    .toEqual(['Boolean', '0']);
            });

            it('correctly handles a DateTime field', function() {
                let validDate = moment('2014-04-25T01:32:21.196+0600').toDate();
                expect(service.createValuePair(mockDefinition('DateTime'), validDate))
                    .toEqual(['DateTime', '2014-04-24T12:32:21Z-08:00']);
            });

            it('handles a DateTime value as a string', function() {
                expect(service.createValuePair(mockDefinition('DateTime'), '2012-04-20T01:16:14.196Z'))
                    .toEqual(['DateTime', '2012-04-20T00:00:00Z-08:00']);
            });

            it('doesn\'t save invalid DateTime field', function() {
                let invalidDate = 'This is a string and not a date!';
                expect(function() { service.createValuePair(mockDefinition('DateTime'), invalidDate) })
                    .toThrow();
            });

            it('correctly handles a HTML field', function() {
                let validHTML = '<div>I like eggs & bacon @ breakfast!</div>';
                expect(service.createValuePair(mockDefinition('HTML'), validHTML))
                    .toEqual(['HTML', '&lt;div&gt;I like eggs &amp; bacon @ breakfast!&lt;/div&gt;']);
            });

            it('correctly handles a Note field', function() {
                let validNote = 'This is a test area > 1 line!';
                expect(service.createValuePair(mockDefinition('Note'), validNote))
                    .toEqual(['Note', 'This is a test area &gt; 1 line!']);
            });

            it('correctly handles a JSON field', function() {
                let validObject = {
                    test: 'cog',
                    test2: 'sprocket'
                };
                expect(service.createValuePair(mockDefinition('JSON'), validObject))
                    .toEqual(['JSON', '{&quot;test&quot;:&quot;cog&quot;,&quot;test2&quot;:&quot;sprocket&quot;}']);
            });

            it('correctly handles a plan text field', function() {
                expect(service.createValuePair(mockDefinition('Title'), 'Test String'))
                    .toEqual(['Title', 'Test String']);
            });
        });

        function mockDefinition(type) {
            return _.find(mockModel.list.customFields, { staticName: type });
        }
        

    });
}