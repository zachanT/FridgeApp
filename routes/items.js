var data = require('../itemsList.json');

exports.view = function (request, response) {

   console.log(data);
   //data['Sections'][0]['categories'][1]['items'].push(test);
   response.render('items', data);
}

exports.viewAlt = function (request, response) {
	data['viewAlt'] = true;
	response.render('items', data);
}