export const GetListItemChangesSinceToken_Add = `<?xml version="1.0" encoding="utf-8"?>
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
                    <Changes LastChangeToken="1;3;f5345fe7-2f7c-49f7-87d0-dbfebdd0ce61;635453547053600000;387814">
                    </Changes>
                    <rs:data ItemCount="1">
                        <z:row ows_ID='3' ows_Modified='2014-09-03 11:25:05' ows_Created='2014-09-02 08:18:48'
                               ows_Author='338;#John Smith' ows_Editor='338;#John Smith'
                               ows_PermMask='0x7fffffffffffffff'
                               ows_UniqueId='3;#{573C8003-CA9B-432C-8BF0-87307D405DB6}'
                               ows_Title='&lt; and &amp;#39; but test&quot;' ows_Boolean='1'
                               ows_Calculated='string;#&lt; and &amp;#39; but test&quot;' ows_Choice='Option 2'
                               ows_MultiChoice=';#Defined Choice 3;#' ows_Currency='15.0000000000000'
                               ows_Date='2014-09-02 00:00:00' ows_DateTime='2014-09-15 00:00:00'
                               ows_Integer='10.0000000000000' ows_Float='2323.00000000000'
                               ows_HTML='&lt;div class=&quot;ExternalClass2C9092BA5AA9461C982203E185D2CD9C&quot;&gt;&lt;p&gt;Text in an HTML box.​&lt;/p&gt;&lt;/div&gt;'
                               ows_JSON='{&quot;test&quot;: 12}' ows_Lookup='1;#Lookup 1' ows_LookupMulti='3;#Lookup 3'
                               ows_Note='&lt;div&gt;Notes in a notes box.&lt;/div&gt;' ows_User='205;#Chad Johnson'
                               ows_UserMulti='' ows_Hyperlink='http://www.yahoo.com, Yahoo' ows_Attachments='0'
                               ows__ModerationStatus='0' ows__Level='1' ows_FSObjType='3;#0' ows_owshiddenversion='5'
                               ows_FileRef='3;#OneAppData/Lists/MockList/3_.000'/>
                    </rs:data>
                </listitems>
            </GetListItemChangesSinceTokenResult>
        </GetListItemChangesSinceTokenResponse>
    </soap:Body>
</soap:Envelope>`;
