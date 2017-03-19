var ordersDao = require ('./ordersDao');
var _ = require('underscore');
var configHelper = require('./configHelper');

function prepareRecipe(winner, restaurant, contact, email){
    var users = ordersDao.getCustomersFromRestaurant(restaurant);
    var recipe = 'Ciao tutti !\n' +
        'dzisiejszym gastro managerem dla ' + restaurant + ' jest ' + winner + ' ! \n' +
        winner + ' oto telefon do złożenia zamówienia : ' + contact + '\n';

       if(email){
           recipe = recipe + 'możesz też skorzystać z maila ' + email + ' \n';
       }

    recipe = prepareOrdersText(users, restaurant, recipe);
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
    recipe = prepareOrdersText(users, restaurant, recipe);
    return recipe;
}

function prepareOrdersText(users, restaurant, recipe) {
    var benefitRecipe = '\nLista zamówień z kartą benefit: \n' +
        '------------------------------\n';
    var noBenefitRecipe = '\n Lista zamówień BEZ karty benefit: \n' +
        '------------------------------\n';

    _.each(users, function (user) {
        var benefitNo = configHelper.getBenefitNo(user);
        if (benefitNo) {
            benefitRecipe = benefitRecipe + user + '[karta:' + benefitNo + '] ........... ' + ordersDao.getOrderFromRestaurant(restaurant, user) + '\n';
        } else {
            noBenefitRecipe = noBenefitRecipe + user + ' ........... ' + ordersDao.getOrderFromRestaurant(restaurant, user) + '\n';
        }

    });
    recipe = recipe + benefitRecipe + noBenefitRecipe;
    return recipe;
}

exports.prepareRecipe=prepareRecipe;
exports.unableToPrepareRecipe=unableToPrepareRecipe;
exports.prepareOrdersStatus = prepareOrdersStatus;
