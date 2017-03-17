var app = require('../app.js');
mongo = require('mongodb')

function getVideoData(videoId, callback) {
	try{
		var collectionVideos = app.db.collection('videos');
		var collectionBandas = app.db.collection('bandas');
		var collectionMusicos = app.db.collection('musicos');
		// Agarramos todos los videos y las bandas
		collectionVideos.findOne({_id:new mongo.ObjectID(videoId)}, function(err, video){
			if(!err){
				var t = new Promise(function(resolve, rejected){
					if("bandas" in video){
						video.bandas.forEach(function(bandaId, bandaIndex){
							var bandasMongoIds = video.bandas.map(function(b){return {_id:new mongo.ObjectID(b)}})
							collectionBandas.find({$or:bandasMongoIds},[]).toArray(function(err,bandasBD){
								if(!err){							
									video.bandas = bandasBD;
									resolve(video);
								}else{
									rejected(err);
								}
							})		
						})
					}else{
						resolve(video);
					}
				}).
				then(function(video){
					var rolesMongoIds = video.roles.map(function(r){
						return {_id:new mongo.ObjectID(r._id)}
					})
					collectionMusicos.find({$or:rolesMongoIds},[]).toArray(function(err, musicosBD){
						if(!err){
							musicosBD.forEach(function(musico){
								video.roles.some(function(rol){
									if(rol._id = musico._id){
										rol.musico = musico
										return true;
									}
								})
							})
							callback(err, video)
						}else{
							callback(err, video)
						}
					})
				},function(err){callback(err, {})})
			}else{
				console.log("entramo acá")
				callback(err, video)
			}
		})
	}catch (err){
		callback(err, {})
	}
}

var videoController = function(req, res) {
	getVideoData(req.params.id, function(err, docs) {
		if (err == null) {
			console.log("No hubieron errores");
			res.render('video', {video:docs});
		} else {
			console.log('Error al recuperar información de la base de datos');
			console.log(err);
			res.render('404.hbs',err)
		}
	});
}

module.exports = videoController;
