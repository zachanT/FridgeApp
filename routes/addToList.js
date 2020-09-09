var data = require("../shoppingList.json");

exports.addToList = function(request, response) {
   
   var item = {
      "listItem": request.query.itemName,
   }
   var member = request.query.member;
   var i;
   for (i = 0; i < data['shoppingLists'].length; i++) {
      if (data.shoppingLists[i].memberName == member) {
         break;
      }
   }
   data.shoppingLists[i].list.push(item);
   response.render('shoppingList.handlebars', data);
}