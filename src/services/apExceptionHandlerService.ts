/// <reference path="../app.module.ts" />

module ap {

    function exceptionLoggingService($log, $injector) {
        function error(exception: Error, cause: string) {

            /** Need to inject otherwise get circular dependency when using dependency injection */
            var apLogger: ILogger = $injector.get('apLogger');
            // now try to log the error to the server side.
            apLogger.exception(exception, cause);

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
    angular
        .module('angularPoint')
		.factory('$exceptionHandler', exceptionLoggingService);

}
