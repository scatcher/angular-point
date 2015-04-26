/// <reference path="../../typings/ap.d.ts" />

module ap {
    'use strict';

    export var DefaultListItemQueryOptions:string = '' +
        '<QueryOptions>' +
        '   <IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns>' +
        '   <IncludeAttachmentUrls>TRUE</IncludeAttachmentUrls>' +
        '   <IncludeAttachmentVersion>FALSE</IncludeAttachmentVersion>' +
        '   <ExpandUserField>FALSE</ExpandUserField>' +
        '</QueryOptions>';

    angular
        .module('angularPoint')
        .constant('apDefaultListItemQueryOptions', DefaultListItemQueryOptions);

}
