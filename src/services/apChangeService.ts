/// <reference path="../app.module.ts" />

module ap {
    'use strict';
    
    interface IUpdateOptions<T>{
        batchCmd: string;
        buildValuePairs:boolean;
        ID: number;
        listName: string;
        operation: string;
        target: IndexedCache<T>;
        valuePairs: string[][];
        webURL: string;
    }

    /**
     * @ngdoc service
     * @name apChangeService
     * @description
     * Primarily used for apMockBackend so we can know what to expect before an attempt to update a list
     * item is intercepted.
     */
    export class ChangeService {
        callbackQueue = [];
        registerListItemUpdate<T>(entity: ListItem<T>, options: IUpdateOptions<T>, promise: ng.IPromise<ListItem<T>>) {
            _.each(this.callbackQueue, (callback) => {
                callback(entity, options, promise);
            });
        }
        subscribeToUpdates(callback: (entity: ListItem<any>, options: IUpdateOptions<any>, promise: ng.IPromise<any>) => void ) {
            this.callbackQueue.push(callback);
        }
    }

    angular
        .module('angularPoint')
        .service('apChangeService', ChangeService);

}
