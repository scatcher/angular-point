export const GetVersionCollection = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <soap:Body>
        <GetVersionCollectionResponse xmlns="http://schemas.microsoft.com/sharepoint/soap/">
            <GetVersionCollectionResult>
                <Versions>
                    <Version Integer="10" Modified="2014-09-03T15:00:56Z"
                             Editor="123;#Bill Doe,#DEV\\bill.doe,#user@email.com,#,#Bill Doe"/>
                    <Version Integer="11" Modified="2014-09-02T22:46:09Z"
                             Editor="100;#Jane Johnson,#DEV\\jane.johnson,#user@email.com,#,#Jane Johnson"/>
                    <!--The value didn't change in this version so we can test ListItem.getChangeSummary-->
                    <Version Integer="11" Modified="2014-09-02T23:20:00Z"
                             Editor="100;#Jane Johnson,#DEV\\jane.johnson,#user@email.com,#,#Jane Johnson"/>
                    <Version Integer="12" Modified="2014-09-02T13:35:57Z"
                             Editor="338;#John Smith,#DEV\\john.smith,#user@email.com,#,#John Smith"/>
                </Versions>
            </GetVersionCollectionResult>
        </GetVersionCollectionResponse>
    </soap:Body>
</soap:Envelope>`;
