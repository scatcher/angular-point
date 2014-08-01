'use strict';

/**
 * @ngdoc service
 * @name angularPoint.apDebugService
 * @description
 * Tools to assist with development.
 */
angular.module('angularPoint')
  .service('apDebugService', function () {

    /**
     * @ngdoc function
     * @name angularPoint.apDebugService:saveFile
     * @methodOf angularPoint.apDebugService
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
     * apDebugService.saveJSON(objectToSave, 'myobject.json');
     * </pre>
     *
     */
    var saveFile = function (data, type, filename) {
      if (!data) {
        console.error('apDebugService.save' + type.toUpperCase() + ': No data');
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
     * @name angularPoint.apDebugService:saveJSON
     * @methodOf angularPoint.apDebugService
     * @description
     * Simple convenience function that uses angularPoint.apDebugService:saveFile to download json to the local machine.
     * @requires angularPoint.apDebugService:saveFile
     * @param {object} data JS object that we'd like to dump to a JSON file and save to the local machine.
     * @param {string} [filename=debug.json] Optionally name the file.
     * @example
     * <pre>
     * //Lets assume we want to looks at an object that is too big to be easily viewed in the console.
     * apDebugService.saveJSON(objectToSave, 'myobject.json');
     * </pre>
     *
     */
    var saveJSON = function (data, filename) {
      saveFile(data, 'json', filename);
    };

    /**
     * @ngdoc function
     * @name angularPoint.apDebugService:saveXML
     * @methodOf angularPoint.apDebugService
     * @description
     * Simple convenience function that uses angularPoint.apDebugService:saveFile to download xml to the local machine.
     * @requires angularPoint.apDebugService:saveFile
     * @param {object} data XML object that we'd like to dump to a XML file and save to the local machine.
     * @param {string} [filename=debug.xml] Optionally name the file.
     * @example
     * <pre>
     * //Lets assume we want to looks at an object that is too big to be easily viewed in the console.
     * apDebugService.saveXML(objectToSave, 'myobject.xml');
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
     * @name angularPoint.apDebugService:saveCSV
     * @methodOf angularPoint.apDebugService
     * @description
     * Converts an array of arrays into a valid CSV file that is then downloaded to the users machine
     * @requires angularPoint.apDebugService:saveFile
     * @param {array[]} data Array of arrays that we'd like to dump to a CSV file and save to the local machine.
     * @param {string} [filename=debug.csv] Optionally name the file.
     * @example
     * <pre>
     * //Lets assume we want to looks at an object that is too big to be easily viewed in the console.
     * apDebugService.saveCSV(objectToSave, 'myobject.csv');
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

    return {
      saveCSV: saveCSV,
      saveFile: saveFile,
      saveJSON: saveJSON,
      saveXML: saveXML
    };
  });