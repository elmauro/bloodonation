var Schema = require('mongoose').Schema

var dataSchema = new Schema({
	name: 		{ type: String }
});

var data = module.exports = dataSchema;