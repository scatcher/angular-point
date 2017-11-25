import { ListItem } from '../factories/apListItemFactory';
import { IndexedCache } from '../factories/apIndexedCacheFactory';

export * from './xml-field.interface';
export * from './field-types.enum';

export interface XMLGroup {
    Description: string;
    ID: string;
    Name: string;
    OwnerID: string;
    OwnerIsUser: string;
}

export interface XMLUser {
    Email: string;
    Flags: string;
    ID: string;
    IsDomainGroup: string;
    IsSiteAdmin: string;
    LoginName: string;
    Name: string;
    Notes: string;
    Sid: string;
}

export interface XMLUserProfile {
    userLoginName: string; // Added to allow us to optionally add a prefix if necessary from apConfig
    UserProfile_GUID: string;
    AccountName: string;
    FirstName: string;
    'SPS-PhoneticFirstName': string;
    LastName: string;
    'SPS-PhoneticLastName': string;
    PreferredName: string;
    'SPS-PhoneticDisplayName': string;
    WorkPhone: string;
    Department: string;
    Title: string;
    'SPS-JobTitle': string;
    Manager: string;
    AboutMe: string;
    PersonalSpace: string;
    PictureURL: string;
    UserName: string;
    QuickLinks: string;
    WebSite: string;
    PublicSiteRedirect: string;
    'SPS-Dotted-line': string;
    'SPS-Peers': string;
    'SPS-Responsibility': string;
    'SPS-SipAddress': string;
    'SPS-MySiteUpgrade': string;
    'SPS-DontSuggestList': string;
    'SPS-ProxyAddresses': string;
    'SPS-HireDate': string;
    'SPS-DisplayOrder': string;
    'SPS-ClaimID': string;
    'SPS-ClaimProviderID': string;
    'SPS-ClaimProviderType': string;
    'SPS-LastColleagueAdded': string;
    'SPS-OWAUrl': string;
    'SPS-SavedAccountName': string;
    'SPS-ResourceAccountName': string;
    'SPS-ObjectExists': string;
    'SPS-MasterAccountName': string;
    'SPS-DistinguishedName': string;
    'SPS-SourceObjectDN': string;
    'SPS-LastKeywordAdded': string;
    WorkEmail: string;
    CellPhone: string;
    Fax: string;
    HomePhone: string;
    Office: string;
    'SPS-Location': string;
    'SPS-TimeZone': string;
    Assistant: string;
    'SPS-PastProjects': string;
    'SPS-Skills': string;
    'SPS-School': string;
    'SPS-Birthday': string;
    'SPS-StatusNotes': string;
    'SPS-Interests': string;
    'SPS-EmailOptin': string;
}

export interface IListItemCrudOptions<T extends ListItem<any>> {
    target: IndexedCache<T>;
}

export interface IWorkflowDefinition {
    instantiationUrl: string;
    name: string;
    templateId: string;
}

export interface IStartWorkflowParams {
    fileRef?: string;
    item: string;
    templateId: string;
    workflowName?: string;
    workflowParameters?: string;
}

// declare module ngTable {
//     export interface INGTableParamsObject {
//         count?: number;
//         filter?: Object;
//         page?: number;
//         sorting?: Object;
//     }
//
//     interface INGTableParamsReference {
//         count(): number;
//         filter(): Object;
//         orderBy(): string[]
//         page(): number;
//         sorting(): Object;
//         total(): number;
//         total(number): void;
//     }
//
//     export interface INGTableSettings {
//         total?: number;
//         counts?: number[];
//         defaultSort?: string; //options: ['asc', 'desc']
//         groupBy?: string | Function;
//         filterDelay?: number;
//         /** Return eiter a data array or promise that resolves with a data array */
//         getData(params: INGTableParamsReference): void;
//     }
//
//     export interface INGTableParams {
//         new (parameters: INGTableParamsObject, settings: INGTableSettings): INGTable;
//     }
//
//     export interface INGTable {
//         reload(): void;
//     }
// }
//
// // extend lodash with functionality in apUtilityService
// declare module _ {
//     interface LoDashStatic {
//         isDefined(val): boolean;
//         isGuid(val): boolean;
//     }
// }
