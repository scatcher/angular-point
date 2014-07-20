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

      if (!filename) {
        filename = 'debug.' + type;
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

    return {
      saveFile: saveFile,
      saveJSON: saveJSON,
      saveXML: saveXML
    };
  });