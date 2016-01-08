import {LoggerService} from '../services';

//TODO: Find out a way to implement in angular2 now that we don't have a $log service
export function ExceptionLoggingService($log, $injector) {
    function error(exception: Error, cause: string) {
        // now try to log the error to the server side.
        LoggerService.exception(exception, cause);

        // preserve the default behaviour which will log the error
        // to the console, and allow the application to continue running.
        $log.error.apply($log, arguments);
    }

    return error;
}

/**
 * @ngdoc service
 * @name angularPoint.$exceptionHandler
 * @description
 * Replaces the default angular implementation and handles logging errors to the apLogger service.
 * @requires angularPoint.apLogger
 */
//angular
//    .module('angularPoint')
//.factory('$exceptionHandler', exceptionLoggingService);

//}
