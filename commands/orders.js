var restUtil = require('../restUtil');
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
    if(param.args.length === 1){
        listOrdersforAllRestaurants();
    }else {
        util.postMessage(param.channel, 'Scusi zły format spróbuj ' + param.commandConfig.help);
    }
}

function listOrdersforAllRestaurants() {

    _.each(places, function(place) {
        var msg = recipeCreator.prepareOrdersStatus(place);
        restUtil.postMessage(config.settings.channel, msg, true);
    });

}
