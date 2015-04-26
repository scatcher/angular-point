/// <reference path="../../typings/ap.d.ts" />

module ap {
    'use strict';

    export var XMLFieldAttributeTypes = {
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
