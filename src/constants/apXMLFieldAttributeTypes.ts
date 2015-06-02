/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    export interface IXMLFieldAttributeTypes {
        [key: string]: string;
    }

    export var XMLFieldAttributeTypes: IXMLFieldAttributeTypes = {
        Decimals: 'Number',
        EnforceUniqueValues: 'Boolean',
        Filterable: 'Boolean',
        FromBaseType: 'Boolean',
        Hidden: 'Boolean',
        Indexed: 'Boolean',
        NumLines: 'Number',
        ReadOnly: 'Boolean',
        Required: 'Boolean',
        Sortable: 'Boolean'
    };

    /**
     * @ngdoc object
     * @name angularPoint.apXMLListAttributeTypes
     * @description Constant object map which contains many common XML attributes found on a field definition with their
     * corresponding type.
     */
    angular
        .module('angularPoint')
        .constant('apXMLFieldAttributeTypes', XMLFieldAttributeTypes);

}
