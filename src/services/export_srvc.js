'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apExportService
 * @description
 * Tools to assist with development.
 * @requires angularPoint.apUtilityService
 */
angular.module('angularPoint')
  .service('apExportService', function (apUtilityService) {

    /**
     * @ngdoc function
     * @name angularPoint.apExportService:saveFile
     * @methodOf angularPoint.apExportService
     * @description
     * Used to convert a JS object or XML document into a file that is then downloaded on the users
     * local machine.  Original work located:
     * [here](http://bgrins.github.io/devtools-snippets/#console-save).
     * @param {object} data JS object that we'd like to dump to a JSON file and save to the local machine.
     * @param {string} type Can be either 'xml' or 'json'.
     * @param {string} [filename=debug.json] Optionally name the file.
     * @example
     * <pre>
     * //Lets assume we want to looks at an object that is too big to be easily viewed in the console.
     * apExportService.saveJSON(objectToSave, 'myobject.json');
     * </pre>
     *
     */
    var saveFile = function (data, type, filename) {
      if (!data) {
        console.error('apExportService.save' + type.toUpperCase() + ': No data');
        return;
      }

      /** If passed in type="csv;charset=utf-8;" we just want to use "csv" */
      var fileExtension = type.split(';')[0];

      if (!filename) {
        filename = 'debug.' + fileExtension;
      }

      if (type === 'json' && typeof data === 'object') {
        data = JSON.stringify(data, undefined, 4);
      }

      var blob = new Blob([data], {type: 'text/' + type}),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/' + type, a.download, a.href].join(':');
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    };

    /**
     * @ngdoc function
     * @name angularPoint.apExportService:saveJSON
     * @methodOf angularPoint.apExportService
     * @description
     * Simple convenience function that uses angularPoint.apExportService:saveFile to download json to the local machine.
     * @requires angularPoint.apExportService:saveFile
     * @param {object} data JS object that we'd like to dump to a JSON file and save to the local machine.
     * @param {string} [filename=debug.json] Optionally name the file.
     * @example
     * <pre>
     * //Lets assume we want to looks at an object that is too big to be easily viewed in the console.
     * apExportService.saveJSON(objectToSave, 'myobject.json');
     * </pre>
     *
     */
    var saveJSON = function (data, filename) {
      saveFile(data, 'json', filename);
    };

    /**
     * @ngdoc function
     * @name angularPoint.apExportService:saveXML
     * @methodOf angularPoint.apExportService
     * @description
     * Simple convenience function that uses angularPoint.apExportService:saveFile to download xml to the local machine.
     * @requires angularPoint.apExportService:saveFile
     * @param {object} data XML object that we'd like to dump to a XML file and save to the local machine.
     * @param {string} [filename=debug.xml] Optionally name the file.
     * @example
     * <pre>
     * //Lets assume we want to looks at an object that is too big to be easily viewed in the console.
     * apExportService.saveXML(objectToSave, 'myobject.xml');
     * </pre>
     *
     */
    var saveXML = function (data, filename) {
      saveFile(data, 'xml', filename);
    };

    /**
     * @description Replaces commonly-used Windows 1252 encoded chars that do not exist in ASCII or
     *  ISO-8859-1 with ISO-8859-1 cognates.
     * @param {string} text Text to be validated and cleaned.
     * @returns {string}
     */
    var replaceWordChars = function(text) {
      var s = text;
      // smart single quotes and apostrophe
      s = s.replace(/[\u2018|\u2019|\u201A]/g, "\'");
      // smart double quotes
      s = s.replace(/[\u201C|\u201D|\u201E]/g, "\"");
      // ellipsis
      s = s.replace(/\u2026/g, "...");
      // dashes
      s = s.replace(/[\u2013|\u2014]/g, "-");
      // circumflex
      s = s.replace(/\u02C6/g, "^");
      // open angle bracket
      s = s.replace(/\u2039/g, "<");
      // close angle bracket
      s = s.replace(/\u203A/g, ">");
      // spaces
      s = s.replace(/[\u02DC|\u00A0]/g, " ");
      return s;
    };


    /**
     * @ngdoc function
     * @name angularPoint.apExportService:saveCSV
     * @methodOf angularPoint.apExportService
     * @description
     * Converts an array of arrays into a valid CSV file that is then downloaded to the users machine
     * @requires angularPoint.apExportService:saveFile
     * @param {array[]} data Array of arrays that we'd like to dump to a CSV file and save to the local machine.
     * @param {string} [filename=debug.csv] Optionally name the file.
     * @example
     * <pre>
     * //Lets assume we want to looks at an object that is too big to be easily viewed in the console.
     * apExportService.saveCSV(objectToSave, 'MyFile');
     * //This would download a file named MyFile.csv
     * </pre>
     *
     */
    var saveCSV = function (data, filename) {
      var csvString = '';
      _.each(data, function(row) {
        _.each(row, function(column, columnIndex) {
          var result =  column === null ? '' : replaceWordChars(column);
          if (columnIndex > 0) {
            csvString += ',';
          }
          /** Escape single quotes with doubles in within the string */
          result = result.replace(/"/g, '""');

          /** Surround string with quotes so we can have line breaks */
          csvString += '"' + result + '"';
        });
        csvString += '\n';
      });
      saveFile(csvString, 'csv;charset=utf-8;', filename);
    };

    /**
     * @ngdoc function
     * @name angularPoint.apExportService:generateCSV
     * @methodOf angularPoint.apExportService
     * @description
     * Converts an array of objects into a parsed array of arrays based on a field config object.
     * @param {object[]} entities Array of objects to convert.
     * @param {object|string[]} fields Array of objects defining the fields to parse.  Can also pass in strings representing the name of the field which will then be parsed based on field type.
     * FieldDefinition:
     * {string} object.field Property name on the object that we want to parse.
     * {string} [object.label=object.field capitalized] Column Label
     * {function} [object.getVal] Custom function that overrides the default method of parsing based on field type.
     * @example
     * <pre>
     * var saveCSV = function() {
     *    var parsedCSV = apExportService.generateCSV(entities, [
     *     //Field definition
     *     { label: 'ID', field: 'id' },
     *     //Field as simple string
     *     title,
     *     project,
     *     { label: 'Project:ID', field: 'project.lookupId' },
     *     { label: 'Type', field: 'eventType' },
     *     { label: 'Start Date', field: 'startDate' },
     *     { label: 'End Date', field: 'endDate' },
     *     location,
     *     description,
     *     //Field definition with custom parse logic
     *     { label: 'Comments', field: 'comments', getVal: function (comments) {
     *       var str = '';
     *       _.each(comments, function (comment, i) {
     *         if (i > 0) {
     *           str += '\n';
     *         }
     *         str += comment.text + '\n';
     *       });
     *       return str;
     *     }}
     *   ]);
     *
     *   //Save to user's machine
     *   apExportService.saveCSV(parsedCSV, 'MyFile');
     * }
     * </pre>
     *
     */
    var generateCSV = function (entities, fields) {
      var entitiesArray = [
        []
      ];

      /** Process each of the entities in the data source */
      _.each(entities, function (entity, entityIndex) {
        var entityArray = [];
        /** Process each of the specified fields */
        _.each(fields, function (f) {

          /** Handle both string and object definition */
          var fieldDefinition = _.isString(f) ? {field: f} : f;

          /** Split the field name from the property if provided */
          var fieldComponents = fieldDefinition.field.split('.');
          var propertyName = fieldComponents[0];

          /** First array has the field names */
          if(entityIndex === 0) {
            /** Take a best guess if a column label isn't specified by capitalizing and inserting spaces between camel humps*/
            var label = fieldDefinition.label ?
              fieldDefinition.label : apUtilityService.fromCamelCase(propertyName);
            entitiesArray[0].push(label);
          }

          var val = '';

          if (_.isFunction(fieldDefinition.getVal)) {
            /** Allows us to override standard field logic for special cases */
            val = fieldDefinition.getVal(entity[fieldDefinition.field]);
          } else if (fieldComponents.length > 1) {
            /** Allow user to specify dot separated property path */
            if (_.deepIn(entity, fieldDefinition.field)) {
              val = _.deepGet(entity, fieldDefinition.field).toString();
            }
          } else {
            /** Get the value based on field type defined in the model for the entity*/
            var modelDefinition = entity.getFieldDefinition(propertyName);
            switch (modelDefinition.objectType) {
              case 'Lookup':
              case 'User':
                val = parseLookup(entity[fieldDefinition.field]);
                break;
              case 'Boolean':
                val = parseBoolean(entity[fieldDefinition.field]);
                break;
              case 'DateTime':
                val = parseDate(entity[fieldDefinition.field]);
                break;
              case 'Integer':
              case 'Number':
              case 'Counter':
                val = entity[fieldDefinition.field].toString();
                break;
              case 'MultiChoice':
                val = parseMultiChoice(entity[fieldDefinition.field]);
                break;
              case 'UserMulti':
              case 'LookupMulti':
                val = parseArray(entity[fieldDefinition.field]);
                break;
              default:
                val = entity[fieldDefinition.field];
            }
          }

          entityArray.push(val);
        });

        entitiesArray.push(entityArray);
      });
      return entitiesArray;
    };

    var parseLookup = function (s) {
      var str = '';
      if (s && s.lookupValue) {
        str = s.lookupValue;
      }
      return str;
    };

    var parseBoolean = function (s) {
      var str = '';
      if (_.isBoolean(s)) {
        str = s.toString();
      }
      return str;
    };

    var parseDate = function (date) {
      var str = '';
      if (_.isDate(date)) {
        str = date.toJSON();
      }
      return str;
    };

    var parseMultiChoice = function (arr) {
      var str = '';
      _.each(arr, function (choice, i) {
        if (i > 0) {
          str += '; ';
        }
        str += choice;
      });
      return str;
    };

    var parseArray = function (arr) {
      var str = '';
      _.each(arr, function (val, valIndex) {
        /** Add artificial delim */
        if (valIndex > 0) {
          str += '; ';
        }

        if (_.isObject(val) && val.lookupValue) {
          /** Handle an array of lookup objects */
          str += val.lookupValue;
        } else {
          /** Handle an array of strings */
          str += val;
        }
      });
      return str;
    };

    return {
      generateCSV: generateCSV,
      saveCSV: saveCSV,
      saveFile: saveFile,
      saveJSON: saveJSON,
      saveXML: saveXML
    };
  });