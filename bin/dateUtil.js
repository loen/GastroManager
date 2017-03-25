var moment = require('moment');


function formatToDate(now, hourMinute){
    var start = now.year() + ':' + (moment().month() + 1) + ':' + now.date() + ':' + hourMinute + ':00';
    console.log(start);
    return moment(start,"YYYY:MM:DD:HH:mm:ss");
}

function isInTimeWindow(date, start,end){
    return (date.diff(start) >= 0) & (date.diff(end) < 0);
}

function formatFileTimestamp(now){
    var timestamp = now.date() + '-' + (now.month() + 1) + '-' + now.year();
    return timestamp;
}

exports.formatToDate = formatToDate;
exports.isInTimeWindow = isInTimeWindow;
exports.formatFileTimestamp = formatFileTimestamp;