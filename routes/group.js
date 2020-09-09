
var data = require('../shoppingList.json');

exports.view = function (request, response) {

   console.log(data);
   response.render('group', data);
};