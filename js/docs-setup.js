NG_DOCS={
  "sections": {
    "api": "API Documentation"
  },
  "pages": [
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
      "id": "angularPoint.apFieldService",
      "shortName": "angularPoint.apFieldService",
      "type": "service",
      "moduleName": "angularPoint",
      "shortDescription": "Handles the mapping of the various types of fields used within a SharePoint list",
      "keywords": "addlistitems allows angularpoint apfieldservice api appropriate approveitems aputilityservice array based build chancejs coded combine container creates data decorates default defaults defined defines definition deletelistitems dynamic dynamically editlistitems empty expected field fields fieldtype full fullmask function generate generates handles hard https included levels list lists main mapping mask mock mockdata model modelservice obj object optional options param params permask permission permissionlevel populates produce query read reference requested resolvepermissions return returns service sharepoint simulation specific staticvalue string takes type types values viewfields viewlistitems xml"
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
      "keywords": "$q angularpoint api application aputilityservice array article attributes based batches batchprocess boolean browser browsers buildprojectsummary calc child chunks comparison complete constructors context conversions convert converts correctly counter create ctor currency current cut cuts dates datetime datetocheck defaults defer deferred definition delay delimited determine doesn don downside easier easily enddate entities evaluate evaluates evergreen example executed extendprojectsummary fall falls fictitious field find float format formatted function functionality getalllistitems getlistitems handle hang hit html includeallattrs int integer intensive ints iso8601 item items iterate iterating javascript js json leading length list ll lock long lookup lookupid lookupmulti lookupvalue mappedname mapping maximum milliseconds modified multi multichoice multiselectvalue nczonline net node number object objects objecttype offset options ows_ parent parsed pass passed pausing performance performing portion prevent problem process processed processing projectmodel projects projectsmodel promise property provided range reference removeows representation resolve return rows running select selection service set shared sharepoint slow someid somevalue spservices spxmltojson startdate starting string stripped stuff sufficient summary summaryobject text thread throttle time timezone true turns type typically ui unnecessarily user usermulti utility valid values var version xml yyyymmdd"
    },
    {
      "section": "api",
      "id": "apModelFactory",
      "shortName": "apModelFactory",
      "type": "service",
      "moduleName": "apModelFactory",
      "shortDescription": "The &#39;apModelFactory&#39; provides a common base prototype for Model, Query, and List Item.",
      "keywords": "angularpoint apcacheservice apdataservice apfieldservice api apmodalservice apmodelfactory base common item list model prototype query service"
    },
    {
      "section": "api",
      "id": "apModelFactory.registerChange",
      "shortName": "apModelFactory.registerChange",
      "type": "function",
      "moduleName": "apModelFactory",
      "shortDescription": "If online and sync is being used, notify all online users that a change has been made.",
      "keywords": "api apmodelfactory break change desired event firebase function functionality model module notify online registerchange sync users"
    },
    {
      "section": "api",
      "id": "apModelFactory.resolvePermissions",
      "shortName": "apModelFactory.resolvePermissions",
      "type": "function",
      "moduleName": "apModelFactory",
      "shortDescription": "Converts permMask into something usable to determine permission level for current user.  Typically used",
      "keywords": "api apmodelfactory assigned bit codeplex converts current determine directly false flags function group http identifying integer item level list listitem mask permission permissionsmask permmask property resolvepermissions rights set site somelistitem specifies typically unsigned usable user wss"
    },
    {
      "section": "api",
      "id": "dataService",
      "shortName": "dataService",
      "type": "service",
      "moduleName": "dataService",
      "shortDescription": "Handles all interaction with SharePoint web services",
      "keywords": "additional anderson angularpoint apcacheservice apconfig apfieldservice api apqueueservice aputilityservice calls codeplex dataservice documentation handles http interaction marc service services sharepoint spservices web"
    },
    {
      "section": "api",
      "id": "dataService.addUpdateItemModel",
      "shortName": "dataService.addUpdateItemModel",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Adds or updates a list item based on if the item passed in contains an id attribute.",
      "keywords": "adds addupdateitemmodel api applicable attribute automatically based buildvaluepairs cache cached configuration currently dataservice default defined ensure entities entity field fields function generate generating identified instances intensive item javascript list mode model newly note object optional pairs params passed precomputed process promise query reference replace representing resolves return search sharepoint stored update updateallcaches updated updates updating valuepairs"
    },
    {
      "section": "api",
      "id": "dataService.createValuePair",
      "shortName": "dataService.createValuePair",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Uses a field definition from a model to properly format a value for submission to SharePoint.  Typically",
      "keywords": "api convert createvaluepair current dataservice defined definition field fielddefinition fieldvalue format function hand internalname item iterate lastname list mappedname model non-readonly objecttype pairs prior properly properties readonly saving sharepoint spservices submission text title typically"
    },
    {
      "section": "api",
      "id": "dataService.deleteAttachment",
      "shortName": "dataService.deleteAttachment",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Deletes and attachment on a list item.  Most commonly used by ListItem.deleteAttachment which is shown",
      "keywords": "api attachment best collection commonly configuration dataservice delete deleteattachment deletes example function getmodel guid item list listitem listitemid listname option options parameters promise prototype requires resolves return updated url var"
    },
    {
      "section": "api",
      "id": "dataService.deleteItemModel",
      "shortName": "dataService.deleteItemModel",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Typically called directly from a list item, removes the list item from SharePoint",
      "keywords": "api cache cached called complete configuration copy currently dataservice default delete deleteitemmodel directly ensure entities entity function getcontainer intensive item javascript list local location model object operation optional params process promise query reference remove removed removes representing resolves returned search sharepoint stored target typically updateallcaches"
    },
    {
      "section": "api",
      "id": "dataService.executeQuery",
      "shortName": "dataService.executeQuery",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Primary method of retrieving list items from SharePoint.  Look at Query and Model for specifics.",
      "keywords": "api array call configuration custom dataservice destination dev entities executequery file function getcache include item items list location making method model objects offline offlinexml optional optionally parameters primary query reference resides retrieving returned sharepoint specifics target title xml"
    },
    {
      "section": "api",
      "id": "dataService.generateValuePairs",
      "shortName": "dataService.generateValuePairs",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Typically used to iterate over the non-readonly field definitions stored in a model and convert a",
      "keywords": "api attempt convert dataservice definitions entity field fielddefinitions fields fieldvalue find function generatevaluepairs item iterate list ll model non-readonly pairs pass properties save saving sharepoint spservices stored typically"
    },
    {
      "section": "api",
      "id": "dataService.getCollection",
      "shortName": "dataService.getCollection",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Used to handle any of the Get[filterNode]Collection calls to SharePoint",
      "keywords": "$scope api array attributes calls collection dataservice extend extracted filternode function getattachmentcollection getcollection getgroupcollectionfromsite getgroupcollectionfromuser getlistcollection getusercollectionfromgroup getusercollectionfromsite getviewcollection groupname handle include iterate listname loginname object objects operation options payload postprocessfunction promise provided representing requested required resolved returned selecteduser sharepoint spservices user userloginname xml"
    },
    {
      "section": "api",
      "id": "dataService.getFieldVersionHistory",
      "shortName": "dataService.getFieldVersionHistory",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Returns the version history for a field in a list item.",
      "keywords": "apconfig api array changes configuration dataservice defaulturl definition field fielddefinition function getfieldversionhistory getversioncollection guid history internalname item list listitem model object operation passed payload promise resolves returns spservices strfieldname strlistid strlistitemid var version weburl"
    },
    {
      "section": "api",
      "id": "dataService.getList",
      "shortName": "dataService.getList",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Returns all list settings for each list on the site",
      "keywords": "api array configuration dataservice default definitions desired field function getlist guid list listname options override parameters promise resolves returns settings site url web weburl"
    },
    {
      "section": "api",
      "id": "dataService.getView",
      "shortName": "dataService.getView",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Returns details of a SharePoint list view",
      "keywords": "api configuration dataservice default desired details formatted function getview guid list listname options override parameters promise provided returns sharepoint url view viewname web weburl"
    },
    {
      "section": "api",
      "id": "dataService.parseFieldVersionHistoryResponse",
      "shortName": "dataService.parseFieldVersionHistoryResponse",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Takes an XML response from SharePoint webservice and returns an array of field versions.",
      "keywords": "api array call change dataservice definition field fielddefinition function model objects parsefieldversionhistoryresponse response responsexml returned returns service sharepoint takes version versions web webservice xml"
    },
    {
      "section": "api",
      "id": "dataService.processDeletionsSinceToken",
      "shortName": "dataService.processDeletionsSinceToken",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "GetListItemChangesSinceToken returns items that have been added as well as deleted so we need",
      "keywords": "api array cache cached dataservice deleted entityarray function getlistitemchangessincetoken items list local processdeletionssincetoken query remove response responsexml returns server xml"
    },
    {
      "section": "api",
      "id": "dataService.processListItems",
      "shortName": "dataService.processListItems",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Post processing of data after returning list items from server.  Returns a promise that resolves with",
      "keywords": "allow allows api array batch call configuration conversions data dataservice definitions elements entities factory field filter find function getcache items iterate large list lists local mapping mode model object optional optionally options pass post prevent processed processing processlistitems promise reference replace resolved resolves responsexml return returning returns server service slowdowns spservices store stored string target typically ui update updating web xml"
    },
    {
      "section": "api",
      "id": "dataService.removeEntityFromLocalCache",
      "shortName": "dataService.removeEntityFromLocalCache",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Searches for an entity based on list item ID and removes it from the cached array if it exists.",
      "keywords": "api array based cached dataservice determine entity entityarray entityid evaluate exists function item items list match query removed removeentityfromlocalcache removes returns searches true"
    },
    {
      "section": "api",
      "id": "dataService.retrieveChangeToken",
      "shortName": "dataService.retrieveChangeToken",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Returns the change token from the xml response of a GetListItemChangesSinceToken query",
      "keywords": "api attribute change dataservice function getlistitemchangessincetoken note query response responsexml retrievechangetoken returns server token xml"
    },
    {
      "section": "api",
      "id": "dataService.retrievePermMask",
      "shortName": "dataService.retrievePermMask",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Returns the text representation of the users permission mask",
      "keywords": "api attribute dataservice function getlistitemchangessincetoken mask note permission representation response responsexml retrievepermmask returns server text users xml"
    },
    {
      "section": "api",
      "id": "dataService.serviceWrapper",
      "shortName": "dataService.serviceWrapper",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Generic wrapper for any SPServices web service call.  The big benefit to this function is it allows us",
      "keywords": "$q allows api application benefit big call check clean codeplex consistent continue dataservice details directly elements expected experience filter filternode find function generic http implementation items iterate list model node objects operation options parameters params parsed passed payload promise provided raw resolved response returns server service servicewrapper spservices string typically web weburl wrapper xml"
    },
    {
      "section": "api",
      "id": "dataService.updateAllCaches",
      "shortName": "dataService.updateAllCaches",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Propagates a change to all duplicate entities in all cached queries within a given model.",
      "keywords": "api automatically cached change dataservice don duplicate entities entity function item javascript list model number object process propagates queries query reference representing sharepoint updateallcaches updated"
    },
    {
      "section": "api",
      "id": "dataService.updateLocalCache",
      "shortName": "dataService.updateLocalCache",
      "type": "function",
      "moduleName": "dataService",
      "shortDescription": "Maps a cache by entity id.  All provided entities are then either added if they don&#39;t already exist",
      "keywords": "api cache dataservice don entities entity exist function localcache maps merged number provided query replaced updated updatelocalcache"
    },
    {
      "section": "api",
      "id": "EntityCache",
      "shortName": "EntityCache",
      "type": "object",
      "moduleName": "EntityCache",
      "shortDescription": "Cache constructor that maintains a queue of all requests for a list item, counter for the number of times",
      "keywords": "add angularpoint apcacheservice api belongs cache counter entity entitycache entityid entitytype functionality guid item list maintains number object queue requests times timestamp update updated"
    },
    {
      "section": "api",
      "id": "EntityCache.getEntity",
      "shortName": "EntityCache.getEntity",
      "type": "function",
      "moduleName": "EntityCache",
      "shortDescription": "Promise which returns the requested entity once it has been registered in the cache.",
      "keywords": "api cache entity entitycache function getentity promise registered requested returns"
    },
    {
      "section": "api",
      "id": "List",
      "shortName": "List",
      "type": "function",
      "moduleName": "List",
      "shortDescription": "List Object Constructor.  This is handled automatically when creating a new model so there shouldn&#39;t be",
      "keywords": "account api application attribute automatically basing call creating customfields details dev field file firstname folder function guid handled initialization internal internalname lastname list ll located lookup manually mappedname mapping maps model names non-standard obj object objecttype offline organization parameters projectslist readonly reason settings sharepoint shouldn spaces text title type unique user xml"
    },
    {
      "section": "api",
      "id": "ListItem",
      "shortName": "ListItem",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Base prototype which all list items inherit CRUD functionality that can be called directly from obj.",
      "keywords": "api base called crud directly function functionality inherit items list listitem obj prototype"
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
      "keywords": "api attachment collection delete deleteattachment function item list listitem promise requires resolves updated url"
    },
    {
      "section": "api",
      "id": "ListItem.deleteItem",
      "shortName": "ListItem.deleteItem",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Deletes record directly from the object and removes record from user cache.",
      "keywords": "api cache cached complete currently dataservice default deleteitem deletes directly ensure entity function intensive iterate listitem object optionally params pass process promise query record remove removed removes request stored updateallcaches user"
    },
    {
      "section": "api",
      "id": "ListItem.getAttachmentCollection",
      "shortName": "ListItem.getAttachmentCollection",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Requests all attachments for a given list item.",
      "keywords": "api attachments function getattachmentcollection item list listitem promise requests resolves"
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
      "keywords": "api array build changes combining definitions field fields finds function getfieldversionhistory history independently interested item list listitem model mygenericlistitem names non-readonly object project promise provided pull requests responses returns server snapshot takes title ve version versions working"
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
      "shortDescription": "See apModelFactory.resolvePermissions for details on what we expect to have returned.",
      "keywords": "api apmodelfactory current details evaluated expect function level listitem mygenericlistitem permission permissionobject properties resolvepermissions returned user var"
    },
    {
      "section": "api",
      "id": "ListItem.saveChanges",
      "shortName": "ListItem.saveChanges",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Updates record directly from the object",
      "keywords": "api cache cached currently data default directly ensure entity function intensive item list listitem object optionally params pass process promise query record resolved savechanges search server service stored update updateallcaches updated updates"
    },
    {
      "section": "api",
      "id": "ListItem.saveFields",
      "shortName": "ListItem.saveFields",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Saves a named subset of fields back to SharePoint",
      "keywords": "$q alternative api array automatically bother business cache cached currently data default don ensure entire entity faster field fieldarray fields function intensive internal item items list listitem logic named names object optionally params pass process processed progresscounter promise promises push query queue request required resolves saved savefields saves saving search server service sharepoint single store stored subset title update updateallcaches updated updating var view"
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
      "keywords": "allows api async create debugging distinction easier entity function item key list lookup lookupid lookupvalue object options parent property propertyname reference referenced request split string type user"
    },
    {
      "section": "api",
      "id": "Lookup.getEntity",
      "shortName": "Lookup.getEntity",
      "type": "function",
      "moduleName": "Lookup",
      "shortDescription": "Allows us to create a promise that will resolve with the entity referenced in the lookup whenever that list",
      "keywords": "allows api building cache create entity full function getentity item list location lookup lookupid lookupvalue object project promise referenced referencing registered resolve resolves title var"
    },
    {
      "section": "api",
      "id": "Lookup.getProperty",
      "shortName": "Lookup.getProperty",
      "type": "function",
      "moduleName": "Lookup",
      "shortDescription": "Returns a promise which resolves with the value of a property in the referenced object.",
      "keywords": "api building city doesn dot entity exists function getproperty location lookup lookupid lookupvalue object project promise property propertypath referenced resolves returns separated title undefined var"
    },
    {
      "section": "api",
      "id": "Model",
      "shortName": "Model",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Model Constructor",
      "keywords": "active addnewitem adds api apmodelfactory application array attachments boolean builds costestimate currency customer customfields customlist data deferred definition denotes empty extend factory false fictitious field fields file formats function getalllistitems group guid identifies individual internalname items js list ll lookup mappedname maps model named names obj object objecttype offline optional options params passed project projectdescription projectgroup projects projectsmodel queries read readonly ready sharepoint spaces status taskmanager text title true types unique user var xml"
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
      "keywords": "api apmodelfactory current details evaluated expect function level model permission permissionobject projectsmodel properties resolvepermissions returned user var"
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
      "keywords": "ability allows api ascending cachexml called caml camlrowlimit changes check control data doesn don efficient false fresh function getlistitems inherit initialization model modifications modified operation optionally options parameters parent passed permissions prevents primary project queries query queryoptions receive recentchanges records reference registerquery request response retrieve returned returns scope set sharepoint time true user"
    },
    {
      "section": "api",
      "id": "Query.execute",
      "shortName": "Query.execute",
      "type": "function",
      "moduleName": "Query",
      "shortDescription": "Query SharePoint, pull down all initial records on first call along with list definition if using",
      "keywords": "api array call calls changes dataservice definition execute executequery function getlistitemchangessincetoken getlistitems initial item larger list note objects operation options passed pull pulls query records sharepoint subsequent"
    },
    {
      "section": "api",
      "id": "Query.searchLocalCache",
      "shortName": "Query.searchLocalCache",
      "type": "function",
      "moduleName": "Query",
      "shortDescription": "Simple wrapper that by default sets the search location to the local query cache.",
      "keywords": "api cache default evaluate function local location model object options pass prototype query search searching searchlocalcache sets simple undefined wrapper"
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