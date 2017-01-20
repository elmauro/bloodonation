var Schema = require('mongoose').Schema

var dataSchema = new Schema({
	firstname: { type: String },
	lastname: { type: String },
	number: { type: String },
	email: { type: String },
	group: { type: String },
	ip: { type: String },
	lat : { type: Number },
	lng : { type: Number }
});

var data = module.exports = dataSchema;