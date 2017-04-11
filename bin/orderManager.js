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
    orders = _.groupBy(orders, createKey);
    return _.map(_.keys(orders), function (e) {
        return {order: mapOrderLine(orders[e][0]), number: _.size(orders[e])};
    });
}

function createKey(order) {
    order = order.toLowerCase()
        .replace(/[()\-+,:\.\/]/g, ' ')
        .replace('ę', 'e')
        .replace('ó', 'o')
        .replace('ą', 'a')
        .replace('ś', 's')
        .replace('ł', 'l')
        .replace('ż', 'z')
        .replace('ź', 'z')
        .replace('ć', 'c')
        .replace('ń', 'n')
        .replace(/\s+/g, ' ').trim().split(' ');
    order = _.sortBy(order, function (e) {
        return e;
    }).join('-');
    return order;
}

function mapOrderLine(order) {
    return order.toLowerCase();
}

exports.groupOrders = groupOrders;
