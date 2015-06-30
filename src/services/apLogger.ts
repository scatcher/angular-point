/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    var deferred: ng.IDeferred<Function>,
        registerCallback: ng.IPromise<Function>;

    var logTypes = ['log', 'error', 'info', 'debug', 'warn'];

    export interface ILogEvent {
        cause?: string;
        event?: string;
        json?: Object;
        message?: string;
        stackTrace?: string[];
        type?: string;
        url?: string;
    }

    export interface ILogger {
        debug(message: string, optionsOverride?: ILogEvent): ng.IPromise<ListItem<any>>;
        error(message: string, optionsOverride?: ILogEvent): ng.IPromise<ListItem<any>>;
        exception(exception, cause?, optionsOverride?: ILogEvent): void;
        info(message: string, optionsOverride?: ILogEvent): ng.IPromise<ListItem<any>>;
        log(message: string, optionsOverride?: ILogEvent): ng.IPromise<ListItem<any>>;
        registerEvent(event: ILogEvent): ng.IPromise<ListItem<any>>;
        subscribe(callback: Function): void;
        warn(message: string, optionsOverride?: ILogEvent): ng.IPromise<ListItem<any>>;
    }

    export class Logger implements ILogger {

        /**
         * @ngdoc function
         * @name apLogger.debug
         * @methodOf apLogger
         * @param {string} message Message to log.
         * @param {ILogger} [optionsOverride] Override any log options.
         */
        debug: (message: string, optionsOverride?: ILogEvent) => ng.IPromise<ListItem<any>>;

        /**
         * @ngdoc function
         * @name apLogger.error
         * @methodOf apLogger
         * @param {string} message Message to log.
         * @param {ILogger} [optionsOverride] Override any log options.
         */
        error: (message: string, optionsOverride?: ILogEvent) => ng.IPromise<ListItem<any>>;

        /**
         * @ngdoc function
         * @name apLogger.info
         * @methodOf apLogger
         * @param {string} message Message to log.
         * @param {ILogger} [optionsOverride] Override any log options.
         */
        info: (message: string, optionsOverride?: ILogEvent) => ng.IPromise<ListItem<any>>;

        /**
         * @ngdoc function
         * @name apLogger.log
         * @methodOf apLogger
         * @param {string} message Message to log.
         * @param {ILogger} [optionsOverride] Override any log options.
         */
        log: (message: string, optionsOverride?: ILogEvent) => ng.IPromise<ListItem<any>>;

        /**
         * @ngdoc function
         * @name apLogger.warn
         * @methodOf apLogger
         * @param {string} message Message to log.
         * @param {ILogger} [optionsOverride] Override any log options.
         */
        warn: (message: string, optionsOverride?: ILogEvent) => ng.IPromise<ListItem<any>>;

        static $inject = ['$q', '$window', '$log', '$timeout'];

        constructor($q, private $window, private $log, private $timeout) {
            /** Create a deferred object we can use to delay functionality until log model is registered */
            deferred = $q.defer();
            registerCallback = deferred.promise;

            /** Generate a method for each logger call */
            _.each(logTypes, (logType) => {

                /**
                 * @Example
                 *
                 * info(message: string, optionsOverride?: ILogEvent): ng.IPromise<ListItem<any>> {
                 *     var opts = _.assign({}, {
                 *         message: message,
                 *         type: 'info'
                 *         url: $window.location.href,
                 *     }, optionsOverride);
                 *
                 *     return this.notify(opts);
                 * }
                 *
                 */

                this[logType] = (message: string, optionsOverride?: ILogEvent): ng.IPromise<ListItem<any>> => {
                    var opts = _.assign({}, {
                        message: message,
                        type: logType,
                    }, optionsOverride);

                    return this.notify(opts);
                }

            });
        }

        /**
         * @ngdoc function
         * @name apLogger.exception
         * @methodOf apLogger
         * @param {Error} exception Error which caused event.
         * @param {string} [cause] Angular sometimes provides cause.
         * @param {ILogger} optionsOverride Override any log options.
         */
        exception(exception: Object, cause?, optionsOverride?: ILogEvent): void {

            try {
                var errorMessage = exception.toString();
                // generate a stack trace
                /* global printStackTrace:true */
                var stackTrace = printStackTrace({e: exception});

                this.error(errorMessage, _.assign({}, {
                    event: 'exception',
                    stackTrace: stackTrace,
                    cause: ( cause || "")
                }, optionsOverride));

            } catch (loggingError) {
                this.$log.warn("Error server-side logging failed");
                this.$log.log(loggingError);
            }

        }

        private notify(options: ILogEvent) {
            return this.$timeout(() => {
                /** Allow navigation to settle before capturing url */
                return this.registerEvent(_.assign({}, {url: this.$window.location.href}, options));
            }, 0);
        }

        registerEvent(logEvent: ILogEvent): ng.IPromise<ListItem<any>> {
            return registerCallback.then((callback: Function) => {
                if (_.isFunction(callback)) {
                    return callback(logEvent);
                }
            });
        }

        /**
         * @ngdoc function
         * @name apLogger.subscribe
         * @methodOf apLogger
         * @param {Function} callback Callend when event occurs.
         * @description Callback fired when log event occurs
         */
        subscribe(callback: Function): void {
            deferred.resolve(callback);
        }

    }


    /**
     * @ngdoc service
     * @name apLogger
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
     *         _.assign(this, obj);
     *         // Create a formatted representation of the stacktrace to display in email notification
     *         if(this.stackTrace && !this.formattedStackTrace) {
     *             this.formattedStackTrace = '';
     *             _.each(this.stackTrace, (traceEntry) => {
     *                 this.formattedStackTrace += `${traceEntry}
     *             `;
     *             });
     *         }
     *     }
     * }
     * var logCounter = 0;
     * var maxLogsPerSesssion = 5;
     * export class LogsModel extends ap.Model{
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
    angular
        .module('angularPoint')
        .service('apLogger', Logger);

}
