var slackTerminal = require('slack-terminalize');
var cron = require('node-cron');

cron.schedule('* * * * *', function(){
    console.log('running a task every minute');
});

slackTerminal.init('TBD',
    {
    CONFIG_DIR: __dirname + '/config',
    COMMAND_DIR: __dirname + '/commands'
    });
