var util = require('../util');
var _ = require('underscore');
var config = require ('../bin/config');

module.exports = function (param) {
    var	channel	= param.channel;
    var resp = [];
    var places = config.settings.places;
    console.log(places);
    var index = 0;
    _.each(places, function (place) {
        index++;
        resp.push(index + '. ' + place.name + ' minimalna ilość zamówień ' + place.minOrders);
    })

    util.postMessage(channel, resp.join('\n'));
}