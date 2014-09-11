var q = require('q');
var fs = require('fs');

module.exports = {
    createJSON: createJSON
};

    function createJSON(directory) {
    var deferred = q.defer(),
        offlineXML = {};

    fs.readdir(directory, function (err, files) {
        if(err) throw err;
        var promises = [];
        files.forEach(function(fileName) {
            if(fileName.indexOf('.xml') > -1) {
                promises.push(parseFile(fileName, directory).then(function (file) {
                    offlineXML[fileName.split('.xml')[0]] = file;
                }));
            }
        });
        q.all(promises).then(function () {
            var fileContents = 'angular.module(\'angularPoint\').constant(\'offlineXML\', ';
            fileContents += JSON.stringify(offlineXML) + ');';

            fs.writeFile(directory + '/offlineXML.js', fileContents, {encoding: 'utf8'}, function (err) {
                if(err) throw err;
                deferred.resolve(offlineXML);
                console.log("Offline XML Constant File Created");
            });
        });
    });

    return deferred.promise;
}

function parseFile(fileName, directory) {
    var deferred = q.defer();

    fs.readFile(directory + '/' + fileName, {encoding: 'utf8'}, function(err, data) {
        deferred.resolve(data);
    });
    return deferred.promise;
}
