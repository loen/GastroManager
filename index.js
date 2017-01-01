var slackTerminal = require('slack-terminalize');
var cron = require('node-cron');
var config = require ('./bin/config');
var moment = require('moment');
var dateUtil = require ('./bin/dateUtil');
var drawer = require ('./bin/drawer');
var recipeSender = require ('./bin/recipeSender');
var ordersDao = require ('./bin/ordersDao');

var drawTimeWindow = config.settings.drawTime;
var timeWindowStart = config.settings.timeWindowStart;
var now = moment();
var drawTime = dateUtil.formatToDate(now, drawTimeWindow);
var startTime = dateUtil.formatToDate(now, timeWindowStart);
var drawTimeCron = '' + drawTime.minutes() + ' ' + drawTime.hours() + ' * * *';
var startTimeCron = '' + startTime.minutes() + ' ' + startTime.hours() + ' * * *';
console.log(drawTimeCron);
console.log(startTimeCron);

cron.schedule(startTimeCron, function(){
    console.log('reset order data');
    ordersDao.resetOrders();
});

cron.schedule(drawTimeCron, function(){
    var cronNow = moment();
    console.log('Draw who will place order');
    console.log(cronNow);
    drawer.drawAllRestaurants(recipeSender.sendRecipe, recipeSender.sendUnableToPrepareRecipe);
});

slackTerminal.init(config.settings.token,
    {
    CONFIG_DIR: __dirname + '/config',
    COMMAND_DIR: __dirname + '/commands'
    });
