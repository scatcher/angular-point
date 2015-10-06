/// <reference path="../../mock/app.module.mock.ts" />
var ap;
(function (ap) {
    'use strict';
    describe("Factory: apFieldFactory", function () {
        beforeEach(module("angularPoint"));
        var factory, mockModel;
        beforeEach(inject(function (_apFieldFactory_, _mockModel_) {
            factory = _apFieldFactory_;
            mockModel = _mockModel_;
        }));
        describe('Function getFormattedValue', function () {
            it("converts a lookup into a string using default method", function () {
                var fieldDefinition = new factory.FieldDefinition({ mappedName: 'lookup', objectType: 'Lookup' });
                var listItem = new mockModel.factory({ lookup: { lookupId: 99, lookupValue: 'Bob' } });
                expect(fieldDefinition.getFormattedValue(listItem)).toEqual('Bob');
            });
            it("converts a lookup into a custom string if a override method is included in field definition", function () {
                var fieldDefinition = new factory.FieldDefinition({
                    mappedName: 'lookup',
                    objectType: 'Lookup',
                    formatter: function (listItem, fieldDefinition) {
                        return listItem[fieldDefinition.mappedName].lookupValue.toUpperCase();
                    }
                });
                var listItem = new mockModel.factory({ lookup: { lookupId: 99, lookupValue: 'Bob' } });
                expect(fieldDefinition.getFormattedValue(listItem)).toEqual('BOB');
            });
        });
    });
})(ap || (ap = {}));

//# sourceMappingURL=apFieldFactory.spec.js.map
