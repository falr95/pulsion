var app = require('../app.js');

function getVideoData(callback) {
	var colVideos = app.db.collection('videos');
	var colBandas = app.db.collection('bandas');
	// Agarramos todos los videos y las bandas
	colVideos.find({}, ['bandas', 'link', 'zapada', 'fecha', 'cancion.nombre']).sort('fecha', -1).toArray(function(err, videos) {
		if (err != null) {
			callback(err, videos);
		} else {
			colBandas.find({}, ['nombre', 'zapada', 'cancion.nombre']).toArray(function(err, bandas) {
				if (err != null) {
					callback(err, bandas);
				} else {
					// Comparamos los IDs para ver q video va con q banda
					videos.forEach(function(video, videoIndex) {
						video.nombreBandas = []; // Agregamos un campo para guardar los nombre de las bandas
						bandas.forEach(function(banda, bandaIndex) {
							for (var i = 0; i < video.bandas.length; i++) {
								if (video.bandas[i].equals(banda._id)) {
									video.nombreBandas[i] = banda.nombre; // Agregamos el nombre de la banda
								}
							}
						});
						
						// Removemos los IDs de la bandas porque ya tenemos el nombre
						delete video['bandas'];
					});
					
					callback(err, videos);
				}
			});
		}
	});
}

var indexController = function(req, res) {
	getVideoData(function(err, docs) {
		if (err == null) {
			console.log("No hubieron errores");
			res.render('index', docs);
		} else {
			console.log('Error al recuperar información de la base de datos');
			console.log(err);
		}
	});
}

module.exports = indexController;
