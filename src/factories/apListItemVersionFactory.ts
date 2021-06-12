import * as _ from 'lodash';
import { ListItem } from './apListItemFactory';
import { User } from './apUserFactory';
import { FieldDefinition, FieldConfigurationObject } from './apFieldFactory';
import { IModelFactory } from './apModelFactory';

export interface ListItemVersions<T extends ListItem<any>> {
    [key: number]: ListItemVersion<T>;
}

export interface ListItemVersion<T extends ListItem<any>> {
    modified: Date;
    version: number;
    [key: string]: any;
}

export interface FieldVersion {
    editor: User;
    modified: Date;
    value: any;
    version: number;
}

/**
 * @ngdoc object
 * @name apListItemVersionFactory.FieldVersionCollection
 * @param {FieldDefinition} fieldDefinition Field definition of each version of the field added.
 * @description
 * Object that contains the entire version history for a given list item field/property.
 */
export class FieldVersionCollection {
    fieldDefinition: FieldDefinition;
    versions: { [key: number]: FieldVersion } = {};

    constructor(fieldDefinition: FieldDefinition) {
        this.fieldDefinition = fieldDefinition;
    }

    /**
     * @ngdoc object
     * @name apListItemVersionFactory.FieldVersionCollection.addVersion
     * @methodOf apListItemVersionFactory.FieldVersionCollection
     * @param {User} editor User who made the change.
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
            version,
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
    newerVersion: ListItemVersion<any>;
    newValue: string;
    oldValue: string;
    previousVersion: ListItemVersion<any>;
    propertyName: string;

    constructor(
        propertyName: string,
        fieldDefinition: FieldConfigurationObject,
        newerVersion: ListItemVersion<any>,
        previousVersion: ListItemVersion<any> = <ListItemVersion<any>>{},
    ) {
        this.fieldName = fieldDefinition.displayName;
        this.newerVersion = newerVersion;
        /** Need to set property name before calling this.getFormattedValue */
        this.propertyName = propertyName;

        this.newValue = this.getFormattedValue(newerVersion);
        this.oldValue = this.getFormattedValue(previousVersion);
        this.previousVersion = previousVersion;
    }

    getFormattedValue(version: ListItemVersion<any> | any): string {
        let propertyValue = '';
        if (version.getFormattedValue) {
            propertyValue = version.getFormattedValue(this.propertyName);
        }
        return propertyValue;
    }
}

/**
 * @ngdoc object
 * @name apListItemVersionFactory.FieldChangeSummary
 * @param {ListItem<T>} newerVersion Updated version of list item.
 * @param {ListItem<T>} [previousVersion={}] Previous version of list item.
 * @description
 * Generates a snapshot between 2 versions of a list item and locates diferences.
 */
export class FieldChangeSummary<T extends ListItem<any>> {
    changeCount: number;
    fieldsChanged: { [key: string]: FieldChange } = {};

    constructor(newerVersion: ListItem<T> | any, previousVersion: ListItem<T> | Object | any = <ListItem<T>>{}) {
        /** Loop through each of the properties on the newer list item */
        _.each(newerVersion, (val, propertyName: string) => {
            const fieldDefinition = newerVersion.getFieldDefinition(propertyName);
            /** Only log non-readonly fields that aren't the same */
            if (
                fieldDefinition &&
                !fieldDefinition.readOnly &&
                JSON.stringify(newerVersion[propertyName]) !== JSON.stringify(previousVersion[propertyName])
            ) {
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
 * @name apListItemVersionFactory.VersionSummary
 * @param {IListItemVersion<T>} newerVersion Updated version of list item.
 * @param {IListItemVersion<T>} [previousVersion={}] Previous version of list item.
 * @description
 * Used specifically to determine difference between 2 distinct versions of a list item using the
 * version history.  Extends FieldChangeSummary.
 */
export class VersionSummary<T extends ListItem<any>> extends FieldChangeSummary<T> {
    listItemVersion: ListItemVersion<any> | any;
    version: number;

    constructor(newerVersion: ListItemVersion<T>, previousVersion: ListItemVersion<T> | Object = {}) {
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
 * @name apListItemVersionFactory.ChangeSummary
 * @param {IListItemVersions} versions Multiple versions of a list item.
 * @description
 * Used to summarize all changes for a given list item.
 */
export class ChangeSummary<T extends ListItem<any>> {
    /** The number of versions where list item data actually changed */
    significantVersionCount = 0;
    private versionSummaryCollection: { [key: number]: VersionSummary<T> } = {};

    constructor(versions: ListItemVersions<T>) {
        /** First version won't have a previous version */
        let previousVersion;
        _.each(versions, (version: ListItemVersion<T>) => {
            const versionSummary = new VersionSummary<T>(version, previousVersion);
            if (versionSummary.hasMajorChanges) {
                this.significantVersionCount++;
            }
            this.versionSummaryCollection[versionSummary.version] = versionSummary;
            /** Store this version so we can compare to the next version */
            previousVersion = version;
        });
    }

    // Use getter in case we need to alter the way we store this in future
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
    [key: number]: ListItemVersion<T>;
    // getFactory: () => IModelFactory;
    constructor(fieldVersionCollections: FieldVersionCollection[], factory: IModelFactory) {
        /** Iterate through each of the field version collections */
        _.each(fieldVersionCollections, (fieldVersionCollection) => {
            this.addFieldCollection(fieldVersionCollection, factory);
        });
    }

    addFieldCollection(fieldVersionCollection: FieldVersionCollection, factory: IModelFactory): void {
        /** Iterate through each version of this field */
        _.each(fieldVersionCollection.versions, (fieldVersion: FieldVersion, versionNumberAsString: string) => {
            /** Create a new version object if it doesn't already exist */
            this[fieldVersion.modified.toUTCString()] =
                this[fieldVersion.modified.toUTCString()] ||
                new factory<T>({
                    editor: fieldVersion.editor,
                    modified: fieldVersion.modified,
                    /** Iterating over object properties which converts everything to string so convert back */
                    version: Number(versionNumberAsString),
                });
            /** Add field to the version history for this version with computed property name */
            this[fieldVersion.modified.toUTCString()][fieldVersionCollection.mappedName] = fieldVersion.value;
        });
    }

    count(): number {
        return _.keys(this).length;
    }

    generateChangeSummary(): ChangeSummary<T> {
        return new ChangeSummary<T>(<any>this);
    }

    toArray(): ListItemVersion<T>[] {
        return _.toArray<ListItemVersion<T>>(this);
    }
}

/**
 * @ngdoc function
 * @name apListItemVersionFactory
 * @description
 * Factory which handles parsing list item versions and identifying changes.
 *
 */
export class ListItemVersionFactory {
    ChangeSummary = ChangeSummary;
    FieldChangeSummary = FieldChangeSummary;
    FieldVersionCollection = FieldVersionCollection;
    VersionHistoryCollection = VersionHistoryCollection;
    VersionSummary = VersionSummary;
}
