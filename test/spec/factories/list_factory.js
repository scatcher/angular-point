describe("Factory: apListFactory", function () {

    var apListFactory;
    beforeEach(module("angularPoint"));
    beforeEach(inject(function(_apListFactory_) {
        "use strict";
        apListFactory = _apListFactory_;
    }));

    describe('create', function() {
        "use strict";
        it("should instantiate a new List", function() {
            expect(apListFactory.create()).toEqual(new apListFactory.List);
        })
    })
});