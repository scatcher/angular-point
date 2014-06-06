/**
 * Polyfill to prevent debugging code from throwing errors in older IE
 */
(function () {
    /** Ensure that IE users in IE8 aren't in compatibility mode, notify if they are */
    if(document.documentMode && document.documentMode < 8) {
        alert("You need to have compatibility mode disabled to use this application.  " +
            "Please go to the tools menu and deselect \"Compatibility View\".");
    }

    if (!window.console) {
        window.console = {};
    }
    // union of Chrome, FF, IE, and Safari console methods
    var m = [
        "log", "info", "warn", "error", "debug", "trace", "dir", "group",
        "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
        "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
    ];
    // define undefined methods as noops to prevent errors
    for (var i = 0; i < m.length; i++) {
        if (!window.console[m[i]]) {
            window.console[m[i]] = function () {
            };
        }
    }

    //Hack for SPServices which assumes SharePoint JS is loaded on page
    window.L_Menu_BaseUrl = '';
})();