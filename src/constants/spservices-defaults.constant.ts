// Defaults added as a function in our library means that the caller can override the defaults
// for their session by calling this function.  Each operation requires a different set of options;
// we allow for all in a standardized way.

export class SPServicesDefaults {
    operation = ''; // The Web Service operation
    webURL = ''; // URL of the target Web
    makeViewDefault = false; // true to make the view the default view for the list

    // For operations requiring CAML, these options will override any abstractions
    CAMLViewName = ''; // View name in CAML format.
    CAMLQuery = ''; // Query in CAML format
    CAMLViewFields = ''; // View fields in CAML format
    CAMLRowLimit = 0; // Row limit as a string representation of an integer
    CAMLQueryOptions = '<QueryOptions></QueryOptions>'; // Query options in CAML format

    // Abstractions for CAML syntax
    batchCmd = 'Update'; // Method Cmd for UpdateListItems
    valuePairs = []; // Fieldname / Fieldvalue pairs for UpdateListItems

    // As of v0.7.1, removed all options which were assigned an empty string ("")
    DestinationUrls = []; // Array of destination URLs for copy operations
    behavior = 'Version3'; // An SPWebServiceBehavior indicating whether the client supports Windows SharePoint Services 2.0 or Windows SharePoint Services 3.0: {Version2 | Version3 }
    storage = 'Shared'; // A Storage value indicating how the Web Part is stored: {None | Personal | Shared}
    objectType = 'List'; // objectType for operations which require it
    cancelMeeting = true; // true to delete a meeting;false to remove its association with a Meeting Workspace site
    nonGregorian = false; // true if the calendar is set to a format other than Gregorian;otherwise; false.
    fClaim = false; // Specifies if the action is a claim or a release. Specifies true for a claim and false for a release.
    recurrenceId = 0; // The recurrence ID for the meeting that needs its association removed. This parameter can be set to 0 for single-instance meetings.
    sequence = 0; // An integer that is used to determine the ordering of updates in case they arrive out of sequence. Updates with a lower-than-current sequence are discarded. If the sequence is equal to the current sequence, the latest update are applied.
    maximumItemsToReturn = 0; // SocialDataService maximumItemsToReturn
    startIndex = 0; // SocialDataService startIndex
    isHighPriority = false; // SocialDataService isHighPriority
    isPrivate = false; // SocialDataService isPrivate
    rating = 1; // SocialDataService rating
    maxResults = 10; // Unless otherwise specified, the maximum number of principals that can be returned from a provider is 10.
    principalType = 'User'; // Specifies currentPerson scope and other information: [None | User | DistributionList | SecurityGroup | SharePointGroup | All]

    async = true; // Allow the currentPerson to force async
    completefunc = null; // Function to call on completion

}
