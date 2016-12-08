var slackTerminal 	= require('slack-terminalize'),
    commands 		= slackTerminal.getCommands(),
    util			= require('../util');

function helpAll() {
    var name,
        index,
        command,
        response = [];

    index = 1;
    for (name in commands) {
        command = commands[name];

        if (!command.exclude) {
            response.push(index++  + '. ' + helpCommand(name));
        }
    }

    return response.join('\n');
};

function helpCommand(name) {
    var response = [ commands[name].help, 'Alias: ' + commands[name].alias.join(', '), commands[name].description ];

    return response.join('\n');
};

module.exports = function (param) {
    var	channel		= param.channel,
        response;

    if (!param.args.length) {
        response = helpAll();
    }
    else {
        response = helpCommand(param.args[0]);
    }

    util.postMessage(channel, response);
};