var data = require("../itemsList.json");

exports.addCategory = function (request, response) {
   var section = request.query.sect;

   var category = {
      "categoryName": request.query.catName,
      "items": []
   }

   var i;
   console.log("section: " + section);
   console.log("length: " + data['Sections'].length);
   for (i = 0; i < data['Sections'].length; i++) {
      console.log(i + " s: " + data.Sections[i].sectionName);
      console.log(data.Sections[i].sectionName == section);
      if (data.Sections[i].sectionName == section) {
               break;
      }
   }
   console.log(i);
   console.log(data.Sections[i]);
   data.Sections[i].categories.push(category);
   console.log(data);
   response.render('items.handlebars', data);
}