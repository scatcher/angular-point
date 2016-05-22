import { SPServicesOptions } from '../services/spservices.service';
export interface ISOAPEnvelope {
    addToPayload(opt: SPServicesOptions, paramArray: {
        name: string;
        sendNull: boolean;
    }[]): void;
    addToPayload(opt: SPServicesOptions, paramArray: [string, string][]): void;
    addToPayload(opt: SPServicesOptions, paramArray: [string, string][]): void;
    addToPayload(opt: SPServicesOptions, paramArray: any): void;
}
export declare class SOAPEnvelope implements ISOAPEnvelope {
    opheader: string;
    opfooter: string;
    header: string;
    footer: string;
    payload: string;
    addToPayload(opt: any, paramArray: any): void;
}
