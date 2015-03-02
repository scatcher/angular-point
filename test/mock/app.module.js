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
//require('angular');

import apConfig from '../../src/constants/apConfig.js';
import apDefaultFields from '../../src/constants/apDefaultFields.js';
import apDefaultListItemQueryOptions from '../../src/constants/apDefaultListItemQueryOptions.js';
import apWebServiceOperationConstants from '../../src/constants/apWebServiceOperationConstants.js';
import apXMLFieldAttributeTypes from '../../src/constants/apXMLFieldAttributeTypes.js';
import apXMLListAttributeTypes from '../../src/constants/apXMLListAttributeTypes.js';

import apCamlFactory from '../../src/factories/apCamlFactory.js';
import apIndexedCacheFactory from '../../src/factories/apIndexedCacheFactory.js';
import apListFactory from '../../src/factories/apListFactory.js';
import apListItemFactory from '../../src/factories/apListItemFactory.js';
import apLookupFactory from '../../src/factories/apLookupFactory.js';
import apModelFactory from '../../src/factories/apModelFactory.js';
import apQueryFactory from '../../src/factories/apQueryFactory.js';
import apUserFactory from '../../src/factories/apUserFactory.js';

import apUserModel from '../../src/models/apUserModel.js';

import apCacheService from '../../src/services/apCacheService.js';
import apDataService from '../../src/services/apDataService.js';
import apDecodeService from '../../src/services/apDecodeService.js';
import apEncodeService from '../../src/services/apEncodeService.js';
import apExportService from '../../src/services/apExportService.js';
import apFieldService from '../../src/services/apFieldService.js';
import apFormattedFieldValueService from '../../src/services/apFormattedFieldValueService.js';
import SPServices from '../../src/services/apSPServices.js';
import apUtilityService from '../../src/services/apUtilityService.js';
import apWebServiceService from '../../src/services/apWebServiceService.js';
import apXMLToJSONService from '../../src/services/apXMLToJSONService.js';

import apMockUtils from '../../test/mock/apMockUtils.js';
import mockXMLService from '../../test/mock/data/mockXMLService.js';
import mockModel from '../../test/mock/models/mockModel.js';
import mockLookupModel from '../../test/mock/models/mockLookupModel.js';


angular.module('angularPoint', [
    'toastr',
    'ngMock'
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

/** MOCKS */
    .service('apMockUtils', apMockUtils)
    .service('mockXMLService', mockXMLService)
    .service('mockModel', mockModel)
    .service('mockLookupModel', mockLookupModel)
    .config(function (apConfig) {

        /** Add a convenience flag, inverse of offline */
        apConfig.online = !apConfig.offline;
    })

    .run('apMockBackend', apMockBackend);


