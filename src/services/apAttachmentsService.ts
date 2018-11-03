import * as _ from 'lodash';

export class AttachmentService {
    static $inject = ['$q'];
    constructor(private $q) {}

    /**
     * @description Check to ensure file to be uploaded doesn't contain any illegal SharePoint characters.
     * @param {string} fileName The name of the file to be uploaded.
     * @returns {boolean | string} Returns false if there is no error otherwise provides a string with error details.
     */
    checkFilename(fileName: string): boolean | string {
        let error: boolean | string = false;
        // let userMessage = '';
        const illegalCharacters = ['~', '#', '%', '&', '*', '{', '}', '\\', '/', ':', '<', '>', '?', '|', '"', '..'];
        _.each(illegalCharacters, illegalCharacter => {
            if (fileName.indexOf(illegalCharacter) > -1) {
                error = `The ${illegalCharacter} character isn't allowed to be used in a file name.`;
                /** Break loop early */
                return error;
            }
        });

        /** You cannot use the period character at the end of a file name. */
        if (fileName[fileName.length - 1] === '.') {
            error = 'You cannot use the period character at the end of a file name.';
        }

        /** You cannot start a file name with the period. */
        if (fileName[0] === '.') {
            error = 'You cannot start a file name with the period.';
        }

        /** Don't continue evaluating if a problem has already been found */
        if (error) {
            error += '  Please update the file on your system and upload again.';
        }

        return error;
    }

    getFileBuffer(file) {
        const deferred = this.$q.defer();

        const reader = new FileReader();

        reader.onload = function(e: any) {
            deferred.resolve(e.target.result);
        };

        reader.onerror = function(e: any) {
            deferred.reject(e.target.error);
        };

        reader.readAsArrayBuffer(file);

        return deferred.promise;
    }
}
