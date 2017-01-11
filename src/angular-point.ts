import * as angular from 'angular';

import {DefaultFields} from './constants/apDefaultFields';
import {DefaultListItemQueryOptions} from './constants/apDefaultListItemQueryOptions';
import {BasePermissionObject} from './constants/apPermissionObject';
import {WebServiceOperationConstants} from './constants/apWebServiceOperationConstants';
import {XMLFieldAttributeTypes} from './constants/apXMLFieldAttributeTypes';
import {XMLListAttributeTypes} from './constants/apXMLListAttributeTypes';
import {CamlFactory} from './factories/apCamlFactory';
import { FieldFactory, FieldConfigurationObject, FieldDefinition } from './factories/apFieldFactory';
import {IndexedCacheFactory, IndexedCache} from './factories/apIndexedCacheFactory';
import {ListItemFactory, ListItem} from './factories/apListItemFactory';
import { ModelFactory, Model, QueriesContainer } from './factories/apModelFactory';
import { ListItemVersionFactory, ChangeSummary, VersionSummary, ListItemVersion } from './factories/apListItemVersionFactory';
import {LookupFactory, Lookup} from './factories/apLookupFactory';
import {QueryFactory, Query} from './factories/apQueryFactory';
import { UserFactory, User } from './factories/apUserFactory';
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
import { Logger, LogEvent } from './services/apLogger';
import {UtilityService} from './services/apUtilityService';
import {WebServiceService} from './services/apWebServiceService';
import {XMLToJSONService} from './services/apXMLToJSONService';
import { List, ListFieldMapping } from './factories/apListFactory';
import { LookupCacheService } from './services/apLookupCacheService';
import { XMLUser, XMLGroup } from './interfaces/index';


export let $AP_INJECTOR: ng.auto.IInjectorService;

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
    .service('apLookupCacheService', LookupCacheService)

    .factory('SPServices', SPServicesCore)
    .service('apUtilityService', UtilityService)
    .service('apWebServiceService', WebServiceService)
    .service('apXMLToJSONService', XMLToJSONService)

    /** Bootstrap everything that needs to be immediately instantiated */
    .run(['$injector', 'apListItemFactory', 'apModelFactory', ($injector: ng.auto.IInjectorService, apListItemFactory: ListItemFactory, apModelFactory: ModelFactory) => {
        // Expose angular $injector for use by the entire application
        $AP_INJECTOR = $injector;
    }]);

export let ENV;

export function registerEnvironment(env) {
    ENV = env;
}

export {
    ChangeSummary,
    DataService,
    FieldConfigurationObject,
    FieldDefinition,
    IndexedCache,
    IndexedCacheFactory,
    List,
    ListItem,
    ListItemVersion,
    LogEvent,
    Logger,
    Lookup,
    Model,
    QueriesContainer,
    Query,
    User,
    UserModel,
    UtilityService,
    VersionSummary,
    XMLGroup,
    XMLUser,
};