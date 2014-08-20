"use strict";

describe("Factory: apDecodeService", function () {

    beforeEach(module("angularPoint"));

    var apDecodeService,
        mockChangeTokenXML,
        mockModel,
        mockXMLService;

    beforeEach(module("ui.bootstrap"));
    beforeEach(inject(function (_apDecodeService_, _mockXMLService_, _mockModel_) {
        apDecodeService = _apDecodeService_;
        mockXMLService = _mockXMLService_;
        mockModel = _mockModel_;

        mockChangeTokenXML = mockXMLService.listItemsSinceChangeToken;

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

        //Currency
        describe('Currency', function () {
            it('creates valid float', function () {
                expect(apDecodeService.attrToJson('19.99', 'Currency'))
                    .toEqual(19.99);
            });
            it('not throw error when currency isn\'t found', function () {
                expect(apDecodeService.attrToJson('', 'Currency'))
                    .toEqual('');
            });
        });


        //DateTime
        describe('DateTime', function () {
            it('Should properly handle a date string.', function () {
                expect(apDecodeService.attrToJson('2009-08-25 14:24:48', 'DateTime'))
                    .toEqual(new Date(2009, 7, 25, 14, 24, 48));
            });
            it('Should handle a date with a "T" delimiter instead of a space.', function () {
                expect(apDecodeService.attrToJson('2009-08-25T14:24:48', 'DateTime'))
                    .toEqual(new Date(2009, 7, 25, 14, 24, 48));
            });
        });

        //HTML
        describe('HTML', function () {
            it('decodes an HTML string', function () {
                expect(apDecodeService.attrToJson('&lt; Test &amp; Test &gt;', 'HTML'))
                    .toEqual('< Test & Test >');
            });
            it('not throw error when HTML isn\'t found', function () {
                expect(apDecodeService.attrToJson('', 'HTML'))
                    .toEqual('');
            });
        });

        //Integer
        describe('Integer', function () {
            it('creates valid integer', function () {
                expect(apDecodeService.attrToJson('11', 'Integer'))
                    .toEqual(11);
            });
            it('not throw error when integer isn\'t found', function () {
                expect(apDecodeService.attrToJson('', 'Integer'))
                    .toEqual('');
            });
        });

        //JSON
        //describe('JSON', function () {
        //    it('decodes an JSON string', function () {
        //        expect(apDecodeService.attrToJson('{"cog": "widget"}', 'JSON').cog)
        //            .toEqual('widget');
        //    });
        //    it('to throw error if malformed', function () {
        //        expect(apDecodeService.attrToJson('', 'JSON'))
        //            .toThrow();
        //    });
        //});


        //Lookup
        describe('Lookup', function () {
            it('will create the lookup ID', function () {
                expect(apDecodeService.attrToJson('12;#Widget', 'Lookup').lookupId)
                    .toEqual(12);
            });
            it('will create the lookup value', function () {
                expect(apDecodeService.attrToJson('12;#Widget', 'Lookup').lookupValue)
                    .toEqual('Widget');
            });
        });

        //LookupMulti
        describe('LookupMulti', function () {
            it('will parse multiple lookups', function () {
                expect(apDecodeService.attrToJson('12;#Widget;#13;#Cog', 'LookupMulti').length)
                    .toEqual(2);
            });
            it('will accept an empty value', function () {
                expect(apDecodeService.attrToJson('', 'LookupMulti'))
                    .toEqual([]);
            });
        });

        //User
        describe('User', function () {
            it('create the user id', function () {
                expect(apDecodeService.attrToJson('9;#Joe', 'User').lookupId)
                    .toEqual(9);
            });
            it('create the user name', function () {
                expect(apDecodeService.attrToJson('9;#Joe', 'User').lookupValue)
                    .toEqual('Joe');
            });
        });


        //LookupMulti
        describe('UserMulti', function () {
            it('will parse multiple users', function () {
                expect(apDecodeService.attrToJson('9;#Joe;#10;#Jane;#11;#Pete', 'UserMulti').length)
                    .toEqual(3);
            });
            it('will accept an empty value', function () {
                expect(apDecodeService.attrToJson('', 'UserMulti'))
                    .toEqual([]);
            });
        });

        //MultiChoice
        describe('MultiChoice', function () {
            it('will create an array of selected choices', function () {
                expect(apDecodeService.attrToJson('Choice 1;#Choice 2;#Choice 3;#Choice 4', 'MultiChoice').length)
                    .toEqual(4);
            });
            it('will add choices in correct order', function () {
                expect(apDecodeService.attrToJson('Choice 1;#Choice 2;#Choice 3;#Choice 4', 'MultiChoice')[2])
                    .toEqual('Choice 3');
            });
            it('will accept an empty value', function () {
                expect(apDecodeService.attrToJson('', 'MultiChoice'))
                    .toEqual([]);
            });
        });
    });


    describe('checkResponseForErrors', function () {
        it('returns null when an error isn\'t found', function () {
            expect(apDecodeService.checkResponseForErrors(mockChangeTokenXML)).toBeNull();
        });
        it('return the error string when an error is found', function () {
            expect(apDecodeService.checkResponseForErrors(mockXMLService.xmlWithError)).toEqual('Root element is missing.');
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
            console.log(multiChoiceFieldDefinition);
        });

        it('should add all of the specified choices', function () {
            expect(multiChoiceFieldDefinition.Choices.length).toEqual(3);
        });

        it('extends field definitions from XML', function () {
            expect(multiChoiceFieldDefinition.displayName).toEqual('Multi Choice');
        });
    });


    describe('create', function () {
        it("should instantiate a new List", function () {

        })
    });


});