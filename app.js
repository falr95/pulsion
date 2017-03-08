var express = require('express');
var path = require('path');
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
		console.log(process.env.MONGOUSER, process.env.MONGOPASS);
		db.authenticate(process.env.MONGOUSER, process.env.MONGOPASS, function(err, result) {
			if (result == true) {
				console.log('Autenticación con la base de datos exitosa');
				module.exports.db = db;
				app.set('views', path.join(__dirname, 'views'));
				app.set('view engine', 'hbs');
				app.use(express.static(path.join(__dirname, 'public')));
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

