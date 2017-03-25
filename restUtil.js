var rp = require('request-promise');
var config = require ('./bin/config');
const strictUriEncode = require('strict-uri-encode');
var fs = require('fs');
var joinPath = require('path.join');
var request = require('request');


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
    message = '```' + message + '```';
    message = strictUriEncode(message);
    var options = {
        uri:  'https://slack.com/api/chat.postMessage?token=' + config.settings.token + '&channel=' + channel +
              '&text=' + message + '&as_user=' + asUser + '&parse=true',
        json: true
    };

    return rp(options).then(function (resp) {
        return resp.ok === 'true';
    });
}

function postPdf(fileName){
    console.log('fileName:' + fileName);
    var filePath = joinPath(__dirname + '/output/' + fileName + '.pdf');
    console.log(filePath);
    request.post({
        url: 'https://slack.com/api/files.upload',
        formData: {
            token: config.settings.token,
            title: "Lista Benefit: " + fileName,
            filename: fileName + ".pdf",
            filetype: "auto",
            channels: config.settings.channel,
            file: fs.createReadStream(filePath),
        },
    }, function (err, response) {
        console.log(JSON.parse(response.body));
    });

}

exports.getUser = getUser;
exports.postMessage = postMessage;
exports.postPdf = postPdf;