var ordersDao = require ('./ordersDao');
var _ = require('underscore');
var configHelper = require('./configHelper');

function prepareRecipe(winner, restaurant, contact, email){
    var users = ordersDao.getCustomersFromRestaurant(restaurant);
    var recipe = 'Buongiorno, *' + winner + '* jesteś gastro managerem dla *' + restaurant + '*, complimenti!\n' +
        'Oto telefon do złożenia zamówienia: *' + contact + '*';

    if (email) {
        recipe = recipe + ', możesz także skorzystać z maila *' + email + '*';
    }

    recipe = recipe + '\n```' + prepareOrdersText(users, restaurant) + '```';
    return recipe;
}

function unableToPrepareRecipe(restaurant, minOrdersCount){
    var response = 'Porca miseria! Minimalna ilość zamówień (' + minOrdersCount + ') dla ' + restaurant + ' nie została osiągnięta.\n' +
        'Zamównienie NIE będzie zrealizowane.';
    console.log(response);
    return response;
}

function prepareOrdersStatus(restaurant){
    var users = ordersDao.getCustomersFromRestaurant(restaurant);
    var recipe = 'Ciao tutti !\n' +
        'Obecny stan zamówień dla ' + restaurant + ':\n';
    recipe = recipe + prepareOrdersText(users, restaurant);
    return recipe;
}

function prepareOrdersText(users, restaurant) {
    var benefitRecipe = '\nLista zamówień z kartą benefit:\n' +
        '------------------------------\n';
    var noBenefitRecipe = '\nLista zamówień BEZ karty benefit:\n' +
        '------------------------------\n';
    var recipe;

    _.each(users, function (user) {
        var benefitNo = configHelper.getBenefitNo(user);
        if (benefitNo) {
            benefitRecipe = benefitRecipe + user + '[karta:' + benefitNo + '] ........... ' + ordersDao.getOrderFromRestaurant(restaurant, user) + '\n';
        } else {
            noBenefitRecipe = noBenefitRecipe + user + ' ........... ' + ordersDao.getOrderFromRestaurant(restaurant, user) + '\n';
        }

    });
    recipe = benefitRecipe + noBenefitRecipe;
    return recipe;
}

exports.prepareRecipe = prepareRecipe;
exports.unableToPrepareRecipe = unableToPrepareRecipe;
exports.prepareOrdersStatus = prepareOrdersStatus;
