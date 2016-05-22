import { MockConnection } from "@angular/http/testing";
import { User } from "../factories/user.factory";
/**
 * @description Initialize mock backend with required data to
 * resovle mock requests when working offline
 *
 * @export
 * @param {{ [ key: string ]: string }} _mockListsXML GUID as key with xml as string for value
 * @param {User} _mockUser The user that will be used for all mock requests
 * @param {{ [ key: string ]: string }} [_mockServicesXML={}] Optionally specify additional
 * mock services that we'll extend
 */
declare function initializeMockBackend(_mockListsXML: {
    [key: string]: string;
}, _mockUser: User): void;
export { initializeMockBackend, generateMockResponse };
declare function generateMockResponse(mockConnection: MockConnection): void;
