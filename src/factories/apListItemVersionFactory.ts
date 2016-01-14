import {ListItem, User, FieldDefinition} from '../factories';
import {FieldConfigurationObject} from './apFieldFactory';
import {IModelFactory} from './apModelFactory';
import  _ from 'lodash';

export interface IListItemVersions<T extends ListItem<any>> extends ListItem<T> {
    [key: number]: IListItemVersion<T>;
}

export interface IListItemVersion<T extends ListItem<any>> extends ListItem<T> {
    modified: Date;
    version: number;
    [key: string]: any;
}

export interface IFieldVersion {
    editor: User;
    modified: Date;
    value: any;
    version: number;
}

/**
 * @ngdoc object
 * @name FieldVersionCollection
 * @param {FieldDefinition} fieldDefinition Field definition of each version of the field added.
 * @description
 * Object that contains the entire version history for a given list item field/property.
 */
export class FieldVersionCollection {
    fieldDefinition: FieldDefinition;
    versions: { [key: number]: IFieldVersion } = {};

    constructor(fieldDefinition: FieldDefinition) {
        this.fieldDefinition = fieldDefinition;
    }

    /**
     * @ngdoc object
     * @name FieldVersionCollection.addVersion
     * @methodOf FieldVersionCollection
     * @param {IUser} editor User who made the change.
     * @param {Date} modified Date modified.
     * @param {any} value Value of the field at this version.
     * @param {number} version The version number.
     * @description
     * Used to add a single version to the collection.
     */
    addVersion(editor: User, modified: Date, value: any, version: number): void {
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

export class FieldChange {
    fieldName: string;
    newerVersion: IListItemVersion<any>;
    newValue: string;
    oldValue: string;
    previousVersion: IListItemVersion<any>;
    propertyName: string;

    constructor(propertyName: string, fieldDefinition: FieldConfigurationObject, newerVersion: IListItemVersion<any>, previousVersion: IListItemVersion<any> | Object = {}) {

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

/**
 * @ngdoc object
 * @name FieldChangeSummary
 * @param {ListItem<T>} newerVersion Updated version of list item.
 * @param {ListItem<T>} [previousVersion={}] Previous version of list item.
 * @description
 * Generates a snapshot between 2 versions of a list item and locates diferences.
 */
export class FieldChangeSummary<T extends ListItem<any>> {
    changeCount: number;
    fieldsChanged: { [key: string]: FieldChange; } = {};

    constructor(newerVersion: ListItem<T>, previousVersion: ListItem<T> | Object = {}) {
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
    }

    get hasMajorChanges(): boolean {
        return _.isNumber(this.changeCount) && this.changeCount > 0;
    }
}

/**
 * @ngdoc object
 * @name VersionSummary
 * @param {IListItemVersion<T>} newerVersion Updated version of list item.
 * @param {IListItemVersion<T>} [previousVersion={}] Previous version of list item.
 * @description
 * Used specifically to determine difference between 2 distinct versions of a list item using the
 * version history.  Extends FieldChangeSummary.
 */
export class VersionSummary<T extends ListItem<any>> extends FieldChangeSummary<T> {
    listItemVersion: IListItemVersion<any>;
    version: number;

    constructor(newerVersion: IListItemVersion<T>, previousVersion: IListItemVersion<T> | Object = {}) {
        super(newerVersion, previousVersion);
        this.listItemVersion = newerVersion;
        this.version = newerVersion.version;
    }

    get editor() {
        return this.listItemVersion.editor;
    }

    get modified() {
        return this.listItemVersion.modified;
    }
}


/**
 * @ngdoc object
 * @name ChangeSummary
 * @param {IListItemVersions} versions Multiple versions of a list item.
 * @description
 * Used to summarize all changes for a given list item.
 */
export class ChangeSummary<T extends ListItem<any>> {
    /** The number of versions where list item data actually changed */
    significantVersionCount = 0;
    private versionSummaryCollection: { [key: number]: VersionSummary<T> } = {};

    constructor(versions: IListItemVersions<T>) {
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

    // use getter in case we need to alter the way we store this in future
    get changes() {
        return this.versionSummaryCollection;
    }

    count(): number {
        return _.keys(this.versionSummaryCollection).length;
    }

    toArray(): VersionSummary<T>[] {
        return _.toArray<any>(this.versionSummaryCollection);
    }
}

export class VersionHistoryCollection<T extends ListItem<any>> {
    [key: number]: IListItemVersion<T>;
    constructor(fieldVersionCollections: FieldVersionCollection[], factory: IModelFactory) {
        /** Iterate through each of the field version collections */
        for (let fieldVersionCollection of fieldVersionCollections) {
            this.addFieldCollection(fieldVersionCollection, factory);
        }
    }

    addFieldCollection(fieldVersionCollection: FieldVersionCollection, factory: IModelFactory): void {
        /** Iterate through each version of this field */
        _.each(fieldVersionCollection.versions, (fieldVersion: IFieldVersion, versionNumberAsString: string) => {
            /** Create a new version object if it doesn't already exist */
            this[versionNumberAsString] = this[versionNumberAsString] || new factory<T>({
                    editor: fieldVersion.editor,
                    modified: fieldVersion.modified,
                    /** Iterating over object properties which converts everything to string so convert back */
                    version: parseInt(versionNumberAsString, 10)
                });
            /** Add field to the version history for this version with computed property name */
            this[versionNumberAsString][fieldVersionCollection.mappedName] = fieldVersion.value;
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
