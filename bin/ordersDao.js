var _ = require('underscore');
var config = require ('../bin/config');

var places = config.settings.places;
var orders = {};
var dishes = {};
var usernamesToUserIds = {};
_.each(places, function(place){
    orders[place.name] = [];
});

function addOrderToRestaurant(restaurant, user, dish){
    var index = orders[restaurant].indexOf(user.name);
    if(index < 0) {
        orders[restaurant].push(user.name);
        dishes[restaurant + "-" + user.name] = dish;
        usernamesToUserIds[user.name] = user.id;
        console.log(JSON.stringify(orders));
        console.log(JSON.stringify(dishes));
        return true;
    }
    return false;
}

function removeOrderFromRestaurant(restaurant, user){
    var index = orders[restaurant].indexOf(user.name);
    if(index > -1) {
        orders[restaurant].splice(index, 1);
        delete dishes[restaurant + "-" + user.name];
        delete usernamesToUserIds[user.name];
        return true;
    }
    console.log(JSON.stringify(orders));
    console.log(JSON.stringify(dishes));
    return false;
}

function getOrderFromRestaurant(restaurant, user){
    return dishes[restaurant + "-" + user.name];
}

function getCustomersFromRestaurant(restaurant){
    return _.map(orders[restaurant], function(nick) {
        return {name: nick, id: usernamesToUserIds[nick]};
    });
}

function resetOrders(){
    orders = {};
    dishes = {};
    usernamesToUserIds = {};
    _.each(places, function(place){
        orders[place.name] = [];
    });
}

exports.removeOrderFromRestaurant=removeOrderFromRestaurant;
exports.addOrderToRestaurant=addOrderToRestaurant;
exports.getOrderFromRestaurant=getOrderFromRestaurant;
exports.getCustomersFromRestaurant=getCustomersFromRestaurant;
exports.resetOrders=resetOrders;
