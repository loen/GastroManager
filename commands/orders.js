var restUtil = require('../restUtil');
var _ = require('underscore');
var config = require ('../bin/config');
var util = require('../util');
var recipeCreator = require ('../bin/recipeCreator');

var people = config.settings.people;
var places = config.settings.places;

module.exports = function order(param){

    restUtil.getUser(param.user).then(function(user){
        if(_.contains(people, user)){
            listCurrentOrders(param);
        }else{
            util.postMessage(param.channel,
                'Scusi - nie jesteś zarejestrowanym użytkownikem, pogadaj z Andrzejem Pozłutko.');
        }
    });

}

function listCurrentOrders(param){
    if(param.args.length === 0){
        var	channel	= param.channel;
        listOrdersforAllRestaurants(channel);
    }else {
        util.postMessage(param.channel, 'Scusi zły format spróbuj ' + param.commandConfig.help);
    }
}

function listOrdersforAllRestaurants(channel) {

    _.each(places, function(place) {
        var msg = recipeCreator.prepareOrdersStatus(place.name);
        restUtil.postMessage(channel, msg, true);
    });

}
