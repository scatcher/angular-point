import {it, describe, expect} from "@angular/core/testing";
import {choiceMultiToString, encodeValue} from "./encode.service";


describe('Encode Service', () => {

    describe('Function: choiceMultiToString', () => {

        it('converts array of strings into delimited string', () => {
            let tempChoices = ['choice 1', 'choice 2'];
            expect(choiceMultiToString(tempChoices))
                .toEqual(';#choice 1;#choice 2;#');
        });

    });
    describe('Function: encodeValue', () => {

        it('returns an empty value if an empty value is passed in', () => {
            expect(encodeValue('Lookup', ''))
                .toEqual('');
        });

        it('correctly handles a Lookup field', () => {
            let validLookup = {lookupId: 1, lookupValue: 'Test'};
            expect(encodeValue('Lookup', validLookup))
                .toEqual('1;#Test');
        });

        it('correctly handles a User field', () => {
            let validUser = {lookupId: 1100, lookupValue: 'Bill'};
            expect(encodeValue('Lookup', validUser))
                .toEqual('1100;#Bill');
        });

        it('correctly handles a UserMulti field', () => {
            let validUsers = [
                {lookupId: 1100, lookupValue: 'Bill'},
                {lookupId: 1101, lookupValue: 'Jane'}
            ];
            expect(encodeValue('UserMulti', validUsers))
                .toEqual('1100;#Bill;#1101;#Jane');
        });

        it('correctly handles a LookupMulti field', () => {
            let validUsers = [
                {lookupId: 1, lookupValue: 'Cog'},
                {lookupId: 2, lookupValue: 'Widget'}
            ];
            expect(encodeValue('LookupMulti', validUsers))
                .toEqual('1;#Cog;#2;#Widget');
        });

        it('correctly handles a true Boolean field', () => {
            expect(encodeValue('Boolean', true))
                .toEqual('1');
        });

        it('correctly handles a false Boolean field', () => {
            expect(encodeValue('Boolean', false))
                .toEqual('0');
        });

        it(`doesn't save invalid DateTime field`, () => {
            let invalidDate = 'This is a string and not a date!';
            expect(() => {
                encodeValue('DateTime', invalidDate)
            }).toThrow();
        });

        it('correctly handles a HTML field', () => {
            let validHTML = '<div>I like eggs & bacon @ breakfast!</div>';
            expect(encodeValue('HTML', validHTML))
                .toEqual('&lt;div&gt;I like eggs &amp; bacon @ breakfast!&lt;/div&gt;');
        });

        it('correctly handles a Note field', () => {
            let validNote = 'This is a test area > 1 line!';
            expect(encodeValue('Note', validNote))
                .toEqual('This is a test area &gt; 1 line!');
        });

        it('correctly handles a JSON field', () => {
            let validObject = {
                test: 'cog',
                test2: 'sprocket'
            };
            expect(encodeValue('JSON', validObject))
                .toEqual('{&quot;test&quot;:&quot;cog&quot;,&quot;test2&quot;:&quot;sprocket&quot;}');
        });


        it('correctly handles a plan text field', () => {
            expect(encodeValue('Title', 'Test String'))
                .toEqual('Test String');
        });

        // it('correctly handles a DateTime field', () => {
        //     let validDate = moment('2014-04-25T01:32:21.196+0600').toDate();
        //     expect(createValuePair(mockDefinition('DateTime'), validDate))
        //         .toEqual(['DateTime', '2014-04-24T12:32:21Z-07:00']);
        // });

        // it('handles a DateTime value as a string', () => {
        //     expect(createValuePair(mockDefinition('DateTime'), '2012-04-20T01:16:14.196Z'))
        //         .toEqual(['DateTime', '2012-04-20T00:00:00Z-07:00']);
        // });

    });

});