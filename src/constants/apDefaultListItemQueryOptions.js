(function () {
    'use strict';

    angular
        .module('angularPoint')
        .constant('apDefaultListItemQueryOptions', '' +
        '<QueryOptions>' +
        '   <IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns>' +
        '   <IncludeAttachmentUrls>TRUE</IncludeAttachmentUrls>' +
        '   <IncludeAttachmentVersion>FALSE</IncludeAttachmentVersion>' +
        '   <ExpandUserField>FALSE</ExpandUserField>' +
        '</QueryOptions>');

})();
