export interface IXMLListAttributeTypes {
    [key: string]: string;
}
/**
 * @ngdoc object
 * @name angularPoint.apXMLListAttributeTypes
 * @description Constant object map which contains many common XML attributes found on a list definition with their
 * corresponding type.
 */
export const XMLListAttributeTypes: IXMLListAttributeTypes = {
    BaseType: 'Number',
    ServerTemplate: 'Number',
    Created: 'DateTime',
    Modified: 'DateTime',
    LastDeleted: 'DateTime',
    Version: 'Number',
    ThumbnailSize: 'Number',
    WebImageWidth: 'Number',
    WebImageHeight: 'Number',
    Flags: 'Number',
    ItemCount: 'Number',
    ReadSecurity: 'Number',
    WriteSecurity: 'Number',
    Author: 'Number',
    MajorWithMinorVersionsLimit: 'Number',
    HasUniqueScopes: 'Boolean',
    NoThrottleListOperations: 'Boolean',
    HasRelatedLists: 'Boolean',
    AllowDeletion: 'Boolean',
    AllowMultiResponses: 'Boolean',
    EnableAttachments: 'Boolean',
    EnableModeration: 'Boolean',
    EnableVersioning: 'Boolean',
    HasExternalDataSource: 'Boolean',
    Hidden: 'Boolean',
    MultipleDataList: 'Boolean',
    Ordered: 'Boolean',
    ShowUser: 'Boolean',
    EnablePeopleSelector: 'Boolean',
    EnableResourceSelector: 'Boolean',
    EnableMinorVersion: 'Boolean',
    RequireCheckout: 'Boolean',
    ThrottleListOperations: 'Boolean',
    ExcludeFromOfflineClient: 'Boolean',
    EnableFolderCreation: 'Boolean',
    IrmEnabled: 'Boolean',
    IsApplicationList: 'Boolean',
    PreserveEmptyValues: 'Boolean',
    StrictTypeCoercion: 'Boolean',
    EnforceDataValidation: 'Boolean',
    MaxItemsPerThrottledOperation: 'Number'
};

