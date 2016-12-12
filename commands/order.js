var util = require('../util');
var _ = require('underscore');
var config = require ('../bin/config');

config.readConfig();
var places = config.getSetting('places');
var orders = {};
_.each(places, function(place){
    orders[place.name] = [];
})

module.exports = function order(param){
    if(param.args.length === 2 & param.args[0]==='remove'){
        var restaurant = param.args[1];
        util.getUser(param.user).then(function(user){
            var index = orders[restaurant].indexOf(user);
            if(index > -1){
                orders[restaurant].splice(index, 1);
            }
            util.postMessage(param.channel, 'Your order has been removed');
        });

    }else if(param.args.length === 3 & param.args[0]=== 'place'){
        var restaurant = param.args[1];
        util.getUser(param.user).then(function(user){
            var resp = '';
            var index = orders[restaurant].indexOf(user);
            if(index < 0){
                orders[restaurant].push(user);
                resp = 'Your order is placed';
            } else{
                resp = 'You already have an order';
            }
            util.postMessage(param.channel, resp);
        });
    } else {
        util.postMessage(param.channel, 'Wrong format, try ' + param.commandConfig.help);
    }
}
