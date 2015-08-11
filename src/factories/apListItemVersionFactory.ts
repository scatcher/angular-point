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

    class VersionSummary {
        changeCount: number;
        changes: { [key: string]: FieldChange; } = {};
        modified: string;
        modifiedBy: string;
        version: number;
        constructor(newerVersion: IListItemVersion<any>, previousVersion: IListItemVersion<any> | Object = {}) {
            _.each(newerVersion, (val, propertyName) => {
                var fieldDefinition = newerVersion.getFieldDefinition(propertyName);
                //Only log non-readonly fields that aren't the same
                if (fieldDefinition && !fieldDefinition.readOnly &&
                    JSON.stringify(newerVersion[propertyName]) !== JSON.stringify(previousVersion[propertyName])) {
                    // JSON.stringify(newerVersion[propertyName]) !== JSON.stringify(previousVersion[propertyName]) &&
                    // newerVersion[propertyName] !== previousVersion[propertyName] ) {
                    let fieldChange = new FieldChange(propertyName, fieldDefinition, newerVersion, previousVersion);
                    if (fieldChange.newValue !== fieldChange.oldValue) {
                        this.changes[propertyName] = fieldChange;
                    }
                }
            });
            this.changeCount = _.keys(this.changes).length;
            this.modified = moment(newerVersion.modified).format('MM/DD/YYYY h:mm a');
            this.modifiedBy = newerVersion.editor.lookupValue;
            this.version = newerVersion.version;
        }
        get hasMajorChanges(): boolean {
            return _.isNumber(this.changeCount) && this.changeCount > 0;
        }
    }

    class ChangeSummary {
        significantVersionCount = 0;
        versionCount = 0;
        versions: VersionSummary[] = [];
        constructor(factory: IModelFactory, changes: Object) {
            let previousVersion;
            let summaryArray = [];
            _.each(changes, (version) => {
                var instantiatedVersion = new factory(version);
                var versionSummary = new VersionSummary(instantiatedVersion, previousVersion);
                if (versionSummary.hasMajorChanges) {
                    this.significantVersionCount++;
                }
                this.versionCount++;
                this.versions.push(versionSummary);
                previousVersion = instantiatedVersion;
            });

        }
    }
    
    export interface IFieldVersionCollection{
        modified: string;
        [key: string]: string;
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
        generateVersionsFromFieldVersionCollection(fieldVersionCollections: IFieldVersionCollection[][]) {
                var versionHistory = {};

                /** Iterate through each of the field version collections */
                _.each(fieldVersionCollections, (fieldVersions) => {
                    /** Iterate through each version of this field */
                    _.each(fieldVersions, (fieldVersion: IFieldVersionCollection) => {
                        /** Create a new version object if it doesn't already exist */
                        versionHistory[fieldVersion.modified.toJSON()] =
                        versionHistory[fieldVersion.modified.toJSON()] || {};

                        /** Add field to the version history for this version */
                        _.assign(versionHistory[fieldVersion.modified.toJSON()], fieldVersion);
                    });
                });

                return versionHistory;
        }

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
