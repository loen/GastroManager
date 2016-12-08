var request = require('request'),
    util 	= require('../util');
var _ = require('underscore');
var config = require ('../bin/config');

config.readConfig();

module.exports = function (param) {
    var	channel		= param.channel;
    var endpoint	= param.commandConfig.endpoint.replace('{username}', param.args[0]);
    console.log(config.getSetting('people'));
    console.log(endpoint);

    var options = {
        url: endpoint,
        headers: {
            'User-Agent': 'test-script'
        }
    }

    request(options, function (err, response, body) {
        var resp = [];

        if (!err && response.statusCode === 200) {
            var repos = JSON.parse(body);

            _.each(repos, function (repo) {
                resp.push(repo.full_name);
            })

        }
        else {
            info = ['No such repos found!'];
        }
        util.postMessage(channel, resp.join('\n'));
    });

};