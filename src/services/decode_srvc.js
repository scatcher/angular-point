'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apDecodeService
 * @description
 * Processes the XML received from SharePoint and converts it into JavaScript objects based on predefined field types.
 *
 * @requires angularPoint.apUtilityService
 * @requires angularPoint.apQueueService
 * @requires angularPoint.apConfig
 * @requires angularPoint.apCacheService
 */
angular.module('angularPoint')
  .service('apDecodeService', function ($q, apUtilityService, apQueueService, apConfig, apCacheService) {

    return {
      attrToJson: attrToJson,
      lookupToJsonObject: lookupToJsonObject,
      parseFieldDefinitionXML: parseFieldDefinitionXML,
      parseFieldVersions: parseFieldVersions,
      processListItems: processListItems,
      updateLocalCache: updateLocalCache,
      xmlToJson: xmlToJson
    };

    /**
     * @ngdoc function
     * @name angularPoint.apDecodeService:processListItems
     * @methodOf angularPoint.apDecodeService
     * @description
     * Post processing of data after returning list items from server.  Returns a promise that resolves with
     * the processed entities.  Promise allows us to batch conversions of large lists to prevent ui slowdowns.
     * @param {object} model Reference to allow updating of model.
     * @param {xml} responseXML Resolved promise from SPServices web service call.
     * @param {object} [options] Optional configuration object.
     * @param {function} [options.factory=model.factory] Constructor function typically stored on the model.
     * @param {string} [options.filter='z:row'] XML filter string used to find the elements to iterate over.
     * @param {Array} [options.mapping=model.list.mapping] Field definitions, typically stored on the model.
     * @param {string} [options.mode='update'] Options for what to do with local list data array in
     * store ['replace', 'update', 'return']
     * @param {Array} [options.target=model.getCache()] Optionally pass in array to update after processing.
     * @returns {object} Promise
     */
    function processListItems(model, responseXML, options) {
      var deferred = $q.defer();

      var defaults = {
        /** Default list item constructor */
        ctor: function (item) {
          /** Allow us to reference the originating query that generated this object */
          item.getQuery = function () {
            return opts.getQuery();
          };
          /** Create Reference to the containing array */
          item.getContainer = function () {
            return opts.target;
          };
          var listItem = new model.factory(item);

          /** Register in global application entity cache */
          apCacheService.registerEntity(listItem);
          return listItem;
        },
        factory: model.factory,
        filter: 'z:row',
        mapping: model.list.mapping,
        mode: 'update',
        target: model.getCache()
      };

      var opts = _.extend({}, defaults, options);

      /** Map returned XML to JS objects based on mapping from model */
      var filteredNodes = $(responseXML).SPFilterNode(opts.filter);

      xmlToJson(filteredNodes, opts).then(function (entities) {
        if (opts.mode === 'replace') {
          /** Replace any existing data */
          opts.target = entities;
          if (apConfig.offline) {
            console.log(model.list.title + ' Replaced with ' + opts.target.length + ' new records.');
          }
        } else if (opts.mode === 'update') {
          var updateStats = updateLocalCache(opts.target, entities);
          if (apConfig.offline) {
            console.log(model.list.title + ' Changes (Create: ' + updateStats.created +
              ' | Update: ' + updateStats.updated + ')');
          }
        }
        apQueueService.decrease();
        deferred.resolve(entities);
      });

      return deferred.promise;

    }

    /**
     * @ngdoc function
     * @name angularPoint.apDecodeService:updateLocalCache
     * @methodOf angularPoint.apDecodeService
     * @description
     * Maps a cache by entity id.  All provided entities are then either added if they don't already exist
     * or replaced if they do.
     * @param {object[]} localCache The cache for a given query.
     * @param {object[]} entities All entities that should be merged into the cache.
     * @returns {object} {created: number, updated: number}
     */
    function updateLocalCache(localCache, entities) {
      var updateCount = 0,
        createCount = 0;

      /** Map to only run through target list once and speed up subsequent lookups */
      var idMap = _.pluck(localCache, 'id');

      /** Update any existing items stored in the cache */
      _.each(entities, function (entity) {
        if (idMap.indexOf(entity.id) === -1) {
          /** No match found, add to target and update map */
          localCache.push(entity);
          idMap.push(entity.id);
          createCount++;
        } else {
          /** Replace local item with updated value */
          localCache[idMap.indexOf(entity.id)] = entity;
          updateCount++;
        }
      });
      return {
        created: createCount,
        updated: updateCount
      };
    }


    /**
     * @ngdoc function
     * @name angularPoint.apDecodeService:xmlToJson
     * @methodOf angularPoint.apDecodeService
     * @description
     * Converts an XML node set to Javascript object array. This is a modified version of the SPServices
     * "SPXmlToJson" function.
     * @param {array} rows ["z:rows"] XML rows that need to be parsed.
     * @param {object} options Options object.
     * @param {object[]} options.mapping [columnName: "mappedName", objectType: "objectType"]
     * @param {boolean} [options.includeAllAttrs=false] If true, return all attributes, regardless whether
     * @param {boolean} [options.ctor] List item constructor.
     * @param {boolean} [options.throttle=true] Cut long running conversions into chunks to prevent ui performance
     * hit.  The downside is most evergreen browsers can handle it so it could slow them down unnecessarily.
     * @param {boolean} [options.removeOws=true] Specifically for GetListItems, if true, the leading ows_ will
     * be stripped off the field name.
     * @returns {Array} An array of JavaScript objects.
     */
    function xmlToJson(rows, options) {

      var defaults = {
        mapping: {},
        includeAllAttrs: false,
        removeOws: true,
        throttle: true
      };

      var deferred = $q.defer();


      var opts = _.extend({}, defaults, options);

      var attrNum;
      var entities = [];

      var processRow = function (item) {
        var row = {};
        var rowAttrs = item.attributes;

        /** Bring back all mapped columns, even those with no value */
        _.each(opts.mapping, function (prop) {
          row[prop.mappedName] = '';
        });

        // Parse through the element's attributes
        for (attrNum = 0; attrNum < rowAttrs.length; attrNum++) {
          var thisAttrName = rowAttrs[attrNum].name;
          var thisMapping = opts.mapping[thisAttrName];
          var thisObjectName = typeof thisMapping !== 'undefined' ? thisMapping.mappedName : opts.removeOws ? thisAttrName.split('ows_')[1] : thisAttrName;
          var thisObjectType = typeof thisMapping !== 'undefined' ? thisMapping.objectType : undefined;
          if (opts.includeAllAttrs || thisMapping !== undefined) {
            row[thisObjectName] = attrToJson(rowAttrs[attrNum].value, thisObjectType, {getQuery: opts.getQuery, entity: row, propertyName: thisObjectName});
          }
        }
        /** Push the newly created list item into the return array */
        if (_.isFunction(opts.ctor)) {
          /** Use provided list item constructor */
          entities.push(opts.ctor(row));
        } else {
          entities.push(row);
        }
      };

      if (opts.throttle) {
        /** Action is async so wait until promise from batchProcess is resolved */
        apUtilityService.batchProcess(rows, processRow, this, 25)
          .then(function () {
            deferred.resolve(entities);
          });
      } else {
        _.each(rows, processRow);
        deferred.resolve(entities);
      }

      return deferred.promise;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apDecodeService:attrToJson
     * @methodOf angularPoint.apDecodeService
     * @description
     * Converts a SharePoint string representation of a field into the correctly formatted JavaScript version
     * based on object type.
     * @param {string} value SharePoint string.
     * @param {string} [objectType='Text'] The type based on field definition.  See
     * See [List.customFields](#/api/List.FieldDefinition) for additional info on how to define a field type.
     * @param {object} [options] Options to pass to the object constructor.
     * @param {object} [options.entity] Reference to the parent list item which can be used by child constructors.
     * @param {object} [options.propertyName] Name of property on the list item.
     * @returns {*} The newly instantiated JavaScript value based on field type.
     */
    function attrToJson(value, objectType, options) {

      var colValue;

      switch (objectType) {
        case 'DateTime': // For calculated columns, stored as datetime;#value
          // Dates have dashes instead of slashes: ows_Created='2009-08-25 14:24:48'
          colValue = dateToJsonObject(value);
          break;
        case 'Lookup':
          colValue = lookupToJsonObject(value, options);
          break;
        case 'User':
          colValue = userToJsonObject(value);
          break;
        case 'LookupMulti':
          colValue = lookupMultiToJsonObject(value, options);
          break;
        case 'UserMulti':
          colValue = userMultiToJsonObject(value);
          break;
        case 'Boolean':
          colValue = booleanToJsonObject(value);
          break;
        case 'Integer':
        case 'Counter':
          colValue = intToJsonObject(value);
          break;
        case 'Currency':
        case 'Number':
        case 'Float': // For calculated columns, stored as float;#value
          colValue = floatToJsonObject(value);
          break;
        case 'Calc':
          colValue = calcToJsonObject(value);
          break;
        case 'MultiChoice':
          colValue = choiceMultiToJsonObject(value);
          break;
        case 'HTML':
          colValue = parseHTML(value);
          break;
        case 'JSON':
          colValue = parseJSON(value);
          break;
        case 'Choice':
        default:
          // All other objectTypes will be simple strings
          colValue = stringToJsonObject(value);
          break;
      }
      return colValue;
    }

    function parseJSON(s) {
      /** Ensure JSON is valid and if not throw error with additional detail */
      var json = null;
      try {
        json = JSON.parse(s);
      }
      catch (err) {
        console.error('Invalid JSON: ', s);
      }
      return json;
    }

    function parseHTML(s) {
      return _.unescape(s);
    }

    function stringToJsonObject(s) {
      return s;
    }

    function intToJsonObject(s) {
      if(!s) {
        return s;
      } else {
        return parseInt(s, 10);
      }
    }

    function floatToJsonObject(s) {
      if(!s) {
        return s;
      } else {
        return parseFloat(s);
      }
    }

    function booleanToJsonObject(s) {
      return (s === '0' || s === 'False') ? false : true;
    }

    function dateToJsonObject(s) {
      /** Replace dashes with slashes and the "T" deliminator with a space if found */
      return new Date(s.replace(/-/g, '/').replace(/T/i, ' '));
    }

    function userToJsonObject(s) {
      if (s.length === 0) {
        return null;
      }
      //Send to constructor
      return new User(s);
    }

    function userMultiToJsonObject(s) {
      if (s.length === 0) {
        return [];
      } else {
        var thisUserMultiObject = [];
        var thisUserMulti = s.split(';#');
        for (var i = 0; i < thisUserMulti.length; i = i + 2) {
          var thisUser = userToJsonObject(thisUserMulti[i] + ';#' + thisUserMulti[i + 1]);
          thisUserMultiObject.push(thisUser);
        }
        return thisUserMultiObject;
      }
    }

    function lookupToJsonObject(s, options) {
      if (s.length === 0) {
        return null;
      } else {
        //Send to constructor
        return new Lookup(s, options);
      }
    }

    function lookupMultiToJsonObject(s, options) {
      if (s.length === 0) {
        return [];
      } else {
        var thisLookupMultiObject = [];
        var thisLookupMulti = s.split(';#');
        for (var i = 0; i < thisLookupMulti.length; i = i + 2) {
          var thisLookup = lookupToJsonObject(thisLookupMulti[i] + ';#' + thisLookupMulti[i + 1], options);
          thisLookupMultiObject.push(thisLookup);
        }
        return thisLookupMultiObject;
      }
    }

    function choiceMultiToJsonObject(s) {
      if (s.length === 0) {
        return [];
      } else {
        var thisChoiceMultiObject = [];
        var thisChoiceMulti = s.split(';#');
        for (var i = 0; i < thisChoiceMulti.length; i++) {
          if (thisChoiceMulti[i].length !== 0) {
            thisChoiceMultiObject.push(thisChoiceMulti[i]);
          }
        }
        return thisChoiceMultiObject;
      }
    }


    function calcToJsonObject(s) {
      if (s.length === 0) {
        return null;
      } else {
        var thisCalc = s.split(';#');
        // The first value will be the calculated column value type, the second will be the value
        return attrToJson(thisCalc[1], thisCalc[0]);
      }
    }

    /**Constructors for user and lookup fields*/
    /**Allows for easier distinction when debugging if object type is shown as either Lookup or User**/

    /**
     * @ngdoc function
     * @name Lookup
     * @description
     * Allows for easier distinction when debugging if object type is shown as either Lookup or User.  Also allows us
     * to create an async request for the entity being referenced by the lookup
     * @param {string} s String to split into lookupValue and lookupId
     * @param {object} options Contains a reference to the parent list item and the property name.
     * @param {object} options.entity Reference to parent list item.
     * @param {object} options.propertyName Key on list item object.
     * @constructor
     */
    function Lookup(s, options) {
      var lookup = this;
      var thisLookup = new apUtilityService.SplitIndex(s);
      lookup.lookupId = thisLookup.id;
      lookup.lookupValue = thisLookup.value;
      lookup._props = function () {
        return options;
      };
    }

    /**
     * @ngdoc function
     * @name Lookup.getEntity
     * @methodOf Lookup
     * @description
     * Allows us to create a promise that will resolve with the entity referenced in the lookup whenever that list
     * item is registered.
     * @example
     * <pre>
     * var project = {
         *    title: 'Project 1',
         *    location: {
         *        lookupId: 5,
         *        lookupValue: 'Some Building'
         *    }
         * };
     *
     * //To get the location entity
     * project.location.getEntity().then(function(entity) {
         *     //Resolves with the full location entity once it's registered in the cache
         *
         *    });
     * </pre>
     * @returns {promise} Resolves with the object the lookup is referencing.
     */
    Lookup.prototype.getEntity = function () {
      var self = this;
      var props = self._props();

      if (!props.getEntity) {
        var query = props.getQuery();
        var listItem = query.searchLocalCache(props.entity.id);

        /** Create a new deferred object if this is the first run */
        props.getEntity = $q.defer();
        listItem.getLookupReference(props.propertyName, self.lookupId)
          .then(function (entity) {
            props.getEntity.resolve(entity);
          })
      }
      return props.getEntity.promise;
    };

    /**
     * @ngdoc function
     * @name Lookup.getProperty
     * @methodOf Lookup
     * @description
     * Returns a promise which resolves with the value of a property in the referenced object.
     * @param {string} propertyPath The dot separated propertyPath.
     * @example
     * <pre>
     * var project = {
         *    title: 'Project 1',
         *    location: {
         *        lookupId: 5,
         *        lookupValue: 'Some Building'
         *    }
         * };
     *
     * //To get the location.city
     * project.location.getProperty('city').then(function(city) {
         *    //Resolves with the city property from the referenced location entity
         *
         *    });
     * </pre>
     * @returns {promise} Resolves with the value, or undefined if it doesn't exists.
     */
    Lookup.prototype.getProperty = function (propertyPath) {
      var self = this;
      var deferred = $q.defer();
      self.getEntity().then(function (entity) {
        deferred.resolve(_.deepGetOwnValue(entity, propertyPath));
      });
      return deferred.promise;
    };

    /**
     * @ngdoc function
     * @name User
     * @description
     * Allows for easier distinction when debugging if object type is shown as a User.  Turns a delimited ";#"
     * string into an object shown below depeinding on field settings:
     * <pre>
     * {
         *      lookupId: 1,
         *      lookupValue: 'Joe User'
         * }
     * </pre>
     * or
     * <pre>
     * {
         *      lookupId: 1,
         *      lookupValue: 'Joe User',
         *      loginName: 'joe.user',
         *      email: 'joe@company.com',
     *      sipAddress: 'whatever',
     *      title: 'Sr. Widget Maker'
     * }
     * </pre>
     * @param {string} s Delimited string used to create a User object.
     * @constructor
     */
    function User(s) {
      var self = this;
      var thisUser = new apUtilityService.SplitIndex(s);

      var thisUserExpanded = thisUser.value.split(',#');
      if (thisUserExpanded.length === 1) {
        //Standard user columns only return a id,#value pair
        self.lookupId = thisUser.id;
        self.lookupValue = thisUser.value;
      } else {
        //Allow for case where user adds additional properties when setting up field
        self.lookupId = thisUser.id;
        self.lookupValue = thisUserExpanded[0].replace(/(,,)/g, ',');
        self.loginName = thisUserExpanded[1].replace(/(,,)/g, ',');
        self.email = thisUserExpanded[2].replace(/(,,)/g, ',');
        self.sipAddress = thisUserExpanded[3].replace(/(,,)/g, ',');
        self.title = thisUserExpanded[4].replace(/(,,)/g, ',');
      }
    }

    function parseFieldDefinitionXML(customFields, responseXML) {
      var fieldMap = {};

      /** Map all custom fields with keys of the internalName and values = field definition */
      _.each(customFields, function (field) {
        if (field.internalName) {
          fieldMap[field.internalName] = field;
        }
      });

      /** Iterate over each of the field nodes */
      $(responseXML).SPFilterNode('Field').each(function () {
        var field = this;
        var staticName = $(field).attr('StaticName');
        /** If we've defined this field then we should extend it */
        if (fieldMap[staticName]) {

          var row = {};
          var rowAttrs = field.attributes;

          _.each(rowAttrs, function (attr, attrNum) {
            var attrName = rowAttrs[attrNum].name;
            row[attrName] = $(field).attr(attrName);
          });

          /** Additional processing for Choice fields to include the default value and choices */
          if (fieldMap[staticName].objectType === 'Choice' || fieldMap[staticName].objectType === 'MultiChoice') {
            row.choices = [];
            /** Convert XML Choices object to an array of choices */
            $(this).find('CHOICE').each(function () {
              row.choices.push($(this).text());
            });
            row.Default = $(this).find('Default').text();
          }

          /** Extend the existing field definition with field attributes from SharePoint */
          _.extend(fieldMap[staticName], row);
        }
      });

      return true;
    };


    /**
     * @ngdoc function
     * @name angularPoint.apDecodeService:parseFieldVersions
     * @methodOf angularPoint.apDecodeService
     * @description
     * Takes an XML response from SharePoint webservice and returns an array of field versions.
     *
     * @param {xml} responseXML Returned XML from web service call.
     * @param {object} fieldDefinition Field definition from the model.
     *
     * @returns {Array} Array objects containing the various version of a field for each change.
     */
    function parseFieldVersions(responseXML, fieldDefinition) {
      var versions = [];
      var versionCount = $(responseXML).find('Version').length;
      $(responseXML).find('Version').each(function (index) {
        var self = this;

        /** Parse the xml and create a representation of the version as a js object */
        var version = {
          editor: attrToJson($(self).attr('Editor'), 'User'),
          /** Turn the SharePoint formatted date into a valid date object */
          modified: attrToJson($(self).attr('Modified'), 'DateTime'),
          /** Returns records in desc order so compute the version number from index */
          version: versionCount - index
        };

        /** Properly format field based on definition from model */
        version[fieldDefinition.mappedName] =
          attrToJson($(self).attr(fieldDefinition.internalName), fieldDefinition.objectType);

        /** Push to beginning of array */
        versions.unshift(version);
      });

      return versions;
    }
  });
