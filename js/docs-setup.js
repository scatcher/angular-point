NG_DOCS={
  "sections": {
    "api": "API Documentation"
  },
  "pages": [
    {
      "section": "api",
      "id": "apCacheService",
      "shortName": "apCacheService",
      "type": "service",
      "moduleName": "apCacheService",
      "shortDescription": "Stores a reference for all list items based on list GUID and list item id.  Allows us to then register promises that",
      "keywords": "allows apcacheservice api based future guid item items list promises reference register registered requested resolve service stores"
    },
    {
      "section": "api",
      "id": "apCacheService.EntityCache",
      "shortName": "apCacheService.EntityCache",
      "type": "function",
      "moduleName": "apCacheService",
      "shortDescription": "Cache constructor that maintains a queue of all requests for a list item, counter for the number of times",
      "keywords": "add apcacheservice api belongs cache counter entity entitycache entityid entitytype function functionality guid item list maintains number queue requests times timestamp update updated"
    },
    {
      "section": "api",
      "id": "apCacheService.getEntity",
      "shortName": "apCacheService.getEntity",
      "type": "function",
      "moduleName": "apCacheService",
      "shortDescription": "Returns a deferred object that resolves with the requested entity immediately if already present or at some",
      "keywords": "apcacheservice api assuming belongs deferred entity entityid entitytype eventually function future getentity guid item list object point registered requested resolves returns"
    },
    {
      "section": "api",
      "id": "apCacheService.registerEntity",
      "shortName": "apCacheService.registerEntity",
      "type": "function",
      "moduleName": "apCacheService",
      "shortDescription": "Registers an entity in the cache and fulfills any pending deferred requests for the entity.",
      "keywords": "add apcacheservice api cache created deferred entity fulfills function newly pass pending registerentity registers requests"
    },
    {
      "section": "api",
      "id": "apCacheService.removeEntity",
      "shortName": "apCacheService.removeEntity",
      "type": "function",
      "moduleName": "apCacheService",
      "shortDescription": "Removes the entity from the local entity cache.",
      "keywords": "apcacheservice api belongs cache entity entityid entitytype function guid item list local removeentity removes"
    },
    {
      "section": "api",
      "id": "dataService",
      "shortName": "dataService",
      "type": "service",
      "moduleName": "dataService",
      "shortDescription": "Handles all interaction with SharePoint web services",
      "keywords": "additional anderson api calls codeplex dataservice documentation handles http interaction marc service services sharepoint spservices web"
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
      "shortDescription": "Post processing of data after returning list items from server",
      "keywords": "allow api array call configuration data dataservice definitions elements factory field filter find function getcache items iterate list local mapping mode model object optional optionally options pass post processing processlistitems promise reference replace resolved responsexml return returning server service spservices store stored string target typeically typically update updating web xml"
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
      "id": "fieldService",
      "shortName": "fieldService",
      "type": "service",
      "moduleName": "fieldService",
      "shortDescription": "Handles the mapping of the various types of fields used within a SharePoint list",
      "keywords": "api fields fieldservice handles list mapping service sharepoint types"
    },
    {
      "section": "api",
      "id": "fieldService.defaultFields",
      "shortName": "fieldService.defaultFields",
      "type": "function",
      "moduleName": "fieldService",
      "shortDescription": "Read only fields that should be included in all lists",
      "keywords": "api defaultfields fields fieldservice function included lists read"
    },
    {
      "section": "api",
      "id": "fieldService.extendFieldDefinitions",
      "shortName": "fieldService.extendFieldDefinitions",
      "type": "function",
      "moduleName": "fieldService",
      "shortDescription": "",
      "keywords": "api array combine creates default defined defines definition extendfielddefinitions field fields fieldservice function list model populates query reference requested sharepoint string viewfields xml"
    },
    {
      "section": "api",
      "id": "fieldService.Field",
      "shortName": "fieldService.Field",
      "type": "function",
      "moduleName": "fieldService",
      "shortDescription": "Decorates field with optional defaults",
      "keywords": "api decorates defaults definition field fieldservice function obj optional"
    },
    {
      "section": "api",
      "id": "fieldService.getDefaultValueForType",
      "shortName": "fieldService.getDefaultValueForType",
      "type": "function",
      "moduleName": "fieldService",
      "shortDescription": "Returns the empty value expected for a field type",
      "keywords": "api based default empty expected field fieldservice fieldtype function getdefaultvaluefortype returns type"
    },
    {
      "section": "api",
      "id": "fieldService.getMockData",
      "shortName": "fieldService.getMockData",
      "type": "function",
      "moduleName": "fieldService",
      "shortDescription": "Can return mock data appropriate for the field type, by default it dynamically generates data but",
      "keywords": "api appropriate build chancejs coded data default definition dynamic dynamically field fieldservice fieldtype function generates getmockdata hard https mock mockdata optional param params produce return specific staticvalue type"
    },
    {
      "section": "api",
      "id": "fieldService.mockPermMask",
      "shortName": "fieldService.mockPermMask",
      "type": "function",
      "moduleName": "fieldService",
      "shortDescription": "Defaults to a full mask but allows simulation of each of main permission levels",
      "keywords": "allows api container defaults fieldservice full function levels main mask mockpermmask optional options permission permissionlevel simulation values"
    },
    {
      "section": "api",
      "id": "fieldService.resolveValueForEffectivePermMask",
      "shortName": "fieldService.resolveValueForEffectivePermMask",
      "type": "function",
      "moduleName": "fieldService",
      "shortDescription": "Takes the name of a permission mask and returns a permission value which can then be used",
      "keywords": "addlistitems api approveitems deletelistitems editlistitems fieldservice fullmask function generate mask modelservice object options permask permission resolvepermissions resolvevalueforeffectivepermmask returns takes viewlistitems"
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
      "id": "ListItem.getFieldVersionHistory",
      "shortName": "ListItem.getFieldVersionHistory",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "Takes an array of field names, finds the version history for field, and returns a snapshot of the object at each",
      "keywords": "api array build changes combining definitions field fields finds function getfieldversionhistory history independently interested item list listitem model mygenericlistitem names non-readonly object project promise provided pull requests responses returns server snapshot takes title ve version versions working"
    },
    {
      "section": "api",
      "id": "ListItem.resolvePermissions",
      "shortName": "ListItem.resolvePermissions",
      "type": "function",
      "moduleName": "ListItem",
      "shortDescription": "See modelFactory.resolvePermissions for details on what we expect to have returned.",
      "keywords": "api current details evaluated expect function level listitem modelfactory mygenericlistitem permission permissionobject properties resolvepermissions returned user var"
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
      "keywords": "$q alternative api array automatically bother business cache cached currently data default ensure entire entity faster field fieldarray fields function intensive internal item items list listitem logic named names object optionally params pass process processed progresscounter promise promises push query queue request required resolves saved savefields saves saving search server service sharepoint single store stored subset title update updateallcaches updated updating var view"
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
      "id": "modalService",
      "shortName": "modalService",
      "type": "service",
      "moduleName": "modalService",
      "shortDescription": "Extends a modal form to include many standard functions",
      "keywords": "$modal angular api bootstrap extends form functions include modal modalservice service standard"
    },
    {
      "section": "api",
      "id": "modalService.deleteEntity",
      "shortName": "modalService.deleteEntity",
      "type": "function",
      "moduleName": "modalService",
      "shortDescription": "Prompts for confirmation of deletion, then deletes and closes modal",
      "keywords": "$modalinstance $scope api closes confirmation controllers deleteentity deleterequest deletes deletion dialog entity function instance item javascript list modal modalservice object prompts reference representing request sharepoint"
    },
    {
      "section": "api",
      "id": "modalService.getPermissions",
      "shortName": "modalService.getPermissions",
      "type": "function",
      "moduleName": "modalService",
      "shortDescription": "Returns an object containing the permission levels for the current user",
      "keywords": "api boolean current entity fullcontrol function getpermissions item javascript levels list modalservice object permission representing returns sharepoint user usercanapprove usercandelete"
    },
    {
      "section": "api",
      "id": "modalService.initializeState",
      "shortName": "modalService.initializeState",
      "type": "function",
      "moduleName": "modalService",
      "shortDescription": "Creates a state object, populates permissions for current user, and sets display mode",
      "keywords": "$scope api creates current dateexceedsboundary display enableapproval entity extended false function initializestate item javascript list modalservice mode object optional params permissions populates representing returns sets sharepoint user"
    },
    {
      "section": "api",
      "id": "modalService.modalModelProvider",
      "shortName": "modalService.modalModelProvider",
      "type": "function",
      "moduleName": "modalService",
      "shortDescription": "Extends a model to allow us to easily attach a modal form that accepts and injects a",
      "keywords": "accepts allow api argument arguments attach comprequestmodalctrl configuration controller dynamic easily edited expectedarguments extends form function html injects item modal modalmodelprovider modalservice model modules number object openmodal options reference request templateurl view"
    },
    {
      "section": "api",
      "id": "modalService.saveEntity",
      "shortName": "modalService.saveEntity",
      "type": "function",
      "moduleName": "modalService",
      "shortDescription": "Creates a new record if necessary, otherwise updates the existing record",
      "keywords": "$modalinstance $scope api comprequestsmodel creates depricated dialog entity existing function instance item list modal modalservice model record reference request saveentity saverequest updates"
    },
    {
      "section": "api",
      "id": "Model",
      "shortName": "Model",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Model Constructor",
      "keywords": "active addnewitem adds api application array attachments boolean builds costestimate currency customer customfields customlist data deferred definition denotes empty extend factory false fictitious field fields file formats function getalllistitems group guid identifies individual internalname items js list ll lookup mappedname maps model modelfactory named names obj object objecttype offline optional options params passed project projectdescription projectgroup projects projectsmodel queries read readonly ready sharepoint spaces status taskmanager text title true types unique user var xml"
    },
    {
      "section": "api",
      "id": "Model.addNewItem",
      "shortName": "Model.addNewItem",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Using the definition of a list stored in a model, create a new list item in SharePoint.",
      "keywords": "additional addnewitem allows api automatically based cache converted create created customer data defined definition definitions dependent description entity fictitious field function item js key list local logic lookupid model newly object options pairs pass project projectmodel projectsmodel promise query resolved returned server service sharepoint stored title unique update updated valid view"
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
      "moduleName": "modelFactoryModel",
      "shortDescription": "Inherited from Model constructor",
      "keywords": "$scope api caches current data entities fictitious function getalllistitems inherited items js list model modelfactorymodel processes projectmodel projects projectsmodel promise resolved returned returning xml"
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
      "id": "Model.getQuery",
      "shortName": "Model.getQuery",
      "type": "function",
      "moduleName": "Model",
      "shortDescription": "Helper function that attempts to locate and return a reference to the requested or catchall query.",
      "keywords": "additional api attempts catchall customquery details function getquery helper identify key locate model namedquery primary primaryquery projectmodel prototype query reference requested return unique var"
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
      "shortDescription": "Constructor that allows us create a static query with a reference to the parent model",
      "keywords": "$scope allow allows api array ascending associated assume cache call changes check create creates custom dataservice default doesn dynamically entities execute executequery exist field function functionality inherit isobject items list listitem local lookup lookupid matching model object optional options param parent pass permissions pid prevents primary project projectid projectmodel projects projecttasksmodel prototype queries query querybyprojectid querykey records reference register registerquery return returned returns specific static stored title true type unique user var"
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
      "id": "modelFactory",
      "shortName": "modelFactory",
      "type": "service",
      "moduleName": "Model",
      "shortDescription": "The &#39;modelFactory&#39; provides a common base prototype for Model, Query, and List Item.",
      "keywords": "api base common item list model modelfactory prototype query service"
    },
    {
      "section": "api",
      "id": "modelFactory.registerChange",
      "shortName": "modelFactory.registerChange",
      "type": "function",
      "moduleName": "modelFactory",
      "shortDescription": "If online and sync is being used, notify all online users that a change has been made.",
      "keywords": "api break change desired event firebase function functionality model modelfactory module notify online registerchange sync users"
    },
    {
      "section": "api",
      "id": "modelFactory.resolvePermissions",
      "shortName": "modelFactory.resolvePermissions",
      "type": "function",
      "moduleName": "modelFactory",
      "shortDescription": "Converts permMask into something usable to determine permission level for current user.  Typically used",
      "keywords": "api assigned bit codeplex converts current determine directly false flags function group http identifying integer item level list listitem mask modelfactory permission permissionsmask permmask property resolvepermissions rights set site somelistitem specifies typically unsigned usable user wss"
    },
    {
      "section": "api",
      "id": "Query",
      "shortName": "Query",
      "type": "function",
      "moduleName": "Query",
      "shortDescription": "Primary constructor that all queries inherit from.",
      "keywords": "ability allows api ascending cachexml called caml camlrowlimit changes check control data doesn don efficient false fresh function getlistitems inherit initialization model modifications modified operation optionally options parameters parent passed permissions prevents primary project queries query queryoptions receive recentchanges records reference registerquery request response retrieve returned returns scope set sharepoint time user"
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
    },
    {
      "section": "api",
      "id": "queueService",
      "shortName": "queueService",
      "type": "service",
      "moduleName": "queueService",
      "shortDescription": "Simple service to monitor the number of active requests we have open with SharePoint",
      "keywords": "active animation api display loading monitor number open queueservice requests service sharepoint simple sort typical"
    },
    {
      "section": "api",
      "id": "queueService.increase",
      "shortName": "queueService.increase",
      "type": "function",
      "moduleName": "queueService",
      "shortDescription": "Increase the counter by 1.",
      "keywords": "api counter function increase queueservice"
    },
    {
      "section": "api",
      "id": "queueService.registerObserverCallback",
      "shortName": "queueService.registerObserverCallback",
      "type": "function",
      "moduleName": "queueService",
      "shortDescription": "Register an observer",
      "keywords": "api call callback change function observer queueservice register registerobservercallback"
    },
    {
      "section": "api",
      "id": "queueService.reset",
      "shortName": "queueService.reset",
      "type": "function",
      "moduleName": "queueService",
      "shortDescription": "Reset counter to 0.",
      "keywords": "api count counter current function incrementing queueservice reset"
    },
    {
      "section": "api",
      "id": "queueService.reset",
      "shortName": "queueService.reset",
      "type": "function",
      "moduleName": "queueService",
      "shortDescription": "Decrease the counter by 1.",
      "keywords": "api count counter current decrease decrementing function queueservice reset"
    },
    {
      "section": "api",
      "id": "utilityService",
      "shortName": "utilityService",
      "type": "service",
      "moduleName": "utilityService",
      "shortDescription": "Provides shared utility functionality across the application.",
      "keywords": "api application functionality service shared utility utilityservice"
    },
    {
      "section": "api",
      "id": "utilityService.attrToJson",
      "shortName": "utilityService.attrToJson",
      "type": "function",
      "moduleName": "utilityService",
      "shortDescription": "Converts a SharePoint string representation of a field into the correctly formatted JavaScript version",
      "keywords": "api attrtojson based boolean calc converts correctly counter currency datetime definition field float formatted function integer javascript json lookup lookupmulti multichoice number object options representation sharepoint string text type user usermulti utilityservice version"
    },
    {
      "section": "api",
      "id": "utilityService.dateWithinRange",
      "shortName": "utilityService.dateWithinRange",
      "type": "function",
      "moduleName": "utilityService",
      "shortDescription": "Converts dates into yyyymmdd formatted ints and evaluates to determine if the dateToCheck",
      "keywords": "api converts current dates datetocheck datewithinrange defaults determine enddate evaluates fall falls formatted function ints provided range startdate starting utilityservice yyyymmdd"
    },
    {
      "section": "api",
      "id": "utilityService.stringifySharePointDate",
      "shortName": "utilityService.stringifySharePointDate",
      "type": "function",
      "moduleName": "utilityService",
      "shortDescription": "Converts a JavaScript date into a modified ISO8601 date string using the TimeZone offset for the current user.",
      "keywords": "api converts current function iso8601 javascript js modified offset string stringifysharepointdate timezone user utilityservice valid"
    },
    {
      "section": "api",
      "id": "utilityService.stringifySharePointMultiSelect",
      "shortName": "utilityService.stringifySharePointMultiSelect",
      "type": "function",
      "moduleName": "utilityService",
      "shortDescription": "Turns an array of, typically &#123;lookupId: someId, lookupValue: someValue&#125;, objects into a string",
      "keywords": "api array delimited doesn field find format function ll lookup lookupid lookupvalue multi multiselectvalue objects pass passed property select selection sharepoint someid somevalue string stringifysharepointmultiselect turns typically user utilityservice values"
    },
    {
      "section": "api",
      "id": "utilityService.xmlToJson",
      "shortName": "utilityService.xmlToJson",
      "type": "function",
      "moduleName": "utilityService",
      "shortDescription": "Converts an XML node set to Javascript object array. This is a modified version of the SPServices",
      "keywords": "api array attributes converts field function getlistitems includeallattrs javascript leading mappedname mapping modified node object objects objecttype options ows_ parsed removeows return rows set spservices spxmltojson stripped true utilityservice version xml xmltojson"
    },
    {
      "section": "api",
      "id": "utilityService.yyyymmdd",
      "shortName": "utilityService.yyyymmdd",
      "type": "function",
      "moduleName": "utilityService",
      "shortDescription": "Convert date into a int formatted as yyyymmdd",
      "keywords": "api comparison convert don easier evaluate formatted function int portion time utilityservice yyyymmdd"
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