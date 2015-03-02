'use strict';

//TODO: Remove dependency on toastr
/** Check to see if dependent modules exist */
try {
    angular.module('toastr');
}
catch (e) {
    /** Toastr wasn't found so redirect all toastr requests to $log */
    angular.module('toastr', [])
        .factory('toastr', function ($log) {
            return {
                error: $log.error,
                info: $log.info,
                success: $log.info,
                warning: $log.warn
            };
        });
}

import apConfig from '../src/constants/apConfig.js';
import apDefaultFields from './constants/apDefaultFields.js';
import apDefaultListItemQueryOptions from './constants/apDefaultListItemQueryOptions.js';
import apWebServiceOperationConstants from './constants/apWebServiceOperationConstants.js';
import apXMLFieldAttributeTypes from './constants/apXMLFieldAttributeTypes.js';
import apXMLListAttributeTypes from './constants/apXMLListAttributeTypes.js';

import apCamlFactory from './factories/apCamlFactory.js';
import apIndexedCacheFactory from './factories/apIndexedCacheFactory.js';
import apListFactory from './factories/apListFactory.js';
import apListItemFactory from './factories/apListItemFactory.js';
import apLookupFactory from './factories/apLookupFactory.js';
import apQueryFactory from './factories/apQueryFactory.js';

import apUserModel from './models/apUserModel.js';

import apCacheService from './services/apCacheService.js';
import apDataService from './services/apDataService.js';
import apDecodeService from './services/apDecodeService.js';
import apEncodeService from './services/apEncodeService.js';
import apExportService from './services/apExportService.js';
import apFieldService from './services/apFieldService.js';
import apFormattedFieldValueService from './services/apFormattedFieldValueService.js';
import SPServices from './services/apSPServices.js';
import apUtilityService from './services/apUtilityService.js';
import apWebServiceService from './services/apWebServiceService.js';
import apXMLToJSONService from './services/apXMLToJSONService.js';

/**
 * @ngdoc overview
 * @module
 * @name angularPoint
 * @description
 * This is the primary angularPoint module and needs to be listed in your app.js dependencies to gain use of AngularPoint
 * functionality in your project.
 * @installModule
 */
angular.module('angularPoint', [
    'toastr'
])
    .constant('_', _)


/** CONTSTANTS */
    .constant('apConfig', apConfig)
    .constant('apDefaultFields', apDefaultFields)
    .constant('apDefaultListItemQueryOptions', apDefaultListItemQueryOptions)
    .constant('apWebServiceOperationConstants', apWebServiceOperationConstants)
    .constant('apXMLFieldAttributeTypes', apXMLFieldAttributeTypes)
    .constant('apXMLListAttributeTypes', apXMLListAttributeTypes)

/** FACTORIES */
    .service('apCamlFactory', apCamlFactory)
    .service('apIndexedCacheFactory', apIndexedCacheFactory)
    .service('apListFactory', apListFactory)
    .service('apListItemFactory', apListItemFactory)
    .service('apLookupFactory', apLookupFactory)
    .service('apModelFactory', apModelFactory)
    .service('apQueryFactory', apQueryFactory)
    .service('apUserFactory', apUserFactory)

/** MODEL */
    .service('apUserModel', apUserModel)

/** SERVICES */
    .service('apCacheService', apCacheService)
    .service('apDataService', apDataService)
    .service('apDecodeService', apDecodeService)
    .service('apEncodeService', apEncodeService)
    .service('apExportService', apExportService)
    .service('apFieldService', apFieldService)
    .service('apFormattedFieldValueService', apFormattedFieldValueService)
    .service('SPServices', SPServices)
    .service('apUtilityService', apUtilityService)
    .service('apWebServiceService', apWebServiceService)
    .service('apXMLToJSONService', apXMLToJSONService)

    .config(function (apConfig) {

        /** Add a convenience flag, inverse of offline */
        apConfig.online = !apConfig.offline;
    });


