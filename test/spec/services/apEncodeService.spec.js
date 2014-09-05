"use strict";

describe("Factory: apEncodeService", function () {

    beforeEach(module("angularPoint"));

    var apEncodeService,
        mockChangeTokenXML,
        mockEntityCache,
        mockModel,
        mockXMLService,
        apUtilityService;

    beforeEach(inject(function (_apEncodeService_, _mockXMLService_, _mockModel_, _apUtilityService_) {
        apEncodeService = _apEncodeService_;
        mockXMLService = _mockXMLService_;
        mockModel = _mockModel_;
        apUtilityService = _apUtilityService_;

        mockChangeTokenXML = mockXMLService.listItemsSinceChangeToken;
    }));

    describe('Function: choiceMultiToString', function () {

        it('converts array of strings into delimited string', function () {
            var tempChoices = ['choice 1', 'choice 2'];
            expect(apEncodeService.choiceMultiToString(tempChoices))
                .toEqual(';#choice 1;#choice 2;#');
        });

    });

    describe('Function: apEncodeService', function () {
        it('returns an empty value if an empty value is passed in', function () {
            expect(apEncodeService.createValuePair(mockDefinition('Lookup'), ''))
                .toEqual(['Lookup', '']);
        });

        it('correctly handles a Lookup field', function () {
            var validLookup = {lookupId: 1, lookupValue: 'Test'};
            expect(apEncodeService.createValuePair(mockDefinition('Lookup'), validLookup))
                .toEqual([ 'Lookup', 1 ]);
        });        

        it('correctly handles a User field', function () {
            var validUser = {lookupId: 1100, lookupValue: 'Bill'};
            expect(apEncodeService.createValuePair(mockDefinition('User'), validUser))
                .toEqual([ 'User', 1100 ]);
        });

        it('correctly handles a UserMulti field', function () {
            var validUsers = [
                {lookupId: 1100, lookupValue: 'Bill'},
                {lookupId: 1101, lookupValue: 'Jane'}
            ];
            expect(apEncodeService.createValuePair(mockDefinition('UserMulti'), validUsers))
                .toEqual([ 'UserMulti', '1100;#;#1101;#;#' ]);
        });

        it('correctly handles a LookupMulti field', function () {
            var validUsers = [
                {lookupId: 1, lookupValue: 'Cog'},
                {lookupId: 2, lookupValue: 'Widget'}
            ];
            expect(apEncodeService.createValuePair(mockDefinition('LookupMulti'), validUsers))
                .toEqual([ 'LookupMulti', '1;#;#2;#;#' ]);
        });

        it('correctly handles a true Boolean field', function () {
            expect(apEncodeService.createValuePair(mockDefinition('Boolean'), true))
                .toEqual([ 'Boolean', 1 ]);
        });

        it('correctly handles a false Boolean field', function () {
            expect(apEncodeService.createValuePair(mockDefinition('Boolean'), false))
                .toEqual([ 'Boolean', 0 ]);
        });

        it('correctly handles a DateTime field', function () {
            var validDate = new Date(2014, 5, 10, 3, 25, 30);
            expect(apEncodeService.createValuePair(mockDefinition('DateTime'), validDate))
                .toEqual([ 'DateTime', '2014-06-10T03:25:30Z-' + getTimezoneOffsetString() ]);
        });

        it('handles a DateTime value as a string', function () {
            expect(apEncodeService.createValuePair(mockDefinition('DateTime'), '2014-05-06'))
                .toEqual([ 'DateTime', '2014-05-06T00:00:00Z-' + getTimezoneOffsetString() ]);
        });

        it('doesn\'t save invalid DateTime field', function () {
            var invalidDate = 'This is a string and not a date!';
            expect(function(){apEncodeService.createValuePair(mockDefinition('DateTime'), invalidDate)})
                .toThrow();
        });

        it('correctly handles a HTML field', function () {
            var validHTML = '<div>I like eggs & bacon @ breakfast!</div>';
            expect(apEncodeService.createValuePair(mockDefinition('HTML'), validHTML))
                .toEqual([ 'HTML', '&lt;div&gt;I like eggs &amp; bacon @ breakfast!&lt;/div&gt;' ]);
        });

        it('correctly handles a Note field', function () {
            var validNote = 'This is a test area > 1 line!';
            expect(apEncodeService.createValuePair(mockDefinition('Note'), validNote))
                .toEqual([ 'Note', 'This is a test area &gt; 1 line!' ]);
        });

        it('correctly handles a JSON field', function () {
            var validObject = {
                test: 'cog',
                test2: 'sprocket'
            };
            expect(apEncodeService.createValuePair(mockDefinition('JSON'), validObject))
                .toEqual([ 'JSON', '{&quot;test&quot;:&quot;cog&quot;,&quot;test2&quot;:&quot;sprocket&quot;}' ]);
        });

        it('correctly handles a plan text field', function () {
            expect(apEncodeService.createValuePair(mockDefinition('Title'), 'Test String'))
                .toEqual(['Title', 'Test String']);
        });
    });

    function mockDefinition(type) {
        return _.find(mockModel.list.customFields, {internalName: type});
    }

    /** We don't know the timezone of the test server so can't hard code it therefore we need the build system
     * to return the anticipated offset */
    function getTimezoneOffsetString() {
        var offsetString = '',
            offsetZone = new Date().getTimezoneOffset() / 60;

        offsetString += apUtilityService.doubleDigit(offsetZone);
        offsetString += ':00';
        return offsetString;
    }

});