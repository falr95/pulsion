var app = require('../app.js');
mongo = require('mongodb')

function getVideoData(videoId, callback) {
	console.log("entró al video data");
	try{
		var collectionVideos = app.db.collection('videos');
		var collectionBandas = app.db.collection('bandas');
		var collectionMusicos = app.db.collection('musicos');
		// Agarramos todos los videos y las bandas
		collectionVideos.findOne({_id:new mongo.ObjectID(videoId)}, function(err, video){
			if(!err){
				var t = new Promise(function(resolve, rejected){
					if("bandas" in video){
						if(video.bandas.length > 0){
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
							resolve(video)
						}
					}else{
						resolve(video);
					}
				}).
				then(function(video){
					var rolesMongoIds = video.roles.map(function(r){
						return {"_id":new mongo.ObjectID(r._id)}
					})
					var rolesRelacionadosMongoIds = video.roles.map(function(r){
						return {"roles._id":new mongo.ObjectID(r._id)}
					})
					collectionMusicos.find({$or:rolesMongoIds},[]).toArray(function(err, musicosBD){
						if(!err){
							musicosBD.forEach(function(musico){
								video.roles.forEach(function(rol){
									var rolID = mongo.ObjectID(rol._id);
									var musicoID = mongo.ObjectID(musico._id);
									if(rolID.equals(musicoID)){
										console.log("match ok")
										rol.nombre = musico.nombre;
										return true;
									}
								})
							})
							collectionVideos.find({$or:rolesRelacionadosMongoIds.concat([{"sede":video.sede}])},[]).toArray(function(err, videosRelacionadosBd){
								if(!err){
									video.relacionados = [];
									video.mismaSede = [];
									videosRelacionadosBd.forEach(function(featuredVideo){
										if(featuredVideo.sede == video.sede){
											video.mismaSede.push(featuredVideo)
										}
										rolesRelacionadosMongoIds.map(function(a){return a["roles._id"]}).some(function(rolRelacion){
											console.log("\n\n\n\n",rolRelacion)
											return featuredVideo.roles.some(function(featuredRol){
												var idFeatured = mongo.ObjectID(featuredRol._id);
												var idRelacion = mongo.ObjectID(rolRelacion);
												if(idFeatured.equals(idRelacion)){
													video.relacionados.push(featuredVideo);
													return true;
												}
											})
										})
									})
									callback(err, video)
								}
							})
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
		console.log("entro al catch")
		callback(err, {})
	}
}

var videoController = function(req, res) {
	getVideoData(req.params.id, function(err, docs) {
		console.log("getVideo Callback;")
		if (err == null) {
			console.log("No hubieron errores");
			console.log("\n\n\n\nRRRRRR",docs.roles);
			res.render('video', {video:docs});
		} else {
			console.log('Error al recuperar información de la base de datos');
			console.log(err);
			res.render('404.hbs',err)
		}
	});
}

module.exports = videoController;
