import apUtilityService from '../../src/services/apUtilityService.js'

class apMockUtils{
    /** We don't know the timezone of the test server so can't hard code it therefore we need the build system
     * to return the anticipated offset */
    getTimezoneOffsetString() {
        var offsetString = '',
            offsetZone = new Date().getTimezoneOffset() / 60;

        offsetString += apUtilityService.doubleDigit(offsetZone);
        offsetString += ':00';
        return offsetString;
    }
}
export default apMockUtils;
