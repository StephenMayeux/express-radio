var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var urlSchema = new Schema({
	release_id: Number,
	video_url: String
},{timestamps: true})

var ModelClass = mongoose.model('url',urlSchema)
module.exports = ModelClass;