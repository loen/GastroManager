var _ = require('underscore');

function groupOrders(orders) {
    var processedOrders = _.sortBy(processOrders(orders), function (e) {
        return e.number * -1;
    });
    var result = _.map(processedOrders, function (e) {
        return '' + e.number + ' x ' + e.order;
    });
    return result;
}

function processOrders(orders) {
    orders = _.map(orders, function (e) {
        return e.toLowerCase()
            .replace(/[()\-+,:\.]/g, ' ')
            .replace('ę', 'e')
            .replace('ó', 'o')
            .replace('ą', 'a')
            .replace('ś', 's')
            .replace('ł', 'l')
            .replace('ż', 'z')
            .replace('ź', 'z')
            .replace('ć', 'c')
            .replace('ń', 'n')
            .replace(/\s+/g, ' ').trim();
    });
    orders = _.sortBy(orders, function (e) {
        return e;
    });
    orders = _.groupBy(orders, function (e) {
        return e;
    });
    return _.map(_.keys(orders), function (e) {
        return {order: e, number: _.size(orders[e])};
    });
}

exports.groupOrders = groupOrders;
