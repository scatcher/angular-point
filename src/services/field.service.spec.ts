import {it, describe, expect} from "@angular/core/testing";
import {getDefaultValueForType} from "./field.service";


describe('Field Service', () => {

    describe('getDefaultValueByFieldType', () => {

        it('should return attachments as empty array', () => {
            var defaultValue = getDefaultValueForType('Attachments');
            expect(defaultValue).toEqual([]);
        });

        it('should return boolean as null', () => {
            var defaultValue = getDefaultValueForType('Boolean');
            expect(defaultValue).toBe(null);
        });

        it('should return datetime as null', () => {
            var defaultValue = getDefaultValueForType('DateTime');
            expect(defaultValue).toBe(null);
        });

        it('should return integer as null', () => {
            var defaultValue = getDefaultValueForType('Integer');
            expect(defaultValue).toBe(null);
        });

        it('should set a JSOn object to an empty string', () => {
            var defaultValue = getDefaultValueForType('JSON');
            expect(defaultValue).toBe('');
        });

        it('should return a undefined parameter as an empty string', () => {
            var defaultValue = getDefaultValueForType(undefined);
            expect(defaultValue).toBe('');
        });

        it('should return a text as an empty string', () => {
            var defaultValue = getDefaultValueForType('Text');
            expect(defaultValue).toBe('');
        });

        it('should set a user to a empty string', () => {
            var defaultValue = getDefaultValueForType('User');
            expect(defaultValue).toEqual('');
        });

        it('should return a multi lookup as an empty array', () => {
            var defaultValue = getDefaultValueForType('LookupMulti');
            expect(defaultValue).toEqual([]);
        });
    });

});