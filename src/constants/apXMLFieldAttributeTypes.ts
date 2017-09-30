export interface IXMLFieldAttributeTypes {
    [key: string]: string;
}
/**
 * @ngdoc object
 * @name angularPoint.apXMLListAttributeTypes
 * @description Constant object map which contains many common XML attributes found on a field definition with their
 * corresponding type.
 */
export const XMLFieldAttributeTypes: IXMLFieldAttributeTypes = {
    Decimals: 'Number',
    EnforceUniqueValues: 'Boolean',
    Filterable: 'Boolean',
    FromBaseType: 'Boolean',
    Hidden: 'Boolean',
    Indexed: 'Boolean',
    NumLines: 'Number',
    ReadOnly: 'Boolean',
    Required: 'Boolean',
    Sortable: 'Boolean',
};
