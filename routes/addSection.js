var data = require("../itemsList.json");

exports.addSection = function(request, response) {
   
   var section = {
      "sectionName": request.query.sectionName,
      "categories": []
   }
   console.log(section);
   data.Sections.push(section);
   console.log("l (addSection): " + data.Sections.length);
   response.render('sections.handlebars', data);
}