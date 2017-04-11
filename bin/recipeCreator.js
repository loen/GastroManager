var ordersDao = require ('./ordersDao');
var _ = require('underscore');
var configHelper = require('./configHelper');
var orderManager = require('./orderManager');

function prepareRecipe(winner, restaurant, contact, email){
    var users = ordersDao.getCustomersFromRestaurant(restaurant);
    var recipe = 'Buongiorno, <@' + winner.id + '|' + winner.name + '> jesteś gastro managerem dla *' + restaurant + '*, complimenti!\n' +
        'Oto telefon do złożenia zamówienia: *' + contact + '*';

    if (email) {
        recipe = recipe + ', możesz także skorzystać z maila *' + email + '*';
    }

    recipe = recipe + prepareOrdersText(users, restaurant);
    return recipe;
}

function unableToPrepareRecipe(restaurant, minOrdersCount){
    var response = 'Porca miseria! Minimalna ilość zamówień (*' + minOrdersCount + '*) dla *' + restaurant + '* nie została osiągnięta.\n' +
        'Zamównienie *NIE* będzie zrealizowane';
    console.log(response);
    return response;
}

function prepareOrdersStatus(restaurant){
    var users = ordersDao.getCustomersFromRestaurant(restaurant);
    var recipe = 'Stan zamówień dla *' + restaurant + '*: ';
    recipe = recipe + prepareOrdersText(users, restaurant);
    return recipe;
}

function prepareOrdersText(users, restaurant) {
    var benefitRecipe = '\nLista zamówień *NA* kartę benefit:';
    var noBenefitRecipe = '\nLista zamówień *BEZ* karty benefit:';
    var recipe = '';
    var orders = prepareOrderLines(users, restaurant);

    if (_.size(orders.benefitOrderLines) === 0 && _.size(orders.noBenefitOrderLines) === 0) {
        recipe = 'lista jest pusta'
    } else {
        if (_.size(orders.benefitOrderLines) > 0) {
            recipe = recipe + benefitRecipe + '```' + _.map(orders.benefitOrderLines, function (order) {
                var prefix = order.user + ' (benefit: ' + order.cardId + ') ';
                return pad_right(prefix, '.', 50) + ' ' + order.order;
            }).join("\n") + '```';
        }
        if (_.size(orders.noBenefitOrderLines) > 0) {
            recipe = recipe + noBenefitRecipe + '```' + _.map(orders.noBenefitOrderLines, function (order) {
                var prefix = order.user + ' ';
                return pad_right(prefix, '.', 30) + ' ' + order.order;
            }).join("\n") + '```';
        }
    }

    return recipe + '\n';
}

function prepareOrderLines(users, restaurant) {
    var benefitOrderLines = [];
    var noBenefitOrderLines = [];
    _.each(users, function (user) {
        var benefitNumber = configHelper.getBenefitNo(user.name);
        var userOrder = ordersDao.getOrderFromRestaurant(restaurant, user);
        if (benefitNumber) {
            benefitOrderLines.push({user: user.name, cardId: benefitNumber, order: userOrder})
        } else {
            noBenefitOrderLines.push({user: user.name, order: userOrder});
        }
    });

    return {
        benefitOrderLines: benefitOrderLines,
        noBenefitOrderLines: noBenefitOrderLines
    };
}

function pad_right(string, paddingChar, size) {
    if (_.size(string) >= size) {
        return string;
    }
    var max = size - _.size(string);
    for (var i = 0; i < max; i++) {
        string += paddingChar;
    }
    return string;
}

function prepareGroupedOrderRecipe(restaurant) {
    var users = ordersDao.getCustomersFromRestaurant(restaurant);
    var orders = prepareOrderLines(users, restaurant);
    var groupedBenefitOrders = orderManager.groupOrders(_.map(orders.benefitOrderLines, getOrder));
    var groupedNoBenefitOrders = orderManager.groupOrders(_.map(orders.noBenefitOrderLines, getOrder));
    var result =      '#####################################\n';
    result = result + '###   Zgrupowany zestaw zamówień  ###\n';
    result = result + '#####################################\n\n';

    if (_.size(groupedBenefitOrders) > 0) {
        result = result + '*** Zamówienie na kartę Benefit ***\n' + groupedBenefitOrders.join('\n') + '\n';
    }
    if (_.size(groupedBenefitOrders) > 0 && _.size(groupedNoBenefitOrders) > 0) {
        result = result + '\n';
    }
    if (_.size(groupedNoBenefitOrders) > 0) {
        result = result + '*** Zamówienie płatne gotówką ***\n' + groupedNoBenefitOrders.join('\n') + '\n';
    }

    result = result + '\n#####################################\n';
    result = result + '###   Oryginalny zestaw zamówień  ###\n';
    result = result + '#####################################\n';

    if (_.size(orders.benefitOrderLines) > 0) {
        result = result + '\nLista zamówień NA kartę benefit:\n';
        result = result + _.map(orders.benefitOrderLines, function (order) {
                var prefix = order.user + ' (benefit: ' + order.cardId + ') ';
                return pad_right(prefix, '.', 50) + ' ' + order.order;
            }).join("\n");
    }
    if (_.size(groupedBenefitOrders) > 0 && _.size(groupedNoBenefitOrders) > 0) {
        result = result + '\n';
    }
    if (_.size(orders.noBenefitOrderLines) > 0) {
        result = result + '\nLista zamówień BEZ karty benefit:\n';
        result = result + _.map(orders.noBenefitOrderLines, function (order) {
                var prefix = order.user + ' ';
                return pad_right(prefix, '.', 30) + ' ' + order.order;
            }).join("\n");
    }

    return result;
}

function getOrder(orderLine) {
    return orderLine.order;
}

exports.prepareRecipe = prepareRecipe;
exports.unableToPrepareRecipe = unableToPrepareRecipe;
exports.prepareOrdersStatus = prepareOrdersStatus;
exports.prepareGroupedOrderRecipe = prepareGroupedOrderRecipe;
