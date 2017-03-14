module.exports = {
	create: function(hbs){
		hbs.registerHelper('log',function(options){
			return Object.keys(options);
		});
		hbs.registerHelper('avatar',function(imageSrc){
			if(imageSrc[0] == "/"){
				return "/images/pulsionAvtr"+imageSrc;
			}else{
				return imageSrc;
			}
		});
		hbs.registerHelper('redes',function(webs){
			result = [];
			var validwebs = {
				facebook : "http://facebook.com",
				twitter:"http://twitter.com",
				bandcamp:"http://bandcamp.com",
				instagram:"http://instagram.com",
				soundcloud:"http://soundcloud.com"
			}
			var webIcons = {
				facebook : "facebook.svg",
				twitter:"twitter.svg",
				bandcamp:"bc.svg",
				instagram:"instagram.svg",
				soundcloud:"scloud.svg"
			}
			for(var key in webs){
				if(key in validwebs){
					var okWeb = validwebs[key]
					var path = webs[key];
					if(path[0] != "/"){
						path = "/"+path;
					}
					result.push('<a href="'+(okWeb+path)+'"><img src="/images/icons/'+webIcons[key]+'"></a>');
				}
			}
			return new hbs.SafeString(result.join(''));
		});
		hbs.registerHelper('age',function(birthDate){
			var now = new Date();
			var years = now.getYear() - birthDate.getYear();
			if(birthDate.getMonth() < now.getMonth() && birthDate.getDate() < now.getDate()){
				years += 1;
			}
			return now.getYear() - birthDate.getYear();
		});
	}
}