import {it, describe, expect} from "@angular/core/testing";

import {
    checkResponseForErrors,
    extendFieldDefinitionsFromXML,
    extendListDefinitionFromXML,
    jsAttachments,
    jsBoolean,
    jsCalc,
    jsChoiceMulti,
    jsDate,
    jsFloat,
    jsInt,
    jsLookup,
    jsLookupMulti,
    jsObject,
    jsString,
    jsUser,
    jsUserMulti,
    parseStringValue
} from "./decode.service";

import {
    getListItemChangesSinceToken,
    errorUpdatingListItem,
    errorContainingErrorString
} from "../e2e/mock-responses.e2e";
import {IFieldDefinition} from "../factories/field-definition.factory";
// import {unescape} from 'lodash';

describe('Decode Service', () => {

    // beforeEachProviders(() => [DecodeService]);


    // it('should ...', inject([DecodeService], (service: DecodeService) => {
    //
    // }));

    //Attachments
    describe('Decodes SharePoint Attachments', () => {
        it('handles an item with no attachments', () => {
            expect(jsAttachments('0'))
                .toEqual('');
        });
        it('handles an item with an attachment count', () => {
            expect(jsAttachments('2'))
                .toEqual(2);
        });
        it('handles an item with an attachment url', () => {
            expect(jsAttachments(';#https://SharePointSite.com/Lists/Widgets/Attachments/4/DocumentName.xlsx;#'))
                .toEqual(['https://SharePointSite.com/Lists/Widgets/Attachments/4/DocumentName.xlsx']);
        });
        it('handles an item with an attachment with multiple attachment urls', () => {
            expect(jsAttachments(';#https://SharePointSite.com/Lists/Widgets/Attachments/4/Document1.xlsx;#https://SharePointSite.com/Lists/Widgets/Attachments/4/Document2.xlsx;#'))
                .toEqual(['https://SharePointSite.com/Lists/Widgets/Attachments/4/Document1.xlsx', 'https://SharePointSite.com/Lists/Widgets/Attachments/4/Document2.xlsx']);
        });
    });

    //Boolean
    describe('Decodes SharePoint Boolean', () => {
        it('evaluates "1" as true', () => {
            expect(jsBoolean('1'))
                .toEqual(true);
        });
        it('evaluates "True" as true', () => {
            expect(jsBoolean('True'))
                .toEqual(true);
        });
        it('evaluates "TRUE" as true', () => {
            expect(jsBoolean('TRUE'))
                .toEqual(true);
        });
        it('evaluates "false" as false', () => {
            expect(jsBoolean('false'))
                .toEqual(false);
        });
    });

    //Calculated
    describe('Decodes SharePoint Calculated', () => {
        it('Should parse a calculated float.', () => {
            expect(jsCalc('float;#1234.5'))
                .toEqual(1234.5);
        });
        it('Should parse a calculated date.', () => {
            expect(jsCalc('datetime;#2009-08-25 14:24:48'))
                .toEqual(new Date(2009, 7, 25, 14, 24, 48));
        });
    });

    //Currency
    describe('Decodes SharePoint Currency', () => {
        it('creates valid float', () => {
            expect(jsFloat('19.99'))
                .toEqual(19.99);
        });
        it('not throw error when currency isn\'t found', () => {
            expect(parseStringValue(''))
                .toEqual('');
        });
    });

    //DateTime
    describe('Decodes SharePoint DateTime', () => {
        // it('Should properly handle a date string.', () => {
        //     expect(jsDate('2009-08-25 14:24:48',))
        //         .toEqual(new Date(2009, 7, 25, 14, 24, 48));
        // });
        it('Should handle a date with a "T" delimiter instead of a space.', () => {
            expect(jsDate('2009-08-25T14:24:48'))
                .toEqual(new Date(2009, 7, 25, 14, 24, 48));
        });
        it('Should handle a Z at the end.', () => {
            expect(jsDate('2014-09-02T13:35:57Z'))
                .toEqual(new Date(2014, 8, 2, 13, 35, 57));
        });
    });

    //HTML
    describe('Decodes SharePoint HTML', () => {
        // it('decodes an HTML string', () => {
        //     //Need to unescape because parseStringValue passes an unescaped value in
        //     let unescapedValue = unescape('&lt; Test &amp; Test &gt;');
        //     expect(jsString(unescapedValue))
        //         .toEqual('< Test & Test >');
        // });
        it('not throw error when HTML isn\'t found', () => {
            expect(jsString(''))
                .toEqual('');
        });
    });

    //Integer
    describe('Decodes SharePoint Integer', () => {
        it('creates valid integer', () => {
            expect(jsInt('11'))
                .toEqual(11);
        });
        it('not throw error when integer isn\'t found', () => {
            expect(jsInt(''))
                .toEqual('');
        });
    });


    //JSON
    describe('Decodes SharePoint JSON objects saved as plain text.', () => {
        it('decodes an JSON string', () => {
            expect(jsObject('{"cog": "widget"}'))
                .toEqual({cog: 'widget'});
        });
    });


    //Lookup
    describe('Decodes SharePoint Lookup', () => {
        it('will create the lookup ID', () => {
            expect(jsLookup('12;#Widget').lookupId)
                .toEqual(12);
        });
        it('will create the lookup value', () => {
            expect(jsLookup('12;#Widget').lookupValue)
                .toEqual('Widget');
        });
    });

    //LookupMulti
    describe('Decodes SharePoint LookupMulti', () => {
        it('will parse multiple lookups', () => {
            expect(jsLookupMulti('12;#Widget;#13;#Cog').length)
                .toEqual(2);
        });
        it('will accept an empty value', () => {
            expect(jsLookupMulti(''))
                .toEqual([]);
        });
    });


    //User
    describe('Decodes SharePoint User', () => {
        it('create the user id', () => {
            expect(jsUser('9;#Joe').lookupId)
                .toEqual(9);
        });
        it('create the user name', () => {
            expect(jsUser('9;#Joe').lookupValue)
                .toEqual('Joe');
        });
    });


    //UserMulti
    describe('Decodes SharePoint UserMulti', () => {
        it('will parse multiple users', () => {
            expect(jsUserMulti('9;#Joe;#10;#Jane;#11;#Pete').length)
                .toEqual(3);
            // expect(jsUserMulti('9;#Joe;#10;#Jane;#11;#Pete')[0])
            //     .toEqual({lookupId: 9, lookupValue: 'Joe'});
        });
        it('will accept an empty value', () => {
            expect(jsUserMulti(''))
                .toEqual([]);
        });
    });


    //MultiChoice
    describe('Decodes SharePoint MultiChoice', () => {
        it('will create an array of selected choices', () => {
            expect(jsChoiceMulti('Choice 1;#Choice 2;#Choice 3;#Choice 4').length)
                .toEqual(4);
        });
        it('will add choices in correct order', () => {
            expect(jsChoiceMulti('Choice 1;#Choice 2;#Choice 3;#Choice 4')[2])
                .toEqual('Choice 3');
        });
        it('will accept an empty value', () => {
            expect(jsChoiceMulti(''))
                .toEqual([]);
        });
    });

    describe('checkResponseForErrors', () => {
        it('returns null when an error isn\'t found', () => {
            expect(checkResponseForErrors(getListItemChangesSinceToken())).toBeUndefined();
        });
        it('to find an error in the <ErrorText> element', () => {
            expect(checkResponseForErrors(errorUpdatingListItem()))
                .toEqual('Invalid date/time value. A date/time field contains invalid data. Please check the value and try again.');
        });
        it('to find an error in the <errorstring> element', () => {
            expect(checkResponseForErrors(errorContainingErrorString()))
                .toEqual(`Parameter Url is missing or invalid.`);
        });
    });

    describe('extendFieldDefinitionsFromXML', () => {

        // let fieldDefinitions = <IFieldDefinition[]>[{
        //     mappedName: 'multiChoice',
        //     objectType: 'MultiChoice',
        //     staticName: 'MultiChoice',
        //     //SharePoint Field Definition Properties
        //     Choices: [],
        //     Default: '',
        //     Description: undefined,
        // }];

        // beforeEach(() => {
        //     // Extend the field definitions with attributes from XML
        //     extendFieldDefinitionsFromXML(fieldDefinitions, getListItemChangesSinceToken());
        // });

        // it('should add all of the specified choices', () => {
        //     expect(fieldDefinitions[0].Choices.length).toEqual(3);
        // });


        // it('extends field definitions from XML', () => {
        //     expect(fieldDefinitions[0].Description).toEqual('Multiple choice option.  Also allows fill-in choices.');
        // });
    });

    describe('extendListDefinitionFromXML', () => {

        // it('extends list definition from XML', () => {

        //     let mockList = {Description: undefined};
        //     // Extend the list with XML
        //     extendListDefinitionFromXML(mockList, getListItemChangesSinceToken());

        //     expect(mockList.Description).toEqual('Just a mock list to use for prototyping.');
        // });
    });


});
