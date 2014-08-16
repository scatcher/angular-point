/**
 * Provides a way to inject vendor libraries that otherwise are globals.
 * This improves code testability by allowing you to more easily know what
 * the dependencies of your components are (avoids leaky abstractions).
 * It also allows you to mock these dependencies, where it makes sense.
 */
angular.module('angularPoint')
  /** lodash */
  .constant('_', _)

/**
 * @ngdoc object
 * @name angularPoint.apConfig
 * @description
 * Basic config for the application (unique for each environment).  Update to change for your environment.
 *
 * @param {string} appTitle Name of the application in case you need to reference.
 * @param {boolean} debug Determines if we should show debug code.
 * @param {string} defaultUrl Automatically sets the defaultUrl for web service calls so we don't need to make the
 * initial blocking call by SPServices.
 * @param {string} [firebaseUrl] Necessary if you're using apSyncService.  Look there for more details.
 * @param {boolean} [offline] Automatically set based on the URL of the site.  Pulls offline XML when hosted locally.
 * @param {string} [offlineXML='dev/'] The location to look for offline xml files.
 * @example
 * <h4>Default Configuration</h4>
 * <pre>
 * .constant('apConfig', {
 *     appTitle: 'Angular-Point',
 *     debugEnabled: true,
 *     firebaseURL: "The optional url of your firebase source",
 *     offline: window.location.href.indexOf('localhost') > -1 ||
 *         window.location.href.indexOf('http://0.') > -1 ||
 *         window.location.href.indexOf('http://10.') > -1 ||
 *         window.location.href.indexOf('http://192.') > -1
 * })
 * </pre>
 *
 * <h4>To Override</h4>
 * <pre>
 * angular.module('MyApp', ['my dependencies'])
 *      .config(function ($stateProvider, $urlRouterProvider) {
 *          //My routes
 *      })
 *      .run(function(apConfig) {
 *          //To set the default site root
 *          apConfig.defaultUrl =
 *            '//sharepoint.myserver.com/siteRoot';
 *
 *          //To set the default location to look for
 *          //offline xml files.
 *          apConfig.offlineXML = 'myCachedQueries/';
 *      });
 * </pre>
 */
  .constant('apConfig', {
    appTitle: 'Angular-Point',
    debug: false,
    firebaseURL: "The optional url of your firebase source",
    offline: window.location.href.indexOf('localhost') > -1 ||
    window.location.href.indexOf('http://0.') > -1 ||
    window.location.href.indexOf('http://10.') > -1 ||
    window.location.href.indexOf('http://192.') > -1,
    offlineXML: 'dev/'
  });
