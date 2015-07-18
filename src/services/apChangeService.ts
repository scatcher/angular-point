/// <reference path="../app.module.ts" />

module ap {
    'use strict';

    interface IUpdateOptions<T extends ListItem<any>>{
        batchCmd: string;
        buildValuePairs:boolean;
        ID: number;
        listName: string;
        operation: string;
        target: IndexedCache<T>;
        valuePairs: string[][];
        webURL: string;
    }

    export interface IChangeServiceCallback{
        (entity: ListItem<any>, options: IUpdateOptions<any>, promise: ng.IPromise<any>): void
    }

    /**
     * @ngdoc service
     * @name apChangeService
     * @description
     * Primarily used for apMockBackend so we can know what to expect before an attempt to update a list
     * item is intercepted.
     */
    export class ChangeService {
        callbackQueue: IChangeServiceCallback[] = [];
        registerListItemUpdate<T extends ListItem<any>>(entity: T, options: IUpdateOptions<T>, promise: ng.IPromise<T>) {
            _.each(this.callbackQueue, (callback) => {
                callback(entity, options, promise);
            });
        }
        subscribeToUpdates(callback: IChangeServiceCallback ) {
            this.callbackQueue.push(callback);
        }
    }

    angular
        .module('angularPoint')
        .service('apChangeService', ChangeService);

}
