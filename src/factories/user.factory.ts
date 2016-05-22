import {splitIndex} from '../services/utility.service';

/**
 * Represents a reference to a site collection currentPerson.  This is
 * very similar to an ap.ILookup except additional properties
 * can be provided if setup to include them in the request.
 * The site collection currentPerson is created the first time a currentPerson
 * accesses a site collection.  The downside is a currentPerson will have
 * different site collection ID's for each site collection.
 */
export interface IUser {
    email?: string;
    loginName?: string;
    lookupId: number;
    lookupValue: string;
    sipAddress?: string;
    title?: string;
}

/**
 * @ngdoc function
 * @name User
 * @description
 * Allows for easier distinction when debugging if object type is shown as a User.  Turns a delimited ";#"
 * string into an object shown below depeinding on field settings:
 * <pre>
 * {
 *      lookupId: 1,
 *      lookupValue: 'Joe User'
 * }
 * </pre>
 * or
 * <pre>
 * {
 *      lookupId: 1,
 *      lookupValue: 'Joe User',
 *      loginName: 'joe.user',
 *      email: 'joe@company.com',
 *      sipAddress: 'whatever',
 *      title: 'Sr. Widget Maker'
 * }
 * </pre>
 * @param {string} s Delimited string used to create a User object.
 * @constructor
 */
export class User implements IUser {
    lookupValue: string;
    lookupId: number;
    loginName: string;
    email: string;
    sipAddress: string;
    title: string;

    constructor(str: string) {
        let {id, value} = splitIndex(str);

        let thisUserExpanded = value.split(',#');
        if (thisUserExpanded.length === 1) {
            //Standard currentPerson columns only return a id,#value pair
            this.lookupId = id;
            this.lookupValue = value;
        } else {
            //Allow for case where currentPerson adds additional properties when setting up field
            this.lookupId = id;
            this.lookupValue = thisUserExpanded[0].replace(/(,,)/g, ',');
            this.loginName = thisUserExpanded[1].replace(/(,,)/g, ',');
            this.email = thisUserExpanded[2].replace(/(,,)/g, ',');
            this.sipAddress = thisUserExpanded[3].replace(/(,,)/g, ',');
            this.title = thisUserExpanded[4].replace(/(,,)/g, ',');
        }
    }
}
