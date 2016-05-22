import {SPServicesOptions} from '../services/spservices.service';
import {wrapNode} from '../services/encode.service';
import {each, isArray} from 'lodash';

export interface ISOAPEnvelope {
    addToPayload(opt: SPServicesOptions, paramArray: {name: string, sendNull: boolean}[]): void;
    addToPayload(opt: SPServicesOptions, paramArray: [string, string][]): void;
    addToPayload(opt: SPServicesOptions, paramArray: [string, string][]): void;
    addToPayload(opt: SPServicesOptions, paramArray: any): void;
}

// Set up SOAP envelope
export class SOAPEnvelope implements ISOAPEnvelope {
    opheader: string;
    opfooter: string;
    header = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body>`;
    footer = `</soap:Body></soap:Envelope>`;
    payload = '';
    // Add the option values to the soapEnvelope.payload for the operation
    //  opt = options for the call
    //  paramArray = an array of option names to add to the payload
    //      "paramName" if the parameter name and the option name match
    //      ["paramName", "optionName"] if the parameter name and the option name are different (this handles early "wrappings" with inconsistent naming)
    //      {name: "paramName", sendNull: false} indicates the element is marked as "add to payload only if non-null"
    addToPayload(opt, paramArray) {
       each(paramArray, (param, index: number) => {
            // the parameter name and the option name match
            if (typeof param === 'string') {
                this.payload += wrapNode(param, opt[param]);
                // the parameter name and the option name are different
            } else if (isArray(param) && param.length === 2) {
                this.payload += wrapNode(param[0], opt[param[1]]);
                // the element not a string or an array and is marked as "add to payload only if non-null"
            } else if ((typeof param === 'object') && (param.sendNull !== undefined)) {
                this.payload += ((opt[param.name] === undefined) || (opt[param.name].length === 0)) ? '' : wrapNode(param.name, opt[param.name]);
                // something isn't right, so report it
            } else {
                console.error(opt.operation, 'paramArray[' + index + ']: ' + param, 'Invalid paramArray element passed to addToPayload()');
            }
        });
    }
}
