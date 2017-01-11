import * as _ from 'lodash';
import {FieldDefinition} from './apFieldFactory';

/**
 * @ngdoc function
 * @name angularPoint.apCamlFactory
 * @description
 * Tools to assist with the creation of CAML queries.
 *
 */

export class CamlFactory {

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
     * var testHTML = {objectType: 'HTML', staticName: 'HTML'};
     * var testJSON = {objectType: 'JSON', staticName: 'JSON'};
     * var testText = {objectType: 'Text', staticName: 'Text'};
     * var testText2 = {objectType: 'Text', staticName: 'Text'};
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
    camlContainsQuery(fieldDefinitionsArray: FieldDefinition[], searchString: string): string {
        const selectStatements = [];

        /** Create a select statement for each field */
        _.each(fieldDefinitionsArray, (fieldDefinition, definitionIndex) => {
            selectStatements.push(this.createCamlContainsSelector(fieldDefinition, searchString));
        });

        return this.chainCamlSelects(selectStatements, 'And');
    }

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
    chainCamlSelects(selectStatements: Object[], joinType: string): string {
        let camlQuery = '';
        let camlQueryClosure = '';
        _.each(selectStatements, function (statement, statementIndex) {
            /** Add an or clause if we still have additional fields to process */
            if (statementIndex < selectStatements.length - 1) {
                camlQuery += '<' + joinType + '>';
                camlQueryClosure = '</' + joinType + '>' + camlQueryClosure;
            }
            camlQuery += statement;
        });
        return camlQuery + camlQueryClosure;
    }

    /**
     * @ngdoc function
     * @name angularPoint.apCamlFactory:createCamlContainsSelector
     * @methodOf angularPoint.apCamlFactory
     * @description
     * Escapes characters that SharePoint gets upset about based on field type.
     * @example
     * <pre>
     * var testHTML = {objectType: 'HTML', staticName: 'HTML'};
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
    createCamlContainsSelector(fieldDefinition: FieldDefinition, searchString: string): string {
        let camlSelector;
        switch (fieldDefinition.objectType) {
            case 'HTML':
            case 'JSON':
                camlSelector = '' +
                    '<Contains>' +
                    '<FieldRef Name="' + fieldDefinition.staticName + '" />' +
                    /** Use CDATA wrapper to escape [&, <, > ] */
                    '<Value Type="Text"><![CDATA[' + searchString + ']]></Value>' +
                    '</Contains>';
                break;
            default:
                camlSelector = '' +
                    '<Contains>' +
                    '<FieldRef Name="' + fieldDefinition.staticName + '" />' +
                    '<Value Type="Text">' + searchString + '</Value>' +
                    '</Contains>';
        }
        return camlSelector;
    }


}
