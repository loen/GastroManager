var fs = require('fs');

var config;

function readConfig(){
    config = JSON.parse(fs.readFileSync(__dirname + '/../config/config.json', 'utf8'));
    return config;
}

function getSetting(name){
    return config[name];
}

exports.readConfig = readConfig;
exports.getSetting = getSetting;