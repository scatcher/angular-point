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

angular.module('angularPoint', [
    'toastr',
    'ngMock'
]);