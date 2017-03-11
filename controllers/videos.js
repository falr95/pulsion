var app = require('../app.js');
mongo = require('mongodb')

function getVideoData(videoId, callback) {
	console.log("videoId", videoId);
	var colVideos = app.db.collection('videos');
	var colBandas = app.db.collection('bandas');
	var colRoles = app.db.collection('roles');
	var colInstrumentos = app.db.collection('instrumentos');
	var colMusicos = app.db.collection('musicos');
	// Agarramos todos los videos y las bandas
	var data = {};
	colVideos.findOne({_id:new mongo.ObjectID(videoId)}, function(err, video){
		if(!err){
			video.bandas = video.bandas || []
			video.roles = video.roles || []
			video.bandas.forEach(function(bandaId, bandaIndex){
				var bandasMongoIds = video.bandas.map(function(b){return {_id:new mongo.ObjectID(b)}})
				colBandas.find({$or:bandasMongoIds},[]).toArray(function(err,bandasBD){
					if(!err){							
						video.bandas = bandasBD;
						var rolesMongoIds = video.roles.map(function(r){return {_id:new mongo.ObjectID(r)}})
						colRoles.find({$or:rolesMongoIds},[]).toArray(function(err,rolesBD){
							if(!err){
								video.roles = rolesBD;
								musicosMongoIds = video.roles.map(function(r){return {_id:new mongo.ObjectID(r.musico)}})
								colMusicos.find({$or:musicosMongoIds},[]).toArray(function(err, musicosBD){
									if(!err){
										video.musicos = musicosBD;
										musicosBD.forEach(function(musico){
											video.roles.some(function(rol){
												if(rol.musico = musico._id){
													rol.musico = musico
													return true;
												}
											})
										})
										callback(err, video)
									}else{callback(err, video)}
								})
							}else{callback(err, video)}
						})
					}else{
						callback(err, video)
					}
				})
				
			})
		}else{callback(err, video)}

	})
}

var videoController = function(req, res) {
	getVideoData(req.params.id, function(err, docs) {
		if (err == null) {
			console.log("No hubieron errores");
			console.log("docs",docs)
			res.render('video', {video:docs});
		} else {
			console.log('Error al recuperar información de la base de datos');
			console.log(err);
		}
	});
}

module.exports = videoController;
