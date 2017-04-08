var dateUtil = require('./../../bin/dateUtil');
var moment = require('moment');

describe("Date Utils test cases", function(){

    it("should get proper Formatted date", function(){
        var now = moment('2017-02-24');
        var fileTimestamp = dateUtil.formatFileTimestamp(now);
        expect(fileTimestamp).toEqual('24-2-2017');
    });
});


describe("Date Utils in time window", function(){
    var now = moment('2017-02-24 09:10:20');

    it("Should show that date is before Time window", function(){
       var start = moment('2017-02-24 09:20:00');
        var end = moment('2017-02-24 09:30:00');
        var result = dateUtil.isInTimeWindow(now, start, end);
       expect(result).toEqual(0);
    });

    it("Should show that date is in Time window", function(){
        var start = moment('2017-02-24 09:00:00');
        var end = moment('2017-02-24 09:20:00');
        var result = dateUtil.isInTimeWindow(now, start, end);
        expect(result).toEqual(1);
    });

    it("Should show that date is after Time window", function(){
        var start = moment('2017-02-24 09:00:00');
        var end = moment('2017-02-24 09:05:00');
        var result = dateUtil.isInTimeWindow(now, start, end);
        expect(result).toEqual(0);
    });

    it("Should show that date is in Time window for left edge case", function(){
        var start = moment('2017-02-24 09:10:20');
        var end = moment('2017-02-24 09:15:00');
        var result = dateUtil.isInTimeWindow(now, start, end);
        expect(result).toEqual(1);
    });

    it("Should show that date is not in Time window for right edge case", function(){
        var start = moment('2017-02-24 09:05:20');
        var end = moment('2017-02-24 09:10:20');
        var result = dateUtil.isInTimeWindow(now, start, end);
        expect(result).toEqual(0);
    });

});
