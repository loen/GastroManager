var rewire = require("rewire");
var configHelper = rewire('./../../bin/configHelper');


describe("Config helper test suite", function(){
    var config;
    beforeEach(function(){
        config = {
            settings : {
                places: [
                    {
                        name: 'etnika',
                        benefitNumberLength: 4
                    },
                    {
                        name: 'emes'
                    }
                ],
                people : [
                    {
                        name: 'andrzej',
                        benefit: '1234'
                    },
                    {
                        name: 'b.tworzewska'
                    },
                    {
                        name: 'jedrektlen',
                        benefit: '0090909093'
                    }
                ]
            }
        };
        configHelper.__set__("config", config);
    });

    it("should return users", function(){
        var people = configHelper.getPeople();
        expect(people.length).toEqual(3);
        expect(people).toContain('andrzej');
        expect(people).toContain('b.tworzewska');
        expect(people).toContain('jedrektlen');

    });

    it("should return benefit no if it's present", function(){
        var benefitNo = configHelper.getBenefitNo('jedrektlen');
        expect(benefitNo).toEqual('0090909093');
    });

    it("should not return benefit no if it's not present", function(){
        var noBenefit = configHelper.getBenefitNo('b.tworzewska');
        expect(noBenefit).toBeNull();
    });

    it("should return null for not existing user", function(){
        var noBenefit = configHelper.getBenefitNo('NotExisting');
        expect(noBenefit).toBeNull();
    });

    it("should return benefit length", function(){
        expect(configHelper.getBenefitNoLength('etnika')).toEqual(4);
    });

    it("should return null in benefit no length not defined", function(){
        expect(configHelper.getBenefitNoLength('emes')).toBeNull();
    });

    it("should return null for undefined restaurant", function(){
        expect(configHelper.getBenefitNoLength('notExistingRestaurant')).toBeNull();
    });
});