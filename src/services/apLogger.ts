/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    var deferred: ng.IDeferred<Function>,
        registerCallback: ng.IPromise<Function>;

    export interface ILogEvent {
        cause?: string;
        event?: string;
        json?: Object;
        message?: string;
        stackTrace?: string[];
        type?: string;
        // initial URL and URL after and routing has settled
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
        static $inject = ['$q', '$window', '$log', '$timeout'];

        constructor($q, private $window, private $log, private $timeout) {
            /** Create a deferred object we can use to delay functionality until log model is registered */
            deferred = $q.defer();
            registerCallback = deferred.promise;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apLogger.debug
         * @methodOf angularPoint.apLogger
         * @param {string} message Message to log.
         * @param {ILogger} [optionsOverride] Override any log options.
         */
        debug(message: string, optionsOverride?: ILogEvent): ng.IPromise<ListItem<any>> {
            let opts = _.assign({
                message: message,
                type: 'debug'
            }, optionsOverride);

            return this.notify(opts);
        };

        /**
         * @ngdoc function
         * @name angularPoint.apLogger.error
         * @methodOf angularPoint.apLogger
         * @param {string} message Message to log.
         * @param {ILogger} [optionsOverride] Override any log options.
         */
        error(message: string, optionsOverride?: ILogEvent): ng.IPromise<ListItem<any>> {
            let opts = _.assign({
                message: message,
                type: 'error'
            }, optionsOverride);

            return this.notify(opts);
        };

        /**
         * @ngdoc function
         * @name angularPoint.apLogger.exception
         * @methodOf angularPoint.apLogger
         * @param {Error} exception Error which caused event.
         * @param {string} [cause] Angular sometimes provides cause.
         * @param {ILogger} optionsOverride Override any log options.
         */
        exception(exception: Error, cause?, optionsOverride?: ILogEvent): void {
            try {
                // generate a stack trace
                /* global ErrorStackParser:true */
                var stackTrace = ErrorStackParser.parse(exception);

                this.error(exception.message, _.assign({}, {
                    event: 'exception',
                    stackTrace: stackTrace,
                    cause: (cause || '')
                }, optionsOverride));

            } catch (loggingError) {
                this.$log.warn('Error server-side logging failed');
                this.$log.log(loggingError);
            }

        }

        /**
         * @ngdoc function
         * @name angularPoint.apLogger.info
         * @methodOf angularPoint.apLogger
         * @param {string} message Message to log.
         * @param {ILogger} [optionsOverride] Override any log options.
         */
        info(message: string, optionsOverride?: ILogEvent): ng.IPromise<ListItem<any>> {
            let opts = _.assign({
                message: message,
                type: 'info'
            }, optionsOverride);

            return this.notify(opts);
        };

        /**
         * @ngdoc function
         * @name angularPoint.apLogger.log
         * @methodOf angularPoint.apLogger
         * @param {string} message Message to log.
         * @param {ILogger} [optionsOverride] Override any log options.
         */
        log(message: string, optionsOverride?: ILogEvent): ng.IPromise<ListItem<any>> {
            let opts = _.assign({
                message: message,
                type: 'log'
            }, optionsOverride);

            return this.notify(opts);
        };

        registerEvent(logEvent: ILogEvent): ng.IPromise<ListItem<any>> {
            return registerCallback.then((callback: Function) => {
                if (_.isFunction(callback)) {
                    return callback(logEvent);
                }
            });
        }

        /**
         * @ngdoc function
         * @name angularPoint.apLogger.subscribe
         * @methodOf angularPoint.apLogger
         * @param {Function} callback Callend when event occurs.
         * @description Callback fired when log event occurs
         */
        subscribe(callback: Function): void {
            deferred.resolve(callback);
        }

        /**
         * @ngdoc function
         * @name angularPoint.apLogger.warn
         * @methodOf angularPoint.apLogger
         * @param {string} message Message to log.
         * @param {ILogger} [optionsOverride] Override any log options.
         */
        warn(message: string, optionsOverride?: ILogEvent): ng.IPromise<ListItem<any>> {
            let opts = _.assign({
                message: message,
                type: 'warn'
            }, optionsOverride);

            return this.notify(opts);
        };

        private notify(options: ILogEvent) {
            // url before navigation
            let url = '1: ' + this.$window.location.href + '\n';
            return this.$timeout(() => {
                /** Allow navigation to settle before capturing 2nd url */
                url += '2: ' + this.$window.location.href;
                return this.registerEvent(_.assign({}, {url}, options));
            }, 100);
        }

    }


    /**
     * @ngdoc service
     * @name angularPoint.apLogger
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
