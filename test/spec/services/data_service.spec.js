"use strict";

describe("Service: apDataService", function () {

    beforeEach(module("angularPoint"));

    var apDataService,
        mockEntities,
        mockModel;


    beforeEach(module("ui.bootstrap"));
    beforeEach(inject(function (_apDataService_, _mockModel_) {
        apDataService = _apDataService_;
        mockModel = _mockModel_;
        mockEntities = mockModel.importMocks();

    }));

    describe('removeEntityFromLocalCache', function () {
        beforeEach(function () {
            apDataService.removeEntityFromLocalCache(mockEntities, 1);
        });
        expect(mockEntities.length).toEqual(1);
    })


});