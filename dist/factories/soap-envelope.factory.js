"use strict";
var encode_service_1 = require('../services/encode.service');
var lodash_1 = require('lodash');
// Set up SOAP envelope
var SOAPEnvelope = (function () {
    function SOAPEnvelope() {
        this.header = "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Body>";
        this.footer = "</soap:Body></soap:Envelope>";
        this.payload = '';
    }
    // Add the option values to the soapEnvelope.payload for the operation
    //  opt = options for the call
    //  paramArray = an array of option names to add to the payload
    //      "paramName" if the parameter name and the option name match
    //      ["paramName", "optionName"] if the parameter name and the option name are different (this handles early "wrappings" with inconsistent naming)
    //      {name: "paramName", sendNull: false} indicates the element is marked as "add to payload only if non-null"
    SOAPEnvelope.prototype.addToPayload = function (opt, paramArray) {
        var _this = this;
        lodash_1.each(paramArray, function (param, index) {
            // the parameter name and the option name match
            if (typeof param === 'string') {
                _this.payload += encode_service_1.wrapNode(param, opt[param]);
            }
            else if (lodash_1.isArray(param) && param.length === 2) {
                _this.payload += encode_service_1.wrapNode(param[0], opt[param[1]]);
            }
            else if ((typeof param === 'object') && (param.sendNull !== undefined)) {
                _this.payload += ((opt[param.name] === undefined) || (opt[param.name].length === 0)) ? '' : encode_service_1.wrapNode(param.name, opt[param.name]);
            }
            else {
                console.error(opt.operation, 'paramArray[' + index + ']: ' + param, 'Invalid paramArray element passed to addToPayload()');
            }
        });
    };
    return SOAPEnvelope;
}());
exports.SOAPEnvelope = SOAPEnvelope;
//# sourceMappingURL=soap-envelope.factory.js.map