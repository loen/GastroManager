var recipeCreator = require('./recipeCreator');
var pdfCreator = require('./pdfCreator');
var txtCreator = require('./txtCreator');
var restUtil = require('../restUtil');
var config = require('./config');

function sendRecipe(winner, restaurant, contact, email) {
    var msg = recipeCreator.prepareRecipe(winner, restaurant, contact, email);
    restUtil.postRawMessage('@' + winner.name, msg, false);
    restUtil.postRawMessage(config.settings.channel, msg, true);
    pdfCreator.generatePdf(restaurant, function (fileName) {
        restUtil.postFile(fileName + '.pdf', 'Lista Benefit: ' + fileName)
    });
    if (config.settings.groupOrders) {
        txtCreator.createFile(restaurant, function (filename) {
            restUtil.postFile(filename + '.txt', 'Zbiorcze zestawienie zamówień: ' + filename);
        });
    }
}

function sendUnableToPrepareRecipe(restaurant, minOrdersCount) {
    var msg = recipeCreator.unableToPrepareRecipe(restaurant, minOrdersCount);
    restUtil.postRawMessage(config.settings.channel, msg, false);
}

exports.sendRecipe = sendRecipe;
exports.sendUnableToPrepareRecipe = sendUnableToPrepareRecipe;
