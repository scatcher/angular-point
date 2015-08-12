/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    export interface IListItemVersion<T extends ListItem<any>> extends ListItem<T> {
        modified: Date;
        version: number;
        [key: string]: any;
    }

    export interface IFieldVersion{
        editor: IUser;
        modified: Date;
        value: any;
        version: number;
    }



    export class FieldVersionCollection{
        fieldDefinition: FieldDefinition;
        versions: {[key: number]: IFieldVersion} = {};
        constructor(fieldDefinition: FieldDefinition) {
            this.fieldDefinition = fieldDefinition;
        }
        addVersion(editor: IUser, modified: Date, value: any, version: number) {
            this.versions[version] = {
                editor,
                modified,
                value,
                version
            }
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
        newValue: string;
        oldValue: string;

        constructor(private propertyName: string, fieldDefinition: IFieldDefinition, private newerVersion: IListItemVersion<any>, private previousVersion: IListItemVersion<any> = {}) {
            this.newValue = this.getFormattedValue(newerVersion);
            this.oldValue = this.getFormattedValue(previousVersion);
            this.fieldName = fieldDefinition.displayName;
        }
        getFormattedValue(version: IListItemVersion<any>): string {
            var propertyValue = '';
            if (version.getFormattedValue) {
                propertyValue = version.getFormattedValue(this.propertyName);
            }
            return propertyValue;
        }
    }

    class VersionSummary<T extends ListItem<any>> {
        changeCount: number;
        changes: { [key: string]: FieldChange; } = {};
        listItemVersion: IListItemVersion<any>;
        version: number;
        constructor(newerVersion: IListItemVersion<T>, previousVersion: IListItemVersion<T> | Object = {}) {
            _.each(newerVersion, (val, propertyName) => {
                var fieldDefinition = newerVersion.getFieldDefinition(propertyName);
                //Only log non-readonly fields that aren't the same
                if (fieldDefinition && !fieldDefinition.readOnly &&
                    JSON.stringify(newerVersion[propertyName]) !== JSON.stringify(previousVersion[propertyName])) {
                    let fieldChange = new FieldChange(propertyName, fieldDefinition, newerVersion, previousVersion);
                    if (fieldChange.newValue !== fieldChange.oldValue) {
                        this.changes[propertyName] = fieldChange;
                    }
                }
            });
            this.changeCount = _.keys(this.changes).length;
            this.listItemVersion = newerVersion;
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

    class ChangeSummary<T extends ListItem<any>> {
        significantVersionCount = 0;
        versionCount = 0;
        versions: VersionSummary<T>[] = [];
        constructor(versions: VersionHistoryVersions<T>) {
            var previousVersion;
            var summaryArray = [];
            _.each(versions, (version: IListItemVersion<T>) => {
                var versionSummary = new VersionSummary<T>(version, previousVersion);
                if (versionSummary.hasMajorChanges) {
                    this.significantVersionCount++;
                }
                this.versionCount++;
                this.versions.push(versionSummary);
                previousVersion = version;
            });

        }
    }

    interface VersionHistoryVersions<T extends ListItem<any>>{
        [key: number]: IListItemVersion<T>
    }

    export class VersionHistoryCollection<T extends ListItem<any>>{
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
                    /** Add field to the version history for this version */
                    [fieldVersionCollection.mappedName]: fieldVersion.value,
                    modified: fieldVersion.modified,
                    version: parseInt(versionNumber)
                });
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

    // export class ListItemVersionFactory {
    //     // static $inject = ['$q', 'apUtilityService'];
    //     constructor() {

    //     }
    //     /**
    //      * @ngdoc
    //      * @name angularPoint.apListItemVersionFactory.generateVersionsFromFieldVersionCollection
    //      * @methodOf angularPoint.apListItemVersionFactory
    //      * @param {IFieldVersionCollection[][]} fieldVersionCollections
    //      *
    //      */
    //     // generateVersionsFromFieldVersionCollection<T extends ListItem<any>>(fieldVersionCollections: FieldVersionCollection[]) {
    //     //         var versionHistory = new VersionHistory();

    //     //         /** Iterate through each of the field version collections */
    //     //         _.each(fieldVersionCollections, (fieldVersionCollection) => {
    //     //             versionHistory.addFieldCollection(fieldVersionCollection);
    //     //         });

    //     //         return versionHistory;
    //     // }

    // }

    // /**
    //  * @ngdoc function
    //  * @name angularPoint.apListItemVersionFactory
    //  * @description
    //  * Factory which handles parsing list item versions.
    //  *
    //  */
    // angular.module('angularPoint')
    //     .service('apListItemVersionFactory', ListItemVersionFactory);


}
