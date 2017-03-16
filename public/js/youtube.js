function googleApiClientReady(cb){
	gapi.load('client', function(){
		gapi.client.init({'apiKey': 'AIzaSyDXU1wevjdAh2luFgg3egQz5OCeANylsJ0',}).
		then(function(){
			gapi.client.load('youtube','v3',function(){
				console.log("asdasd",gapi.client.youtube);
				gapi.client.youtube.search.list({part:"snippet", q:"gMdJzUVHRwU | D0BsgJxw208"}).execute(function(videos){
					cb(videos)
				})
			})
		})
	});
}