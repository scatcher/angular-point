/// <reference path="../../mock/app.module.mock.ts" />
module ap {
    'use strict';

    var mockModel: MockModel,
        versionHistoryCollection: VersionHistoryCollection<MockListItem>,
        integerFieldVersionCollection: FieldVersionCollection<MockListItem>,
        integerFieldDefinition: FieldDefinition,
        mockUser = {lookupId: 22, lookupValue: 'Some Guy'};


    describe('Factory: apListItemVersionFactory', function () {

        beforeEach(module('angularPoint'));

        beforeEach(inject(function (_mockModel_) {
            //factory = _apListItemFactory_;
            mockModel = _mockModel_;

            integerFieldDefinition = mockModel.getFieldDefinition('integer');
            resetFieldVersionCollection();
        }));

        describe('Class FieldVersionCollection', function () {
            it('allows versions to be added', function () {
                integerFieldVersionCollection.addVersion(mockUser, new Date(2013, 9, 8), 5, 1);
                expect(integerFieldVersionCollection.length).toEqual(1);
                expect(integerFieldVersionCollection.versions[1]).toBeDefined();
            });
            it('exposes fields mapped name', function () {
                expect(integerFieldDefinition.mappedName).toEqual('integer');
            });
        });

        describe('Class FieldChangeSummary', function () {

            it('correctly detects a change', function () {
                var newVersion = new mockModel.factory<MockListItem>({integer: 4});
                var oldVersion = new mockModel.factory<MockListItem>({integer: 3});
                var changeSummary = new ap.FieldChangeSummary(newVersion, oldVersion);

                expect(changeSummary.hasMajorChanges).toBeTruthy();
            });

        });

        describe('Class VersionSummary', function () {

            describe('getter hasMajorChanges', function () {
                it('returns false when nothing changes between versions', function () {
                    var newVersion = new mockModel.factory<MockListItem>({integer: 3, version: 2});
                    var oldVersion = new mockModel.factory<MockListItem>({integer: 3, version: 1});
                    var versionSummary = new ap.VersionSummary(newVersion, oldVersion);

                    expect(versionSummary.hasMajorChanges).toBeFalsy();
                });
                it('returns true when nothing changes between versions', function () {
                    var newVersion = new mockModel.factory<MockListItem>({integer: 4, version: 2});
                    var oldVersion = new mockModel.factory<MockListItem>({integer: 3, version: 1});
                    var versionSummary = new ap.VersionSummary(newVersion, oldVersion);

                    expect(versionSummary.hasMajorChanges).toBeTruthy();
                });
            });

            describe('change count', function () {
                it('correctly identifies that 2 fields were changed', function () {
                    var newVersion = new mockModel.factory<MockListItem>({boolean: false, integer: 3, version: 2});
                    var oldVersion = new mockModel.factory<MockListItem>({boolean: true, integer: 4, version: 1});
                    var versionSummary = new ap.VersionSummary(newVersion, oldVersion);

                    expect(versionSummary.changeCount).toEqual(2);
                });
            });

        });

        describe('Class ChangeSummary', function() {
                      
            it('correctly determines which changes are significant', function () {
                var changes = {
                    /** Significant because it's the first */
                    1: new mockModel.factory<MockListItem>({integer: 2, version: 1}),
                    /** Significant because integer changed */
                    2: new mockModel.factory<MockListItem>({integer: 3, version: 2}),
                    /** Not a significant change */
                    3: new mockModel.factory<MockListItem>({integer: 3, version: 3})
                };
                var changeSummary = new ap.ChangeSummary(changes);

                expect(changeSummary.significantVersionCount).toEqual(2);
            });
        });

        describe('Class VersionHistoryCollection', function() {
            let v1Date = new Date(2014, 10, 9);
            let v2Date = new Date(2014, 11, 1);
            let mockUser2 = {lookupId: 7, lookupValue: 'James Bond'}
            
            let integerVersions = {
                mappedName: 'integer',
                versions: {
                    1: {value: 2, editor: mockUser, modified: v1Date},
                    2: {value: 3, editor: mockUser2, modified: v2Date}
                }
            }
            let booleanVersions = {
                mappedName: 'boolean',
                versions: {
                    1: {value: true, editor: mockUser, modified: new Date(2014, 10, 9)},
                    2: {value: false, editor: mockUser2, modified: new Date(2014, 11, 1)}
                }
            }
            let versionHistoryCollection;
            
            beforeEach(() => versionHistoryCollection = new ap.VersionHistoryCollection([integerVersions, booleanVersions], mockModel.factory));
            
            it('correctly combines two field version collections to build version 1', function() {
                expect(versionHistoryCollection[1].integer).toEqual(2);
                expect(versionHistoryCollection[1].boolean).toEqual(true);
                expect(versionHistoryCollection[1].modified).toEqual(v1Date);
                expect(versionHistoryCollection[1].editor).toEqual(mockUser);
                expect(versionHistoryCollection[1].version).toEqual(1);
            });
            
            it('correctly combines two field version collections to build version 2', function() {
                expect(versionHistoryCollection[2].integer).toEqual(3);
                expect(versionHistoryCollection[2].boolean).toEqual(false);
                expect(versionHistoryCollection[2].modified).toEqual(v2Date);
                expect(versionHistoryCollection[2].editor).toEqual(mockUser2);
                expect(versionHistoryCollection[2].version).toEqual(2);                
            });
            
            it('its count method to return the number of versions', function() {
                expect(versionHistoryCollection.count()).toEqual(2);
            });
            
            it('its toArray method converts the object into an array', function() {
                expect(versionHistoryCollection.toArray()[1]).toEqual(versionHistoryCollection[2]);
                expect(versionHistoryCollection.toArray()[0].version).toEqual(1);
            });
            
            
        });


    });

    function resetFieldVersionCollection() {
        integerFieldVersionCollection = new ap.FieldVersionCollection(integerFieldDefinition);
    }

}
