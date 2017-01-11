import {Logger} from './apLogger';

/**
 * @ngdoc service
 * @name angularPoint.$exceptionHandler
 * @description
 * Replaces the default angular implementation and handles logging errors to the apLogger service.
 * @requires angularPoint.apLogger
 */
exceptionLoggingService.$inject = ['$log', '$injector'];
export function exceptionLoggingService($log, $injector) {
    function error(exception: Error, cause: string) {

        /** Need to inject otherwise get circular dependency when using dependency injection */
        const apLogger: Logger = $injector.get('apLogger');
        // now try to log the error to the server side.
        apLogger.exception(exception, cause);

        // preserve the default behaviour which will log the error
        // to the console, and allow the application to continue running.
        $log.error.apply($log, arguments);

    }

    return error;
}


