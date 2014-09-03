"use strict";

describe("Service: apDataService", function () {

    beforeEach(module("angularPoint"));

    var apDataService,
        mockEntityCache,
        secondaryMockEntityCache,
        mockModel,
        mockToUpdate,
        mockXML,
        mockXMLService,
        $rootScope,
        $q;


    beforeEach(module("ui.bootstrap"));
    beforeEach(inject(function (_apDataService_, _mockModel_, _mockXMLService_, _$q_, _$rootScope_) {
        apDataService = _apDataService_;
        mockModel = _mockModel_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        mockXMLService = _mockXMLService_;
        mockXML = mockXMLService.listItemsSinceChangeToken;
        mockModel.importMocks();
        mockEntityCache = mockModel.getCache('primary');
        secondaryMockEntityCache = mockModel.getCache('secondary');

    }));

    describe('Function: addUpdateItemModel', function () {
        describe('add item', function () {
            beforeEach(function () {
                apDataService.addUpdateItemModel(mockModel, {text: 'New Entity'});
            });
            it('the cache to have the new item', function () {
                expect(mockEntityCache.count()).toEqual(3);
            });
        });
        describe('update item', function () {
            beforeEach(function () {
                mockToUpdate = mockModel.getCache('primary')[1];
                mockToUpdate.titleText = 'Updated Text';
                apDataService.addUpdateItemModel(mockModel, mockToUpdate);
            });
            it('has the updated value', function () {
                expect(mockModel.getCache('primary')[1].titleText).toEqual('Updated Text');
            });
            it('the other caches also contain the same data because they should be referencing the same object', function () {
                expect(mockModel.getCache('secondary')[1].titleText).toEqual('Updated Text');
            });
        });
    });

    describe('Function: cleanCache', function () {
        beforeEach(function () {
            apDataService.cleanCache(mockEntityCache[1]);
        });
        it('removes 1 of the entities from the cache', function () {
            expect(mockEntityCache.count()).toEqual(1);
        });
        it('leaves a reference in the secondary cache', function () {
            expect(secondaryMockEntityCache.count()).toEqual(2);
        });

    });

    describe('Function: deleteItemModel', function () {
        describe('delete from single cache', function () {
            beforeEach(function () {
                mockEntityCache = mockModel.getCache('primary');
                secondaryMockEntityCache = mockModel.getCache('secondary');

                apDataService.deleteItemModel(mockModel, mockEntityCache[1]);
            });
            it('removes 1 of the entities from the primary cache', function () {
                expect(mockEntityCache.count()).toEqual(1);
            });
            it('leaves both entities in the secondary cache', function () {
                expect(secondaryMockEntityCache.count()).toEqual(2);
            });
        });
        describe('delete from all query caches', function () {
            beforeEach(function () {
                mockEntityCache = mockModel.getCache('primary');
                secondaryMockEntityCache = mockModel.getCache('secondary');

                apDataService.deleteItemModel(mockModel, mockEntityCache[1], {updateAllCaches: true});
            });
            it('removes 1 of the entities from the primary cache', function () {
                expect(mockEntityCache.count()).toEqual(1);
            });
            it('removes 1 entity from the secondary cache as well', function () {
                expect(secondaryMockEntityCache.count()).toEqual(1);
            });
        });
    });

    describe('Function: retrieveChangeToken', function () {
        it('returns the change token from the XML', function () {
            expect(apDataService.retrieveChangeToken(mockXML)).toEqual('1;3;f5345fe7-2f7c-49f7-87d0-dbfebdd0ce61;635452551037430000;387547');
        })
    });

    describe('Function: retrievePermMask', function () {
        it('returns perm mask for the current user on this lsit', function () {
            expect(apDataService.retrievePermMask(mockXML)).toEqual('FullMask');
        })
    });

    describe('Function: removeEntityFromLocalCache', function () {
        beforeEach(function () {
            apDataService.removeEntityFromLocalCache(mockEntityCache, 1);
        });
        it('removes 1 of the entities from the cache', function () {
            expect(mockEntityCache.count()).toEqual(1);
        });
    });

    describe('Function: getCollection', function () {
        beforeEach(function () {
            spyOn(apDataService, 'getMyData').and.callFake(getXml('getListCollection'));
        });
        it('can process a GetListCollection call', function () {
            var collection;
            apDataService.getCollection({operation:'GetListCollection'})
                .then(function (listCollection) {
                    collection = listCollection;
                });
            $rootScope.$digest();
            expect(collection.length).toEqual(1);
        });
    });

    describe('Function: getList', function () {
        beforeEach(function () {
            spyOn(apDataService, 'getMyData').and.callFake(getXml('listItemsSinceChangeToken'));
        });
        it('can process a list definition', function () {
            var listXML;
            apDataService.getList({listName:mockModel.list.guid})
                .then(function (response) {
                    listXML = response;
                });
            $rootScope.$digest();
            expect(listXML).toEqual(mockXML);
        });
    });

    describe('Function: getListFields', function () {
        beforeEach(function () {
            spyOn(apDataService, 'getMyData').and.callFake(getXml('listItemsSinceChangeToken'));
        });
        it('can extend the list fields', function () {
            var fields;
            apDataService.getListFields({listName:mockModel.list.guid})
                .then(function (response) {
                    fields = response;
                });
            $rootScope.$digest();
            expect(fields.length).toEqual(98);
        });
    });

    describe('Function: executeQuery', function () {
        beforeEach(function () {
            spyOn(apDataService, 'getMyData').and.callFake(getXml('listItemsSinceChangeToken'));
        });
        it('can complete a query form a known model', function () {
            var cache = mockModel.getCache('primary');
            cache.clear();
            //Ensure there's nothing left in the cache
            expect(cache.count()).toEqual(0);
            apDataService.executeQuery(mockModel, mockModel.getQuery())
                .then(function (response) {
                    cache = response;
                });
            $rootScope.$digest();
            expect(cache.count()).toEqual(2);
        });
    });



    describe('Function: logErrorsToConsole', function () {
        it('finds errors', function () {
            var errors = apDataService.logErrorsToConsole(mockXMLService.xmlWithError, 'GetListItems');
            expect(errors).toEqual('GetListItems: Root element is missing.');
        });
    });
    

    function getListCollection() {
        var deferred = $q.defer();
        deferred.resolve(mockXML.getListCollection);
        return deferred.promise;

    }


    function getXml(name) {
        return function() {
            var deferred = $q.defer();
            deferred.resolve(mockXMLService[name]);
            return deferred.promise;
        };
    }



});