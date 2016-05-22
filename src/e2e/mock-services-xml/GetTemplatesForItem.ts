export const GetTemplatesForItem = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <soap:Body>
        <GetTemplatesForItemResponse xmlns="http://schemas.microsoft.com/sharepoint/soap/workflow/">
            <GetTemplatesForItemResult>
                <TemplateData>
                    <Web Title="My Widget Site"
                         Url="https://sharepoint.mycompany.com"/>
                    <List Title="Widgets"
                          Url="https://sharepoint.mycompany.com/Lists/Widgets"/>
                    <WorkflowTemplates>
                        <WorkflowTemplate Name="WidgetApproval" Description=""
                                          InstantiationUrl="https://sharepoint.mycompany.com/_layouts/IniWrkflIP.aspx?List=fc17890e-8c0f-43b5-8e3e-ffae6f456727&amp;ID=5&amp;TemplateID={59062311-cea9-40d1-a183-6edde9333815}&amp;Web={ec744d8e-ae0a-45dd-bcd1-8a63b9b399bd}">
                            <WorkflowTemplateIdSet TemplateId="59062311-cea9-40d1-a183-6edde9333815"
                                                   BaseId="85eb58d0-6108-40dc-84fa-b31a5fb33497"/>
                            <AssociationData>
                                <string>&lt;dfs:myFields xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                                    xmlns:dms="http://schemas.microsoft.com/office/2009/documentManagement/types"
                                    xmlns:dfs="http://schemas.microsoft.com/office/infopath/2003/dataFormSolution"
                                    xmlns:q="http://schemas.microsoft.com/office/infopath/2009/WSSList/queryFields"
                                    xmlns:d="http://schemas.microsoft.com/office/infopath/2009/WSSList/dataFields"
                                    xmlns:ma="http://schemas.microsoft.com/office/2009/metadata/properties/metaAttributes"
                                    xmlns:pc="http://schemas.microsoft.com/office/infopath/2007/PartnerControls"
                                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"&gt;&lt;dfs:queryFields /&gt;&lt;dfs:dataFields&gt;&lt;d:SharePointListItem_RW
                                    /&gt;&lt;/dfs:dataFields&gt;&lt;/dfs:myFields&gt;</string>
                            </AssociationData>
                            <Metadata>
                                <InitiationCategories>
                                    <string>General;#List</string>
                                </InitiationCategories>
                                <Instantiation_FormURI>
                                    <string>
                                        https://sharepoint.mycompany.com/Workflows/WidgetsApproval/WidgetsApproval.xsn
                                    </string>
                                </Instantiation_FormURI>
                            </Metadata>
                        </WorkflowTemplate>
                    </WorkflowTemplates>
                </TemplateData>
            </GetTemplatesForItemResult>
        </GetTemplatesForItemResponse>
    </soap:Body>
</soap:Envelope>`;
