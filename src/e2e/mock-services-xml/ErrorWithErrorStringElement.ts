export const ErrorWithErrorStringElement = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <soap:Body>
        <soap:Fault>
            <faultcode>soap:Server</faultcode>
            <faultstring>Exception of type 'Microsoft.SharePoint.SoapServer.SoapServerException' was thrown.
            </faultstring>
            <detail>
                <errorstring xmlns="http://schemas.microsoft.com/sharepoint/soap/">Parameter Url is missing or
                    invalid.
                </errorstring>
                <errorcode xmlns="http://schemas.microsoft.com/sharepoint/soap/">0x82000001</errorcode>
            </detail>
        </soap:Fault>
    </soap:Body>
</soap:Envelope>`;
