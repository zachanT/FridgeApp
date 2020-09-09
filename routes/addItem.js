var data = require("../itemsList.json");

exports.addItem = function (request, response) {
   var section = request.query.sect;

   var item = {
      "itemName": request.query.itemName,
      "expiration": request.query.expiration,
      "notification": request.query.notification,
      "quantity": request.query.quantity,
      "units": request.query.units,
      "shared": request.query.shared
   }
   
   if (item.shared == undefined) {
      item.shared = null;
   }
   console.log("shared: " + item.shared);
   var category = request.query.category;
   console.log("category: " + category);
   var i;
   var k;

   if(!category) {
      category = request.query.cat;
      var cat = {
         "categoryName": category,
         "items": []
      }
   }
   console.log("length: " + data.Sections[0].categories.length);
loop1:
   for (i = 0; i < data['Sections'].length; i++) {
      console.log(i + " s: " + data.Sections[i].sectionName);
      if (section == "All Items" || data.Sections[i].sectionName == section) {
         data.Sections[i].categories.push(cat);
loop2:
         for (k = 0; k < data.Sections[i].categories.length; k++) {
            console.log("c: " + data.Sections[i].categories[k].categoryName);
            if (data.Sections[i].categories[k].categoryName == category) {
               break loop1;
            }
         }
      }
   }
   if (!k) {
      //data.Sections[i].
   }
   console.log("ind: " + k);
   data.Sections[i].categories[k].items.push(item);
   response.render('items.handlebars', data);
}