import {UtilityService} from '../services';


/** Lookup referencing a ListItem of the specified type.  The "lookupId""
 * will be the same as the referenced <T>.id.  The "lookupValue"" by default
 * should be the <T>.title but it can be changed to another text field
 * in the SharePoint list settings for this list. Only the lookupValue is
 * required and will be sent to the server when saving.  The lookupValue is
 * ignored.
 */
export interface ILookup<T> {
    lookupValue: string;
    lookupId: number;
}

/**
 * @ngdoc function
 * @name Lookup
 * @description
 * Allows for easier distinction when debugging if object type is shown as either Lookup or User.  Also allows us
 * to create an async request for the entity being referenced by the lookup
 * @param {string} s String to split into lookupValue and lookupId
 * @param {object} options Contains a reference to the parent list item and the property name.
 * @param {object} options.entity Reference to parent list item.
 * @param {object} options.propertyName Key on list item object.
 * @constructor
 */
export class Lookup<T> implements ILookup<T> {
    lookupId: number;
    lookupValue: string;

    constructor(str: string) {
        let {id, value} =  UtilityService.splitIndex(str);
        this.lookupId = id;
        this.lookupValue = value || '';
    }
}
