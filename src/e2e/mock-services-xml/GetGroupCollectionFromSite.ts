export const GetGroupCollectionFromSite = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <GetGroupCollectionFromSiteResponse xmlns="http://schemas.microsoft.com/sharepoint/soap/directory/">
            <GetGroupCollectionFromSiteResult>
                <GetGroupCollectionFromSite>
                    <Groups>
                        <Group ID="481" Name="Acting Managers"
                               Description="Members of this group have been designated as an Acting Manager and therefore have similar permissions."
                               OwnerID="433" OwnerIsUser="False"/>
                        <Group ID="15" Name="Approvers"
                               Description="Members of this group can edit and approve pages, list items, and documents."
                               OwnerID="7" OwnerIsUser="False"/>
                        <Group ID="688" Name="Contacts Members"
                               Description="Use this group to grant people contribute permissions to the SharePoint site: Contacts"
                               OwnerID="687" OwnerIsUser="False"/>
                        <Group ID="687" Name="Contacts Owners"
                               Description="Use this group to grant people full control permissions to the SharePoint site: Contacts"
                               OwnerID="687" OwnerIsUser="False"/>
                        <Group ID="689" Name="Contacts Visitors"
                               Description="Use this group to grant people read permissions to the SharePoint site: Contacts"
                               OwnerID="687" OwnerIsUser="False"/>
                        <Group ID="13" Name="Designers"
                               Description="Members of this group can edit lists, document libraries, and pages in the site. Designers can create Master Pages and Page Layouts in the Master Page Gallery and can change the behavior and appearance of each site in the site collection by using master pages and CSS files.  "
                               OwnerID="7" OwnerIsUser="False"/>
                        <Group ID="193" Name="Developers"
                               Description="Use this group to grant people contribute permissions to the SharePoint site: Developer Resources"
                               OwnerID="126" OwnerIsUser="False"/>
                        <Group ID="5" Name="Viewers"
                               Description="Members of this group can view pages, list items, and documents.  If the document has a server rendering available, they can only view the document using the server rendering."
                               OwnerID="1073741823" OwnerIsUser="True"/>
                    </Groups>
                </GetGroupCollectionFromSite>
            </GetGroupCollectionFromSiteResult>
        </GetGroupCollectionFromSiteResponse>
    </soap:Body>
</soap:Envelope>`;
