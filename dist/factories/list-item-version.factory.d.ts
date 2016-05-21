import { ListItem, User } from '../factories';
import { IFieldConfigurationObject, IFieldDefinition } from './field-definition.factory';
import { IFieldServiceFactory } from './list-service.factory';
export interface IListItemVersions<T extends ListItem<any>> {
    [key: number]: IListItemVersion<T>;
}
export interface IListItemVersion<T extends ListItem<T>> extends ListItem<T> {
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
export declare class FieldVersionCollection {
    fieldDefinition: IFieldDefinition;
    versions: {
        [key: number]: IFieldVersion;
    };
    constructor(fieldDefinition: IFieldDefinition);
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
    addVersion(editor: User, modified: Date, value: any, version: number): void;
    mappedName: string;
    length: number;
}
export declare class FieldChange {
    fieldName: string;
    newerVersion: IListItemVersion<any>;
    newValue: string;
    oldValue: string;
    previousVersion: IListItemVersion<any> | Object;
    propertyName: string;
    constructor(propertyName: string, fieldDefinition: IFieldConfigurationObject, newerVersion: IListItemVersion<any>, previousVersion?: IListItemVersion<any> | Object);
    getFormattedValue(version: IListItemVersion<any>): string;
}
/**
 * @ngdoc object
 * @name FieldChangeSummary
 * @param {ListItem<T>} newerVersion Updated version of list item.
 * @param {ListItem<T>} [previousVersion={}] Previous version of list item.
 * @description
 * Generates a snapshot between 2 versions of a list item and locates diferences.
 */
export declare class FieldChangeSummary<T extends ListItem<any>> {
    changeCount: number;
    fieldsChanged: {
        [key: string]: FieldChange;
    };
    constructor(newerVersion: IListItemVersion<T> | ListItem<any>, previousVersion?: IListItemVersion<T> | Object);
    hasMajorChanges: boolean;
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
export declare class VersionSummary<T extends ListItem<any>> extends FieldChangeSummary<T> {
    listItemVersion: IListItemVersion<any>;
    version: number;
    constructor(newerVersion: IListItemVersion<T>, previousVersion?: IListItemVersion<T> | Object);
    editor: User;
    modified: Date;
}
/**
 * @ngdoc object
 * @name ChangeSummary
 * @param {IListItemVersions} versions Multiple versions of a list item.
 * @description
 * Used to summarize all changes for a given list item.
 */
export declare class ChangeSummary<T extends ListItem<any>> {
    /** The number of versions where list item data actually changed */
    significantVersionCount: number;
    private versionSummaryCollection;
    constructor(versions: IListItemVersions<T>);
    changes: {
        [key: number]: VersionSummary<T>;
    };
    count(): number;
    toArray(): VersionSummary<T>[];
}
export declare class VersionHistoryCollection<T extends ListItem<any>> {
    [key: number]: IListItemVersion<T>;
    constructor(fieldVersionCollections: FieldVersionCollection[], factory: IFieldServiceFactory<T>);
    addFieldCollection(fieldVersionCollection: FieldVersionCollection, factory: IFieldServiceFactory<T>): void;
    count(): number;
    generateChangeSummary(): ChangeSummary<T>;
    toArray(): IListItemVersion<T>[];
}
