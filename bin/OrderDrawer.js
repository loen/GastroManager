var _ = require('underscore');
var config = require ('../bin/config');
var ordersDao = require ('../bin/ordersDao');

var places = config.settings.places;

function drawAllRestaurants(successCallback, failureCallback){
    _.each(places, function(place){
        var orders = ordersDao.getCustomersFromRestaurant(place.name);
        if(orders.length >= place.minOrders){
            var winner = draw(orders);
            console.log('order will be placed by ' + winner);
            successCallback(winner,place.name, place.contact);
        }else {
            console.log('minimum orders ' + place.minOrders + ' not reached for ' + place.name);
            failureCallback(place.name, place.minOrders);
        }
    });
}

function draw(orders){
    var index = _.random(orders.length -1 );
    return orders[index]
}

exports.drawAllRestaurants=drawAllRestaurants;