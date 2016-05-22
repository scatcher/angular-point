import { ListItem } from '../factories';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export interface IUpdateOptions<T extends ListItem<any>> {
    batchCmd: string;
    buildValuePairs: boolean;
    ID: number;
    listName: string;
    operation: string;
    valuePairs: string[][];
    webURL: string;
}
export interface IListItemUpdate {
    listItem: ListItem<any>;
    options: IUpdateOptions<any>;
}
/**
 * @ngdoc service
 * @name apChangeService
 * @description
 * Primarily used by mock backend so we can know what to expect before an attempt to update a list
 * item is intercepted.
 */
declare let listItemUpdateStream$: BehaviorSubject<IListItemUpdate>;
export { listItemUpdateStream$, registerListItemUpdate };
declare function registerListItemUpdate<T extends ListItem<any>>(listItem: ListItem<T>, options: IUpdateOptions<T>): void;
