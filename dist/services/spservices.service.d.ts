import { SOAPEnvelope } from '../factories/soap-envelope.factory';
export interface SPServicesOptions {
    /** If true, we'll cache the XML results with jQuery's .data() function */
    cacheXML?: boolean;
    /** The Web Service operation */
    operation: string;
    /** URL of the target Web */
    webURL?: string;
    /** true to make the view the default view for the list */
    makeViewDefault?: boolean;
    /** View name in CAML format. */
    viewName?: string;
    /** Query in CAML format */
    CAMLQuery?: string;
    /** View fields in CAML format */
    CAMLViewFields?: string;
    /** Row limit as a string representation of an integer */
    CAMLRowLimit?: number;
    /** Query options in CAML format */
    CAMLQueryOptions?: string;
    /** Method Cmd for UpdateListItems */
    batchCmd?: string;
    /** Fieldname / Fieldvalue pairs for UpdateListItems */
    valuePairs?: [string, string][];
    /** Array of destination URLs for copy operations */
    DestinationUrls?: Array<any>;
    /** An SPWebServiceBehavior indicating whether the client supports Windows SharePoint Services 2.0 or Windows SharePoint Services 3.0: {Version2 | Version3 } */
    behavior?: string;
    /** A Storage value indicating how the Web Part is stored: {None | Personal | Shared} */
    storage?: string;
    /** objectType for operations which require it */
    objectType?: string;
    /** true to delete a meeting;false to remove its association with a Meeting Workspace site */
    cancelMeeting?: boolean;
    /** true if the calendar is set to a format other than Gregorian;otherwise, false. */
    nonGregorian?: boolean;
    /** Specifies if the action is a claim or a release. Specifies true for a claim and false for a release. */
    fClaim?: boolean;
    /** The recurrence ID for the meeting that needs its association removed. This parameter can be set to 0 for single-instance meetings. */
    recurrenceId?: number;
    /** An integer that is used to determine the ordering of updates in case they arrive out of sequence. Updates with a lower-than-current sequence are discarded. If the sequence is equal to the current sequence, the latest update are applied. */
    sequence?: number;
    /** SocialDataService maximumItemsToReturn */
    maximumItemsToReturn?: number;
    /** SocialDataService startIndex */
    startIndex?: number;
    /** SocialDataService isHighPriority */
    isHighPriority?: boolean;
    /** SocialDataService isPrivate */
    isPrivate?: boolean;
    /** SocialDataService rating */
    rating?: number;
    /** Unless otherwise specified, the maximum number of principals that can be returned from a provider is 10. */
    maxResults?: number;
    /** Specifies user scope and other information? [None | User | DistributionList | SecurityGroup | SharePointGroup | All] */
    principalType?: string;
    /** Allow the user to force async */
    async?: boolean;
    /** Function to call on completion */
    completefunc?: (xData: Element, status: string) => void;
    IDs?: number[] | string[];
    ID?: number;
    updates?: [any, any][];
    queryXml?: string;
    registrationXml?: string;
    accountName?: string;
    excludeItemsTime?: any;
}
/**
 * @ngdoc service
 * @name angularPoint.SPServices
 * @description
 * This is just a trimmed down version of Marc Anderson's awesome [SPServices](http://spservices.codeplex.com/) library.
 * We're primarily looking for the ability to create the SOAP envelope and let AngularJS's $http service handle all
 * communication with the server.
 *
 */
export declare function generateXMLComponents(options: SPServicesOptions): {
    msg: string;
    SOAPEnvelope: SOAPEnvelope;
    SOAPAction: any;
};
