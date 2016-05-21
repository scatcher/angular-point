"use strict";
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
/**
 * @ngdoc service
 * @name apChangeService
 * @description
 * Primarily used by mock backend so we can know what to expect before an attempt to update a list
 * item is intercepted.
 */
var listItemUpdateStream$ = new BehaviorSubject_1.BehaviorSubject(null);
exports.listItemUpdateStream$ = listItemUpdateStream$;
function registerListItemUpdate(listItem, options) {
    listItemUpdateStream$.next({ listItem: listItem, options: options });
}
exports.registerListItemUpdate = registerListItemUpdate;
// function subscribeToUpdates(callback: IListItemUpdate) {
//     listItemUpdateStream$.push(callback);
// }
//# sourceMappingURL=change.service.js.map