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
     * @name angularPoint.apDebugService:saveJson
     * @methodOf angularPoint.apDebugService
     * @description
     * Converts an object into a JSON file that is then downloaded to the local machine.  Original script located
     * [here](http://bgrins.github.io/devtools-snippets/#console-save).
     * @param {object} data JS object that we'd like to dump to a JSON file and save to the local machine.
     * @param {string} [filename=debug.json] Optionally name the file.
     * @example
     * <pre>
     * //Lets assume we want to looks at an object that is too big to be easily viewed in the console.
     * apDebugService.saveJson(objectToSave, 'myobject.json');
     * </pre>
     *
     */
    var saveJson = function (data, filename) {
      if (!data) {
        console.error('apDebugService.saveJson: No data');
        return;
      }

      if (!filename) {
        filename = 'debug.json';
      }

      if (typeof data === 'object') {
        data = JSON.stringify(data, undefined, 4);
      }

      var blob = new Blob([data], {type: 'text/json'}),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a');

      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);

    };

    return {
      saveJson: saveJson
    };
  });