// Defaults added as a function in our library means that the caller can override the defaults
// for their session by calling this function.  Each operation requires a different set of options;
// we allow for all in a standardized way.
"use strict";
var SPServicesDefaults = (function () {
    function SPServicesDefaults() {
        this.operation = ''; // The Web Service operation
        this.webURL = ''; // URL of the target Web
        this.makeViewDefault = false; // true to make the view the default view for the list
        // For operations requiring CAML, these options will override any abstractions
        this.CAMLViewName = ''; // View name in CAML format.
        this.CAMLQuery = ''; // Query in CAML format
        this.CAMLViewFields = ''; // View fields in CAML format
        this.CAMLRowLimit = 0; // Row limit as a string representation of an integer
        this.CAMLQueryOptions = '<QueryOptions></QueryOptions>'; // Query options in CAML format
        // Abstractions for CAML syntax
        this.batchCmd = 'Update'; // Method Cmd for UpdateListItems
        this.valuePairs = []; // Fieldname / Fieldvalue pairs for UpdateListItems
        // As of v0.7.1, removed all options which were assigned an empty string ("")
        this.DestinationUrls = []; // Array of destination URLs for copy operations
        this.behavior = 'Version3'; // An SPWebServiceBehavior indicating whether the client supports Windows SharePoint Services 2.0 or Windows SharePoint Services 3.0: {Version2 | Version3 }
        this.storage = 'Shared'; // A Storage value indicating how the Web Part is stored: {None | Personal | Shared}
        this.objectType = 'List'; // objectType for operations which require it
        this.cancelMeeting = true; // true to delete a meeting;false to remove its association with a Meeting Workspace site
        this.nonGregorian = false; // true if the calendar is set to a format other than Gregorian;otherwise; false.
        this.fClaim = false; // Specifies if the action is a claim or a release. Specifies true for a claim and false for a release.
        this.recurrenceId = 0; // The recurrence ID for the meeting that needs its association removed. This parameter can be set to 0 for single-instance meetings.
        this.sequence = 0; // An integer that is used to determine the ordering of updates in case they arrive out of sequence. Updates with a lower-than-current sequence are discarded. If the sequence is equal to the current sequence, the latest update are applied.
        this.maximumItemsToReturn = 0; // SocialDataService maximumItemsToReturn
        this.startIndex = 0; // SocialDataService startIndex
        this.isHighPriority = false; // SocialDataService isHighPriority
        this.isPrivate = false; // SocialDataService isPrivate
        this.rating = 1; // SocialDataService rating
        this.maxResults = 10; // Unless otherwise specified, the maximum number of principals that can be returned from a provider is 10.
        this.principalType = 'User'; // Specifies currentPerson scope and other information: [None | User | DistributionList | SecurityGroup | SharePointGroup | All]
        this.async = true; // Allow the currentPerson to force async
        this.completefunc = null; // Function to call on completion
    }
    return SPServicesDefaults;
}());
exports.SPServicesDefaults = SPServicesDefaults;
//# sourceMappingURL=spservices-defaults.constant.js.map