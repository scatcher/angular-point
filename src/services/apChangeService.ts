import {IndexedCache, ListItem} from '../factories';
import {Promise} from 'es6-promise';
import  * as  _ from 'lodash';

export interface IUpdateOptions<T extends ListItem<any>> {
    batchCmd: string;
    buildValuePairs: boolean;
    ID: number;
    listName: string;
    operation: string;
    target: IndexedCache<T>;
    valuePairs: string[][];
    webURL: string;
}

export interface IChangeServiceCallback {
    (entity: ListItem<any>, options: IUpdateOptions<any>, promise: Promise<any>): void;
}

/**
 * @ngdoc service
 * @name apChangeService
 * @description
 * Primarily used for apMockBackend so we can know what to expect before an attempt to update a list
 * item is intercepted.
 */
export class ChangeServiceClass {
    callbackQueue: IChangeServiceCallback[] = [];

    registerListItemUpdate<T extends ListItem<any>>(entity: ListItem<T>, options: IUpdateOptions<T>, promise: Promise<ListItem<T>>) {
        _.each(this.callbackQueue, (callback: IChangeServiceCallback) => {
            callback(entity, options, promise);
        });
    }

    subscribeToUpdates(callback: IChangeServiceCallback) {
        this.callbackQueue.push(callback);
    }
}

export let ChangeService = new ChangeServiceClass();

