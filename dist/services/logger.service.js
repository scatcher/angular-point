"use strict";
var lodash_1 = require('lodash');
var LogEvent = (function () {
    function LogEvent(options, type, message) {
        var _this = this;
        this.type = type;
        this.message = message;
        this.url = location.href;
        // create a promise to pass back to caller to monitor log creation
        this.promise = new Promise(function (resolve, reject) {
            _this._resolve = resolve;
        });
        // extend object with any additional attributes
        Object.assign(this, options);
        // generate notification
        registerEvent(this);
    }
    return LogEvent;
}());
exports.LogEvent = LogEvent;
var eventQueue = [];
var subscribers = [];
exports.LoggerService = {
    eventQueue: eventQueue,
    subscribers: subscribers,
    debug: debug,
    error: error,
    exception: exception,
    info: info,
    log: log,
    registerEvent: registerEvent,
    subscribe: subscribe,
    warn: warn
};
/**
 * @ngdoc service
 * @name angularPoint.LoggerService
 * @description
 * Common definitions used in the application.
 *
 * HOW TO USE
 * 1. Create a logging model for logs to be stored
 * 2. Ensure everyone has write access to the list
 * 3. Add the model as one of the dependencies in your .run so it'll be instantiated immediately
 * 4. Subscribe to change events from on the model
 *
 *
 * @example
 * <pre>
 * export class Log extends ap.ListItem{
 *     cause: string;
 *     event: string;
 *     formattedStackTrace: string;
 *     json: Object;
 *     message: string;
 *     stackTrace: string[];
 *     type: string;
 *     url: string;
 *     constructor(obj){
 *         Object.assign(this, obj);
 *     }
 *     //override the default save and cleanup before actually saving
 *     saveChanges() {
 *          // stringify stacktrace prior to saving so we can display in email notifications
 *          if(this.stackTrace && !this.formattedStackTrace) {
 *          this.formattedStackTrace = this.stackTrace.map(function(sf) {
 *               return sf.toString();
 *           }).join('\n');
 *         }
 *         return super.saveChanges();
 *     }
 * }
 * var logCounter = 0;
 * var maxLogsPerSesssion = 5;
 * export class LogsModel extends ap.ListService{
 *     constructor(apLogger: ap.Logger) {
 *         model = this;
 *         super({
 *             factory: Log,
 *             list: {
 *                 title: 'Logs',
 *                 guid: '{LOG LIST GUID...CHANGE ME}',
 *                 customFields: [
 *                     {staticName: 'Message', objectType: 'Note', mappedName: 'message', readOnly: false},
 *                     {staticName: 'Title', objectType: 'Text', mappedName: 'url', readOnly: false},
 *                     {staticName: 'LogType', objectType: 'Text', mappedName: 'type', readOnly: false},
 *                     {staticName: 'StackTrace', objectType: 'JSON', mappedName: 'stackTrace', readOnly: false},
 *                     {staticName: 'Cause', objectType: 'Text', mappedName: 'cause', readOnly: false},
 *                     {staticName: 'JSON', objectType: 'JSON', mappedName: 'json', readOnly: false},
 *                     {staticName: 'Event', objectType: 'Text', mappedName: 'event', readOnly: false},
 *                     {
 *                         staticName: 'FormattedStackTrace',
 *                         objectType: 'Note',
 *                         mappedName: 'formattedStackTrace',
 *                         readOnly: false,
 *                         description: 'Trace formatted to be readable in email notification.'
 *                     }
 *                 ]
 *             }
 *         });
 *         // Register this model as the list where all logs will be stored
 *         apLogger.subscribe(function (event: ap.ILogEvent) {
 *             // Ensure we keep logging under control, prevents spamming server if loop occurs
 *             if(logCounter < maxLogsPerSesssion) {
 *                 var newLog = model.createEmptyItem(event);
 *                 console.log(newLog);
 *                 newLog.saveChanges();
 *                 logCounter++;
 *             }
 *         });
 *     }
 * }
 *
 * </pre>
 *
 */
/**
 * @ngdoc function
 * @name angularPoint.apLogger.debug
 * @methodOf angularPoint.apLogger
 * @param {string} message Message to log.
 * @param {ILogger} [optionsOverride] Override any log options.
 */
function debug(message, optionsOverride) {
    if (optionsOverride === void 0) { optionsOverride = {}; }
    var logEvent = new LogEvent(optionsOverride, 'debug', message);
    return logEvent.promise;
}
/**
 * @ngdoc function
 * @name angularPoint.apLogger.error
 * @methodOf angularPoint.apLogger
 * @param {string} message Message to log.
 * @param {ILogger} [optionsOverride] Override any log options.
 */
function error(message, optionsOverride) {
    var logEvent = new LogEvent(optionsOverride, 'error', message);
    return logEvent.promise;
}
// declare module ErrorStackParser {
//     export interface parse{
//         (any): string;
//     }
// }
/**
 * @ngdoc function
 * @name angularPoint.apLogger.exception
 * @methodOf angularPoint.apLogger
 * @param {Error} exception Error which caused event.
 * @param {string} [cause] Angular sometimes provides cause.
 * @param {ILogger} optionsOverride Override any log options.
 */
function exception(exception, cause, optionsOverride) {
    var defaults = {
        event: 'exception',
        stackTrace: undefined,
        cause: (cause || '')
    };
    console.info('Need to do something with error', error);
    // try {
    //     // generate a stack trace
    //     /* global ErrorStackParser:true */
    //     var stackTrace = ErrorStackParser.parse(exception);
    //     defaults.stackTrace = stackTrace;
    // } catch (loggingError) {
    //     let notification = 'Error server-side logging failed so unable to generate notification.';
    //     console.warn(notification);
    //     console.log(loggingError);
    //     defaults.stackTrace = notification;
    // }
    error(exception.message, Object.assign({}, defaults, optionsOverride));
}
/**
 * @ngdoc function
 * @name angularPoint.apLogger.info
 * @methodOf angularPoint.apLogger
 * @param {string} message Message to log.
 * @param {ILogger} [optionsOverride] Override any log options.
 */
function info(message, optionsOverride) {
    var logEvent = new LogEvent(optionsOverride, 'info', message);
    return logEvent.promise;
}
/**
 * @ngdoc function
 * @name angularPoint.apLogger.log
 * @methodOf angularPoint.apLogger
 * @param {string} message Message to log.
 * @param {ILogger} [optionsOverride] Override any log options.
 */
function log(message, optionsOverride) {
    var logEvent = new LogEvent(optionsOverride, 'log', message);
    return logEvent.promise;
}
;
function registerEvent(logEvent) {
    eventQueue.push(logEvent);
    processEventQueue();
}
/**
 * @ngdoc function
 * @name angularPoint.apLogger.subscribe
 * @methodOf angularPoint.apLogger
 * @param {Function} callback Register subscription with a callback function that is notified each time an event occurs.
 * @description Callback fired when log event occurs
 */
function subscribe(callback) {
    if (!lodash_1.isFunction(callback)) {
        throw new Error('A callback function was expected but not provided.');
    }
    // only add to subscribers if it not already there
    if (!lodash_1.includes(subscribers, callback)) {
        subscribers.push(callback);
    }
    processEventQueue();
}
/**
 * @ngdoc function
 * @name angularPoint.apLogger.warn
 * @methodOf angularPoint.apLogger
 * @param {string} message Message to log.
 * @param {ILogger} [optionsOverride] Override any log options.
 */
function warn(message, optionsOverride) {
    var logEvent = new LogEvent(optionsOverride, 'warn', message);
    return logEvent.promise;
}
function processEventQueue() {
    // iterate over each subscriber and notify for each event in the queue
    for (var _i = 0, subscribers_1 = subscribers; _i < subscribers_1.length; _i++) {
        var callback = subscribers_1[_i];
        for (var _a = 0, eventQueue_1 = eventQueue; _a < eventQueue_1.length; _a++) {
            var event_1 = eventQueue_1[_a];
            callback(event_1);
        }
    }
}
//# sourceMappingURL=logger.service.js.map