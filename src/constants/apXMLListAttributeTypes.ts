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
    AllowDeletion: 'Boolean',
    AllowMultiResponses: 'Boolean',
    Author: 'Number',
    BaseType: 'Number',
    Created: 'DateTime',
    EnableAttachments: 'Boolean',
    EnableFolderCreation: 'Boolean',
    EnableMinorVersion: 'Boolean',
    EnableModeration: 'Boolean',
    EnablePeopleSelector: 'Boolean',
    EnableResourceSelector: 'Boolean',
    EnableVersioning: 'Boolean',
    EnforceDataValidation: 'Boolean',
    ExcludeFromOfflineClient: 'Boolean',
    Flags: 'Number',
    HasExternalDataSource: 'Boolean',
    HasRelatedLists: 'Boolean',
    HasUniqueScopes: 'Boolean',
    Hidden: 'Boolean',
    IrmEnabled: 'Boolean',
    IsApplicationList: 'Boolean',
    ItemCount: 'Number',
    LastDeleted: 'DateTime',
    MajorWithMinorVersionsLimit: 'Number',
    MaxItemsPerThrottledOperation: 'Number',
    Modified: 'DateTime',
    MultipleDataList: 'Boolean',
    NoThrottleListOperations: 'Boolean',
    Ordered: 'Boolean',
    PreserveEmptyValues: 'Boolean',
    ReadSecurity: 'Number',
    RequireCheckout: 'Boolean',
    ServerTemplate: 'Number',
    ShowUser: 'Boolean',
    StrictTypeCoercion: 'Boolean',
    ThrottleListOperations: 'Boolean',
    ThumbnailSize: 'Number',
    Version: 'Number',
    WebImageHeight: 'Number',
    WebImageWidth: 'Number',
    WriteSecurity: 'Number',
};
