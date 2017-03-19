var util = require('../util');

function sendUserUnregistered(channel) {
    util.postMessage(channel,
        'Scusi - nie jesteś zarejestrowanym użytkownikem, pogadaj z Andrzejem Pozłutko.');
}

exports.sendUserUnregistered=sendUserUnregistered;