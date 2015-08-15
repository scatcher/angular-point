/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    export interface IListItemVersion<T extends ListItem<any>> extends ListItem<T> {
        modified: Date;
        version: number;
        [key: string]: any;
    }

    export interface IFieldVersion {
        editor: IUser;
        modified: Date;
        value: any;
        version: number;
    }

    export class FieldVersionCollection {
        fieldDefinition: FieldDefinition;
        versions: { [key: number]: IFieldVersion } = {};

        constructor(fieldDefinition: FieldDefinition) {
            this.fieldDefinition = fieldDefinition;
        }

        addVersion(editor: IUser, modified: Date, value: any, version: number) {
            this.versions[version] = {
                editor,
                modified,
                value,
                version
            };
        }

        get mappedName() {
            return this.fieldDefinition.mappedName;
        }

        get length() {
            return _.keys(this.versions).length;
        }
    }

    class FieldChange {
        fieldName: string;
        newerVersion: IListItemVersion<any>;
        newValue: string;
        oldValue: string;
        previousVersion: IListItemVersion<any>;
        propertyName: string;

        constructor(propertyName: string, fieldDefinition: IFieldDefinition, newerVersion: IListItemVersion<any>, previousVersion: IListItemVersion<any> = {}) {

            this.fieldName = fieldDefinition.displayName;
            this.newerVersion = newerVersion;
            /** Need to set property name before calling this.getFormattedValue */
            this.propertyName = propertyName;

            this.newValue = this.getFormattedValue(newerVersion);
            this.oldValue = this.getFormattedValue(previousVersion);
            this.previousVersion = previousVersion;
        }

        getFormattedValue(version: IListItemVersion<any>): string {
            var propertyValue = '';
            if (version.getFormattedValue) {
                propertyValue = version.getFormattedValue(this.propertyName);
            }
            return propertyValue;
        }
    }

    export class VersionSummary<T extends ListItem<any>> {
        changeCount: number;
        fieldsChanged: { [key: string]: FieldChange; } = {};
        listItemVersion: IListItemVersion<any>;
        version: number;

        constructor(newerVersion: IListItemVersion<T>, previousVersion: IListItemVersion<T> | Object = {}) {
            /** Loop through each of the properties on the newer list item */
            _.each(newerVersion, (val, propertyName) => {
                var fieldDefinition = newerVersion.getFieldDefinition(propertyName);
                /** Only log non-readonly fields that aren't the same */
                if (fieldDefinition && !fieldDefinition.readOnly &&
                    JSON.stringify(newerVersion[propertyName]) !== JSON.stringify(previousVersion[propertyName])) {

                    let fieldChange = new FieldChange(propertyName, fieldDefinition, newerVersion, previousVersion);
                    if (fieldChange.newValue !== fieldChange.oldValue) {
                        /** This field has changed */
                        this.fieldsChanged[propertyName] = fieldChange;
                    }
                }
            });
            this.changeCount = _.keys(this.fieldsChanged).length;
            this.listItemVersion = newerVersion;
            this.version = newerVersion.version;
        }

        get editor() {
            return this.listItemVersion.editor;
        }

        get modified() {
            return this.listItemVersion.modified;
        }

        get hasMajorChanges(): boolean {
            return _.isNumber(this.changeCount) && this.changeCount > 0;
        }
    }

    export class ChangeSummary<T extends ListItem<any>> {
        /** The number of versions where list item data actually changed */
        significantVersionCount = 0;
        private versionSummaryCollection: { [key: number]: VersionSummary<T> } = {};

        constructor(versions: { [key: number]: IListItemVersion<T> }) {
            /** First version won't have a previous version */
            var previousVersion;
            _.each(versions, (version: IListItemVersion<T>) => {
                var versionSummary = new VersionSummary<T>(version, previousVersion);
                if (versionSummary.hasMajorChanges) {
                    this.significantVersionCount++;
                }
                this.versionSummaryCollection[versionSummary.version] = versionSummary;
                /** Store this version so we can compare to the next version */
                previousVersion = version;
            });
        }
        //Use getter in case we need to alter the way we store this in future
        get changes() {
            return this.versionSummaryCollection;
        }
        get count(): number {
            return _.keys(this.versionSummaryCollection).length;
        }
        get toArray() {
            return _.toArray<VersionSummary<T>>(this.versionSummaryCollection);
        }
    }

    export class VersionHistoryCollection<T extends ListItem<any>> {
        [key: number]: IListItemVersion<T>;
        // getFactory: () => IModelFactory;
        constructor(fieldVersionCollections: FieldVersionCollection[], factory: IModelFactory) {
            /** Iterate through each of the field version collections */
            _.each(fieldVersionCollections, (fieldVersionCollection) => {
                this.addFieldCollection(fieldVersionCollection, factory);
            });
        }

        addFieldCollection(fieldVersionCollection: FieldVersionCollection, factory: IModelFactory): void {
            /** Iterate through each version of this field */
            _.each(fieldVersionCollection.versions, (fieldVersion: IFieldVersion, versionNumber) => {
                /** Create a new version object if it doesn't already exist */
                this[versionNumber] = this[versionNumber] || new factory<T>({
                    editor: fieldVersion.editor,
                    modified: fieldVersion.modified,
                    /** Iterating over object properties which converts everything to string so convert back */
                    version: parseInt(versionNumber)
                });
                /** Add field to the version history for this version with computed property name */
                this[versionNumber][fieldVersionCollection.mappedName] = fieldVersion.value
            });
        }

        count(): number {
            return _.keys(this).length;
        }

        generateChangeSummary(): ChangeSummary<T> {
            return new ChangeSummary<T>(this);
        }

        toArray(): IListItemVersion<T>[] {
            return _.toArray<IListItemVersion<T>>(this);
        }
    }

    //export class ListItemVersionFactory {
    //    // static $inject = ['$q', 'apUtilityService'];
    //    ChangeSummary = ChangeSummary;
    //    VersionHistoryCollection = VersionHistoryCollection;
    //}
    //
    ///**
    // * @ngdoc function
    // * @name angularPoint.apListItemVersionFactory
    // * @description
    // * Factory which handles parsing list item versions.
    // *
    // */
    //angular.module('angularPoint')
    //    .service('apListItemVersionFactory', ListItemVersionFactory);


}
