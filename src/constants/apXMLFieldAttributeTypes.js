(function () {
    'use strict';

    /**
     * @ngdoc object
     * @name angularPoint.apXMLListAttributeTypes
     * @description Constant object map which contains many common XML attributes found on a field definition with their
     * corresponding type.
     */
    angular
        .module('angularPoint')
        .constant('apXMLFieldAttributeTypes',{
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
        });

})();
