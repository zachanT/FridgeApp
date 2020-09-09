var data = require("../shoppingList.json");

exports.addMember = function(request, response) {
   
   var member = {
      "memberName": request.query.memberName,
      "list": []
   }
   console.log(member);
   data.shoppingLists.push(member);
   response.render('group.handlebars', data);
}