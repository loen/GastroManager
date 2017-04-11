var fs = require('fs');
var joinPath = require('path.join');
var recipeCreator = require('./recipeCreator');
var moment = require('moment');
var dateUtil = require('./dateUtil');

function createFile(restaurant, successCallback) {
    var recipe = recipeCreator.prepareGroupedOrderRecipe(restaurant);

    var date = dateUtil.formatFileTimestamp(moment());
    var text = joinPath(__dirname + './../output/', restaurant + '-orders-' + date + '.txt');
    console.log(text);

    var stream = fs.createWriteStream(text);
    stream.write(recipe);

    stream.on('finish', function () {
        successCallback(restaurant + '-orders-' + date);
    });
    stream.end();
}

exports.createFile = createFile;
