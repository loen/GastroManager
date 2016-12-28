var restUtil = require('../restUtil');
var util = require('../util');
var _ = require('underscore');
var config = require ('../bin/config');
var ordersDao = require ('../bin/ordersDao');
var dateUtil = require ('../bin/dateUtil');
var moment = require('moment');

var timeWindowStart = config.settings.timeWindowStart;
var timeWindowEnd = config.settings.timeWindowEnd;
var drawTimeWindow = config.settings.drawTime;
var people = config.settings.people;

module.exports = function order(param){

    restUtil.getUser(param.user).then(function(user){
        if(_.contains(people, user)){
            orderProcessing(user, param);
        }else{
            util.postMessage(param.channel,
                'Scusi - nie jesteś zarejestrowanym użytkownikem, pogadaj z Andrzejem Pozłutko.');
        }
    });

}

function orderProcessing(user, param){
    var now = moment();
    var startTime= dateUtil.formatToDate(now, timeWindowStart);
    var endTime = dateUtil.formatToDate(now, timeWindowEnd);
    var drawTime = dateUtil.formatToDate(now, drawTimeWindow);

    if(param.args.length === 2 & param.args[0]==='remove'){
        if(dateUtil.isInTimeWindow(now,startTime,drawTime)) {
            var restaurant = param.args[1];
            if(ordersDao.removeOrderFromRestaurant(restaurant,user)) {
                util.postMessage(param.channel, 'Grazie, Twoje zamówenie zostało usuniętę, mamma mia.');
            }
        }else {
            util.postMessage(param.channel,
                'Scusi zamówienia mogą być [' + timeWindowStart + '-' + drawTimeWindow + ']');
        }

    }else if(param.args.length >= 3 & param.args[0]=== 'place'){
        if(dateUtil.isInTimeWindow(now,startTime,endTime)){
            var restaurant = param.args[1];
            var dish = param.args.splice(2).join(' ');
            var resp = '';
            if(ordersDao.addOrderToRestaurant(restaurant, user, dish)){
                resp = 'che bello!! Twoje zamównienie zostało złożone.';
            } else{
                resp = user + ' tranquillo, masz już zamówienie: ' + ordersDao.getOrderFromRestaurant(restaurant, user);
            }
            util.postMessage(param.channel, resp);
        }else {
            util.postMessage(param.channel,
                'Scusi - zamówienia można składać tylko pomiędzy: [' + timeWindowStart + '-' + timeWindowEnd + ']');
        }

    } else {
        util.postMessage(param.channel, 'Wrong format, try ' + param.commandConfig.help);
    }
}


