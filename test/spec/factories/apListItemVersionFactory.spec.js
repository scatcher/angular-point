/// <reference path="../../mock/app.module.mock.ts" />
var ap;
(function (ap) {
    'use strict';
    var mockModel, versionHistoryCollection, integerFieldVersionCollection, integerFieldDefinition, mockUser = { lookupId: 22, lookupValue: 'Some Guy' };
    describe('Factory: apListItemVersionFactory', function () {
        beforeEach(module('angularPoint'));
        beforeEach(inject(function (_mockModel_) {
            //factory = _apListItemFactory_;
            mockModel = _mockModel_;
            integerFieldDefinition = mockModel.getFieldDefinition('integer');
            resetFieldVersionCollection();
        }));
        describe('Class VersionHistoryCollection', function () {
            it('allows versions to be added', function () {
                integerFieldVersionCollection.addVersion(mockUser, new Date(2013, 9, 8), 5, 1);
                expect(integerFieldVersionCollection.length).toEqual(1);
                expect(integerFieldVersionCollection.versions[1]).toBeDefined();
            });
            it('exposes fields mapped name', function () {
                expect(integerFieldDefinition.mappedName).toEqual('integer');
            });
        });
        describe('Class VersionSummary', function () {
            describe('getter hasMajorChanges', function () {
                it('returns false when nothing changes between versions', function () {
                    var newVersion = new mockModel.factory({ integer: 3, version: 2 });
                    var oldVersion = new mockModel.factory({ integer: 3, version: 1 });
                    var versionSummary = new ap.VersionSummary(newVersion, oldVersion);
                    expect(versionSummary.hasMajorChanges).toBeFalsy();
                });
                it('returns true when nothing changes between versions', function () {
                    var newVersion = new mockModel.factory({ integer: 4, version: 2 });
                    var oldVersion = new mockModel.factory({ integer: 3, version: 1 });
                    var versionSummary = new ap.VersionSummary(newVersion, oldVersion);
                    expect(versionSummary.hasMajorChanges).toBeTruthy();
                });
            });
            describe('change count', function () {
                it('correctly identifies that 2 fields were changed', function () {
                    var newVersion = new mockModel.factory({ boolean: false, integer: 3, version: 2 });
                    var oldVersion = new mockModel.factory({ boolean: true, integer: 4, version: 1 });
                    var versionSummary = new ap.VersionSummary(newVersion, oldVersion);
                    expect(versionSummary.changeCount).toEqual(2);
                });
            });
        });
        describe('Class ChangeSummary', function () {
            it('correctly determines which changes are significant', function () {
                var changes = {
                    /** Significant because it's the first */
                    1: new mockModel.factory({ integer: 2, version: 1 }),
                    /** Significant because integer changed */
                    2: new mockModel.factory({ integer: 3, version: 2 }),
                    /** Not a significant change */
                    3: new mockModel.factory({ integer: 3, version: 3 })
                };
                var changeSummary = new ap.ChangeSummary(changes);
                expect(changeSummary.significantVersionCount).toEqual(2);
            });
        });
    });
    function resetFieldVersionCollection() {
        integerFieldVersionCollection = new ap.FieldVersionCollection(integerFieldDefinition);
    }
})(ap || (ap = {}));

//# sourceMappingURL=../../spec/factories/apListItemVersionFactory.spec.js.map