var slackTerminal = require('slack-terminalize');
var cron = require('node-cron');
var config = require ('./bin/config');

cron.schedule('* * * * *', function(){
    console.log('running a task every minute');
});

slackTerminal.init(config.settings.token,
    {
    CONFIG_DIR: __dirname + '/config',
    COMMAND_DIR: __dirname + '/commands'
    });
