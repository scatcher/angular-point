import * as angular from 'angular';
import {DefaultFields} from './constants/apDefaultFields';
import {DefaultListItemQueryOptions} from './constants/apDefaultListItemQueryOptions';
import {BasePermissionObject} from './constants/apPermissionObject';
import {WebServiceOperationConstants} from './constants/apWebServiceOperationConstants';
import {XMLFieldAttributeTypes} from './constants/apXMLFieldAttributeTypes';
import {XMLListAttributeTypes} from './constants/apXMLListAttributeTypes';
import {CamlFactory} from './factories/apCamlFactory';
import {FieldFactory} from './factories/apFieldFactory';
import {IndexedCacheFactory} from './factories/apIndexedCacheFactory';
import {ListItemFactory} from './factories/apListItemFactory';
import {ModelFactory} from './factories/apModelFactory';
import {ListItemVersionFactory} from './factories/apListItemVersionFactory';
import {LookupFactory} from './factories/apLookupFactory';
import {QueryFactory} from './factories/apQueryFactory';
import {UserFactory} from './factories/apUserFactory';
import {UserModel} from './models/apUserModel';
import {CacheService} from './services/apCacheService';
import {ChangeService} from './services/apChangeService';
import {DataService} from './services/apDataService';
import {DecodeService} from './services/apDecodeService';
import {EncodeService} from './services/apEncodeService';
import {exceptionLoggingService} from './services/apExceptionHandlerService';
import {ExportService} from './services/apExportService';
import {FieldService} from './services/apFieldService';
import {FormattedFieldValueService} from './services/apFormattedFieldValueService';
import {SPServicesCore} from './services/apSPServices';
import {Logger} from './services/apLogger';
import {UtilityService} from './services/apUtilityService';
import {WebServiceService} from './services/apWebServiceService';
import {XMLToJSONService} from './services/apXMLToJSONService';
import auto = angular.auto;

export let $AP_INJECTOR: auto.IInjectorService;

export * from './constants';
export * from './factories';
export * from './models';
export * from './interfaces';
export * from './services';
export * from './app.module';

/**
 * @ngdoc overview
 * @module
 * @name angularPoint
 * @description
 * This is the primary angularPoint module and needs to be listed in your app.js dependencies to gain use of AngularPoint
 * functionality in your project.
 * @installModule
 */
export const AngularPointModule = angular.module('angularPoint', [])

// Constants
    .constant('apDefaultFields', DefaultFields)
    // .constant('apConfig', APConfig)
    .constant('apDefaultListItemQueryOptions', DefaultListItemQueryOptions)
    .constant('apBasePermissionObject', BasePermissionObject)
    .constant('apWebServiceOperationConstants', WebServiceOperationConstants)
    .constant('apXMLFieldAttributeTypes', XMLFieldAttributeTypes)
    .constant('apXMLListAttributeTypes', XMLListAttributeTypes)

    // Factories
    .service('apCamlFactory', CamlFactory)
    .service('apFieldFactory', FieldFactory)
    .service('apIndexedCacheFactory', IndexedCacheFactory)
    .service('apListFactory', ListItemFactory)
    .service('apListItemFactory', ListItemFactory)
    .service('apListItemVersionFactory', ListItemVersionFactory)
    .service('apLookupFactory', LookupFactory)
    .service('apModelFactory', ModelFactory)
    .service('apQueryFactory', QueryFactory)
    .service('apUserFactory', UserFactory)

    // Models
    .service('apUserModel', UserModel)

    // Services
    .service('apCacheService', CacheService)
    .service('apChangeService', ChangeService)
    .service('apDataService', DataService)
    .service('apDecodeService', DecodeService)
    .service('apEncodeService', EncodeService)
    .factory('$exceptionHandler', exceptionLoggingService)
    .service('apExportService', ExportService)
    .service('apFieldService', FieldService)
    .service('apFormattedFieldValueService', FormattedFieldValueService)
    .service('apLogger', Logger)
    .factory('SPServices', SPServicesCore)
    .service('apUtilityService', UtilityService)
    .service('apWebServiceService', WebServiceService)
    .service('apXMLToJSONService', XMLToJSONService)

    /** Bootstrap everything that needs to be immediately instantiated */
    .run(['$injector', 'apListItemFactory', 'apModelFactory', ($injector: auto.IInjectorService, apListItemFactory: ListItemFactory, apModelFactory: ModelFactory) => {
        // Expose angular $injector for use by the entire application
        $AP_INJECTOR = $injector;
    }]);
