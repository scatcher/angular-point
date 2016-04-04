/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    // Set up SOAP envelope
    class SOAPEnvelope {
        opheader: string;
        opfooter: string;
        header = "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' " +
        "xmlns:xsd='http://www.w3.org/2001/XMLSchema' " +
        "xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body>";
        footer = "</soap:Body></soap:Envelope>";
        payload = "";
    }

    //Definition file taken from SPServices project on GitHub, look at way to use as depency and link to it
    interface SPServicesOptions {
        /** If true, we'll cache the XML results with jQuery's .data() function */
        cacheXML?: boolean;
        /** The Web Service operation */
        operation: string;
        /** URL of the target Web */
        webURL?: string;
        /** true to make the view the default view for the list */
        makeViewDefault?: boolean;

        // For operations requiring CAML, these options will override any abstractions

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

        // Abstractions for CAML syntax

        /** Method Cmd for UpdateListItems */
        batchCmd?: string;
        /** Fieldname / Fieldvalue pairs for UpdateListItems */
        valuePairs?: [string, string][];

        // As of v0.7.1, removed all options which were assigned an empty string ("")

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
        completefunc?: (xData: JQueryXHR, status: string) => void;
    }


    //TODO Cleanup and convert to TS
    function Service(apWebServiceOperationConstants: IWebServiceOperationConstants, apWebServiceService: WebServiceService) {

        /*
         * SPServices - Work with SharePoint's Web Services using jQuery
         * Version 2014.02a
         * @requires jQuery v1.8 or greater - jQuery 1.10.x recommended
         *
         * Copyright (c) 2009-2013 Sympraxis Consulting LLC
         * Examples and docs at:
         * http://spservices.codeplex.com
         * Licensed under the MIT license:
         * http://www.opensource.org/licenses/mit-license.php
         */
        /*
         * @description Work with SharePoint's Web Services using jQuery
         * @type jQuery
         * @name SPServices
         * @category Plugins/SPServices
         * @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
         */
        /* jshint undef: true */
        /* global L_Menu_BaseUrl, _spUserId, _spPageContextInfo, GipAddSelectedItems, GipRemoveSelectedItems, GipGetGroupData */

        // Global variables
        var SCHEMASharePoint = "http://schemas.microsoft.com/sharepoint";
        var i = 0; // Generic loop counter
        var encodeOptionList = ["listName", "description"]; // Used to encode options which may contain special characters

        // Defaults added as a function in our library means that the caller can override the defaults
        // for their session by calling this function.  Each operation requires a different set of options;
        // we allow for all in a standardized way.
        var defaults = {

            operation: "", // The Web Service operation
            webURL: "", // URL of the target Web
            makeViewDefault: false, // true to make the view the default view for the list

            // For operations requiring CAML, these options will override any abstractions
            CAMLViewName: "", // View name in CAML format.
            CAMLQuery: "", // Query in CAML format
            CAMLViewFields: "", // View fields in CAML format
            CAMLRowLimit: 0, // Row limit as a string representation of an integer
            CAMLQueryOptions: "<QueryOptions></QueryOptions>", // Query options in CAML format

            // Abstractions for CAML syntax
            batchCmd: "Update", // Method Cmd for UpdateListItems
            valuePairs: [], // Fieldname / Fieldvalue pairs for UpdateListItems

            // As of v0.7.1, removed all options which were assigned an empty string ("")
            DestinationUrls: [], // Array of destination URLs for copy operations
            behavior: "Version3", // An SPWebServiceBehavior indicating whether the client supports Windows SharePoint Services 2.0 or Windows SharePoint Services 3.0: {Version2 | Version3 }
            storage: "Shared", // A Storage value indicating how the Web Part is stored: {None | Personal | Shared}
            objectType: "List", // objectType for operations which require it
            cancelMeeting: true, // true to delete a meeting;false to remove its association with a Meeting Workspace site
            nonGregorian: false, // true if the calendar is set to a format other than Gregorian;otherwise, false.
            fClaim: false, // Specifies if the action is a claim or a release. Specifies true for a claim and false for a release.
            recurrenceId: 0, // The recurrence ID for the meeting that needs its association removed. This parameter can be set to 0 for single-instance meetings.
            sequence: 0, // An integer that is used to determine the ordering of updates in case they arrive out of sequence. Updates with a lower-than-current sequence are discarded. If the sequence is equal to the current sequence, the latest update are applied.
            maximumItemsToReturn: 0, // SocialDataService maximumItemsToReturn
            startIndex: 0, // SocialDataService startIndex
            isHighPriority: false, // SocialDataService isHighPriority
            isPrivate: false, // SocialDataService isPrivate
            rating: 1, // SocialDataService rating
            maxResults: 10, // Unless otherwise specified, the maximum number of principals that can be returned from a provider is 10.
            principalType: "User", // Specifies user scope and other information: [None | User | DistributionList | SecurityGroup | SharePointGroup | All]

            async: true, // Allow the user to force async
            completefunc: null // Function to call on completion

        }; // End SPServices.defaults





        // Main function, which calls SharePoint's Web Services directly.
        var SPServices = {
            defaults: defaults,
            encodeXml: encodeXml,
            generateXMLComponents: generateXMLComponents,
            SCHEMASharePoint: SCHEMASharePoint,
            SOAPEnvelope: new SOAPEnvelope()
        };

        function generateXMLComponents(options: SPServicesOptions) {

            /** Key/Value mapping of SharePoint properties to SPServices properties */
            var mapping = [
                ['query', 'CAMLQuery'],
                ['viewFields', 'CAMLViewFields'],
                ['rowLimit', 'CAMLRowLimit'],
                ['queryOptions', 'CAMLQueryOptions'],
                ['listItemID', 'ID']
            ];

            /** Ensure the SharePoint properties are available prior to extending with defaults */
            _.each(mapping, function(map) {
                if (options[map[0]] && !options[map[1]]) {
                    /** Ensure SPServices properties are added in the event the true property name is used */
                    options[map[1]] = options[map[0]];
                }
            });

            var soapEnvelope = new SOAPEnvelope();
            var SOAPAction;

            // If there are no options passed in, use the defaults.  Extend replaces each default with the passed option.
            var opt: SPServicesOptions = _.assign({}, defaults, options);

            // Encode options which may contain special character, esp. ampersand
            _.each(encodeOptionList, function(optionName) {
                if (_.isString(opt[optionName])) {
                    opt[optionName] = encodeXml(opt[optionName]);
                }
            });

            var service = apWebServiceOperationConstants[opt.operation][0];

            // Put together operation header and SOAPAction for the SOAP call based on which Web Service we're calling
            soapEnvelope.opheader = `<${opt.operation} xmlns="${apWebServiceService.xmlns(service) }" >`;
            SOAPAction = apWebServiceService.action(service);

            // Add the operation to the SOAPAction and opfooter
            SOAPAction += opt.operation;
            soapEnvelope.opfooter = `</${opt.operation}>`;

            // Each operation requires a different set of values.  This switch statement sets them up in the soapEnvelope.payload.
            switch (opt.operation) {
                // ALERT OPERATIONS
                case "GetAlerts":
                    break;
                case "DeleteAlerts":
                    soapEnvelope.payload += "<IDs>";
                    for (i = 0; i < opt.IDs.length; i++) {
                        soapEnvelope.payload += wrapNode("string", opt.IDs[i]);
                    }
                    soapEnvelope.payload += "</IDs>";
                    break;

                // AUTHENTICATION OPERATIONS
                case "Mode":
                    break;
                case "Login":
                    addToPayload(opt, ["username", "password"]);
                    break;

                // COPY OPERATIONS
                case "CopyIntoItems":
                    addToPayload(opt, ["SourceUrl"]);
                    soapEnvelope.payload += "<DestinationUrls>";
                    for (i = 0; i < opt.DestinationUrls.length; i++) {
                        soapEnvelope.payload += wrapNode("string", opt.DestinationUrls[i]);
                    }
                    soapEnvelope.payload += "</DestinationUrls>";
                    addToPayload(opt, ["Fields", "Stream", "Results"]);
                    break;
                case "CopyIntoItemsLocal":
                    addToPayload(opt, ["SourceUrl"]);
                    soapEnvelope.payload += "<DestinationUrls>";
                    for (i = 0; i < opt.DestinationUrls.length; i++) {
                        soapEnvelope.payload += wrapNode("string", opt.DestinationUrls[i]);
                    }
                    soapEnvelope.payload += "</DestinationUrls>";
                    break;
                case "GetItem":
                    addToPayload(opt, ["Url", "Fields", "Stream"]);
                    break;

                // FORM OPERATIONS
                case "GetForm":
                    addToPayload(opt, ["listName", "formUrl"]);
                    break;
                case "GetFormCollection":
                    addToPayload(opt, ["listName"]);
                    break;

                // LIST OPERATIONS
                case "AddAttachment":
                    addToPayload(opt, ["listName", "listItemID", "fileName", "attachment"]);
                    break;
                case "AddDiscussionBoardItem":
                    addToPayload(opt, ["listName", "message"]);
                    break;
                case "AddList":
                    addToPayload(opt, ["listName", "description", "templateID"]);
                    break;
                case "AddListFromFeature":
                    addToPayload(opt, ["listName", "description", "featureID", "templateID"]);
                    break;
                case "ApplyContentTypeToList":
                    addToPayload(opt, ["webUrl", "contentTypeId", "listName"]);
                    break;
                case "CheckInFile":
                    addToPayload(opt, ["pageUrl", "comment", "CheckinType"]);
                    break;
                case "CheckOutFile":
                    addToPayload(opt, ["pageUrl", "checkoutToLocal", "lastmodified"]);
                    break;
                case "CreateContentType":
                    addToPayload(opt, ["listName", "displayName", "parentType", "fields", "contentTypeProperties", "addToView"]);
                    break;
                case "DeleteAttachment":
                    addToPayload(opt, ["listName", "listItemID", "url"]);
                    break;
                case "DeleteContentType":
                    addToPayload(opt, ["listName", "contentTypeId"]);
                    break;
                case "DeleteContentTypeXmlDocument":
                    addToPayload(opt, ["listName", "contentTypeId", "documentUri"]);
                    break;
                case "DeleteList":
                    addToPayload(opt, ["listName"]);
                    break;
                case "GetAttachmentCollection":
                    addToPayload(opt, ["listName", ["listItemID", "ID"]]);
                    break;
                case "GetList":
                    addToPayload(opt, ["listName"]);
                    break;
                case "GetListAndView":
                    addToPayload(opt, ["listName", "viewName"]);
                    break;
                case "GetListCollection":
                    break;
                case "GetListContentType":
                    addToPayload(opt, ["listName", "contentTypeId"]);
                    break;
                case "GetListContentTypes":
                    addToPayload(opt, ["listName"]);
                    break;
                case "GetListItems":
                    addToPayload(opt,
                        ["listName", "viewName",
                            ["query", "CAMLQuery"],
                            ["viewFields", "CAMLViewFields"],
                            ["rowLimit", "CAMLRowLimit"],
                            ["queryOptions", "CAMLQueryOptions"]
                        ]);
                    break;
                case "GetListItemChanges":
                    addToPayload(opt, ["listName", "viewFields", "since", "contains"]);
                    break;
                case "GetListItemChangesSinceToken":
                    addToPayload(opt,
                        ["listName", "viewName",
                            ["query", "CAMLQuery"],
                            ["viewFields", "CAMLViewFields"],
                            ["rowLimit", "CAMLRowLimit"],
                            ["queryOptions", "CAMLQueryOptions"],
                            {
                                name: "changeToken",
                                sendNull: false
                            },
                            {
                                name: "contains",
                                sendNull: false
                            }
                        ]);
                    break;
                case "GetVersionCollection":
                    addToPayload(opt, ["strlistID", "strlistItemID", "strFieldName"]); // correct case
                    break;
                case "UndoCheckOut":
                    addToPayload(opt, ["pageUrl"]);
                    break;
                case "UpdateContentType":
                    addToPayload(opt, ["listName", "contentTypeId", "contentTypeProperties", "newFields", "updateFields", "deleteFields", "addToView"]);
                    break;
                case "UpdateContentTypesXmlDocument":
                    addToPayload(opt, ["listName", "newDocument"]);
                    break;
                case "UpdateContentTypeXmlDocument":
                    addToPayload(opt, ["listName", "contentTypeId", "newDocument"]);
                    break;
                case "UpdateList":
                    addToPayload(opt, ["listName", "listProperties", "newFields", "updateFields", "deleteFields", "listVersion"]);
                    break;
                case "UpdateListItems":
                    addToPayload(opt, ["listName"]);
                    if (typeof opt.updates !== "undefined" && opt.updates.length > 0) {
                        addToPayload(opt, ["updates"]);
                    } else {
                        soapEnvelope.payload += `<updates><Batch OnError="Continue"><Method ID="1" Cmd="${opt.batchCmd}">`;
                        _.each(opt.valuePairs, (valuePair: [string, string]) => {
                            soapEnvelope.payload += `<Field Name="${ valuePair[0] }">${ escapeColumnValue(valuePair[1]) }</Field>`;
                        })
                        if (opt.batchCmd !== "New") {
                            soapEnvelope.payload += `<Field Name="ID">${opt.ID}</Field>`;
                        }
                        soapEnvelope.payload += "</Method></Batch></updates>";
                    }
                    break;

                // MEETINGS OPERATIONS
                case "AddMeeting":
                    addToPayload(opt, ["organizerEmail", "uid", "sequence", "utcDateStamp", "title", "location", "utcDateStart", "utcDateEnd", "nonGregorian"]);
                    break;
                case "CreateWorkspace":
                    addToPayload(opt, ["title", "templateName", "lcid", "timeZoneInformation"]);
                    break;
                case "RemoveMeeting":
                    addToPayload(opt, ["recurrenceId", "uid", "sequence", "utcDateStamp", "cancelMeeting"]);
                    break;
                case "SetWorkspaceTitle":
                    addToPayload(opt, ["title"]);
                    break;

                // PEOPLE OPERATIONS
                case "ResolvePrincipals":
                    addToPayload(opt, ["principalKeys", "principalType", "addToUserInfoList"]);
                    break;
                case "SearchPrincipals":
                    addToPayload(opt, ["searchText", "maxResults", "principalType"]);
                    break;

                // PERMISSION OPERATIONS
                case "AddPermission":
                    addToPayload(opt, ["objectName", "objectType", "permissionIdentifier", "permissionType", "permissionMask"]);
                    break;
                case "AddPermissionCollection":
                    addToPayload(opt, ["objectName", "objectType", "permissionsInfoXml"]);
                    break;
                case "GetPermissionCollection":
                    addToPayload(opt, ["objectName", "objectType"]);
                    break;
                case "RemovePermission":
                    addToPayload(opt, ["objectName", "objectType", "permissionIdentifier", "permissionType"]);
                    break;
                case "RemovePermissionCollection":
                    addToPayload(opt, ["objectName", "objectType", "memberIdsXml"]);
                    break;
                case "UpdatePermission":
                    addToPayload(opt, ["objectName", "objectType", "permissionIdentifier", "permissionType", "permissionMask"]);
                    break;

                // PUBLISHEDLINKSSERVICE OPERATIONS
                case "GetLinks":
                    break;

                // SEARCH OPERATIONS
                case "GetPortalSearchInfo":
                    soapEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                    SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
                    break;
                case "GetQuerySuggestions":
                    soapEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                    SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
                    soapEnvelope.payload += wrapNode("queryXml", encodeXml(opt.queryXml));
                    break;
                case "GetSearchMetadata":
                    soapEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                    SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
                    break;
                case "Query":
                    soapEnvelope.payload += wrapNode("queryXml", encodeXml(opt.queryXml));
                    break;
                case "QueryEx":
                    soapEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                    SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
                    soapEnvelope.payload += wrapNode("queryXml", encodeXml(opt.queryXml));
                    break;
                case "Registration":
                    soapEnvelope.payload += wrapNode("registrationXml", encodeXml(opt.registrationXml));
                    break;
                case "Status":
                    break;

                // SHAREPOINTDIAGNOSTICS OPERATIONS
                case "SendClientScriptErrorReport":
                    addToPayload(opt, ["message", "file", "line", "client", "stack", "team", "originalFile"]);
                    break;

                // SITEDATA OPERATIONS
                case "EnumerateFolder":
                    addToPayload(opt, ["strFolderUrl"]);
                    break;
                case "GetAttachments":
                    addToPayload(opt, ["strListName", "strItemId"]);
                    break;
                case "SiteDataGetList":
                    addToPayload(opt, ["strListName"]);
                    // Because this operation has a name which duplicates the Lists WS, need to handle
                    soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
                    break;
                case "SiteDataGetListCollection":
                    // Because this operation has a name which duplicates the Lists WS, need to handle
                    soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
                    break;
                case "SiteDataGetSite":
                    // Because this operation has a name which duplicates the Lists WS, need to handle
                    soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
                    break;
                case "SiteDataGetSiteUrl":
                    addToPayload(opt, ["Url"]);
                    // Because this operation has a name which duplicates the Lists WS, need to handle
                    soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
                    break;
                case "SiteDataGetWeb":
                    // Because this operation has a name which duplicates the Lists WS, need to handle
                    soapEnvelope = siteDataFixSOAPEnvelope(soapEnvelope, opt.operation);
                    break;

                // SITES OPERATIONS
                case "CreateWeb":
                    addToPayload(opt, ["url", "title", "description", "templateName", "language", "languageSpecified",
                        "locale", "localeSpecified", "collationLocale", "collationLocaleSpecified", "uniquePermissions",
                        "uniquePermissionsSpecified", "anonymous", "anonymousSpecified", "presence", "presenceSpecified"
                    ]);
                    break;
                case "DeleteWeb":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetSite":
                    addToPayload(opt, ["SiteUrl"]);
                    break;
                case "GetSiteTemplates":
                    addToPayload(opt, ["LCID", "TemplateList"]);
                    break;

                // SOCIALDATASERVICE OPERATIONS
                case "AddComment":
                    addToPayload(opt, ["url", "comment", "isHighPriority", "title"]);
                    break;
                case "AddTag":
                    addToPayload(opt, ["url", "termID", "title", "isPrivate"]);
                    break;
                case "AddTagByKeyword":
                    addToPayload(opt, ["url", "keyword", "title", "isPrivate"]);
                    break;
                case "CountCommentsOfUser":
                    addToPayload(opt, ["userAccountName"]);
                    break;
                case "CountCommentsOfUserOnUrl":
                    addToPayload(opt, ["userAccountName", "url"]);
                    break;
                case "CountCommentsOnUrl":
                    addToPayload(opt, ["url"]);
                    break;
                case "CountRatingsOnUrl":
                    addToPayload(opt, ["url"]);
                    break;
                case "CountTagsOfUser":
                    addToPayload(opt, ["userAccountName"]);
                    break;
                case "DeleteComment":
                    addToPayload(opt, ["url", "lastModifiedTime"]);
                    break;
                case "DeleteRating":
                    addToPayload(opt, ["url"]);
                    break;
                case "DeleteTag":
                    addToPayload(opt, ["url", "termID"]);
                    break;
                case "DeleteTagByKeyword":
                    addToPayload(opt, ["url", "keyword"]);
                    break;
                case "DeleteTags":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetAllTagTerms":
                    addToPayload(opt, ["maximumItemsToReturn"]);
                    break;
                case "GetAllTagTermsForUrlFolder":
                    addToPayload(opt, ["urlFolder", "maximumItemsToReturn"]);
                    break;
                case "GetAllTagUrls":
                    addToPayload(opt, ["termID"]);
                    break;
                case "GetAllTagUrlsByKeyword":
                    addToPayload(opt, ["keyword"]);
                    break;
                case "GetCommentsOfUser":
                    addToPayload(opt, ["userAccountName", "maximumItemsToReturn", "startIndex"]);
                    break;
                case "GetCommentsOfUserOnUrl":
                    addToPayload(opt, ["userAccountName", "url"]);
                    break;
                case "GetCommentsOnUrl":
                    addToPayload(opt, ["url", "maximumItemsToReturn", "startIndex"]);
                    if (typeof opt.excludeItemsTime !== "undefined" && opt.excludeItemsTime.length > 0) {
                        soapEnvelope.payload += wrapNode("excludeItemsTime", opt.excludeItemsTime);
                    }
                    break;
                case "GetRatingAverageOnUrl":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetRatingOfUserOnUrl":
                    addToPayload(opt, ["userAccountName", "url"]);
                    break;
                case "GetRatingOnUrl":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetRatingsOfUser":
                    addToPayload(opt, ["userAccountName"]);
                    break;
                case "GetRatingsOnUrl":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetSocialDataForFullReplication":
                    addToPayload(opt, ["userAccountName"]);
                    break;
                case "GetTags":
                    addToPayload(opt, ["url"]);
                    break;
                case "GetTagsOfUser":
                    addToPayload(opt, ["userAccountName", "maximumItemsToReturn", "startIndex"]);
                    break;
                case "GetTagTerms":
                    addToPayload(opt, ["maximumItemsToReturn"]);
                    break;
                case "GetTagTermsOfUser":
                    addToPayload(opt, ["userAccountName", "maximumItemsToReturn"]);
                    break;
                case "GetTagTermsOnUrl":
                    addToPayload(opt, ["url", "maximumItemsToReturn"]);
                    break;
                case "GetTagUrls":
                    addToPayload(opt, ["termID"]);
                    break;
                case "GetTagUrlsByKeyword":
                    addToPayload(opt, ["keyword"]);
                    break;
                case "GetTagUrlsOfUser":
                    addToPayload(opt, ["termID", "userAccountName"]);
                    break;
                case "GetTagUrlsOfUserByKeyword":
                    addToPayload(opt, ["keyword", "userAccountName"]);
                    break;
                case "SetRating":
                    addToPayload(opt, ["url", "rating", "title", "analysisDataEntry"]);
                    break;
                case "UpdateComment":
                    addToPayload(opt, ["url", "lastModifiedTime", "comment", "isHighPriority"]);
                    break;

                // SPELLCHECK OPERATIONS
                case "SpellCheck":
                    addToPayload(opt, ["chunksToSpell", "declaredLanguage", "useLad"]);
                    break;

                // TAXONOMY OPERATIONS
                case "AddTerms":
                    addToPayload(opt, ["sharedServiceId", "termSetId", "lcid", "newTerms"]);
                    break;
                case "GetChildTermsInTerm":
                    addToPayload(opt, ["sspId", "lcid", "termId", "termSetId"]);
                    break;
                case "GetChildTermsInTermSet":
                    addToPayload(opt, ["sspId", "lcid", "termSetId"]);
                    break;
                case "GetKeywordTermsByGuids":
                    addToPayload(opt, ["termIds", "lcid"]);
                    break;
                case "GetTermsByLabel":
                    addToPayload(opt, ["label", "lcid", "matchOption", "resultCollectionSize", "termIds", "addIfNotFound"]);
                    break;
                case "GetTermSets":
                    addToPayload(opt, ["sharedServiceId", "termSetId", "lcid", "clientTimeStamps", "clientVersions"]);
                    break;

                // USERS AND GROUPS OPERATIONS
                case "AddGroup":
                    addToPayload(opt, ["groupName", "ownerIdentifier", "ownerType", "defaultUserLoginName", "description"]);
                    break;
                case "AddGroupToRole":
                    addToPayload(opt, ["groupName", "roleName"]);
                    break;
                case "AddRole":
                    addToPayload(opt, ["roleName", "description", "permissionMask"]);
                    break;
                case "AddRoleDef":
                    addToPayload(opt, ["roleName", "description", "permissionMask"]);
                    break;
                case "AddUserCollectionToGroup":
                    addToPayload(opt, ["groupName", "usersInfoXml"]);
                    break;
                case "AddUserCollectionToRole":
                    addToPayload(opt, ["roleName", "usersInfoXml"]);
                    break;
                case "AddUserToGroup":
                    addToPayload(opt, ["groupName", "userName", "userLoginName", "userEmail", "userNotes"]);
                    break;
                case "AddUserToRole":
                    addToPayload(opt, ["roleName", "userName", "userLoginName", "userEmail", "userNotes"]);
                    break;
                case "GetAllUserCollectionFromWeb":
                    break;
                case "GetGroupCollection":
                    addToPayload(opt, ["groupNamesXml"]);
                    break;
                case "GetGroupCollectionFromRole":
                    addToPayload(opt, ["roleName"]);
                    break;
                case "GetGroupCollectionFromSite":
                    break;
                case "GetGroupCollectionFromUser":
                    addToPayload(opt, ["userLoginName"]);
                    break;
                case "GetGroupCollectionFromWeb":
                    break;
                case "GetGroupInfo":
                    addToPayload(opt, ["groupName"]);
                    break;
                case "GetRoleCollection":
                    addToPayload(opt, ["roleNamesXml"]);
                    break;
                case "GetRoleCollectionFromGroup":
                    addToPayload(opt, ["groupName"]);
                    break;
                case "GetRoleCollectionFromUser":
                    addToPayload(opt, ["userLoginName"]);
                    break;
                case "GetRoleCollectionFromWeb":
                    break;
                case "GetRoleInfo":
                    addToPayload(opt, ["roleName"]);
                    break;
                case "GetRolesAndPermissionsForCurrentUser":
                    break;
                case "GetRolesAndPermissionsForSite":
                    break;
                case "GetUserCollection":
                    addToPayload(opt, ["userLoginNamesXml"]);
                    break;
                case "GetUserCollectionFromGroup":
                    addToPayload(opt, ["groupName"]);
                    break;
                case "GetUserCollectionFromRole":
                    addToPayload(opt, ["roleName"]);
                    break;
                case "GetUserCollectionFromSite":
                    break;
                case "GetUserCollectionFromWeb":
                    break;
                case "GetUserInfo":
                    addToPayload(opt, ["userLoginName"]);
                    break;
                case "GetUserLoginFromEmail":
                    addToPayload(opt, ["emailXml"]);
                    break;
                case "RemoveGroup":
                    addToPayload(opt, ["groupName"]);
                    break;
                case "RemoveGroupFromRole":
                    addToPayload(opt, ["roleName", "groupName"]);
                    break;
                case "RemoveRole":
                    addToPayload(opt, ["roleName"]);
                    break;
                case "RemoveUserCollectionFromGroup":
                    addToPayload(opt, ["groupName", "userLoginNamesXml"]);
                    break;
                case "RemoveUserCollectionFromRole":
                    addToPayload(opt, ["roleName", "userLoginNamesXml"]);
                    break;
                case "RemoveUserCollectionFromSite":
                    addToPayload(opt, ["userLoginNamesXml"]);
                    break;
                case "RemoveUserFromGroup":
                    addToPayload(opt, ["groupName", "userLoginName"]);
                    break;
                case "RemoveUserFromRole":
                    addToPayload(opt, ["roleName", "userLoginName"]);
                    break;
                case "RemoveUserFromSite":
                    addToPayload(opt, ["userLoginName"]);
                    break;
                case "RemoveUserFromWeb":
                    addToPayload(opt, ["userLoginName"]);
                    break;
                case "UpdateGroupInfo":
                    addToPayload(opt, ["oldGroupName", "groupName", "ownerIdentifier", "ownerType", "description"]);
                    break;
                case "UpdateRoleDefInfo":
                    addToPayload(opt, ["oldRoleName", "roleName", "description", "permissionMask"]);
                    break;
                case "UpdateRoleInfo":
                    addToPayload(opt, ["oldRoleName", "roleName", "description", "permissionMask"]);
                    break;
                case "UpdateUserInfo":
                    addToPayload(opt, ["userLoginName", "userName", "userEmail", "userNotes"]);
                    break;

                // USERPROFILESERVICE OPERATIONS
                case "AddColleague":
                    addToPayload(opt, ["accountName", "colleagueAccountName", "group", "privacy", "isInWorkGroup"]);
                    break;
                case "AddLink":
                    addToPayload(opt, ["accountName", "name", "url", "group", "privacy"]);
                    break;
                case "AddMembership":
                    addToPayload(opt, ["accountName", "membershipInfo", "group", "privacy"]);
                    break;
                case "AddPinnedLink":
                    addToPayload(opt, ["accountName", "name", "url"]);
                    break;
                case "CreateMemberGroup":
                    addToPayload(opt, ["membershipInfo"]);
                    break;
                case "CreateUserProfileByAccountName":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetCommonColleagues":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetCommonManager":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetCommonMemberships":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetInCommon":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetPropertyChoiceList":
                    addToPayload(opt, ["propertyName"]);
                    break;
                case "GetUserColleagues":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetUserLinks":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetUserMemberships":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetUserPinnedLinks":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "GetUserProfileByGuid":
                    addToPayload(opt, ["guid"]);
                    break;
                case "GetUserProfileByIndex":
                    addToPayload(opt, ["index"]);
                    break;
                case "GetUserProfileByName":
                    // Note that this operation is inconsistent with the others, using AccountName rather than accountName
                    if (typeof opt.accountName !== "undefined" && opt.accountName.length > 0) {
                        addToPayload(opt, [
                            ["AccountName", "accountName"]
                        ]);
                    } else {
                        addToPayload(opt, ["AccountName"]);
                    }
                    break;
                case "GetUserProfileCount":
                    break;
                case "GetUserProfileSchema":
                    break;
                case "GetUserPropertyByAccountName":
                    addToPayload(opt, ["accountName", "propertyName"]);
                    break;
                case "ModifyUserPropertyByAccountName":
                    addToPayload(opt, ["accountName", "newData"]);
                    break;
                case "RemoveAllColleagues":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "RemoveAllLinks":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "RemoveAllMemberships":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "RemoveAllPinnedLinks":
                    addToPayload(opt, ["accountName"]);
                    break;
                case "RemoveColleague":
                    addToPayload(opt, ["accountName", "colleagueAccountName"]);
                    break;
                case "RemoveLink":
                    addToPayload(opt, ["accountName", "id"]);
                    break;
                case "RemoveMembership":
                    addToPayload(opt, ["accountName", "sourceInternal", "sourceReference"]);
                    break;
                case "RemovePinnedLink":
                    addToPayload(opt, ["accountName", "id"]);
                    break;
                case "UpdateColleaguePrivacy":
                    addToPayload(opt, ["accountName", "colleagueAccountName", "newPrivacy"]);
                    break;
                case "UpdateLink":
                    addToPayload(opt, ["accountName", "data"]);
                    break;
                case "UpdateMembershipPrivacy":
                    addToPayload(opt, ["accountName", "sourceInternal", "sourceReference", "newPrivacy"]);
                    break;
                case "UpdatePinnedLink ":
                    addToPayload(opt, ["accountName", "data"]);
                    break;

                // VERSIONS OPERATIONS
                case "DeleteAllVersions":
                    addToPayload(opt, ["fileName"]);
                    break;
                case "DeleteVersion":
                    addToPayload(opt, ["fileName", "fileVersion"]);
                    break;
                case "GetVersions":
                    addToPayload(opt, ["fileName"]);
                    break;
                case "RestoreVersion":
                    addToPayload(opt, ["fileName", "fileVersion"]);
                    break;

                // VIEW OPERATIONS
                case "AddView":
                    addToPayload(opt, ["listName", "viewName", "viewFields", "query", "rowLimit", "rowLimit", "type", "makeViewDefault"]);
                    break;
                case "DeleteView":
                    addToPayload(opt, ["listName", "viewName"]);
                    break;
                case "GetView":
                    addToPayload(opt, ["listName", "viewName"]);
                    break;
                case "GetViewCollection":
                    addToPayload(opt, ["listName"]);
                    break;
                case "GetViewHtml":
                    addToPayload(opt, ["listName", "viewName"]);
                    break;
                case "UpdateView":
                    addToPayload(opt, ["listName", "viewName", "viewProperties", "query", "viewFields", "aggregations", "formats", "rowLimit"]);
                    break;
                case "UpdateViewHtml":
                    addToPayload(opt, ["listName", "viewName", "viewProperties", "toolbar", "viewHeader", "viewBody", "viewFooter", "viewEmpty", "rowLimitExceeded",
                        "query", "viewFields", "aggregations", "formats", "rowLimit"
                    ]);
                    break;

                // WEBPARTPAGES OPERATIONS
                case "AddWebPart":
                    addToPayload(opt, ["pageUrl", "webPartXml", "storage"]);
                    break;
                case "AddWebPartToZone":
                    addToPayload(opt, ["pageUrl", "webPartXml", "storage", "zoneId", "zoneIndex"]);
                    break;
                case "GetWebPart2":
                    addToPayload(opt, ["pageUrl", "storageKey", "storage", "behavior"]);
                    break;
                case "GetWebPartPage":
                    addToPayload(opt, ["documentName", "behavior"]);
                    break;
                case "GetWebPartProperties":
                    addToPayload(opt, ["pageUrl", "storage"]);
                    break;
                case "GetWebPartProperties2":
                    addToPayload(opt, ["pageUrl", "storage", "behavior"]);
                    break;

                // WEBS OPERATIONS
                case "Webs.CreateContentType":
                    addToPayload(opt, ["displayName", "parentType", "newFields", "contentTypeProperties"]);
                    break;
                case "GetColumns":
                    addToPayload(opt, ["webUrl"]);
                    break;
                case "GetContentType":
                    addToPayload(opt, ["contentTypeId"]);
                    break;
                case "GetContentTypes":
                    break;
                case "GetCustomizedPageStatus":
                    addToPayload(opt, ["fileUrl"]);
                    break;
                case "GetListTemplates":
                    break;
                case "GetObjectIdFromUrl":
                    addToPayload(opt, ["objectUrl"]);
                    break;
                case "GetWeb":
                    addToPayload(opt, [
                        ["webUrl", "webURL"]
                    ]);
                    break;
                case "GetWebCollection":
                    break;
                case "GetAllSubWebCollection":
                    break;
                case "UpdateColumns":
                    addToPayload(opt, ["newFields", "updateFields", "deleteFields"]);
                    break;
                case "Webs.UpdateContentType":
                    addToPayload(opt, ["contentTypeId", "contentTypeProperties", "newFields", "updateFields", "deleteFields"]);
                    break;
                case "WebUrlFromPageUrl":
                    addToPayload(opt, [
                        ["pageUrl", "pageURL"]
                    ]);
                    break;

                // WORKFLOW OPERATIONS
                case "AlterToDo":
                    addToPayload(opt, ["item", "todoId", "todoListId", "taskData"]);
                    break;
                case "ClaimReleaseTask":
                    addToPayload(opt, ["item", "taskId", "listId", "fClaim"]);
                    break;
                case "GetTemplatesForItem":
                    addToPayload(opt, ["item"]);
                    break;
                case "GetToDosForItem":
                    addToPayload(opt, ["item"]);
                    break;
                case "GetWorkflowDataForItem":
                    addToPayload(opt, ["item"]);
                    break;
                case "GetWorkflowTaskData":
                    addToPayload(opt, ["item", "listId", "taskId"]);
                    break;
                case "StartWorkflow":
                    addToPayload(opt, ["item", "templateId", "workflowParameters"]);
                    break;

                default:
                    break;
            }

            // Glue together the pieces of the SOAP message
            var msg = soapEnvelope.header + soapEnvelope.opheader + soapEnvelope.payload + soapEnvelope.opfooter + soapEnvelope.footer;
            var soapAction = apWebServiceOperationConstants[opt.operation][1] ? SOAPAction : false;

            return {
                msg: msg,
                SOAPEnvelope: soapEnvelope,
                SOAPAction: soapAction
            };

            // Add the option values to the soapEnvelope.payload for the operation
            //  opt = options for the call
            //  paramArray = an array of option names to add to the payload
            //      "paramName" if the parameter name and the option name match
            //      ["paramName", "optionName"] if the parameter name and the option name are different (this handles early "wrappings" with inconsistent naming)
            //      {name: "paramName", sendNull: false} indicates the element is marked as "add to payload only if non-null"
            function addToPayload(opt, paramArray) {

                var i;

                for (i = 0; i < paramArray.length; i++) {
                    // the parameter name and the option name match
                    if (typeof paramArray[i] === "string") {
                        soapEnvelope.payload += wrapNode(paramArray[i], opt[paramArray[i]]);
                        // the parameter name and the option name are different
                    } else if (_.isArray(paramArray[i]) && paramArray[i].length === 2) {
                        soapEnvelope.payload += wrapNode(paramArray[i][0], opt[paramArray[i][1]]);
                        // the element not a string or an array and is marked as "add to payload only if non-null"
                    } else if ((typeof paramArray[i] === "object") && (paramArray[i].sendNull !== undefined)) {
                        soapEnvelope.payload += ((opt[paramArray[i].name] === undefined) || (opt[paramArray[i].name].length === 0)) ? "" : wrapNode(paramArray[i].name, opt[paramArray[i].name]);
                        // something isn't right, so report it
                    } else {
                        console.error(opt.operation, "paramArray[" + i + "]: " + paramArray[i], "Invalid paramArray element passed to addToPayload()");
                    }
                }
            } // End of function addToPayload

            // The SiteData operations have the same names as other Web Service operations. To make them easy to call and unique, I'm using
            // the SiteData prefix on their names. This function replaces that name with the right name in the soapEnvelope.
            function siteDataFixSOAPEnvelope(SOAPEnvelope, siteDataOperation) {
                var siteDataOp = siteDataOperation.substring(8);
                SOAPEnvelope.opheader = SOAPEnvelope.opheader.replace(siteDataOperation, siteDataOp);
                SOAPEnvelope.opfooter = SOAPEnvelope.opfooter.replace(siteDataOperation, siteDataOp);
                return SOAPEnvelope;
            } // End of function siteDataFixSOAPEnvelope


        }; // End SPServices.generateXMLComponents


        ////// PRIVATE FUNCTIONS ////////
        // Wrap an XML node (n) around a value (v)
        function wrapNode(n, v) {
            var thisValue = typeof v !== "undefined" ? v : "";
            return "<" + n + ">" + thisValue + "</" + n + ">";
        }

        // Get the filename from the full URL
        function fileName(s) {
            return s.substring(s.lastIndexOf("/") + 1, s.length);
        }

        /* Taken from http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/ */
        var xml_special_to_escaped_one_map = {
            '&': '&amp;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;'
        };

        function encodeXml(string) {
            return string.replace(/([\&"<>])/g, function(str, item) {
                return xml_special_to_escaped_one_map[item];
            });
        }

        /* Taken from http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/ */
        // Escape column values
        function escapeColumnValue(s) {
            if (typeof s === "string") {
                return s.replace(/&(?![a-zA-Z]{1,8};)/g, "&amp;");
            } else {
                return s;
            }
        }

        // James Padolsey's Regex Selector for jQuery http://james.padolsey.com/javascript/regex-selector-for-jquery/
        $.expr[':'].regex = function(elem, index, match) {
            var matchParams = match[3].split(','),
                validLabels = /^(data|css):/,
                attr = {
                    method: matchParams[0].match(validLabels) ?
                        matchParams[0].split(':')[0] : 'attr',
                    property: matchParams.shift().replace(validLabels, '')
                },
                regexFlags = 'ig',
                regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
            return regex.test(jQuery(elem)[attr.method](attr.property));
        };

        return SPServices;

    }


    /**
     * @ngdoc service
     * @name angularPoint.SPServices
     * @description
     * This is just a trimmed down version of Marc Anderson's awesome [SPServices](http://spservices.codeplex.com/) library.
     * We're primarily looking for the ability to create the SOAP envelope and let AngularJS's $http service handle all
     * communication with the server.
     *
     * */
    angular.module('angularPoint')
        .factory('SPServices', Service);
}
