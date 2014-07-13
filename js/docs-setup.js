NG_DOCS={
  "sections": {
    "api": "API Documentation"
  },
  "pages": [
    {
      "section": "api",
      "id": "angularPoint",
      "shortName": "angularPoint",
      "type": "overview",
      "moduleName": "angularPoint",
      "shortDescription": "This is the primary angularPoint module and needs to be listed in your app.js dependencies to gain use of AngularPoint",
      "keywords": "angularpoint api app dependencies functionality gain js listed module overview primary project"
    },
    {
      "section": "api",
      "id": "angularPoint.apCacheService",
      "shortName": "angularPoint.apCacheService",
      "type": "service",
      "moduleName": "angularPoint",
      "shortDescription": "Stores a reference for all list items based on list GUID and list item id.  Allows us to then register promises that",
      "keywords": "add allows angularpoint apcacheservice api assuming based belongs cache created deferred entity entityid entitytype eventually fulfills function future guid item items list local newly object pass pending point promises reference register registered registers removes requested requests resolve resolves returns service stores"
    },
    {
      "section": "api",
      "id": "angularPoint.apConfig",
      "shortName": "angularPoint.apConfig",
      "type": "object",
      "moduleName": "angularPoint",
      "shortDescription": "Basic config for the application (unique for each environment).  Update to change for your environment.",
      "keywords": "$urlrouterprovider angular angular-point angularpoint apconfig api application apptitle apsyncservice automatically based basic blocking call calls case change code config configuration constant debug debugenabled default defaulturl dependencies details determines don environment firebase firebaseurl hosted href http indexof initial localhost locally location module myapp myserver object offline optional override pulls reference root routes service set sets site source spservices true update url web window xml"
    },
    {
      "section": "api",
      "id": "angularPoint.apDecodeService",
      "shortName": "angularPoint.apDecodeService",
      "type": "service",
      "moduleName": "angularPoint",
      "shortDescription": "Processes the XML received from SharePoint and converts it into JavaScript objects based on predefined field types.",
      "keywords": "additional allow allows angularpoint apcacheservice apconfig apdecodeservice api apqueueservice aputilityservice array attributes based batch browsers cache call change child chunks configuration constructors conversions converts correctly ctor customfields cut data define definition definitions don downside elements entities entity evergreen exist factory field fielddefinition filter find formatted function getcache getlistitems handle hit includeallattrs info instantiated item items iterate javascript large leading list lists local localcache long mappedname mapping maps merged mode model modified newly node number object objects objecttype optional optionally options ows_ parent parsed pass performance post predefined prevent processed processes processing promise property propertyname provided query received reference removeows replace replaced representation resolved resolves response responsexml return returned returning returns rows running server service set sharepoint slow slowdowns spservices spxmltojson store stored string stripped takes target text throttle true type types typically ui unnecessarily update updated updating version versions web webservice xml"
    },
    {
      "section": "api",
      "id": "angularPoint.apEncodeService",
      "shortName": "angularPoint.apEncodeService",
      "type": "service",
      "moduleName": "angularPoint",
      "shortDescription": "Processes JavaScript objects and converts them to a format SharePoint expects.",
      "keywords": "angularpoint apconfig apencodeservice api aputilityservice array attempt convert converts current defined definition definitions delimited doesn entity expects field fielddefinition fielddefinitions fields fieldvalue find format function hand internalname iso8601 item iterate javascript js lastname list ll lookup lookupid lookupvalue mappedname model modified multi multiselectvalue non-readonly objects objecttype offset pairs pass passed prior processes properly properties property readonly save saving select selection service sharepoint someid somevalue spservices stored string submission text timezone title turns typically user valid values"
    },
    {
      "section": "api",
      "id": "angularPoint.apFieldService",
      "shortName": "angularPoint.apFieldService",
      "type": "service",
      "moduleName": "angularPoint",
      "shortDescription": "Handles the mapping of the various types of fields used within a SharePoint list",
      "keywords": "addlistitems allows angularpoint apfieldservice api appropriate approveitems aputilityservice array based build chancejs coded combine container creates data decorates default defaults defined defines definition deletelistitems dynamic dynamically editlistitems empty expected field fields fieldtype full fullmask function generate generates handles hard https included levels list lists main mapping mask mock mockdata model modelservice obj object optional options param params permask permission permissionlevel populates produce query read reference requested resolvepermissions return returns service sharepoint simulation specific staticvalue string takes type types values viewfields viewlistitems xml"
    },
    {
      "section": "api",
      "id": "angularPoint.apListFactory",
      "shortName": "angularPoint.apListFactory",
      "type": "object",
      "moduleName": "angularPoint",
      "shortDescription": "Exposes the List prototype and a constructor to instantiate a new List.",
      "keywords": "angularpoint apconfig apfieldservice api aplistfactory config exposes function instantiate instantiates list object options prototype returns"
    },
    {
      "section": "api",
      "id": "angularPoint.apListItemFactory",
      "shortName": "angularPoint.apListItemFactory",
      "type": "object",
      "moduleName": "angularPoint",
      "shortDescription": "Exposes the ListItem prototype and a constructor to instantiate a new ListItem.",
      "keywords": "allow angularpoint apcacheservice apdataservice api aplistitemfactory aputilityservice details event exposes factory function inherit instantiate instantiates isn listitem methods object prototype returns standard"
    },
    {
      "section": "api",
      "id": "angularPoint.apModalService",
      "shortName": "angularPoint.apModalService",
      "type": "service",
      "moduleName": "angularPoint",
      "shortDescription": "Extends a modal form to include many standard functions",
      "keywords": "$modalinstance $scope accepts admin allow angularpoint api apmodalservice argument arguments attach binding boolean checked closes comprequestmodalctrl comprequestsmodel configuration confirmation controller controllers controls creates current dateexceedsboundary default deleteentity deleterequest deletes deletion deprecated determine dialog disable display displaymode dynamic easily edit edited enableapproval entity existing expectedarguments extended extends fallback false firebase flag form fullcontrol function functions html include initializestate injects instance item javascript levels list locked lockedby locking modal modalmodelprovider mode model modules negotiatingwithserver number object openmodal optional options params permission permissions populates promise prompts record reference representing request returns rights saveentity saverequest service sets sharepoint standard templateurl turn updates user usercanapprove usercandelete usercanedit view"
    },
    {
      "section": "api",
      "id": "angularPoint.apModelFactory",
      "shortName": "angularPoint.apModelFactory",
      "type": "object",
      "moduleName": "angularPoint",
      "shortDescription": "Exposes the model prototype and a constructor to instantiate a new Model.",
      "keywords": "angularpoint apcacheservice apdataservice api aplistfactory aplistitemfactory apmodalservice apmodelfactory apqueryfactory aputilityservice array assignedto config create customfields description designer dev estimatedeffort exposes factory false field file folder function guid instantiate instantiates integer item list mappedname mapping model object objects objecttype offline options percentcomplete priority properties property prototype readonly requestedby returns sharepoint spaces status task tasks text title user var xml"
    },
    {
      "section": "api",
      "id": "angularPoint.apQueryFactory",
      "shortName": "angularPoint.apQueryFactory",
      "type": "object",
      "moduleName": "angularPoint",
      "shortDescription": "Exposes the Query prototype and a constructor to instantiate a new Query.",
      "keywords": "angularpoint apcacheservice apconfig apdataservice api apmodalservice apqueryfactory config exposes function instantiate instantiates object options prototype query returns"
    },
    {
      "section": "api",
      "id": "angularPoint.apQueueService",
      "shortName": "angularPoint.apQueueService",
      "type": "service",
      "moduleName": "angularPoint",
      "shortDescription": "Simple service to monitor the number of active requests we have open with SharePoint",
      "keywords": "active angularpoint animation api apqueueservice call callback change count counter current decrease decrementing display function increase incrementing loading monitor number observer open register requests reset service sharepoint simple sort typical"
    },
    {
      "section": "api",
      "id": "angularPoint.apUtilityService",
      "shortName": "angularPoint.apUtilityService",
      "type": "service",
      "moduleName": "angularPoint",
      "shortDescription": "Provides shared utility functionality across the application.",
      "keywords": "$q addandcustomizepages adddelprivatewebparts addlistitems admin angularpoint apconfig api application applystylesheets applythemeandborder approveitems aputilityservice array article assigned based batches batchprocess bit break browsedirectories browser browseuserinfo buildprojectsummary cancelcheckout change chunks codeplex comparison complete context convert converts create createalerts creategroups createsscsite current cuts dates datetocheck defaults defer deferred delay deletelistitems deleteversions desired determine directly don dvwps easier easily editlistitems editmyuserinfo enddate entities enumeratepermissions evaluate evaluates event example executed extendprojectsummary fall falls false fictitious firebase flags formatted fullmask function functionality getalllistitems group hang identifying info int integer intensive ints item items iterate iterating javascript js length level list listitem lock long managealerts managelists managepermissions managesubwebs manageweb mask maximum milliseconds model module nczonline net notify number object online open openitems pausing performing perm permission permissionsmask permmask personalviews portion problem process processed processing projectmodel projects projectsmodel promise properties provided range reference resolve resolvepermissions return returned rights running security service set shared sharepoint site specifies splookupaddnew spservices startdate starting stuff sufficient summary summaryobject sync thread time trimming typically ui unsigned updatepersonalwebparts usable user useremoteapis users utility var viewformpages viewlistitems viewpages viewusagedata viewversions wss yyyymmdd"
    },
    {
      "section": "api",
      "id": "angularPoint.directive:apAttachments",
      "shortName": "apAttachments",
      "type": "directive",
      "moduleName": "angularPoint",
      "shortDescription": "Uses an iFrame to hijack the portions of the upload attachment form that we would like to show to the user. Adds",
      "keywords": "adds allow angularpoint api attachment attachments callback complete data-ap-attachments data-change-event data-list-item delete directive disassociate display event fetchattachments form functionality hijack iframe item linked list listed listeners listitem opening portions provide queries resets span updated upload user verification view waits"
    },
    {
      "section": "api",
      "id": "angularPoint.directive:apSelect",
      "shortName": "apSelect",
      "type": "directive",
      "moduleName": "angularPoint",
      "shortDescription": "A SharePoint lookup value is represented as an object containing a lookupId and lookupValue.",
      "keywords": "acronym activetask allows angularpoint api applicable arr array attempts attribute categories category class coming control-label create data-ap-select data-arr data-lookup-value data-multi data-target directive display field form form-group item items list lookup lookupid lookupvalue mind multi-select object objects options populate providing pushes reference referencing represented select select2 selected sets sharepoint span target taskcategories title true typically"
    },
    {
      "section": "api",
      "id": "apDataService",
      "shortName": "apDataService",
      "type": "service",
      "moduleName": "apDataService",
      "shortDescription": "Handles all interaction with SharePoint&#39;s SOAP web services.  Mostly a wrapper for SPServices functionality.",
      "keywords": "additional anderson angularpoint apconfig apdataservice apfieldservice api apqueueservice aputilityservice calls codeplex documentation functionality handles interaction marc service services sharepoint soap spservices web wrapper"
    },
    {
      "section": "api",
      "id": "apDataService.addUpdateItemModel",
      "shortName": "apDataService.addUpdateItemModel",
      "type": "function",
      "moduleName": "apDataService",
      "shortDescription": "Adds or updates a list item based on if the item passed in contains an id attribute.",
      "keywords": "adds addupdateitemmodel apdataservice api applicable attribute automatically based buildvaluepairs cache cached configuration currently default defined ensure entities entity field fields function generate generating identified instances intensive item javascript list mode model newly note object optional pairs params passed precomputed process promise query reference replace representing resolves return search sharepoint stored update updateallcaches updated updates updating valuepairs"
    },
    {
      "section": "api",
      "id": "apDataService.deleteAttachment",
      "shortName": "apDataService.deleteAttachment",
      "type": "function",
      "moduleName": "apDataService",
      "shortDescription": "Deletes and attachment on a list item.  Most commonly used by ListItem.deleteAttachment which is shown",
      "keywords": "apdataservice api attachment best collection commonly configuration delete deleteattachment deletes example function getmodel guid item list listitem listitemid listname option options parameters promise prototype requires resolves return updated url var"
    },
    {
      "section": "api",
      "id": "apDataService.deleteItemModel",
      "shortName": "apDataService.deleteItemModel",
      "type": "function",
      "moduleName": "apDataService",
      "shortDescription": "Typically called directly from a list item, removes the list item from SharePoint",
      "keywords": "apdataservice api cache cached called complete configuration copy currently default delete deleteitemmodel directly ensure entities entity function getcontainer intensive item javascript list local location model object operation optional params process promise query reference remove removed removes representing resolves returned search sharepoint stored target typically updateallcaches"
    },
    {
      "section": "api",
      "id": "apDataService.executeQuery",
      "shortName": "apDataService.executeQuery",
      "type": "function",
      "moduleName": "apDataService",
      "shortDescription": "Primary method of retrieving list items from SharePoint.  Look at Query and Model for specifics.",
      "keywords": "apdataservice api array call configuration custom destination dev entities executequery file function getcache include item items list location making method model objects offline offlinexml optional optionally parameters primary query reference resides retrieving returned sharepoint specifics target title xml"
    },
    {
      "section": "api",
      "id": "apDataService.getCollection",
      "shortName": "apDataService.getCollection",
      "type": "function",
      "moduleName": "apDataService",
      "shortDescription": "Used to handle any of the Get[filterNode]Collection calls to SharePoint",
      "keywords": "$scope apdataservice api array attributes calls collection extend extracted filternode function getattachmentcollection getcollection getgroupcollectionfromsite getgroupcollectionfromuser getlistcollection getusercollectionfromgroup getusercollectionfromsite getviewcollection groupname handle include iterate listname loginname object objects operation options payload postprocessfunction promise provided representing requested required resolved returned selecteduser sharepoint spservices user userloginname xml"
    },
    {
      "section": "api",
      "id": "apDataService.getFieldVersionHistory",
      "shortName": "apDataService.getFieldVersionHistory",
      "type": "function",
      "moduleName": "apDataService",
      "shortDescription": "Returns the version history for a field in a list item.",
      "keywords": "apconfig apdataservice api array changes configuration defaulturl definition field fielddefinition function getfieldversionhistory getversioncollection guid history internalname item list listitem model object operation passed payload promise resolves returns spservices strfieldname strlistid strlistitemid var version weburl"
    },
    {
      "section": "api",
      "id": "apDataService.getList",
      "shortName": "apDataService.getList",
      "type": "function",
      "moduleName": "apDataService",
      "shortDescription": "Returns all list settings for each list on the site",
      "keywords": "apdataservice api array configuration default definitions desired field function getlist guid list listname options override parameters promise resolves returns settings site url web weburl"
    },
    {
      "section": "api",
      "id": "apDataService.getView",
      "shortName": "apDataService.getView",
      "type": "function",
      "moduleName": "apDataService",
      "shortDescription": "Returns details of a SharePoint list view",
      "keywords": "apdataservice api configuration default desired details formatted function getview guid list listname options override parameters promise provided returns sharepoint url view viewname web weburl"
    },
    {
      "section": "api",
      "id": "apDataService.processDeletionsSinceToken",
      "shortName": "apDataService.processDeletionsSinceToken",
      "type": "function",
      "moduleName": "apDataService",
      "shortDescription": "GetListItemChangesSinceToken returns items that have been added as well as deleted so we need",
      "keywords": "apdataservice api array cache cached deleted entityarray function getlistitemchangessincetoken items list local processdeletionssincetoken query remove response responsexml returns server xml"
    },
    {
      "section": "api",
      "id": "apDataService.removeEntityFromLocalCache",
      "shortName": "apDataService.removeEntityFromLocalCache",
      "type": "function",
      "moduleName": "apDataService",
      "shortDescription": "Searches for an entity based on list item ID and removes it from the cached array if it exists.",
      "keywords": "apdataservice api array based cached determine entity entityarray entityid evaluate exists function item items list match query removed removeentityfromlocalcache removes returns searches true"
    },
    {
      "section": "api",
      "id": "apDataService.retrieveChangeToken",
      "shortName": "apDataService.retrieveChangeToken",
      "type": "function",
      "moduleName": "apDataService",
      "shortDescription": "Returns the change token from the xml response of a GetListItemChangesSinceToken query",
      "keywords": "apdataservice api attribute change function getlistitemchangessincetoken note query response responsexml retrievechangetoken returns server token xml"
    },
    {
      "section": "api",
      "id": "apDataService.retrievePermMask",
      "shortName": "apDataService.retrievePermMask",
      "type": "function",
      "moduleName": "apDataService",
      "shortDescription": "Returns the text representation of the users permission mask",
      "keywords": "apdataservice api attribute function getlistitemchangessincetoken mask note permission representation response responsexml retrievepermmask returns server text users xml"
    },
    {
      "section": "api",
      "id": "apDataService.serviceWrapper",
      "shortName": "apDataService.serviceWrapper",
      "type": "function",
      "moduleName": "apDataService",
      "shortDescription": "Generic wrapper for any SPServices web service call.  The big benefit to this function is it allows us",
      "keywords": "$q allows apdataservice api application benefit big call check clean codeplex consistent continue details directly elements expected experience filter filternode find function generic http implementation items iterate list model node objects operation options parameters params parsed passed payload promise provided raw resolved response returns server service servicewrapper spservices string typically web weburl wrapper xml"
    },
    {
      "section": "api",
      "id": "apDataService.updateAllCaches",
      "shortName": "apDataService.updateAllCaches",
      "type": "function",
      "moduleName": "apDataService",
      "shortDescription": "Propagates a change to all duplicate entities in all cached queries within a given model.",
      "keywords": "apdataservice api automatically cached change don duplicate entities entity function item javascript list model number object process propagates queries query reference representing sharepoint updateallcaches updated"
    },
    {
      "section": "api",
      "id": "List",
      "shortName": "List",
      "type": "object",
      "moduleName": "List",
      "shortDescription": "List Object Constructor.  This is handled automatically when creating a new model so there shouldn&#39;t be",
      "keywords": "account additional api application attribute automatically basing call config creating customfields define details dev field fielddefinition file firstname folder guid handled info initialization internal internalname lastname list ll located lookup manually mappedname mapping maps model names non-standard object objecttype offline organization parameters projectslist readonly reason settings sharepoint shouldn spaces text title type unique user xml"
    },
    {
      "section": "api",
      "id": "List.FieldDefinition",
      "shortName": "List.FieldDefinition",
      "type": "object",
      "moduleName": "List",
      "shortDescription": "Defined in the MODEL.list.fieldDefinitions array.  Each field definition object maps an internal field",
      "keywords": "actual add additional angular api apmodelfactory app array attribute attributes automatically base broken calculated call changed choice choice_field_name choices class collection column convert converts counter create created current customfields dashes data defined definition deliminator delimited description designer desired dev display element error extend factory fetch field fielddefinition fielddefinitions fields file float folder form function generally getfielddefinition guid href ignore info inherits initial initially int integer internal internalname invalid item items javascript js json list list-fielddefinition-page listitem local lookup lookupid lookupvalue manager mapped mappedname mapping maps methods model modelname module multiple named newly number obj object objects objecttype offline parsed passed point post primary priority processing project properties property prototype pulls push read read-only readonly records reference registerquery representing requested requirement respect retrieve return returned returns saving second selected service set sharepoint single site slashes space spaces store stored string strings subsequent task taskermodel tasks text thrown title true type typically unescape unique updated updates usage user valid var xml"
    },
    {
      "section": "api",
      "id": "ListItem",
      "shortName": "ListItem",
      "type": "object",
      "moduleName": "ListItem",
      "shortDescription": "Base prototype which all list items inherit from.  All methods can be accessed through this prototype so all CRUD",
      "keywords": "accessed api base called crud directly functionality inherit item items list listitem methods object prototype"
    },
    {
      "section": "api",
      "id": "ListItem.addEntityReference",
      "shortName": "ListItem.addEntityReference",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Allows us to pass in another entity to associate superficially, only persists for the current session and",
      "keywords": "_apcache addentityreference allows api associate associated associateprojecttasks cache corresponding creates current data digest entity faster fictitious function item iterate list listitem lookup lookupid model multi-lookup object pass passed persists project projects property references save saved searchlocalcache session superficially task tasks tasksmodel title type var"
    },
    {
      "section": "api",
      "id": "ListItem.deleteAttachment",
      "shortName": "ListItem.deleteAttachment",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Delete an attachment from a list item.",
      "keywords": "$scope alert api attachment collection confirm confirmation delete deleteattachment deleted file function item list listitem promise requires resolves scope updated url var window"
    },
    {
      "section": "api",
      "id": "ListItem.deleteItem",
      "shortName": "ListItem.deleteItem",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Deletes record directly from the object and removes record from user cache.",
      "keywords": "api cache cached clicked complete currently dataservice default delete deleteitem deletes directly ensure entity function href intensive item iterate link list listitem local longer ng-click ng-repeat object optionally params pass process promise query record remove removed removes request stored task tasks title updateallcaches updated user view"
    },
    {
      "section": "api",
      "id": "ListItem.getAttachmentCollection",
      "shortName": "ListItem.getAttachmentCollection",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Requests all attachments for a given list item.",
      "keywords": "api attachments current fetchattachments function getattachmentcollection item list listitem promise requests resolves scope var"
    },
    {
      "section": "api",
      "id": "ListItem.getDataService",
      "shortName": "ListItem.getDataService",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Allows us to reference when out of scope",
      "keywords": "allows api dataservice event function getdataservice listitem reference scope"
    },
    {
      "section": "api",
      "id": "ListItem.getFieldDefinition",
      "shortName": "ListItem.getFieldDefinition",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Returns the field definition from the definitions defined in the custom fields array within a model.",
      "keywords": "api array building custom defined definition definitions field fieldname fields function getfielddefinition internal listitem location locationdefinition lookupid lookupvalue metadata model project returns title var"
    },
    {
      "section": "api",
      "id": "ListItem.getFieldVersionHistory",
      "shortName": "ListItem.getFieldVersionHistory",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Takes an array of field names, finds the version history for field, and returns a snapshot of the object at each",
      "keywords": "$scope api array assuming build changes combining definitions display field fields finds form function getfieldversionhistory history independently interested item list listitem modal model mygenericlistitem names non-readonly object project promise provided pull requests responses returns server snapshot takes title ve version versionhistory working"
    },
    {
      "section": "api",
      "id": "ListItem.getLookupReference",
      "shortName": "ListItem.getLookupReference",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Allows us to retrieve the entity being referenced in a given lookup field.",
      "keywords": "allows api building entity field fieldname function getlookupreference item iterating list listitem location logic lookup lookupid lookups lookupvalue multi-select object project property referenced references referencing resolves retrieve title var"
    },
    {
      "section": "api",
      "id": "ListItem.resolvePermissions",
      "shortName": "ListItem.resolvePermissions",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "See apModelService.resolvePermissions for details on what we expect to have returned.",
      "keywords": "addandcustomizepages adddelprivatewebparts addlistitems admin api apmodelservice applystylesheets applythemeandborder approveitems assume browsedirectories browseuserinfo cancelcheckout canuseredit checking createalerts creategroups createsscsite current deletelistitems deleteversions details edit editlistitems editmyuserinfo enumeratepermissions evaluated example expect fullmask function item level list listitem managealerts managelists managepermissions managesubwebs manageweb object open openitems permission personalviews properties resolvepermissions return returned rights site task updatepersonalwebparts user useremoteapis userpermissions var viewformpages viewlistitems viewpages viewusagedata viewversions"
    },
    {
      "section": "api",
      "id": "ListItem.saveChanges",
      "shortName": "ListItem.saveChanges",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Updates record directly from the object",
      "keywords": "$scope api app cache cached close currently data default directly ensure entity example failure fictitious form function intensive item js list listitem modal object optionally params pass process promise query record resolved save savechanges saved search server service stored task update updateallcaches updated updates"
    },
    {
      "section": "api",
      "id": "ListItem.saveFields",
      "shortName": "ListItem.saveFields",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Saves a named subset of fields back to SharePoint",
      "keywords": "$scope alternative api app array cache cached currently data default ensure entity example failure fictitious field fieldarray fields form function intensive internal item js list listitem modal named names notes optionally params pass process promise pushing query resolves save savechanges saved savefields saves saving search server service sharepoint status stored subset task update updateallcaches updated updatestatus"
    },
    {
      "section": "api",
      "id": "ListItem.validateEntity",
      "shortName": "ListItem.validateEntity",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Helper function that passes the current item to Model.validateEntity",
      "keywords": "api current dataservice displayed evaluation false function helper item listitem messages model optionally params pass passes prevent set toast toastr validateentity validity"
    },
    {
      "section": "api",
      "id": "Lookup",
      "shortName": "Lookup",
      "type": "function",
      "moduleName": "Lookup",
      "shortDescription": "Allows for easier distinction when debugging if object type is shown as either Lookup or User.  Also allows us",
      "keywords": "allows api async building cache city create debugging distinction doesn dot easier entity exists full function getentity getproperty item key list location lookup lookupid lookupvalue object options parent project promise property propertyname propertypath reference referenced referencing registered request resolve resolves returns separated split string title type undefined user var"
    },
    {
      "section": "api",
      "id": "Model",
      "shortName": "Model",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Model Constructor",
      "keywords": "active addnewitem adds api aplistitemfactory apmodelfactory application array attachments boolean builds config costestimate creategenericfactory currency customer customfields customlist data deferred definition denotes empty extend factory false fictitious field fields file formats function getalllistitems group guid identifies individual internalname items js list ll lookup mappedname maps model named names obj object objecttype offline optional params passed project projectdescription projectgroup projects projectsmodel queries read readonly ready sharepoint spaces status taskmanager text title true types unique user var xml"
    },
    {
      "section": "api",
      "id": "Model.addNewItem",
      "shortName": "Model.addNewItem",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Using the definition of a list stored in a model, create a new list item in SharePoint.",
      "keywords": "additional addnewitem allows api app automatically based cache converted create created customer data defined definition definitions dependent description entity field function item js key list local logic lookupid model newly object options pairs pass project projectmodel promise query resolved returned server service sharepoint stored title unique update updated valid view"
    },
    {
      "section": "api",
      "id": "Model.createEmptyItem",
      "shortName": "Model.createEmptyItem",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Creates an object using the editable fields from the model, all attributes are empty based on the field",
      "keywords": "ability addnewitem api approach attributes based benefit call calling created createemptyitem creates defaults editable empty entity extend extends field fields function inherits item list listitem model newly object optionally overrides passed prototype returned savechanges specific type values"
    },
    {
      "section": "api",
      "id": "Model.executeQuery",
      "shortName": "Model.executeQuery",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "The primary method for retrieving data from a query registered on a model.  It returns a promise",
      "keywords": "$scope api array cache call changes check constructors data defined entities executequery function identify inherit items key list listitem local method model mycustomquery optionally options pass post primary processing project projectmodel promise prototype query reference registered resolves retrieving returns service stored subsetofprojects unique"
    },
    {
      "section": "api",
      "id": "Model.generateMockData",
      "shortName": "Model.generateMockData",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Generates &#39;n&#39; mock records for testing using the field types defined in the model to provide something to visualize.",
      "keywords": "api created data default defined desired dynamically field function generatemockdata generates level mask mock model number object optional parameters permission permissionlevel provide quantity records requested return set sets simulate static staticvalue testing types visualize"
    },
    {
      "section": "api",
      "id": "Model.getAllListItems",
      "shortName": "Model.getAllListItems",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Inherited from Model constructor",
      "keywords": "$scope api caches current data entities fictitious function getalllistitems inherited items js list model processes projectmodel projects projectsmodel promise resolved returned returning xml"
    },
    {
      "section": "api",
      "id": "Model.getCache",
      "shortName": "Model.getCache",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Helper function that return the local cache for a named query if provided, otherwise",
      "keywords": "api cache changes check contents current customquery function getcache helper identify key local model named namedquerycache primary primaryquerycache projectmodel provided query resolved return returns sharepoint unique var"
    },
    {
      "section": "api",
      "id": "Model.getFieldDefinition",
      "shortName": "Model.getFieldDefinition",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Returns the field definition from the definitions defined in the custom fields array within a model.",
      "keywords": "api array building custom defined definition definitions field fieldname fields function getfielddefinition internal location locationdefinition lookupid lookupvalue metadata model project projectsmodel returns title var"
    },
    {
      "section": "api",
      "id": "Model.getLocalEntity",
      "shortName": "Model.getLocalEntity",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Similar to Model.searchLocalCache but you don&#39;t need to specify a query, only searches by list item",
      "keywords": "api cache don entity entityid fulfilled function getlocalentity item list listitem lookupid lookupvalue model object project projectmodel projectthaticareabout promise query referenced registered requested resolve returns searches searchlocalcache super task title var"
    },
    {
      "section": "api",
      "id": "Model.getQuery",
      "shortName": "Model.getQuery",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Helper function that attempts to locate and return a reference to the requested or catchall query.",
      "keywords": "additional api attempts catchall customquery details function getquery helper identify key locate model namedquery primary primaryquery projectmodel prototype query reference requested return unique var"
    },
    {
      "section": "api",
      "id": "Model.initializeModalState",
      "shortName": "Model.initializeModalState",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Uses apModalService to return some general state information for a modal form using",
      "keywords": "$modalinstance $scope additional admin allow angular api apmodalservice app aria-hidden attempt attributes binding btn btn-danger btn-default btn-primary button cancel candelete checked class close cols controller controls current custom default delete deleterecord description details disable dismiss displaymode edit entity extend fa fa-trash-o false firebase flag flags form form-control form-group fullcontrol function general html include initializemodalstate item js length list locked lockedby locking modal modal-body modal-footer modal-header model module negotiatingwithserver ng-click ng-disabled ng-form ng-model ng-show object optional options param passed permissions project projectmodalctrl projectsmodel pull-left request return returned rights rows save saveentity saverequest service sharepoint stateoption1 stateoption2 strict task text title true type user usercanapprove usercandelete usercanedit view"
    },
    {
      "section": "api",
      "id": "Model.isInitialised",
      "shortName": "Model.isInitialised",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Methods which allows us to easily determine if we&#39;ve successfully made any queries this session.",
      "keywords": "allows api determine easily evaluation function isinitialised methods model queries returns session ve"
    },
    {
      "section": "api",
      "id": "Model.registerQuery",
      "shortName": "Model.registerQuery",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Constructor that allows us create a static query with the option to build dynamic queries as seen in the",
      "keywords": "$scope advanced allow allows api array ascending aspx associated assume build cache cachexml call caml camlrowlimit changes check codeplex construct create creates custom default defaults doesn don dynamic dynamically entities example execute executequery exist false faster field function functionality getlistitemchangessincetoken good inherit isobject items josh js list listitem lists local lookup lookupid matching mccarty microsoft model modifications modified object objects operation option optional options param parsed pass passthrough payload permissions pid prevents primary project projectid projectmodel projects projecttasksmodel prototype queries query querybyprojectid querykey queryoptions quick recentchanges records reference register registerquery response retrieve return returned returns smaller specific static store stored third title true type typically unique user var xml"
    },
    {
      "section": "api",
      "id": "Model.resolvePermissions",
      "shortName": "Model.resolvePermissions",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "See apModelFactory.resolvePermissions for details on what we expect to have returned.",
      "keywords": "addandcustomizepages adddelprivatewebparts addlistitems admin api apmodelfactory applystylesheets applythemeandborder approveitems assume browsedirectories browseuserinfo cancelcheckout checking createalerts creategroups createsscsite current deletelistitems deleteversions details edit editlistitems editmyuserinfo enumeratepermissions evaluated example expect fullmask function level list managealerts managelists managepermissions managesubwebs manageweb model object open openitems perm permission personalviews properties resolvepermissions returned rights site tasksmodel updatepersonalwebparts user usercanedit useremoteapis userpermissions var viewformpages viewlistitems viewpages viewusagedata viewversions"
    },
    {
      "section": "api",
      "id": "Model.searchLocalCache",
      "shortName": "Model.searchLocalCache",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Search functionality that allow for deeply searching an array of objects for the first",
      "keywords": "additionally allow api array cache cachename calls changed compare currently data deeply dot flag function functionality future getcache ignore indexes items length local localcache lookupid mapping maps matching model object objects optional parameters previous primary project propertypath rebuild rebuildindex rebuilds record required search searching searchlocalcache separated set source speed supplied undefined values"
    },
    {
      "section": "api",
      "id": "Model.validateEntity",
      "shortName": "Model.validateEntity",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Uses the custom fields defined in an model to ensure each field (required = true) is evaluated",
      "keywords": "alert api based custom defined ensure entity evaluated evaluation field fields function generated issues item list model object optional parameters sharepoint toast toasts true type user validateentity validity"
    },
    {
      "section": "api",
      "id": "Query",
      "shortName": "Query",
      "type": "function",
      "moduleName": "Query",
      "shortDescription": "Primary constructor that all queries inherit from.",
      "keywords": "ability allows api array ascending cache cachexml call called calls caml camlrowlimit changes check config control data dataservice default definition doesn don efficient evaluate execute executequery false fresh function getlistitemchangessincetoken getlistitems inherit initial initialization item larger list local location model modifications modified note object objects operation optionally options parameters parent pass passed permissions prevents primary project prototype pull pulls queries query queryoptions receive recentchanges records reference registerquery request response retrieve returned returns scope search searching searchlocalcache set sets sharepoint simple subsequent time true undefined user wrapper"
    },
    {
      "section": "api",
      "id": "User",
      "shortName": "User",
      "type": "function",
      "moduleName": "User",
      "shortDescription": "Allows for easier distinction when debugging if object type is shown as a User.  Turns a delimited &quot;;#&quot;",
      "keywords": "allows api create debugging delimited depeinding distinction easier email field function joe loginname lookupid lookupvalue maker object settings sipaddress sr string title turns type user widget"
    }
  ],
  "apis": {
    "api": true
  },
  "html5Mode": false,
  "startPage": "/api",
  "scripts": [
    "angular.js",
    "angular-animate.min.js"
  ]
};