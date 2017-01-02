var ordersDao = require ('./ordersDao');
var _ = require('underscore');

function prepareRecipe(winner, restaurant, contact){
    var users = ordersDao.getCustomersFromRestaurant(restaurant);
    var recipe = 'Ciao tutti !\n' +
        'dzisiejszym gastro managerem dla ' + restaurant + ' jest ' + winner + ' ! \n' +
        winner + ' oto kontakt do złożenia zamówienia : ' + contact + '\n\n';
    recipe = recipe + 'Lista zamównień:\n';
    recipe = recipe + '----------------\n';
    _.each(users, function(user){
        recipe = recipe + user + ' ........... ' + ordersDao.getOrderFromRestaurant(restaurant, user) + '\n';
    });
    console.log(recipe);
    return recipe;
}

function unableToPrepareRecipe(restaurant, minOrdersCount){
    var response = 'Porca miseria! Minimalna ilość zamówień (' + minOrdersCount + ') dla ' + restaurant + ' nie została osiągnięta.\n' +
        'Zamównienie NIE będzie zrealizowane.';
    console.log(response);
    return response;

}

exports.prepareRecipe=prepareRecipe;
exports.unableToPrepareRecipe=unableToPrepareRecipe;
