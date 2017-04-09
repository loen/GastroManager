var manager = require("../bin/orderManager");
var _ = require('underscore');

describe("Order Manager", function () {

    beforeEach(function () {
        this.addMatchers({
            toContainAll: function (expected) {
                var actual = this.actual;
                return _.every(expected, function (e) {
                    return _.contains(actual, e);
                });
            }
        });
    });

    it("should group orders 1", function () {
        var order = [
            'zupa dnia + makaron z łososiem dnia',
            'zupa + makaron orzechy włoskie, pesto',
            'zupa + danie dnia',
            'zupa + danie dnia bez mięsa - Makaron z Łososiem, szpinakiem, czosnek w sosie kremowym, zapiekany w piecu z serem mozzarella',
            'danie dnia',
            'danie dnia',
            'danie-dnia + zupa',
            'danie dnia bez mięsa',
            'Makaron z Łososiem, szpinakiem, czosnek w sosie kremowym, zapiekany w piecu z serem mozzarella',
            'pierogi z truskawkami',
            'pizza-pepperoni + zupa',
            'zupa, makaron orzechy włoskie, sos pesto',
            'danie dania bez mięsa (makaron)',
            'danie dnia bez mięsa',
            'danie dnia bez miesa',
            'danie dnia bez miesa (makaron z lososiem)'
        ];
        var expectedOrder = [
            '3 x danie dnia bez mięsa',
            '2 x zupa + danie dnia',
            '2 x danie dnia',
            '1 x danie dania bez mięsa (makaron)',
            '1 x danie dnia bez miesa (makaron z lososiem)',
            '1 x makaron z łososiem, szpinakiem, czosnek w sosie kremowym, zapiekany w piecu z serem mozzarella',
            '1 x pierogi z truskawkami',
            '1 x pizza-pepperoni + zupa',
            '1 x zupa + danie dnia bez mięsa - makaron z łososiem, szpinakiem, czosnek w sosie kremowym, zapiekany w piecu z serem mozzarella',
            '1 x zupa dnia + makaron z łososiem dnia',
            '1 x zupa + makaron orzechy włoskie, pesto',
            '1 x zupa, makaron orzechy włoskie, sos pesto'
        ];
        expect(manager.groupOrders(order)).toContainAll(expectedOrder);
    });

    it("should group orders 2", function () {
        var order = [
            'zupa + sałatka wiosenna',
            'danie dnia',
            'danie-dnia',
            'danie dnia',
            'danie dnia',
            'zupa, makaron orzechy włoskie sos pesto',
            'zupa + makaron z łososiem',
            'zupa, makaron kurczak, szpinak, oliwa',
            'pierogi z truskawkami',
            'danie dnia',
            'pizza pepperoni',
            'danie dnia',
            'pizza salami',
            'danie dnia',
            'zupa + makaron z łososiem na ostro',
            'zupa dnia + danie-dnia'
        ];
        var expectedOrder = [
            '7 x danie dnia',
            '1 x pierogi z truskawkami',
            '1 x pizza pepperoni',
            '1 x pizza salami',
            '1 x zupa dnia + danie-dnia',
            '1 x zupa, makaron kurczak, szpinak, oliwa',
            '1 x zupa, makaron orzechy włoskie sos pesto',
            '1 x zupa + makaron z łososiem',
            '1 x zupa + makaron z łososiem na ostro',
            '1 x zupa + sałatka wiosenna'
        ];
        expect(manager.groupOrders(order)).toContainAll(expectedOrder);
    });

    it("should group orders 3", function () {
        var order = [
            'danie dnia',
            'zupa + pizza fungi',
            'pizza-pepperoni + zupa',
            'danie-dnia',
            'danie dnia',
            'danie dnia',
            'danie dnia',
            'danie dnia',
            'danie dnia',
            'danie dnia',
            'danie-dnia',
            'pizza-pepperoni + zupa',
            'zupa + pizza hawajska',
            'zupa + pizza hawajska',
            'danie dnia',
            'zupa, makaron kurczak, pieczarki, cebula, oliwa',
            'zupa + makaron z łososiem',
            'danie dnia',
            'danie dnia',
            'zupa + makaron kurczak pieczarki cebula',
            'zupa, orzechy włoskie, sos pesto',
            'danie dnia',
            'danie dnia'
        ];
        var expectedOrder = [
            '14 x danie dnia',
            '2 x pizza-pepperoni + zupa',
            '2 x zupa + pizza hawajska',
            '1 x zupa + makaron kurczak pieczarki cebula',
            '1 x zupa, makaron kurczak, pieczarki, cebula, oliwa',
            '1 x zupa + makaron z łososiem',
            '1 x zupa, orzechy włoskie, sos pesto',
            '1 x zupa + pizza fungi'
        ];
        expect(manager.groupOrders(order)).toContainAll(expectedOrder);
    });

    it("should group orders 4", function () {
        var order = [
            'zupa + sałatka wiosenna',
            'danie dnia',
            'zupa + danie dnia',
            'zupa + danie dnia',
            'zupa + danie dnia',
            'zupa + makaron z łososiem',
            'zupa + makaron bolognese',
            'zestaw pizza hawajska + zupa dnia'
        ];
        var expectedOrder = [
            '3 x zupa + danie dnia',
            '1 x danie dnia',
            '1 x zestaw pizza hawajska + zupa dnia',
            '1 x zupa + makaron bolognese',
            '1 x zupa + makaron z łososiem',
            '1 x zupa + sałatka wiosenna'
        ];
        expect(manager.groupOrders(order)).toContainAll(expectedOrder);
    });

    it("should group orders 5", function () {
        var order = [
            'zupa, sałatka wiosenna',
            'zupa + makaron (kurczak, pieczarki, cebula, s. kremowy)',
            'danie dnia',
            'danie dnia'
        ];
        var expectedOrder = [
            '2 x danie dnia',
            '1 x zupa + makaron (kurczak, pieczarki, cebula, s. kremowy)',
            '1 x zupa, sałatka wiosenna'
        ];
        expect(manager.groupOrders(order)).toContainAll(expectedOrder);
    });

    it("should group orders 6", function () {
        var order = [
            'Makaron ryżowy z warzywami w aromatycznych przyprawach korzennych, przyrządzony na ostro z wieprzowiną',
            'Makaron ryżowy z warzywami w aromatycznych przyprawach korzennych, przyrządzony na ostro z wieprzowiną',
            'Makaron ryżowy z warzywami w aromatycznych przyprawach korzennych, przyrządzony na ostro z wieprzowiną',
            'Makaron ryżowy z warzywami w aromatycznych przyprawach korzennych, przyrządzony na ostro z wieprzowiną',
            'Makaron ryżowy z warzywami w aromatycznych przyprawach korzennych, przyrządzony na ostro z tofu',
            'Makaron ryżowy z warzywami w aromatycznych przyprawach korzennych, przyrządzony na ostro z wieprzowiną'
        ];
        var expectedOrder = [
            '5 x makaron ryżowy z warzywami w aromatycznych przyprawach korzennych, przyrządzony na ostro z wieprzowiną',
            '1 x makaron ryżowy z warzywami w aromatycznych przyprawach korzennych, przyrządzony na ostro z tofu'
        ];
        expect(manager.groupOrders(order)).toContainAll(expectedOrder);
    });

    it("should group orders 7", function () {
        var order = [
            'pizza pepperoni',
            'zestaw 2 zupa + makaron kurczak pieczarki cebula oliwa/sos kremowy',
            'zupa + pizza pepperoni',
            'zupa + pizza pepperoni',
            'zupa dnia + danie dnia',
            'Zupa + makaron łosoś, kapary, sos kremowy na ostro)',
            'zupa + sałatka wiosenna z sosem czosnkowym',
            'zupa + pizza fungi',
            'zupa + makaron z łososiem, kapary, (sos kremowy łagodny)',
            'zupa, makaron orzechy włoskie, sos pesto'
        ];
        var expectedOrder = [
            '2 x zupa + pizza pepperoni',
            '1 x pizza pepperoni',
            '1 x zestaw 2 zupa + makaron kurczak pieczarki cebula oliwa/sos kremowy',
            '1 x zupa dnia + danie dnia',
            '1 x zupa + makaron łosoś, kapary, sos kremowy na ostro)',
            '1 x zupa, makaron orzechy włoskie, sos pesto',
            '1 x zupa + makaron z łososiem, kapary, (sos kremowy łagodny)',
            '1 x zupa + pizza fungi',
            '1 x zupa + sałatka wiosenna z sosem czosnkowym'
        ];
        expect(manager.groupOrders(order)).toContainAll(expectedOrder);
    });

    it("should group orders 8", function () {
        var order = [
            'zupa + pizza pepperoni',
            'danie-dnia + zupa',
            'zupa, makaron orzechy włoskie, pesto',
            'danie-dnia',
            'zupa, danie-dnia',
            'danie dnia + zupa',
            'zupa, makaron kurczak, pieczarki, cebula, sos kremowy',
            'zupa, makaron kurczak, pieczarki, cebula, sos kremowy',
            'zupa + makaron z kurczakiem i szpinakiem',
            'zupa + danie dnia',
            'zupa, makaron kurczak, szpinak, sos kremowy',
            'zupa + pizza pepperoni',
            'zupa + pizza pepperoni',
            'zupa, makaron orzechy włoskie, pesto',
            'zupa + makaron (kurczak, pieczarki)'
        ];
        var expectedOrder = [
            '4 x danie-dnia + zupa',
            '3 x zupa + pizza pepperoni',
            '2 x zupa, makaron kurczak, pieczarki, cebula, sos kremowy',
            '2 x zupa, makaron orzechy włoskie, pesto',
            '1 x danie-dnia',
            '1 x zupa + makaron (kurczak, pieczarki)',
            '1 x zupa, makaron kurczak, szpinak, sos kremowy',
            '1 x zupa + makaron z kurczakiem i szpinakiem'
        ];
        expect(manager.groupOrders(order)).toContainAll(expectedOrder);
    });

    it("should group orders 9", function () {
        var order = [
            'Wieprzowina słodko-pikantna serwowana z ryżem i surówką',
            '2. Wieprzowina słodko-pikantna serwowana z ryżem i surówką',
            'Wieprzowina słodko-pikantna serwowana z ryżem i surówką',
            '2. Wieprzowina słodko-pikantna serwowana z ryżem i surówką',
            'Wieprzowina słodko-pikantna serwowana z ryżem i surówką',
            'Wieprzowina słodko-pikantna serwowana z ryżem i surówką',
            'Wieprzowina słodko-pikantna serwowana z ryżem i surówką',
            'Wieprzowina słodko-pikantna serwowana z ryżem i surówką',
            'Wieprzowina słodko-pikantna serwowana z ryżem i surówką',
            'Wieprzowina słodko-pikantna serwowana z ryżem i surówką',
            'zielone curry z tofu (dopłacę różnicę do benefita)'
        ];
        var expectedOrder = [
            '8 x wieprzowina słodko-pikantna serwowana z ryżem i surówką',
            '2 x 2. wieprzowina słodko-pikantna serwowana z ryżem i surówką',
            '1 x zielone curry z tofu (dopłacę różnicę do benefita)'
        ];
        expect(manager.groupOrders(order)).toContainAll(expectedOrder);
    });

    it("should group orders 10", function () {
        var order = [
            'zupa + makaron (kurczak, szpinak, oliwa)',
            'zupa + makaron (kurczak, szpinak, oliwa)',
            'zupa + makaron (kurczak, szpinak, oliwa)',
            'zupa + makaron orzechy włoskie, sos pesto',
            'Zupa dnia - sałatka wiosenna',
            'Zupa + makaron łosoś, kapary, sos kremowy na ostro',
            'zupa + pizza funghi',
            'zupa + pizza fungi',
            'danie dnia',
            'danie dnia'
        ];
        var expectedOrder = [
            '3 x zupa + makaron (kurczak, szpinak, oliwa)',
            '2 x danie dnia',
            '1 x zupa dnia - sałatka wiosenna',
            '1 x zupa + makaron łosoś, kapary, sos kremowy na ostro',
            '1 x zupa + makaron orzechy włoskie, sos pesto',
            '1 x zupa + pizza funghi',
            '1 x zupa + pizza fungi'
        ];
        expect(manager.groupOrders(order)).toContainAll(expectedOrder);
    });

    it("should group orders 11", function () {
        var order = [
            'danie dnia',
            'danie dnia',
            'zupa + danie dnia',
            'sałatka wiosenna',
            'danie dnia',
            'danie dnia + zupa',
            'zupa + danie dnia',
            'pizza pepperoni + zupa (zestaw)',
            'pizza pepperoni + zupa',
            'pizza pepperoni + zupa',
            'pizza pepperoni + zupa',
            'danie dnia',
            'pizza pepperoni + zupa',
            'pizza pepperoni + zupa'
        ];
        var expectedOrder = [
            '5 x pizza pepperoni + zupa',
            '4 x danie dnia',
            '3 x zupa + danie dnia',
            '1 x pizza pepperoni + zupa (zestaw)',
            '1 x sałatka wiosenna'
        ];
        expect(manager.groupOrders(order)).toContainAll(expectedOrder);
    });

    it("should group orders 12", function () {
        var order = [
            'Makaron z łososiem, szpinakiem, chilli, posypany rukolą i favitą',
            'lasagne',
            'lasagne',
            'Makaron z łososiem, szpinakiem, chilli, posypany rukolą i favitą.',
            'Makaron z łososiem, szpinakiem, chilli, posypany rukolą i favitą',
            'lasagne',
            'lasagne',
            'zupa + sałatka wiosenna z sosem czosnkowym',
            'Makaron z łososiem, szpinakiem, chilli, posypany rukolą i favitą',
            'Makaron z łososiem, szpinakiem, chilli, posypany rukolą i favitą',
            'Makaron z łososiem, szpinakiem, chilli, posypany rukolą i favitą'
        ];
        var expectedOrder = [
            '6 x makaron z łososiem, szpinakiem, chilli, posypany rukolą i favitą',
            '4 x lasagne',
            '1 x zupa + sałatka wiosenna z sosem czosnkowym'
        ];
        expect(manager.groupOrders(order)).toContainAll(expectedOrder);
    });

    it("should group orders 13", function () {
        var order = [
            'danie danie - Pizza Toskania',
            'zupa + makaron pesto orzechy włoskie',
            'Pizza BBQ',
            'sałatka wiosenna',
            'Pizza BBQ',
            'danie dnia - Pizza Toskania',
            'danie-dnia Pizza Bolonia- salame Picante, bekon, cebula)',
            'Pizza BBQ',
            'danie dnia: Pizza Bolonia',
            'danie dnia Pizza Bolonia'
        ];
        var expectedOrder = [
            '3 x pizza bbq',
            '2 x danie dnia: pizza bolonia',
            '1 x danie danie - pizza toskania',
            '1 x danie-dnia pizza bolonia- salame picante, bekon, cebula)',
            '1 x danie dnia - pizza toskania',
            '1 x sałatka wiosenna',
            '1 x zupa + makaron pesto orzechy włoskie'
        ];
        expect(manager.groupOrders(order)).toContainAll(expectedOrder);
    });

    it("should group orders 14", function () {
        var order = [
            'danie dnia + zupa',
            'zupa + sałatka wiosenna',
            'danie dnia',
            'danie dnia',
            'zupa + danie-dnia',
            'danie dnia',
            'danie dnia',
            'zupa + makaron z łososiem',
            'zupa + makaron z łososiem',
            'zupa + pizza pepperoni',
            'pizza pepperoni + zupa',
            'zupa + pizza pepperoni',
            'zupa + pizza pepperoni',
            'danie dnia + zupa dnia',
            'danie dnia'
        ];
        var expectedOrder = [
            '5 x danie dnia',
            '4 x zupa + pizza pepperoni',
            '2 x danie dnia + zupa',
            '2 x zupa + makaron z łososiem',
            '1 x zupa + sałatka wiosenna',
            '1 x danie dnia + zupa dnia'
        ];
        expect(manager.groupOrders(order)).toContainAll(expectedOrder);
    });

    it("should group orders 15", function () {
        var order = [
            'zupa + sałatka wiosenna',
            'pizza pepperoni',
            'pizza pepperoni',
            'zupa + makaron pesto orzechy włoskie',
            'danie dnia',
            'zupa + makaron pesto orzechy włoskie',
            'makaron ze szpinakiem, suszone pomidory',
            'zupa + makaron: (łosoś, kapary, sos kremowy łagodny)',
            'zupa, pizza-fungi, benefit',
            'zupa, makaron orzechy włoskie, sos pesto',
            'pizza pepperoni',
            'zupa + makaron łosoś kapary sos kremowy ZAPIEKANY',
            'zupa + sałatka wiosenna',
            'zupa + sałatka wiosenna',
            'zupa + makaron: (łosoś, kapary, sos kremowy łagodny)',
            'zupa + makaron pesto orzechy włoskie',
            'pizza zielona pitruszka',
            'makaron ze szpinakiem, suszone pomidory',
            'losos, kapary, sos kremowy (na ostro)'
        ];
        var expectedOrder = [
            '3 x zupa + sałatka wiosenna',
            '3 x pizza pepperoni',
            '3 x zupa + makaron pesto orzechy włoskie',
            '2 x makaron ze szpinakiem, suszone pomidory',
            '2 x zupa + makaron: (łosoś, kapary, sos kremowy łagodny)',
            '1 x danie dnia',
            '1 x zupa, pizza-fungi, benefit',
            '1 x zupa, makaron orzechy włoskie, sos pesto',
            '1 x zupa + makaron łosoś kapary sos kremowy zapiekany',
            '1 x pizza zielona pitruszka',
            '1 x losos, kapary, sos kremowy (na ostro)'
        ];
        expect(manager.groupOrders(order)).toContainAll(expectedOrder);
    });

});
