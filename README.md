#angular-point [![Build Status](https://travis-ci.org/scatcher/angular-point.png?branch=master)](https://travis-ci.org/scatcher/angular-point)


This library is the core component in all angular-point based SharePoint/AngularJS SPA applications.

##Highlights

* Each list is defined in single location [listName]Model.js and this model handles all caching of data and syncing 
with SharePoint.
* Default query type only pulls data that has been changed since the last call and keeps cache fresh.  Optionally can 
utilize sessionStorage or localStorage to persist query information between application sessions
* All data for a query is automatically cached in the model for future retrieval without any additional configuration.
* Decodes all native SharePoint data types and converts into JS using field configuration objects defined in model.
* Encodes all JS properties to XML values and builds payload once again based on field configuration objects.
* Single list item can appear in multiple cache locations based on query it was retrieved in but there exists only 1
shared instance of this list item so you don't have to worry about your local cache getting out of sync.
* Supports 3-way data binding if you decide to incorporate [Firebase](https://www.firebase.com/) (any change by any user to a list item is 
mirrored across users).  The data isn't saved to [Firebase](https://www.firebase.com/) but the change event is so all subscribers are notified to request an update from SharePoint
* Over 200 supporting unit tests
* Used in several very large production environments.
* All CRUD functionality is inherited from the model, list, and list item base classes so you can easily call this shared functionality from any of these objects

````html
<!-- I produce a lot of inputs that can be updated and saved -->
<div ng-repeat="todo in vm.todos" class="form-group"> 
    <input ng-model="todo.title" class="form-control">
    <button ng-click="vm.save(todo) 
        ng-disabled="vm.negotiatingWithServer" 
        class="btn btn-primary">Save</button>
</div>
````

````typescript

module app {
    'use strict';

    class TodoController {
        negotiatingWithServer = false;
        todos: Todo[];
        constructor(todoModel: TodoModel) {
            var vm = this;
            todosModel.executeQuery('myTodos')
                .then((todoCache: ap.IndexedCache<Todo>) => {
                    //I now have my cached todos but I need to
                    //convert to array for some reason...
                    vm.todos = todoCache.toArray();
                  
                })
                .catch((err) => {
                    //Looks like we have an issue!
                    throw new Error(err);
                });
        }
        save(todo: Todo) {
            //Disable save to prevent multiple submissions
            this.negotiatingWithServer = true;
            
            //Async save
            todo.saveChanges()
                .then((results) => {
                    //Item saved without issue, local cache is 
                    //updated, and Angular updates the view
                    
                    //Enable buttons again
                    this.negotiatingWithServer = false;
                })
                .catch((err) => {
                    //Bad things...
                    throw new Error(err);
                });
        }
    }

    angular.module('angular-point-example')
        .controller('todoController', TodoController);
}

````

##Background
This project evolved out of the necessity to create rich custom "apps" in a range of SharePoint environments (2007+) 
without the ability to deploy server-side code.  For many years we built these applications using a combination of XSL 
Templates and jQuery but the limited amount of code reuse and temperamental nature of SharePoint Designer "inspired" 
us to look for a better alternative.

This project originally evolved as a collection of enhancements to Marc Anderson's incredible [SPServices](http://spservices.codeplex.com/) 
library.  Since that point, a lot has changed but much of the core transactional logic still relies on pieces of SPServices.  Thanks Marc!

Over the past year this project has been converted from vanilla ES5 to TypeScript and the benefits of having strong 
typing in all projects that use this library is pretty amazing.  

##Getting Started
(1) Install with bower
````cmd
bower install angular-point
````
(2) Add bower_components/angular-point/dist/angular-point.js to your index.html.

(3) Add 'angular-point' to your main module's list of dependencies

(4) If using tsd, optionally let tsd know where the angular-point TypeScript code is so we can benefit from library typings.
````cmd
tsd link
````

(5) Create your models which represents your lists or library (details below).


##Examples
A simple example project needs to be created but for
now I've stripped out all proprietary data from one of our older sample applications which can be found here: 
[angular-point-example](https://github.com/scatcher/angular-point-example).  There's a lot going on in this example but 
it should provide some insight into how this library can be used.

##Dependencies
The only required library that angular-point depends on is [lodash](https://lodash.com/).  Optionally also include [angular-toastr](https://github.com/Foxandxss/angular-toastr) in your project if you'd like to utilize built in toasts.
````cmd
bower install lodash --save
bower install angular-toastr --save
````
Make sure these are loaded prior to angular-point.

##Model
The model is where we define the list item constructor and the [list](http://scatcher.github.io/angular-point/#/api/List) itself.  It is extended
using the core ap.Model class which provides all common model functionality.  More information can be found at the main
[angular-point docs](http://scatcher.github.io/angular-point/#/api/angularPoint) site on the left side nav under "Model".

The "Project" class defines an individual project list item and each new list item we retrieve from SharePoint is 
instantiated using this class so all methods are available directly from the list item object.  The list item is 
extended using the base "ap.ListItem" class that includes the default methods available to all list items.  More info 
can be found for each of the available methods [here](http://scatcher.github.io/angular-point/#/api/angularPoint) under 
the "ListItem" nav on the left side.

````typescript

module app {
    'use strict';
    
    //List item constructor
    export class Project extends ap.ListItem<Project>{
        active: boolean;
        attachments: string[];
        costEstimate: number;
        customer: ap.ILookup<Customer>;
        group: ap.ILookup<Group>;
        projectDescription: string;
        status: string;
        taskManager: ap.IUser;
        title: string;
        users: ap.IUser[];
        constructor(obj) {
            super(obj);
            _.assign(this, obj);
        }
        //Simple getter
        get label(): string {
            return 'Project Name is ' + this.title;
        }
        //Method that all projects now are able to call which reaches 
        //out to the model for this list item
        doSomethingOnModel(): void {
            //GetModel along with many other methods added when extending from ap.ListItem.  In this case
            //it would return the instantiated ProjectsModel below.
            let model = this.getModel();
            return model.someExposedModelMethod();
        }

    }
    
    //Model definition, contains list information, field definitions, and 
    //model specific methods
    export class ProjectsModel extends ap.Model {
        constructor() {
            super({
                factory: Project, //References the list item constructor above
                list: {
                    //The magic that all list/library based requests require
                    guid: '{PROJECT LIST GUID}',
                    title: 'Projects',
                    customFields: [
                        {
                            staticName: 'Title', //Name that SharePoint uses
                            objectType: 'Text',  //Type of object to decode/encode
                            mappedName: 'title'  //JavaScript property name on list item
                        },
                        {
                            staticName: 'Customer',
                            objectType: 'Lookup',
                            mappedName: 'customer'
                        },
                        {
                            staticName: 'ProjectDescription',
                            objectType: 'Text',
                            mappedName: 'projectDescription'
                        },
                        {
                            staticName: 'Status',
                            objectType: 'Text',
                            mappedName: 'status'
                        },
                        {
                            staticName: 'TaskManager',
                            objectType: 'User',
                            mappedName: 'taskManager'
                        },
                        {
                            staticName: 'ProjectGroup',
                            objectType: 'Lookup',
                            mappedName: 'group'
                        },
                        {
                            staticName: 'CostEstimate',
                            objectType: 'Currency',
                            mappedName: 'costEstimate'
                        },
                        {
                            staticName: 'Active',
                            objectType: 'Boolean',
                            mappedName: 'active'
                        },
                        {
                            staticName: 'Attachments',
                            objectType: 'Attachments',
                            mappedName: 'attachments',
                            readOnly: true
                        }
                    ]
                }
            });

            let model = this;

            /** 
            * Query to retrieve the most recent 25 modifications, gets all records the first 
            * time it's called and just gets changes for each additional call but still
            * resolves with entire cache for this query.  To execute we just call
            * model.executeQuery('recentChanges').
            */
            model.registerQuery({
                name: 'recentChanges', //Unique name for this query
                rowLimit: 25, //Defaults to all list items if not specified
                query: '' +
                '<Query>' +
                '   <OrderBy>' +
                //Get most recent list items
                '       <FieldRef Name="Modified" Ascending="FALSE"/>' +
                '   </OrderBy>' +
                // Prevents any records from being returned if user
                // doesn't have permissions on project lookup list
                '   <Where>' +
                '       <IsNotNull>' +
                '           <FieldRef Name="Project"/>' +
                '       </IsNotNull>' +
                '   </Where>' +
                '</Query>'
            });
           
            /**
            * When called simply fetches all list items using
            * GetListItemChangesSinceToken (Default) operation.  Initial
            * call pulls entire list and we receive a change token.
            * All future calls use the change token from the previous
            * call to retrieve the list items that have 
            * changed and the returned IndexedCache is updated 
            * accordingly.
            */
            model.registerQuery({ name: 'simpleQuery' });

            /**
             * Similar to above, but this query will store the 
             * list items and change token in browser session 
             * storage so if user comes back before storage 
             * expires we just rehydrate stored list items and
             * request changes since the last request.
             */            
            model.registerQuery({
                name: 'sessionStorageQuery',
                sessionStorage: true,
                //Defaults to 24 hours but we are overiding to 8 hours
                localStorageExpiration: 28800000
            });
            
            /**
             * In this example we request the list items a single
             * time and all subsequent calls get the already resolved
             * initial promise.  This works well for data that doesn't
             * change often and the GetListItems operation is much smaller
             * than the default GetListItemChangesSinceToken operation. */            
            model.registerQuery({
                name: 'runOnce',
                operation: 'GetListItems',
                runOnce: true
            });

             
             
            //Any other model setup
        }
        someExposedModelMethod(): void {
            this.dosomething...
        }
    }
}
````

The first important thing that needs to be defined here is the list.guid 
because this is the unique identifier used in all web service calls to interact with the SOAP web services for this 
list or library.

The next thing that needs to be defined is the list.customFields array which maps our SharePoint field names/types to
our JavaScript property names/values.  Based on the defined type of field, we format the value accordingly but by default
all field objectTypes are Text.  See [the field documentation](http://scatcher.github.io/angular-point/#/api/Field) for
additional info.

At this point it's time to define our named queries using the 
[model.registerQuery](http://scatcher.github.io/angular-point/#/api/Model.registerQuery) method on the instantiated
model.  Once registered, you'll be able to execute this query from anywhere in the application using 

````typescript

module app {
    'use strict';

    class ProjectController {
        projects: Project[];
        constructor(projectsModel: ProjectsModel) {
            var vm = this;
            projectsModel.executeQuery('recentChanges')
                .then((projectCache: ap.IndexedCache<Project>) => {
                    //I now have my cached projects but I need to convert to array
                    vm.projects = projectCache.toArray();
                })
                .catch((err) => {
                    //The ball has been dropped
                    throw new Error(err);
                });
        }
    }

    angular.module('angular-point-example')
        .controller('projectController', ProjectController);
}
````

Additional info on the model.executeQuery method can be found [here](http://scatcher.github.io/angular-point/#/api/Model.executeQuery).  It will be
return inside of an [IndexedCache](http://scatcher.github.io/angular-point/#/api/IndexedCache).

At this point the data source is ready to be used within the application.


##Offline Development 
#####(Made to work with [angular-point-tools](https://github.com/scatcher/angular-point-tools))

The offline development environment included with library attempts to utilize cached XML query responses from the 
lists you're planning to use.  As a fallback, the offline environment attempts to generate mock XML responses 
(although not very well).  

The offline environment will intercept all outgoing calls to SharePoint and depending if you have cached xml files
available will return cached server responses or dynamically generated mock server responses.  All application 
interactions while in this environment will persist until the browser is reloaded.  

All project script/style files in the main app folder will automatically get injected into the build blocks contained
in the app/index.html file so there is no need to manually create script/style references.  Any changes made to the 
code will cause any necessary compilers (TypeScript/LESS) to run and the browser will automatically refresh.


##Authentication
SharePoint handles authentication so in order to load the main application index.html file, the user has already 
been authenticated by SharePoint.  At that point we know who the user is and can retrieve any other information at 
that time.  We still use SharePoint groups to manage user permissions and there is a supporting 
[angular-point-group-manager](https://github.com/scatcher/angular-point-group-manager) directive that makes user 
management pretty simple directly within the application and allows complex logic like combining groups.  Because 
the application is requesting data on the client-side on behalf of the user, the application runs with the 
permissions of the user so we can ensure only authorized data can be retrieved/modified just as if the user was
attempting the update information in the typical SharePoint environment.


##Optional Modules
This is the core component of the angular-point project but there are a few optional modules:

* [angular-point-attachments](https://github.com/scatcher/angular-point-attachments) Simple directive for angular-point that handles base64 encoding on file upload, deletion, and viewing of attachments.
* [angular-point-discussion-thread](https://github.com/scatcher/angular-point-discussion-thread) Simple discussion thread directive for angular point.  Uses a normal long text field on a list item and stores discussion as JSON object.
* [angular-point-formly-templates](https://github.com/scatcher/angular-point-formly-templates) A collection of formly templates designed to support angular-point projects.
* [angular-point-group-manager](https://github.com/scatcher/angular-point-group-manager) Directive that improves group management within SharePoint.  Allows complex functionality to combining groups and displaying all groups for a given user.
* [angular-point-lookup-cache](https://github.com/scatcher/angular-point-lookup-cache) Service used to create caches for specified lookup fields to eliminate the need to iterate over the entire list to find related items.
* [angular-point-modal](https://github.com/scatcher/angular-point-modal) Modal service for angular-point and ui-bootstraps modal dialog.
* [angular-point-offline-generator](https://github.com/scatcher/angular-point-offline-generator) Directive used to export XML for a given list/library for use in offline development environment.
* [angular-point-sync](https://github.com/scatcher/angular-point-sync) Adds ability to use [Firebase](https://www.firebase.com/) within angular-point to sync data between all subscribed users.
* [angular-point-tools](https://github.com/scatcher/angular-point-tools) Build tools shared by angular-point projects.


##Angular 2
At this point there is relatively little in this library that relies and Angular 1.  That being said, my experiences so far with 
Angular 2 have been pretty bumpy so we'll need to see what the development story looks like as we get a little closer to
a production ready release of NG2.
