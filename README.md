angular-point [![Build Status](https://travis-ci.org/scatcher/angular-point.png?branch=master)](https://travis-ci.org/scatcher/angular-point)
============

angular-point is an initial attempt at hosting a full AngularJS SPA directly within SharePoint.

This project evolved out of the necessity to create rich custom "apps" in a range of SharePoint environments (2007+) without the ability to deploy server-side code.  For many years I built these applications using a combination of XSL Templates and jQuery but the limited amount of code reuse and temperamental nature of SharePoint Designer "inspired" me to look for a better alternative.  This is still very much a work in progress but the goal is to get a single

Highlights
---------
* Each list is defined in single location [listName]Model.js
* Default query type only pulls data that has been changed since the last call and keeps cache fresh
* Data for a query is automatically cached in the model for future retrieval
* Provides deep search functionality for cached data that caches results to speed up future calls if no changes have been made

        //Find a list item that has a lookup field set that references an item in another list with an id of 1
        var listItemImLookingFor = theModelOfTheListItem.searchLocalCache(1, {propertyPath: 'field.lookupId'});
* Supports IE8 (really wish I didn't have this requirements)
* All CRUD functionality if iherited from the model, list, and list item prototypes so you can easily call this functionality from any of these objects
 
        <!-- I produce a lot of inputs -->
        <div ng-repeat="listItem in listItems"> 
          <input ng-model="listItem.title>
          <button ng-click="saveMe(listItem)>Save</button>
        </div>

        $scope.saveMe = function(listItem) {
          listItem.saveChanges().then(function(results) {
            //Item saved without issue, local cache is updated, and Angular updates the view
            //Can do something with results if I want
          }
        }
* Supports 3-way data binding if you decide to incorporate firebase (any change by any user to a list item is mirrored across users).  The data isn't saved to firebase but the change event is so all subscribers are notified to request an update from SharePoint

dataService
---------
* Abstracts much of the functionality from Marc Anderson's SPServices and serves as a wrapper
* Uses $q to handle promises to provide better consistency within Angular
* Uses field mappings from models to only request/submit necessary fields
* Converts received XML into JS objects based on field type and similarly flattens these objects when submitting data back to SharePoint

modelService
---------
* Creates base prototypes for Model, List, Query, and ListItem
* Prototypes inherit a variety of methods that allow us to interact directly with the individual objects (see dist/docs/function for details)


At a very high level, these services are my attempt to abstract much of the normal setup process of an application of this type and allow more time to  

At a very high level, these services allow us to define a model (contains the definition of a SharePoint list and allows us to extend list items using JavaScript's prototypal inheritence as well as cache local entities) to do some pretty cool things to a list with minimal setup.

without the traditional overhead associated with SharePoint.  I began creating these application with XSL Templates but the reuse was very low and data quickly became stale.

There are Primarily this is a  combination of the AngularJS $http service we've extended Marc Anderson's SPServices library to negotiate with SharePoint's SOAP web services.  This allows us to create solutions for SharePoint 2007+;

SharePoint then acts only as a authentication and data storage mechanism and allows us to create a completely unique application (SPA) using AngularJS and SharePoint.
Common resources shared by all angularPoint (mix of SharePoint and AngularJS) instances with a

Instead of using Angular's $http service we've extended Marc Anderson's SPServices library to negotiate with SharePoint's SOAP web services.  This allows us to create solutions for SharePoint 2007+;

