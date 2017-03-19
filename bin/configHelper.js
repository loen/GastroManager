var _ = require('underscore');
var config = require ('../bin/config');


function getPeople(){
    var newPeople = config.settings.people;
    var names = [];
    _.each(newPeople,function(people){
        names.push(people.name);
    })
    return names;
}

function getBenefitNo(name){
    var newPeople = config.settings.people;
    var user = _.findWhere(newPeople,{name: name});
    if(user.benefit){
        return user.benefit;
    }
    return null;
}

exports.getPeople = getPeople;
exports.getBenefitNo = getBenefitNo;