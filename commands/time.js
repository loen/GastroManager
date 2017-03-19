var restUtil = require('../restUtil');
var _ = require('underscore');
var config = require ('../bin/config');
var util = require('../util');
var commonResp = require('../bin/commonResp');

var timeWindowStart = config.settings.timeWindowStart;
var timeWindowEnd = config.settings.timeWindowEnd;
var drawTimeWindow = config.settings.drawTime;
var people = config.settings.people;


module.exports = function time(param){

    restUtil.getUser(param.user).then(function(user){
        if(_.contains(people, user)){
            showTimeFrames(param.channel);
        }else{
            commonResp.sendUserUnregistered(param.channel);
        }
    });

}

function showTimeFrames(channel){
    var command = 'che succede! Zamówienia można składać między [' + timeWindowStart + '-' + timeWindowEnd + '],\n' +
                    'a losowanie odbędzie się o ' + drawTimeWindow  + '.';
    util.postMessage(channel, command);
}