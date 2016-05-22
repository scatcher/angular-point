export const GetListItemChangesSinceToken_Delete = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <soap:Body>
        <GetListItemChangesSinceTokenResponse xmlns="http://schemas.microsoft.com/sharepoint/soap/">
            <GetListItemChangesSinceTokenResult>
                <listitems MinTimeBetweenSyncs='0' RecommendedTimeBetweenSyncs='180' MaxBulkDocumentSyncSize='500'
                           AlternateUrls='http://sharepoint.company-server.com/,https://sharepoint.company-server.com/'
                           EffectivePermMask='FullMask' xmlns:s='uuid:BDC6E3F0-6DA3-11d1-A2A3-00AA00C14882'
                           xmlns:dt='uuid:C2F41010-65B3-11d1-A29F-00AA00C14882'
                           xmlns:rs='urn:schemas-microsoft-com:rowset'
                           xmlns:z='#RowsetSchema'>
                    <Changes LastChangeToken="1;3;f5345fe7-2f7c-49f7-87d0-dbfebdd0ce61;635453527045400000;387809">
                        <Id ChangeType="Delete" UniqueId="{DA3FA45D-D874-4C73-AAE5-61556D3E3A79}">1</Id>
                    </Changes>
                    <rs:data ItemCount="0">
                    </rs:data>
                </listitems>
            </GetListItemChangesSinceTokenResult>
        </GetListItemChangesSinceTokenResponse>
    </soap:Body>
</soap:Envelope>`;
