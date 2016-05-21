"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lodash_1 = require('lodash');
/**
 * @ngdoc object
 * @name FieldVersionCollection
 * @param {FieldDefinition} fieldDefinition Field definition of each version of the field added.
 * @description
 * Object that contains the entire version history for a given list item field/property.
 */
var FieldVersionCollection = (function () {
    function FieldVersionCollection(fieldDefinition) {
        this.versions = {};
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
    FieldVersionCollection.prototype.addVersion = function (editor, modified, value, version) {
        this.versions[version] = {
            editor: editor,
            modified: modified,
            value: value,
            version: version
        };
    };
    Object.defineProperty(FieldVersionCollection.prototype, "mappedName", {
        get: function () {
            return this.fieldDefinition.mappedName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FieldVersionCollection.prototype, "length", {
        get: function () {
            return lodash_1.keys(this.versions).length;
        },
        enumerable: true,
        configurable: true
    });
    return FieldVersionCollection;
}());
exports.FieldVersionCollection = FieldVersionCollection;
var FieldChange = (function () {
    function FieldChange(propertyName, fieldDefinition, newerVersion, previousVersion) {
        if (previousVersion === void 0) { previousVersion = {}; }
        this.fieldName = fieldDefinition.displayName;
        this.newerVersion = newerVersion;
        /** Need to set property name before calling this.getFormattedValue */
        this.propertyName = propertyName;
        this.newValue = this.getFormattedValue(newerVersion);
        this.oldValue = this.getFormattedValue(previousVersion);
        this.previousVersion = previousVersion;
    }
    FieldChange.prototype.getFormattedValue = function (version) {
        var propertyValue = '';
        if (version.getFormattedValue) {
            propertyValue = version.getFormattedValue(this.propertyName);
        }
        return propertyValue;
    };
    return FieldChange;
}());
exports.FieldChange = FieldChange;
/**
 * @ngdoc object
 * @name FieldChangeSummary
 * @param {ListItem<T>} newerVersion Updated version of list item.
 * @param {ListItem<T>} [previousVersion={}] Previous version of list item.
 * @description
 * Generates a snapshot between 2 versions of a list item and locates diferences.
 */
var FieldChangeSummary = (function () {
    function FieldChangeSummary(newerVersion, previousVersion) {
        var _this = this;
        if (previousVersion === void 0) { previousVersion = {}; }
        this.fieldsChanged = {};
        /** Loop through each of the properties on the newer list item */
        lodash_1.each(newerVersion, function (val, propertyName) {
            var fieldDefinition = newerVersion.getFieldDefinition(propertyName);
            /** Only log non-readonly fields that aren't the same */
            if (fieldDefinition && !fieldDefinition.readOnly &&
                JSON.stringify(newerVersion[propertyName]) !== JSON.stringify(previousVersion[propertyName])) {
                var fieldChange = new FieldChange(propertyName, fieldDefinition, newerVersion, previousVersion);
                if (fieldChange.newValue !== fieldChange.oldValue) {
                    /** This field has changed */
                    _this.fieldsChanged[propertyName] = fieldChange;
                }
            }
        });
        this.changeCount = lodash_1.keys(this.fieldsChanged).length;
    }
    Object.defineProperty(FieldChangeSummary.prototype, "hasMajorChanges", {
        get: function () {
            return lodash_1.isNumber(this.changeCount) && this.changeCount > 0;
        },
        enumerable: true,
        configurable: true
    });
    return FieldChangeSummary;
}());
exports.FieldChangeSummary = FieldChangeSummary;
/**
 * @ngdoc object
 * @name VersionSummary
 * @param {IListItemVersion<T>} newerVersion Updated version of list item.
 * @param {IListItemVersion<T>} [previousVersion={}] Previous version of list item.
 * @description
 * Used specifically to determine difference between 2 distinct versions of a list item using the
 * version history.  Extends FieldChangeSummary.
 */
var VersionSummary = (function (_super) {
    __extends(VersionSummary, _super);
    function VersionSummary(newerVersion, previousVersion) {
        if (previousVersion === void 0) { previousVersion = {}; }
        _super.call(this, newerVersion, previousVersion);
        this.listItemVersion = newerVersion;
        this.version = newerVersion.version;
    }
    Object.defineProperty(VersionSummary.prototype, "editor", {
        get: function () {
            return this.listItemVersion.editor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VersionSummary.prototype, "modified", {
        get: function () {
            return this.listItemVersion.modified;
        },
        enumerable: true,
        configurable: true
    });
    return VersionSummary;
}(FieldChangeSummary));
exports.VersionSummary = VersionSummary;
/**
 * @ngdoc object
 * @name ChangeSummary
 * @param {IListItemVersions} versions Multiple versions of a list item.
 * @description
 * Used to summarize all changes for a given list item.
 */
var ChangeSummary = (function () {
    function ChangeSummary(versions) {
        var _this = this;
        /** The number of versions where list item data actually changed */
        this.significantVersionCount = 0;
        this.versionSummaryCollection = {};
        /** First version won't have a previous version */
        var previousVersion;
        lodash_1.each(versions, function (version) {
            var versionSummary = new VersionSummary(version, previousVersion);
            if (versionSummary.hasMajorChanges) {
                _this.significantVersionCount++;
            }
            _this.versionSummaryCollection[versionSummary.version] = versionSummary;
            /** Store this version so we can compare to the next version */
            previousVersion = version;
        });
    }
    Object.defineProperty(ChangeSummary.prototype, "changes", {
        // use getter in case we need to alter the way we store this in future
        get: function () {
            return this.versionSummaryCollection;
        },
        enumerable: true,
        configurable: true
    });
    ChangeSummary.prototype.count = function () {
        return lodash_1.keys(this.versionSummaryCollection).length;
    };
    ChangeSummary.prototype.toArray = function () {
        return lodash_1.toArray(this.versionSummaryCollection);
    };
    return ChangeSummary;
}());
exports.ChangeSummary = ChangeSummary;
var VersionHistoryCollection = (function () {
    function VersionHistoryCollection(fieldVersionCollections, factory) {
        /** Iterate through each of the field version collections */
        for (var _i = 0, fieldVersionCollections_1 = fieldVersionCollections; _i < fieldVersionCollections_1.length; _i++) {
            var fieldVersionCollection = fieldVersionCollections_1[_i];
            this.addFieldCollection(fieldVersionCollection, factory);
        }
    }
    VersionHistoryCollection.prototype.addFieldCollection = function (fieldVersionCollection, factory) {
        var _this = this;
        /** Iterate through each version of this field */
        lodash_1.each(fieldVersionCollection.versions, function (fieldVersion, versionNumberAsString) {
            /** Create a new version object if it doesn't already exist */
            _this[versionNumberAsString] = _this[versionNumberAsString] || factory({
                editor: fieldVersion.editor,
                modified: fieldVersion.modified,
                /** Iterating over object properties which converts everything to string so convert back */
                version: parseInt(versionNumberAsString, 10)
            });
            /** Add field to the version history for this version with computed property name */
            _this[versionNumberAsString][fieldVersionCollection.mappedName] = fieldVersion.value;
        });
    };
    VersionHistoryCollection.prototype.count = function () {
        return lodash_1.keys(this).length;
    };
    VersionHistoryCollection.prototype.generateChangeSummary = function () {
        return new ChangeSummary(this);
    };
    VersionHistoryCollection.prototype.toArray = function () {
        return lodash_1.toArray(this);
    };
    return VersionHistoryCollection;
}());
exports.VersionHistoryCollection = VersionHistoryCollection;
//# sourceMappingURL=list-item-version.factory.js.map