"use strict";

describe("Factory: apDecodeService", function () {

    beforeEach(module("angularPoint"));

    var service,
        mockChangeTokenXML,
        mockEntityCache,
        mockModel,
        mockXMLService;

    beforeEach(inject(function ($injector) {
        service = $injector.get('apDecodeService');
        mockXMLService = $injector.get('mockXMLService');
        mockModel = $injector.get('mockModel');
        mockChangeTokenXML = mockXMLService.GetListItemChangesSinceToken;
    }));


    describe('parseStringValue', function () {
        //Attachments
        describe('Attachments', function () {
            it('handles an item with no attachments', function () {
                expect(service.parseStringValue('0', 'Attachments'))
                    .toEqual('');
            });
            it('handles an item with an attachment count', function () {
                expect(service.parseStringValue('2', 'Attachments'))
                    .toEqual(2);
            });
            it('handles an item with an attachment url', function () {
                expect(service.parseStringValue(';#https://SharePointSite.com/Lists/Widgets/Attachments/4/DocumentName.xlsx;#', 'Attachments'))
                    .toEqual(['https://SharePointSite.com/Lists/Widgets/Attachments/4/DocumentName.xlsx']);
            });
            it('handles an item with an attachment with multiple attachment urls', function () {
                expect(service.parseStringValue(';#https://SharePointSite.com/Lists/Widgets/Attachments/4/Document1.xlsx;#https://SharePointSite.com/Lists/Widgets/Attachments/4/Document2.xlsx;#', 'Attachments'))
                    .toEqual(['https://SharePointSite.com/Lists/Widgets/Attachments/4/Document1.xlsx', 'https://SharePointSite.com/Lists/Widgets/Attachments/4/Document2.xlsx']);
            });
        });

        //Boolean
        describe('Boolean', function () {
            it('evaluates "1" as true', function () {
                expect(service.parseStringValue('1', 'Boolean'))
                    .toEqual(true);
            });
            it('evaluates "True" as true', function () {
                expect(service.parseStringValue('True', 'Boolean'))
                    .toEqual(true);
            });
            it('evaluates "TRUE" as true', function () {
                expect(service.parseStringValue('TRUE', 'Boolean'))
                    .toEqual(true);
            });
            it('evaluates "false" as false', function () {
                expect(service.parseStringValue('false', 'Boolean'))
                    .toEqual(false);
            });
        });

        //Calculated
        describe('Calculated', function () {
            it('Should parse a calculated float.', function () {
                expect(service.parseStringValue('float;#1234.5', 'Calculated'))
                    .toEqual(1234.5);
            });
            it('Should parse a calculated date.', function () {
                expect(service.parseStringValue('datetime;#2009-08-25 14:24:48', 'Calculated'))
                    .toEqual(new Date(2009, 7, 25, 14, 24, 48));
            });
        });

        //Currency
        describe('Currency', function () {
            it('creates valid float', function () {
                expect(service.parseStringValue('19.99', 'Currency'))
                    .toEqual(19.99);
            });
            it('not throw error when currency isn\'t found', function () {
                expect(service.parseStringValue('', 'Currency'))
                    .toEqual('');
            });
        });


        //DateTime
        describe('DateTime', function () {
            it('Should properly handle a date string.', function () {
                expect(service.parseStringValue('2009-08-25 14:24:48', 'DateTime'))
                    .toEqual(new Date(2009, 7, 25, 14, 24, 48));
            });
            it('Should handle a date with a "T" delimiter instead of a space.', function () {
                expect(service.parseStringValue('2009-08-25T14:24:48', 'DateTime'))
                    .toEqual(new Date(2009, 7, 25, 14, 24, 48));
            });
            it('Should handle a Z at the end.', function () {
                expect(service.parseStringValue('2014-09-02T13:35:57Z', 'DateTime'))
                    .toEqual(new Date(2014, 8, 2, 13, 35, 57));
            });
        });

        //HTML
        describe('HTML', function () {
            it('decodes an HTML string', function () {
                expect(service.parseStringValue('&lt; Test &amp; Test &gt;', 'HTML'))
                    .toEqual('< Test & Test >');
            });
            it('not throw error when HTML isn\'t found', function () {
                expect(service.parseStringValue('', 'HTML'))
                    .toEqual('');
            });
        });

        //Integer
        describe('Integer', function () {
            it('creates valid integer', function () {
                expect(service.parseStringValue('11', 'Integer'))
                    .toEqual(11);
            });
            it('not throw error when integer isn\'t found', function () {
                expect(service.parseStringValue('', 'Integer'))
                    .toEqual('');
            });
        });

        //JSON
        //describe('JSON', function () {
        //    it('decodes an JSON string', function () {
        //        expect(apDecodeService.parseStringValue('{"cog": "widget"}', 'JSON').cog)
        //            .toEqual('widget');
        //    });
        //    it('to throw error if malformed', function () {
        //        expect(apDecodeService.parseStringValue('', 'JSON'))
        //            .toThrow();
        //    });
        //});


        //Lookup
        describe('Lookup', function () {
            it('will create the lookup ID', function () {
                expect(service.parseStringValue('12;#Widget', 'Lookup').lookupId)
                    .toEqual(12);
            });
            it('will create the lookup value', function () {
                expect(service.parseStringValue('12;#Widget', 'Lookup').lookupValue)
                    .toEqual('Widget');
            });
        });

        //LookupMulti
        describe('LookupMulti', function () {
            it('will parse multiple lookups', function () {
                expect(service.parseStringValue('12;#Widget;#13;#Cog', 'LookupMulti').length)
                    .toEqual(2);
            });
            it('will accept an empty value', function () {
                expect(service.parseStringValue('', 'LookupMulti'))
                    .toEqual([]);
            });
        });

        //User
        describe('User', function () {
            it('create the user id', function () {
                expect(service.parseStringValue('9;#Joe', 'User').lookupId)
                    .toEqual(9);
            });
            it('create the user name', function () {
                expect(service.parseStringValue('9;#Joe', 'User').lookupValue)
                    .toEqual('Joe');
            });
        });


        //LookupMulti
        describe('UserMulti', function () {
            it('will parse multiple users', function () {
                expect(service.parseStringValue('9;#Joe;#10;#Jane;#11;#Pete', 'UserMulti').length)
                    .toEqual(3);
            });
            it('will accept an empty value', function () {
                expect(service.parseStringValue('', 'UserMulti'))
                    .toEqual([]);
            });
        });

        //MultiChoice
        describe('MultiChoice', function () {
            it('will create an array of selected choices', function () {
                expect(service.parseStringValue('Choice 1;#Choice 2;#Choice 3;#Choice 4', 'MultiChoice').length)
                    .toEqual(4);
            });
            it('will add choices in correct order', function () {
                expect(service.parseStringValue('Choice 1;#Choice 2;#Choice 3;#Choice 4', 'MultiChoice')[2])
                    .toEqual('Choice 3');
            });
            it('will accept an empty value', function () {
                expect(service.parseStringValue('', 'MultiChoice'))
                    .toEqual([]);
            });
        });
    });


    describe('checkResponseForErrors', function () {
        it('returns null when an error isn\'t found', function () {
            expect(service.checkResponseForErrors(mockChangeTokenXML)).toBeUndefined();
        });
        it('to find an error in the <ErrorText> element', function () {
            expect(_.isString(service.checkResponseForErrors(mockXMLService.errorUpdatingListItem)))
                .toBe(true);
        });
        it('to find an error in the <errorstring> element', function () {
            expect(_.isString(service.checkResponseForErrors(mockXMLService.errorContainingErrorString)))
                .toBe(true);
        });
    });



    describe('extendListDefinitionFromXML', function () {

        it('extends list definition from XML', function () {
            /** Extend the list with XML */
            service.extendListDefinitionFromXML(mockModel.list, mockChangeTokenXML);

            expect(mockModel.list.Description).toEqual('Just a mock list to use for prototyping.');
        });

    });

    describe('extendFieldDefinitionsFromXML', function () {

        var multiChoiceFieldDefinition;

        beforeEach(function () {
            /** Extend the list with XML */
            service.extendFieldDefinitionsFromXML(mockModel.list.fields, mockChangeTokenXML);
            multiChoiceFieldDefinition = mockModel.getFieldDefinition('multiChoice');
        });

        it('should add all of the specified choices', function () {
            expect(multiChoiceFieldDefinition.Choices.length).toEqual(3);
        });

        it('extends field definitions from XML', function () {
            expect(multiChoiceFieldDefinition.displayName).toEqual('Multi Choice');
        });
    });

    describe('dependent methods', function () {
        beforeEach(function () {
            mockEntityCache = mockModel.getCache();
            service.processListItems(mockModel, mockModel.getQuery(), mockChangeTokenXML, {
                target: mockEntityCache
            });
        });

        describe('processListItems', function () {

            it('creates 2 entities', function () {
                expect(mockEntityCache.count()).toBe(2);
            });

        });

    });



    describe('create', function () {
        it("should instantiate a new List", function () {

        })
    });


});
