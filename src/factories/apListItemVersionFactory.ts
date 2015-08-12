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
    }

    export interface IFieldVersionCollection{
        modified: string;
        [key: string]: string;
    }


    export class FieldVersionCollection{
        fieldDefinition: FieldDefinition;
        versions: {[key: number]: IFieldVersion}
        constructor(fieldDefinition: FieldDefinition) {
            this.fieldDefinition = fieldDefinition;
        }
        addVersion(editor: IUser, modified: Date, value: any, version: number) {
            this.versions[version] = {
                editor,
                modified,
                value
            }
        }
        get mappedName() {
            return this.fieldDefinition.mappedName;
        }
    }

    class FieldChange {
        fieldName: string;
        newValue: string;
        oldValue: string;

        constructor(private propertyName: string, fieldDefinition: IFieldDefinition, private newerVersion: IListItemVersion<any>, private previousVersion: IListItemVersion<any>) {
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
        modified: string;
        modifiedBy: string;
        version: IListItemVersion<any>;
        versionNumber: number;
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
            this.modified = moment(newerVersion.modified).format('MM/DD/YYYY h:mm a');
            this.modifiedBy = newerVersion.editor.lookupValue;
            this.versionNumber = newerVersion.version;
        }
        get hasMajorChanges(): boolean {
            return _.isNumber(this.changeCount) && this.changeCount > 0;
        }
    }

    class ChangeSummary<T extends ListItem<any>> {
        significantVersionCount = 0;
        versionCount = 0;
        versions: VersionSummary<T>[] = [];
        constructor(factory: IModelFactory, versions: VersionHistoryVersions<T>) {
            let previousVersion;
            let summaryArray = [];
            _.each(versions, (version: IListItemVersion<T>) => {
                var instantiatedVersion = new factory(version);
                var versionSummary = new VersionSummary<T>(instantiatedVersion, previousVersion);
                if (versionSummary.hasMajorChanges) {
                    this.significantVersionCount++;
                }
                this.versionCount++;
                this.versions.push(versionSummary);
                previousVersion = instantiatedVersion;
            });

        }
    }

    interface VersionHistoryVersions<T extends ListItem<any>>{
        [key: number]: IListItemVersion<T>
    }
    
    export class VersionHistoryCollection<T extends ListItem<any>>{
        [key: number]: IListItemVersion<T>;
        constructor(fieldVersionCollections: FieldVersionCollection[], private factory: IModelFactory) {
            /** Iterate through each of the field version collections */
            _.each(fieldVersionCollections, (fieldVersionCollection) => {
                this.addFieldCollection(fieldVersionCollection);
            });
        }
        addFieldCollection(fieldVersionCollection: FieldVersionCollection) {
            /** Iterate through each version of this field */
            _.each(fieldVersionCollection.versions, (fieldVersion: IFieldVersion, versionNumber) => {
                /** Create a new version object if it doesn't already exist */
                this[versionNumber] = this[versionNumber] || new this.factory<T>({
                    modified: fieldVersion.modified,
                    version: versionNumber
                });

                /** Add field to the version history for this version */
                this[versionNumber][fieldVersionCollection.mappedName] = fieldVersion.value;
            });
        }
        generateChangeSummary() {
            return new ChangeSummary<T>(this.factory, this);
        }
    }

    export class VersionHistory<T extends ListItem<any>>{
        factory: IModelFactory;
        versions: VersionHistoryVersions<T>;
        constructor(factory: IModelFactory) {
            this.factory = factory;
        }
        addFieldCollection(fieldVersionCollection: FieldVersionCollection) {
            /** Iterate through each version of this field */
            _.each(fieldVersionCollection.versions, (fieldVersion: IFieldVersion, versionNumber) => {
                /** Create a new version object if it doesn't already exist */
                this.versions[versionNumber] = this.versions[versionNumber] || {};

                /** Add field to the version history for this version */
                _.assign(this.versions[versionNumber][fieldVersionCollection.mappedName], fieldVersion.value);
            });
        }
        generateChangeSummary() {
            return new ChangeSummary<T>(this.factory, this.versions);
        }
    }

    export class ListItemVersionFactory {
        // static $inject = ['$q', 'apUtilityService'];
        constructor() {

        }
        /**
         * @ngdoc
         * @name angularPoint.apListItemVersionFactory.generateVersionsFromFieldVersionCollection
         * @methodOf angularPoint.apListItemVersionFactory
         * @param {IFieldVersionCollection[][]} fieldVersionCollections
         *
         */
        // generateVersionsFromFieldVersionCollection<T extends ListItem<any>>(fieldVersionCollections: FieldVersionCollection[]) {
        //         var versionHistory = new VersionHistory();

        //         /** Iterate through each of the field version collections */
        //         _.each(fieldVersionCollections, (fieldVersionCollection) => {
        //             versionHistory.addFieldCollection(fieldVersionCollection);
        //         });

        //         return versionHistory;
        // }

    }

    /**
     * @ngdoc function
     * @name angularPoint.apListItemVersionFactory
     * @description
     * Factory which handles parsing list item versions.
     *
     */
    angular.module('angularPoint')
        .service('apListItemVersionFactory', ListItemVersionFactory);


}
