  //require as a module to be used anywhere.

module.exports = {}  

var MongoClient = require('mongodb').MongoClient;
var mongoURI = process.env.MONGOLAB_URI;
if(mongoURI == undefined){ //local testing when not on heroku.
  mongoURI = "mongodb://localhost/chem"
}

MongoClient.connect(mongoURI, function(err, db) {
	if(err) throw err;

	module.exports.users = db.collection('users');
	module.exports.classes = db.collection('classes');

	console.log('Connected to Mongo!')

})