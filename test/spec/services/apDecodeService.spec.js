"use strict";

describe("Factory: apDecodeService", function () {

    beforeEach(module("angularPoint"));

    var apDecodeService,
        mockChangeTokenXML,
        mockEntityCache,
        mockModel,
        mockXMLService;

    beforeEach(inject(function (_apDecodeService_, _mockXMLService_, _mockModel_) {
        apDecodeService = _apDecodeService_;
        mockXMLService = _mockXMLService_;
        mockModel = _mockModel_;

        mockChangeTokenXML = mockXMLService.GetListItemChangesSinceToken;
    }));


    describe('parseStringValue', function () {
        //Boolean
        describe('Boolean', function () {
            it('evaluates "1" as true', function () {
                expect(apDecodeService.parseStringValue('1', 'Boolean'))
                    .toEqual(true);
            });
            it('evaluates "True" as true', function () {
                expect(apDecodeService.parseStringValue('True', 'Boolean'))
                    .toEqual(true);
            });
            it('evaluates "TRUE" as true', function () {
                expect(apDecodeService.parseStringValue('TRUE', 'Boolean'))
                    .toEqual(true);
            });
            it('evaluates "false" as false', function () {
                expect(apDecodeService.parseStringValue('false', 'Boolean'))
                    .toEqual(false);
            });
        });

        //Calc
        describe('Calc', function () {
            it('Should parse a calculated string.', function () {
                expect(apDecodeService.parseStringValue('99;#Test', 'Calc'))
                    .toEqual('Test');
            });
        });

        //Currency
        describe('Currency', function () {
            it('creates valid float', function () {
                expect(apDecodeService.parseStringValue('19.99', 'Currency'))
                    .toEqual(19.99);
            });
            it('not throw error when currency isn\'t found', function () {
                expect(apDecodeService.parseStringValue('', 'Currency'))
                    .toEqual('');
            });
        });


        //DateTime
        describe('DateTime', function () {
            it('Should properly handle a date string.', function () {
                expect(apDecodeService.parseStringValue('2009-08-25 14:24:48', 'DateTime'))
                    .toEqual(new Date(2009, 7, 25, 14, 24, 48));
            });
            it('Should handle a date with a "T" delimiter instead of a space.', function () {
                expect(apDecodeService.parseStringValue('2009-08-25T14:24:48', 'DateTime'))
                    .toEqual(new Date(2009, 7, 25, 14, 24, 48));
            });
            it('Should handle a Z at the end.', function () {
                expect(apDecodeService.parseStringValue('2014-09-02T13:35:57Z', 'DateTime'))
                    .toEqual(new Date(2014, 8, 2, 13, 35, 57));
            });
        });

        //HTML
        describe('HTML', function () {
            it('decodes an HTML string', function () {
                expect(apDecodeService.parseStringValue('&lt; Test &amp; Test &gt;', 'HTML'))
                    .toEqual('< Test & Test >');
            });
            it('not throw error when HTML isn\'t found', function () {
                expect(apDecodeService.parseStringValue('', 'HTML'))
                    .toEqual('');
            });
        });

        //Integer
        describe('Integer', function () {
            it('creates valid integer', function () {
                expect(apDecodeService.parseStringValue('11', 'Integer'))
                    .toEqual(11);
            });
            it('not throw error when integer isn\'t found', function () {
                expect(apDecodeService.parseStringValue('', 'Integer'))
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
                expect(apDecodeService.parseStringValue('12;#Widget', 'Lookup').lookupId)
                    .toEqual(12);
            });
            it('will create the lookup value', function () {
                expect(apDecodeService.parseStringValue('12;#Widget', 'Lookup').lookupValue)
                    .toEqual('Widget');
            });
        });

        //LookupMulti
        describe('LookupMulti', function () {
            it('will parse multiple lookups', function () {
                expect(apDecodeService.parseStringValue('12;#Widget;#13;#Cog', 'LookupMulti').length)
                    .toEqual(2);
            });
            it('will accept an empty value', function () {
                expect(apDecodeService.parseStringValue('', 'LookupMulti'))
                    .toEqual([]);
            });
        });

        //User
        describe('User', function () {
            it('create the user id', function () {
                expect(apDecodeService.parseStringValue('9;#Joe', 'User').lookupId)
                    .toEqual(9);
            });
            it('create the user name', function () {
                expect(apDecodeService.parseStringValue('9;#Joe', 'User').lookupValue)
                    .toEqual('Joe');
            });
        });


        //LookupMulti
        describe('UserMulti', function () {
            it('will parse multiple users', function () {
                expect(apDecodeService.parseStringValue('9;#Joe;#10;#Jane;#11;#Pete', 'UserMulti').length)
                    .toEqual(3);
            });
            it('will accept an empty value', function () {
                expect(apDecodeService.parseStringValue('', 'UserMulti'))
                    .toEqual([]);
            });
        });

        //MultiChoice
        describe('MultiChoice', function () {
            it('will create an array of selected choices', function () {
                expect(apDecodeService.parseStringValue('Choice 1;#Choice 2;#Choice 3;#Choice 4', 'MultiChoice').length)
                    .toEqual(4);
            });
            it('will add choices in correct order', function () {
                expect(apDecodeService.parseStringValue('Choice 1;#Choice 2;#Choice 3;#Choice 4', 'MultiChoice')[2])
                    .toEqual('Choice 3');
            });
            it('will accept an empty value', function () {
                expect(apDecodeService.parseStringValue('', 'MultiChoice'))
                    .toEqual([]);
            });
        });
    });


    describe('checkResponseForErrors', function () {
        it('returns null when an error isn\'t found', function () {
            expect(apDecodeService.checkResponseForErrors(mockChangeTokenXML)).toBeNull();
        });
        it('to find an error in the <ErrorText> element', function () {
            expect(_.isString(apDecodeService.checkResponseForErrors(mockXMLService.errorUpdatingListItem)))
                .toBe(true);
        });
        it('to find an error in the <errorstring> element', function () {
            expect(_.isString(apDecodeService.checkResponseForErrors(mockXMLService.errorContainingErrorString)))
                .toBe(true);
        });
    });



    describe('extendListDefinitionFromXML', function () {

        beforeEach(function () {
            /** Extend the list with XML */
            apDecodeService.extendListDefinitionFromXML(mockModel.list, mockChangeTokenXML);
        });


        it('extends list definition from XML', function () {
            expect(mockModel.list.Description).toEqual('Just a mock list to use for prototyping.');
        });

    });

    describe('extendFieldDefinitionsFromXML', function () {

        var multiChoiceFieldDefinition;

        beforeEach(function () {
            /** Extend the list with XML */
            apDecodeService.extendFieldDefinitionsFromXML(mockModel.list.fields, mockChangeTokenXML);
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
            apDecodeService.processListItems(mockModel, mockModel.getQuery(), mockChangeTokenXML, {
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
