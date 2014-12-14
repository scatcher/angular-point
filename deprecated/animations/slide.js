angular.module('angularPoint')
    .animation('.oa-slide-animation', function () {
        return {
            enter: function (element, done) {
                jQuery(element).hide();
                jQuery(element).show('slide', {direction: 'right'}, 600, done);
            },

            leave: function (element, done) {
                jQuery(element).hide();
            }
        };
    });
