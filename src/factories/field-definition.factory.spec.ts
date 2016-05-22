import {it, describe, expect} from "@angular/core/testing";

import {FieldDefinition, IFieldConfigurationObject} from "./field-definition.factory";
import {ListItem} from '../index';


describe('Field Defintion Factory', () => {

    // describe('Function: getFormattedValue', () => {
    //     it("converts a lookup into a string using default method", () => {
    //         var fieldDefinition = new FieldDefinition(<IFieldConfigurationObject>{ mappedName: 'lookup', objectType: 'Lookup' });
    //         // var listItem = new mockModel.factory({ lookup: { lookupId: 99, lookupValue: 'Bob' } });
    //         expect(fieldDefinition.getFormattedValue(<ListItem<any>>{ lookup: { lookupId: 99, lookupValue: 'Bob' } }))
    //             .toEqual('Bob');
    //     });
    //     it("converts a lookup into a custom string if a override method is included in field definition", () => {
    //         var fieldDefinition = new FieldDefinition(<IFieldConfigurationObject>{
    //             mappedName: 'lookup',
    //             objectType: 'Lookup',
    //             formatter: (listItem, fieldDefinition) => {
    //                 return listItem[fieldDefinition.mappedName].lookupValue.toUpperCase();
    //             }
    //         });
    //         expect(fieldDefinition.getFormattedValue({ lookup: { lookupId: 99, lookupValue: 'Bob' } }))
    //             .toEqual('BOB');
    //     });
    // });
    
});