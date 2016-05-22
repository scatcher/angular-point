export const GetView = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <soap:Body>
        <GetViewResponse xmlns="http://schemas.microsoft.com/sharepoint/soap/">
            <GetViewResult>
                <View Name="{FA418C01-BEAC-4C79-B8A3-7C33479D4A75}" DefaultView="TRUE" MobileView="TRUE"
                      MobileDefaultView="TRUE" Type="HTML" DisplayName="All Items" Url="Lists/MockList/AllItems.aspx"
                      Level="1" BaseViewID="1" ContentTypeID="0x" ImageUrl="/_layouts/images/generic.png">
                    <Query>
                        <OrderBy>
                            <FieldRef Name="ID"/>
                        </OrderBy>
                    </Query>
                    <ViewFields>
                        <FieldRef Name="Attachments"/>
                        <FieldRef Name="LinkTitle"/>
                        <FieldRef Name="Boolean"/>
                        <FieldRef Name="Currency"/>
                        <FieldRef Name="Date"/>
                        <FieldRef Name="DateTime"/>
                        <FieldRef Name="Integer"/>
                        <FieldRef Name="JSON"/>
                        <FieldRef Name="Lookup"/>
                        <FieldRef Name="LookupMulti"/>
                        <FieldRef Name="User"/>
                        <FieldRef Name="UserMulti"/>
                        <FieldRef Name="Calculated"/>
                        <FieldRef Name="Choice"/>
                        <FieldRef Name="MultiChoice"/>
                        <FieldRef Name="HTML"/>
                        <FieldRef Name="Note"/>
                        <FieldRef Name="Float"/>
                        <FieldRef Name="Hyperlink"/>
                        <FieldRef Name="Picture"/>
                    </ViewFields>
                    <RowLimit Paged="TRUE">30</RowLimit>
                </View>
            </GetViewResult>
        </GetViewResponse>
    </soap:Body>
</soap:Envelope>`;
