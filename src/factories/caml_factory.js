'use strict';

/**
 * @ngdoc function
 * @name angularPoint.apCamlFactory
 * @description
 * Tools to assist with the creation of CAML queries.
 *
 */
angular.module('angularPoint')
  .factory('apCamlFactory', function () {

    /**
     * @ngdoc function
     * @name angularPoint.apCamlFactory:createCamlContainsSelector
     * @methodOf angularPoint.apCamlFactory
     * @description
     * Escapes characters that SharePoint gets upset about based on field type.
     * @example
     * <pre>
     * var testHTML = {objectType: 'HTML', internalName: 'HTML'};
     *
     * var testCaml = createCamlContainsSelector(testHTML, 'Test Query');
     * console.log(testCaml);
     *
     * //Returns
     * <Contains>
     *   <FieldRef Name=\"HTML\" />
     *   <Value Type=\"Text\"><![CDATA[Test Query]]></Value>
     * </Contains>
     * </pre>
     */
    var createCamlContainsSelector = function (fieldDefinition, searchString) {
      var camlSelector;
      switch (fieldDefinition.objectType) {
        case 'HTML':
        case 'JSON':
          camlSelector = '' +
            '<Contains>' +
            '<FieldRef Name="' + fieldDefinition.internalName + '" />' +
          /** Use CDATA wrapper to escape [&, <, > ] */
            '<Value Type="Text"><![CDATA[' + searchString + ']]></Value>' +
            '</Contains>';
          break;
        default:
          camlSelector = '' +
            '<Contains>' +
            '<FieldRef Name="' + fieldDefinition.internalName + '" />' +
            '<Value Type="Text">' + searchString + '</Value>' +
            '</Contains>';
      }
      return camlSelector;
    };

    /**
     * @ngdoc function
     * @name angularPoint.apCamlFactory:chainCamlSelects
     * @methodOf angularPoint.apCamlFactory
     * @description
     * Used to combine multiple caml selectors into a single CAML query string wrapped properly.
     * @param {object[]} selectStatements An array of select statements to wrap in "<Or>".
     * @param {string} joinType Valid caml join type ('Or', 'And', ...).
     * @returns {string} CAML query string.
     */
    var chainCamlSelects = function (selectStatements, joinType) {
      var camlQuery = '',
        camlQueryClosure = '';
      _.each(selectStatements, function (statement, statementIndex) {
        /** Add an or clause if we still have additional fields to process */
        if (statementIndex < selectStatements.length - 1) {
          camlQuery += '<' + joinType + '>';
          camlQueryClosure = '</' + joinType + '>' + camlQueryClosure;
        }
        camlQuery += statement;
      });
      return camlQuery + camlQueryClosure;
    };

    /**
     * @ngdoc function
     * @name angularPoint.apCamlFactory:camlContainsQuery
     * @methodOf angularPoint.apCamlFactory
     * @parameter {object[]} fieldDefinitionsArray Array of fields to search for a given search string.
     * @parameter {string} searchString String of text to search records for.
     * @description
     * Returns a combination of selectors using CAML '<Or></Or>' elements
     * @returns {string} Caml select string.
     * @example
     * <pre>
     *
     * var testHTML = {objectType: 'HTML', internalName: 'HTML'};
     * var testJSON = {objectType: 'JSON', internalName: 'JSON'};
     * var testText = {objectType: 'Text', internalName: 'Text'};
     * var testText2 = {objectType: 'Text', internalName: 'Text'};
     *
     * var testCaml = camlContainsQuery([testHTML, testText, testJSON, testText2], 'Test Query');
     * console.log(testCaml);
     *
     * //Returns
     * <Or><Contains><FieldRef Name=\"HTML\" /><Value Type=\"Text\"><![CDATA[Test Query]]>
     * </Value></Contains><Or><Contains><FieldRef Name=\"Text\" /><Value Type=\"Text\">Test Query</Value>
     * </Contains><Or><Contains><FieldRef Name=\"JSON\" /><Value Type=\"Text\"><![CDATA[Test Query]]>
     * </Value></Contains><Contains><FieldRef Name=\"Text\" /><Value Type=\"Text\">Test Query</Value>
     * </Contains></Or></Or></Or>
     * </pre>
     */
    var camlContainsQuery = function (fieldDefinitionsArray, searchString) {
      var selectStatements = [];

      /** Create a select statement for each field */
      _.each(fieldDefinitionsArray, function (fieldDefinition, definitionIndex) {
        selectStatements.push(createCamlContainsSelector(fieldDefinition, searchString));
      });

      return chainCamlSelects(selectStatements, 'And');
    };

//    var testHTML = {objectType: 'HTML', internalName: 'HTML'};
//    var testJSON = {objectType: 'JSON', internalName: 'JSON'};
//    var testText = {objectType: 'Text', internalName: 'Text'};
//    var testText2 = {objectType: 'Text', internalName: 'Text'};
//
//    var testCaml = camlContainsQuery([testHTML, testText, testJSON, testText2], 'Test Query');
//
//
//    console.log(testCaml);

    return {
      camlContainsQuery: camlContainsQuery,
      chainCamlSelects: chainCamlSelects,
      createCamlContainsSelector: createCamlContainsSelector
    }

  });