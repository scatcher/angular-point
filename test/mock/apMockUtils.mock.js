/// <reference path="../../typings/ap.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
var ap;
(function (ap) {
    'use strict';
    var MockUtils = (function () {
        function MockUtils(apUtilityService) {
            this.apUtilityService = apUtilityService;
        }
        /** We don't know the timezone of the test server so can't hard code it therefore we need the build system
        * to return the anticipated offset */
        MockUtils.prototype.getTimezoneOffsetString = function () {
            var offsetString = '', offsetZone = new Date().getTimezoneOffset() / 60;
            offsetString += this.apUtilityService.doubleDigit(offsetZone);
            offsetString += ':00';
            return offsetString;
        };
        return MockUtils;
    })();
    ap.MockUtils = MockUtils;
    angular.module('angularPoint')
        .service('apMockUtils', MockUtils);
})(ap || (ap = {}));

//# sourceMappingURL=apMockUtils.mock.js.map
