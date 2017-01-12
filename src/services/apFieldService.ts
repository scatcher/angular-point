let service: FieldService;
let uniqueCount = 0;


/**
 * @ngdoc service
 * @name angularPoint.apFieldService
 * @description
 * Handles the mapping of the various types of fields used within a SharePoint list
 */
export class FieldService {
    fieldTypes;

    constructor() {
        service = this;
        this.fieldTypes = getFieldTypes()
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
    getDefaultValueForType(fieldType: string): any {
        let fieldDefinition = service.getDefinition(fieldType);
        let defaultValue;

        if (fieldDefinition) {
            defaultValue = fieldDefinition.defaultValue;
        }
        return defaultValue;
    }

    /**
     * Returns an object defining a specific field type
     * @param {string} fieldType
     * @returns {object} fieldTypeDefinition
     */
    getDefinition(fieldType) {
        return service.fieldTypes[fieldType] ? service.fieldTypes[fieldType] : service.fieldTypes['Text'];
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
    getMockData(fieldType, options) {
        let mock;
        const fieldDefinition = service.getDefinition(fieldType);
        if (fieldDefinition) {
            // if (_.isFunction(window.Chance) && options && !options.staticValue) {
            //     /** Return dynamic data if ChanceJS is available and flag isn't set requiring static data */
            //     mock = fieldDefinition.dynamicMock(options);
            // } else {
            /** Return static data if the flag is set or ChanceJS isn't available */
            mock = fieldDefinition.staticMock;
            // }
        }
        return mock;
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
    mockPermMask(options?: {permissionLevel: string}) {
        let mask = 'FullMask';
        if (options && options.permissionLevel) {
            mask = options.permissionLevel;
        }
        return service.resolveValueForEffectivePermMask(mask);
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
    resolveValueForEffectivePermMask(perMask) {
        let permissionValue;
        switch (perMask) {
            case 'AddListItems':
                permissionValue = 0x0000000000000002;
                break;
            case 'EditListItems':
                permissionValue = 0x0000000000000004;
                break;
            case 'DeleteListItems':
                permissionValue = 0x0000000000000008;
                break;
            case 'ApproveItems':
                permissionValue = 0x0000000000000010;
                break;
            case 'FullMask':
                permissionValue = 0x7FFFFFFFFFFFFFFF;
                break;
            case 'ViewListItems':
            default:
                permissionValue = 0x0000000000000001;
                break;
        }
        return permissionValue;
    }

}


function getFieldTypes() {
    return {
        Text: {
            defaultValue: '',
            staticMock: 'Test String',
        },
        Note: {
            defaultValue: '',
            staticMock: 'This is a sentence.',
        },
        Boolean: {
            defaultValue: null,
            staticMock: true,
        },
        Calculated: {
            defaultValue: null,
            staticMock: 'float;#123.45',
        },
        Choice: {
            defaultValue: '',
            staticMock: 'My Choice',
        },
        Counter: {
            defaultValue: null,
            staticMock: getUniqueCounter(),
        },
        Currency: {
            defaultValue: null,
            staticMock: 120.50,
        },
        DateTime: {
            defaultValue: null,
            staticMock: new Date(2014, 5, 4, 11, 33, 25),
        },
        Integer: {
            defaultValue: null,
            staticMock: 14,
        },
        JSON: {
            defaultValue: '',
            staticMock: [
                {id: 1, title: 'test'},
                {id: 2}
            ],
        },
        Lookup: {
            defaultValue: '',
            staticMock: {lookupId: 49, lookupValue: 'Static Lookup'},
        },
        LookupMulti: {
            defaultValue: [],
            staticMock: [
                {lookupId: 50, lookupValue: 'Static Multi 1'},
                {lookupId: 51, lookupValue: 'Static Multi 2'}
            ],
        },
        Mask: {
            defaultValue: service.mockPermMask(),
            staticMock: service.mockPermMask(),
        },
        MultiChoice: {
            defaultValue: [],
            staticMock: ['A Good Choice', 'A Bad Choice'],
        },
        User: {
            defaultValue: '',
            staticMock: {lookupId: 52, lookupValue: 'Static User'},
        },
        UserMulti: {
            defaultValue: [],
            staticMock: [
                {lookupId: 53, lookupValue: 'Static User 1'},
                {lookupId: 54, lookupValue: 'Static User 2'}
            ],
        }
    }
}

function getUniqueCounter() {
    uniqueCount++;
    return uniqueCount;
}
