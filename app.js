var express = require('express');
var handlebars = require('express-handlebars');
var mongoClient = require('mongodb').MongoClient;

var app = express();

var indexController = require('./controllers/index');

mongoClient.connect('mongodb://ds157549.mlab.com:57549/pulsion', function(err,db) {
	if (err) {
		console.log('Error al conectarse con la base de datos');
		console.log(err);
		db.close();
	} else {
		console.log('Conexión a la base de datos establecida');
		db.authenticate(process.env.MONGOUSER, process.env.MONGOPASS, function(err, result) {
			if (result == true) {
				console.log('Autenticación con la base de datos exitosa');

				module.exports.db = db;

				app.engine('handlebars', handlebars());
				app.set('view engine', 'handlebars');

				app.get('/', indexController);

				app.listen(3000, function() {
					console.log('Escuchando en el puerto 3000');
				});
			} else {
				db.close();
				console.log('Autenticación con la base de datos fallida');
				console.log(err);
			}
		});
	}
});


