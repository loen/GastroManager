var rewire = require("rewire");
var commonResp = rewire('./../../bin/commonResp');

describe("Common Response", function(){
    var channel, util;

    beforeEach(function(){
        channel = {};
        util = {
            postMessage : function(channel, text){
                expect(text).toEqual('Scusi - nie jesteś zarejestrowanym użytkownikem, pogadaj z Andrzejem Pozłutko.');
            }
        };
        commonResp.__set__("util", util);
    });

    it("Should send Unregistered message", function(){
        commonResp.sendUserUnregistered(channel);
    });
});