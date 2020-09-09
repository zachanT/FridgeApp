var data = require("../itemsList.json");

exports.deleteItem = function (request, response) {

   
   response.render('items.handlebars', data);
}