var app = require('../app.js');
mongo = require('mongodb')

function getMusicianData(musicoId, callback) {
	var ourMusician = {};
	var collectionVideos = app.db.collection('videos');
	var collectionBandas = app.db.collection('bandas');
	var collectionMusicos = app.db.collection('musicos');
	function getMusician(cb){
		collectionMusicos.findOne({_id:new mongo.ObjectID(musicoId)}, function(err, musico){
			if(err || !musico){
				throw err;
			}else{
				Object.assign(ourMusician, musico);
				cb();
			}
		})
	}
	function getBands(cb){
		if("bandas" in ourMusician){
			var bandasMongoIds = ourMusician.bandas.map(function(b){return {_id:new mongo.ObjectID(b)}})
			collectionBandas.find({$or:bandasMongoIds},[]).toArray(function(err,bandasBD){
				if(err){
					throw err;
				}else{
					ourMusician.bandas = bandasBD;
					cb();
				}
			})
		}else{
			resolve()
		}
	}
	function getVideos(cb){
		collectionVideos.find({"roles":{$elemMatch: {"_id":new mongo.ObjectID(musicoId)}}}).toArray(function(err, videosMusico){
			if(!err && videosMusico){
				ourMusician.videos = videosMusico;
				cb(err, ourMusician);
			}else{
				throw err;
			}
		})
	}
	function getPartners(cb){
		var partnersMongoIds = [];
		ourMusician.videos.forEach(function(video){
			video.roles.forEach(function(partner){
				if(partner.nombre != ourMusician.nombre){
					partnersMongoIds.push({"_id":new mongo.ObjectID(partner._id)});
				}
			});
		})
		if(partnersMongoIds.length > 0){
			collectionMusicos.find({$or: partnersMongoIds}).toArray(function(err, bdPartners){
				if(!err && bdPartners){
					ourMusician.partners = bdPartners;
					cb(err, ourMusician);
				}else{
					throw err;
				}
			})
		}else{
			cb(err, ourMusician);
		}
	}
	try{
		getMusician(function(){
			getBands(function(){
				getVideos(function(){
					getPartners(function(err){
						callback(err, ourMusician)
					})
				})
			})
		})
	}catch(err){
		callback(err, ourMusician)
	}
}

var musicoController = function(req, res) {
	getMusicianData(req.params.id, function(err, docs) {
		if (err == null) {
			console.log("No hubieron errores");
			res.render('musico', {musico:docs});
		} else {
			console.log('Error al recuperar información de la base de datos');
			console.log(err);
			res.render('404.hbs',err)
		}
	});
}

module.exports = musicoController;
