/// <reference path="../../typings/ap.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />

module ap.test {
    'use strict';

    export class MockUtils {
        constructor(private apUtilityService: UtilityService) {}
        
        /** We don't know the timezone of the test server so can't hard code it therefore we need the build system
        * to return the anticipated offset */
        getTimezoneOffsetString() {
            var offsetString = '',
                offsetZone = new Date().getTimezoneOffset() / 60;

            offsetString += this.apUtilityService.doubleDigit(offsetZone);
            offsetString += ':00';
            return offsetString;
        }
    }

    angular.module('angularPoint')
        .service('apMockUtils', MockUtils);

}