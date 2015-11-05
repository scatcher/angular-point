/// <reference path="../../mock/app.module.mock.ts" />
module ap.test {
    'use strict';

    describe("Factory: apListFactory", function() {

        var factory:ListFactory,
            apConfig,
            mockModel: MockModel,
            savedGuid;
        beforeEach(module("angularPoint"));
        beforeEach(inject(function(_apListFactory_, _apConfig_, _mockModel_) {
            factory = _apListFactory_;
            apConfig = _apConfig_;
            mockModel = _mockModel_;
        }));

        describe('create', function() {
            it("should instantiate a new List", function() {
                expect(factory.create()).toEqual(new factory.List);
            })
        });

        describe('Factory: List', function() {
            it('is an instance of List', function() {
                expect(mockModel.list instanceof factory.List).toBe(true);
            });
        });


        describe('Method: getListId', function() {

            it('returns the list guid if guid is specified and apConfig.environment is left at production', function() {
                expect(apConfig.environment).toEqual('production');
                expect(mockModel.list.getListId()).toEqual('{F5345FE7-2F7C-49F7-87D0-DBFEBDD0CE61}');
            });

            describe('using environment object', function() {
                beforeEach(function() {
                    mockModel.list.environments = {
                        development: '{my development guid}',
                        production: '{my production guid}'
                    };
                    savedGuid = mockModel.list.guid;
                    //delete mockModel.list.guid;
                });
                afterEach(function() {
                    mockModel.list.environments = { production: savedGuid };
                    apConfig.environment = 'production';
                });

                it('returns the list guid of a development list from the environments object', function() {
                    mockModel.list.environments = {
                        development: '{my development guid}',
                        production: '{my production guid}'
                    };
                    apConfig.environment = 'development';
                    expect(mockModel.list.getListId()).toEqual('{my development guid}');
                    apConfig.environment = 'production';
                    expect(mockModel.list.getListId()).toEqual('{my production guid}');
                });

                it('throws an error if the environment isn\'t defined in the list', function() {
                    apConfig.environment = 'some undefined environment';
                    expect(function() {
                        mockModel.list.getListId();
                    }).toThrow();
                });

            });
        });
    });
}