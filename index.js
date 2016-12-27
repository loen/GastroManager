var slackTerminal = require('slack-terminalize');
var cron = require('node-cron');
var config = require ('./bin/config');
var moment = require('moment');
var dateUtil = require ('./bin/dateUtil');
var orderDrawer = require ('./bin/orderDrawer');
var recipeSender = require ('./bin/recipeSender');

var drawTimeWindow = config.settings.drawTime;
var now = moment();
var drawTime = dateUtil.formatToDate(now, drawTimeWindow);
var cronPattern = '' + drawTime.minutes() + ' ' + drawTime.hours() + ' * * *';
console.log(cronPattern);

cron.schedule(cronPattern, function(){
    var cronNow = moment();
    console.log('Draw who will place order');
    console.log(cronNow);
    orderDrawer.drawAllRestaurants(recipeSender.sendRecipe, recipeSender.sendUnableToPrepareRecipe);
});

slackTerminal.init(config.settings.token,
    {
    CONFIG_DIR: __dirname + '/config',
    COMMAND_DIR: __dirname + '/commands'
    });
