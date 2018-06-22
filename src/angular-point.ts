import * as angular from 'angular';
import { DefaultFields } from './constants/apDefaultFields';
import { DefaultListItemQueryOptions } from './constants/apDefaultListItemQueryOptions';
import { BasePermissionObject, UserPermissionsObject } from './constants/apPermissionObject';
import { WebServiceOperationConstants } from './constants/apWebServiceOperationConstants';
import { XMLFieldAttributeTypes } from './constants/apXMLFieldAttributeTypes';
import { XMLListAttributeTypes } from './constants/apXMLListAttributeTypes';
import { CamlFactory } from './factories/apCamlFactory';
import { FieldConfigurationObject, FieldDefinition, FieldFactory } from './factories/apFieldFactory';
import { IndexedCache, IndexedCacheFactory } from './factories/apIndexedCacheFactory';
import { List } from './factories/apListFactory';
import { ListItem, ListItemFactory } from './factories/apListItemFactory';
import {
    ChangeSummary,
    ListItemVersion,
    ListItemVersionFactory,
    VersionSummary,
} from './factories/apListItemVersionFactory';
import { Lookup, LookupFactory } from './factories/apLookupFactory';
import { Model, ModelFactory, QueriesContainer } from './factories/apModelFactory';
import { Query, QueryFactory } from './factories/apQueryFactory';
import { User, UserFactory } from './factories/apUserFactory';
import { FieldTypeEnum, FieldTypeUnion, XMLFieldDefinition, XMLGroup, XMLList, XMLUser } from './interfaces';
import { UserModel } from './models/apUserModel';
import { CacheService } from './services/apCacheService';
import { ChangeService } from './services/apChangeService';
import { DataService } from './services/apDataService';
import { DecodeService } from './services/apDecodeService';
import { EncodeService } from './services/apEncodeService';
import { exceptionLoggingService } from './services/apExceptionHandlerService';
import { ExportService } from './services/apExportService';
import { FieldService } from './services/apFieldService';
import { FormattedFieldValueService } from './services/apFormattedFieldValueService';
import { LogEvent, Logger } from './services/apLogger';
import { LookupCacheService } from './services/apLookupCacheService';
import { SPServicesCore } from './services/apSPServices';
import { UtilityService } from './services/apUtilityService';
import { WebServiceService } from './services/apWebServiceService';
import { XMLToJSONService } from './services/apXMLToJSONService';

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
export const AngularPointModule = angular
    .module('angularPoint', [])
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
    .run([
        '$injector',
        'apListItemFactory',
        'apModelFactory',
        ($injector: ng.auto.IInjectorService, apListItemFactory: ListItemFactory, apModelFactory: ModelFactory) => {
            // Expose angular $injector for use by the entire application
            $AP_INJECTOR = $injector;
        },
    ]);

export let ENV;

export function registerEnvironment(env) {
    ENV = env;
}

export {
    ChangeSummary,
    DataService,
    FieldConfigurationObject,
    FieldDefinition,
    FieldTypeEnum,
    FieldTypeUnion,
    IndexedCache,
    IndexedCacheFactory,
    List,
    ListItem,
    ListItemVersion,
    LogEvent,
    Logger,
    Lookup,
    LookupCacheService,
    Model,
    QueriesContainer,
    Query,
    User,
    UserModel,
    UserPermissionsObject,
    UtilityService,
    VersionSummary,
    XMLFieldDefinition,
    XMLGroup,
    XMLList,
    XMLToJSONService,
    XMLUser,
};
