var recipeCreator = require ('./recipeCreator');
var restUtil = require('../restUtil');
var config = require ('./config');

function sendRecipe(winner, restaurant, contact, email){
    var msg = recipeCreator.prepareRecipe(winner, restaurant, contact, email);
    restUtil.postMessage('@' + winner, msg, false);
    restUtil.postMessage(config.settings.channel, msg, true);
}

function sendUnableToPrepareRecipe(restaurant, minOrdersCount){
    var msg = recipeCreator.unableToPrepareRecipe(restaurant, minOrdersCount);
    restUtil.postMessage(config.settings.channel, msg, false);
}

exports.sendRecipe=sendRecipe;
exports.sendUnableToPrepareRecipe=sendUnableToPrepareRecipe;
