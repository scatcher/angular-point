'use strict';

describe('Factory: apQueryFactory', function () {

    beforeEach(module('angularPoint'));

    var mockModel, apQueryFactory;

    beforeEach(module("ui.bootstrap"));
    beforeEach(inject(function (_mockModel_, _apQueryFactory_) {
        mockModel = _mockModel_;
        apQueryFactory = _apQueryFactory_;
    }));
    
//    describe("test", function () {
//        it(true).toBe(true);
//    })


});