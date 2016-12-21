var _ = require('underscore');
var config = require ('../bin/config');

config.readConfig();
var places = config.getSetting('places');
var orders = {};
var dishes = {};
_.each(places, function(place){
    orders[place.name] = [];
});

function addOrderToRestaurant(restaurant, user, dish){
    var index = orders[restaurant].indexOf(user);
    if(index < 0) {
        orders[restaurant].push(user);
        dishes[restaurant + "-" + user] = dish;
        console.log(JSON.stringify(orders));
        console.log(JSON.stringify(dishes));
        return true;
    }
    return false;
}

function removeOrderFromRestaurant(restaurant,user){
    var index = orders[restaurant].indexOf(user);
    if(index > -1) {
        orders[restaurant].splice(index, 1);
        delete dishes[restaurant + "-" + user];
        return true;
    }
    console.log(JSON.stringify(orders));
    console.log(JSON.stringify(dishes));
    return false;
}

function getOrderFromRestaurant(restaurant, user){
    return dishes[restaurant + "-" + user];
}

exports.removeOrderFromRestaurant=removeOrderFromRestaurant;
exports.addOrderToRestaurant=addOrderToRestaurant;
exports.getOrderFromRestaurant=getOrderFromRestaurant;