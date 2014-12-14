'use strict';

angular.module('angularPoint')
    .animation('.fade-animation', function () {
        return {
            enter: function (element, done) {
                jQuery(element).show({
                    effect: 'fade',
                    duration: 400,
                    complete: done
                });
            },

            leave: function (element, done) {
                jQuery(element).hide({
                    effect: 'fade',
                    duration: 400,
                    complete: done
                });
            }
        };
    });
