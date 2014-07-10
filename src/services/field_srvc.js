'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apFieldService
 * @description
 * Handles the mapping of the various types of fields used within a SharePoint list
 * @requires angularPoint.apUtilityService
 */
angular.module('angularPoint')
    .service('apFieldService', function (apUtilityService) {

        var getUniqueCounter = function () {
            var self = getUniqueCounter;
            self.count = self.count || 0;
            self.count++;
            return self.count;
        };

        function randomBoolean() {
            return chance.bool();
        }

        function randomString(len) {
            return chance.word() + ' ' + chance.word();
        }

        function randomParagraph() {
            return chance.paragraph();
        }

        function randomCurrency() {
            return parseInt(_.random(10000000, true) * 100) / 100;
        }

        function randomDate() {
            return chance.date();
        }

        function randomInteger() {
            return chance.integer();
        }

        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:resolveValueForEffectivePermMask
         * @methodOf angularPoint.apFieldService
         * @description
         * Takes the name of a permission mask and returns a permission value which can then be used
         * to generate a permission object using modelService.resolvePermissions(outputfromthis)
         * @param {string} perMask Options:
         *  - AddListItems
         *  - EditListItems
         *  - DeleteListItems
         *  - ApproveItems
         *  - FullMask
         *  - ViewListItems
         * @returns {string} value
         */
        function resolveValueForEffectivePermMask(perMask) {
            var permissionValue;
            switch(perMask) {
                case 'AddListItems':
                    permissionValue = '0x0000000000000002';
                    break;
                case 'EditListItems':
                    permissionValue = '0x0000000000000004';
                    break;
                case 'DeleteListItems':
                    permissionValue = '0x0000000000000008';
                    break;
                case 'ApproveItems':
                    permissionValue = '0x0000000000000010';
                    break;
                case 'FullMask':
                    permissionValue = '0x7FFFFFFFFFFFFFFF';
                    break;
                case 'ViewListItems':
                default:
                    permissionValue = '0x0000000000000001';
                    break;
            }
            return permissionValue;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:mockPermMask
         * @methodOf angularPoint.apFieldService
         * @description
         * Defaults to a full mask but allows simulation of each of main permission levels
         * @param {object} [options] Options container.
         * @param {string} [options.permissionLevel=FullMask] Optional mask.
         * @returns {string} Values for mask.
         */
        function mockPermMask(options) {
            var mask = 'FullMask';
            if(options && options.permissionLevel) {
                mask = options.permissionLevel;
            }
            return resolveValueForEffectivePermMask(mask);
        }

        function randomLookup() {
            return {
                lookupId: getUniqueCounter(),
                lookupValue: chance.word()
            };
        }

        function randomUser() {
            return {
                lookupId: getUniqueCounter(),
                lookupValue: chance.name()
            };
        }

        function randomLookupMulti() {
            var mockData = [];
            _.each(_.random(10), function () {
                mockData.push(randomLookup());
            });
            return mockData;
        }

        function randomUserMulti() {
            var mockData = [];
            _.each(_.random(10), function () {
                mockData.push(randomUser());
            });
            return mockData;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:Field
         * @methodOf angularPoint.apFieldService
         * @description
         * Decorates field with optional defaults
         * @param {object} obj Field definition.
         * @returns {object} Field
         * @constructor
         */
        function Field(obj) {
            var self = this;
            var defaults = {
                readOnly: false,
                objectType: 'Text'
            };
            _.extend(self, defaults, obj);
            self.displayName = self.displayName || apUtilityService.fromCamelCase(self.mappedName);
        }

        Field.prototype.getDefinition = function () {
            return getDefinition(this.objectType);
        };

        Field.prototype.getDefaultValueForType = function () {
            return getDefaultValueForType(this.objectType);
        };

        Field.prototype.getMockData = function (options) {
            return getMockData(this.objectType, options);
        };

        /** Field types used on the models to create a field definition */
        var fieldTypes = {
            Text: {defaultValue: '', staticMock: 'Test String', dynamicMock: randomString},
            TextLong: {defaultValue: '', staticMock: 'This is a sentence.', dynamicMock: randomParagraph},
            Boolean: { defaultValue: null, staticMock: true, dynamicMock: randomBoolean },
            Counter: { defaultValue: null, staticMock: getUniqueCounter(), dynamicMock: getUniqueCounter },
            Currency: { defaultValue: null, staticMock: 120.50, dynamicMock: randomCurrency },
            DateTime: { defaultValue: null, staticMock: new Date(2014, 5, 4, 11, 33, 25), dynamicMock: randomDate },
            Integer: { defaultValue: null, staticMock: 14, dynamicMock: randomInteger },
            JSON: { defaultValue: '', staticMock: [
                {id: 1, title: 'test'},
                {id: 2}
            ], dynamicMock: randomString },
            Lookup: { defaultValue: '', staticMock: {lookupId: 49, lookupValue: 'Static Lookup'}, dynamicMock: randomLookup },
            LookupMulti: { defaultValue: [], staticMock: [
                {lookupId: 50, lookupValue: 'Static Multi 1'},
                {lookupId: 51, lookupValue: 'Static Multi 2'}
            ], dynamicMock: randomLookupMulti },
            Mask: { defaultValue: mockPermMask(), staticMock: mockPermMask(), dynamicMock: mockPermMask },
            User: { defaultValue: '', staticMock: {lookupId: 52, lookupValue: 'Static User'}, dynamicMock: randomUser },
            UserMulti: { defaultValue: [], staticMock: [
                {lookupId: 53, lookupValue: 'Static User 1'},
                {lookupId: 54, lookupValue: 'Static User 2'}
            ], dynamicMock: randomUserMulti }
        };

        /**
         * Returns an object defining a specific field type
         * @param {string} fieldType
         * @returns {object} fieldTypeDefinition
         */
        function getDefinition(fieldType) {
            return fieldTypes[fieldType];
        }

        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:getDefaultValueForType
         * @methodOf angularPoint.apFieldService
         * @description
         * Returns the empty value expected for a field type
         * @param {string} fieldType Type of field.
         * @returns {*} Default value based on field type.
         */
        function getDefaultValueForType(fieldType) {
            var fieldDefinition = getDefinition(fieldType), defaultValue;
            if (fieldDefinition) {
                defaultValue = fieldDefinition.defaultValue;
            }
            return defaultValue;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:getMockData
         * @methodOf angularPoint.apFieldService
         * @description
         * Can return mock data appropriate for the field type, by default it dynamically generates data but
         * the staticValue param will instead return a hard coded type specific value
         *
         * @requires ChanceJS to produce dynamic data.
         * https://github.com/victorquinn/chancejs
         * @param {string} fieldType Field type from the field definition.
         * @param {object} [options] Optional params.
         * @param {boolean} [options.staticValue=false] Default to dynamically build mock data.
         * @returns {*} mockData
         */
        function getMockData(fieldType, options) {
            var mock;
            var fieldDefinition = getDefinition(fieldType);
            if (fieldDefinition) {
                //Return static data if the flag is set or ChanceJS isn't available
                mock = (options && (options.staticValue || !_.isFunction(chance))) ? fieldDefinition.staticMock : fieldDefinition.dynamicMock(options);
            }
            return mock;
        }

        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:defaultFields
         * @methodOf angularPoint.apFieldService
         * @description
         * Read only fields that should be included in all lists
         */
        var defaultFields = [
            { internalName: 'ID', objectType: 'Counter', mappedName: 'id', readOnly: true},
            { internalName: 'Modified', objectType: 'DateTime', mappedName: 'modified', readOnly: true},
            { internalName: 'Created', objectType: 'DateTime', mappedName: 'created', readOnly: true},
            { internalName: 'Author', objectType: 'User', mappedName: 'author', readOnly: true},
            { internalName: 'Editor', objectType: 'User', mappedName: 'editor', readOnly: true},
            { internalName: 'PermMask', objectType: 'Mask', mappedName: 'permMask', readOnly: true},
            { internalName: 'UniqueId', objectType: 'String', mappedName: 'uniqueId', readOnly: true}
        ];

        /**
         * @ngdoc function
         * @name angularPoint.apFieldService:extendFieldDefinitions
         * @methodOf angularPoint.apFieldService
         * @description
         * 1. Populates the fields array which uses the Field constructor to combine the default
         * SharePoint fields with those defined in the list definition on the model
         * 2. Creates the list.viewFields XML string that defines the fields to be requested on a query
         *
         * @param {object} list Reference to the list within a model.
         */
        function extendFieldDefinitions(list) {
            /**
             * Constructs the field
             * - adds to viewField
             * - create ows_ mapping
             * @param fieldDefinition
             */
            var buildField = function (fieldDefinition) {
                var field = new Field(fieldDefinition);
                list.fields.push(field);
                list.viewFields += '<FieldRef Name="' + field.internalName + '"/>';
                list.mapping['ows_' + field.internalName] = { mappedName: field.mappedName, objectType: field.objectType };
            };

            /** Open viewFields */
            list.viewFields += '<ViewFields>';

            /** Add the default fields */
            _.each(defaultFields, function (field) {
                buildField(field);
            });

            /** Add each of the fields defined in the model */
            _.each(list.customFields, function (field) {
                buildField(field);
            });

            /** Close viewFields */
            list.viewFields += '</ViewFields>';
        }
        
        return{
            defaultFields: defaultFields,
            extendFieldDefinitions: extendFieldDefinitions,
            getDefaultValueForType: getDefaultValueForType,
            getMockData: getMockData,
            getDefinition: getDefinition,
            mockPermMask: mockPermMask,
            resolveValueForEffectivePermMask: resolveValueForEffectivePermMask
        };

    });
