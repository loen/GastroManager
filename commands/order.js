var util = require('../util');
var _ = require('underscore');
var config = require ('../bin/config');
var ordersDao = require ('../bin/ordersDao');
var dateUtil = require ('../bin/dateUtil');
var moment = require('moment');

config.readConfig();
var timeWindowStart = config.getSetting('timeWindowStart');
var timeWindowEnd = config.getSetting('timeWindowEnd');
var drawTimeWindow = config.getSetting('drawTime');

module.exports = function order(param){
    var now = moment();
    var startTime= dateUtil.formatToDate(now, timeWindowStart);
    var endTime = dateUtil.formatToDate(now, timeWindowEnd);
    var drawTime = dateUtil.formatToDate(now, drawTimeWindow);
    
    if(param.args.length === 2 & param.args[0]==='remove'){
        if(dateUtil.isInTimeWindow(now,startTime,drawTime)) {
            var restaurant = param.args[1];
            util.getUser(param.user).then(function (user) {
                if(ordersDao.removeOrderFromRestaurant(restaurant,user)) {
                    util.postMessage(param.channel, 'Your order has been removed');
                }
            });
        }else {
            util.postMessage(param.channel,
                'Sorry your order is not removed. You could do it only between [' + timeWindowStart + '-' + drawTimeWindow + ']');
        }

    }else if(param.args.length === 3 & param.args[0]=== 'place'){
        if(dateUtil.isInTimeWindow(now,startTime,endTime)){
        var restaurant = param.args[1];
        var dish = param.args[2];
        util.getUser(param.user).then(function(user){
            var resp = '';
            if(ordersDao.addOrderToRestaurant(restaurant, user, dish)){
            resp = 'Your order is placed';
            } else{
                resp = user + ' already have following order: ' + ordersDao.getOrderFromRestaurant(restaurant, user);
            }
            util.postMessage(param.channel, resp);
        });
        }else {
            util.postMessage(param.channel,
                'Sorry your order maybe placed only between [' + timeWindowStart + '-' + timeWindowEnd + ']');
        }

    } else {
        util.postMessage(param.channel, 'Wrong format, try ' + param.commandConfig.help);
    }
}


