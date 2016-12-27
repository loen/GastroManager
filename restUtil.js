var rp = require('request-promise');
var config = require ('./bin/config');


function getUser(userId){
    var options = {
        uri:  'https://slack.com/api/users.info?token=' + config.settings.token + '&user=' + userId,
        json: true
    };
    return rp(options).then(function (resp) {
        return resp.user.name;
    });
};

function postMessage(channel, message, asUser){

    var options = {
        uri:  'https://slack.com/api/chat.postMessage?token=' + config.settings.token + '&channel=' + channel +
              '&text=' + message + '&as_user=' + asUser + '&parse=true',
        json: true
    };

    return rp(options).then(function (resp) {
        return resp.ok === 'true';
    });
}

exports.getUser = getUser;
exports.postMessage = postMessage;