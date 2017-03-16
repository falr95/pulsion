var app = angular.module("myApp",[]).
config(function($interpolateProvider){
	$interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
})
app.factory("youtubeClient", [function(clientCallback){
	function googleApiClientReady(cb){
		gapi.load('client', function(){
			gapi.client.init({'apiKey': 'AIzaSyDXU1wevjdAh2luFgg3egQz5OCeANylsJ0',}).
			then(function(){
				gapi.client.load('youtube','v3',function(){
					cb(gapi.client.youtube);
				})
			})
		});
	}
	return googleApiClientReady;
}])
app.controller('mainCtrl',["$scope","youtubeClient", function($scope, youtubeClient){
	$scope.youtube = youtubeClient;
}])
app.directive("toggler",function(){
	return{
		link:function($scope, element, attrs){
			element.on("click",function(){
				console.log("clicked",attrs.target,attrs.toggler);
				var target = document.querySelectorAll(attrs.target)[0]
				angular.element(target).toggleClass(attrs.toggler);
			})
		}
	}
})
app.directive("setThumb",function(){
	return {
		link:function($scope, element, attrs){
			$scope.youtube(function(youtube){
				youtube.search.list({part:"snippet", q:[attrs["setThumb"]]}).execute(function(videoData){
					videoData = videoData.items[0]
					console.log("y?",videoData.snippet.thumbnails.high.url,element);
					angular.element(element).css("background-image","url("+videoData.snippet.thumbnails.high.url+")");
				})
			})
		}
	}
})

app.directive("setPlayer",function(){
	return {
		link:function($scope, element, attrs){
			$scope.youtube(function(youtube){
				youtube.search.list({part:"snippet", q:[attrs["setPlayer"]]}).execute(function(videoData){
					videoData = videoData.items[0]
					console.log("y?",videoData.snippet.thumbnails.high.url,element);
					var playBtn = angular.element(document.querySelectorAll("#playBtn")[0]);
					angular.element(element).css("background-image","url("+videoData.snippet.thumbnails.high.url+")");
					playBtn.on("click", function(){
						var playerTag = angular.element(document.querySelectorAll("#player")[0]);
						var videoInfoTag = angular.element(document.querySelectorAll("#videoInfo")[0]);
				    	var controls = angular.element(document.querySelectorAll("#controls")[0])
				    	var social = angular.element(document.querySelectorAll("#social")[0])
						playBtn.toggleClass("hide");
						playerTag.toggleClass("show");
						videoInfoTag.toggleClass("hide");
						var player;
				        player = new YT.Player('player', {
					        height: '390',
					        width: '640',
					        playerVars:{
					        	autoplay:true,
					        	controls: 2,
					        	enablejsapi:true
					        },
					        videoId: attrs["setPlayer"],
					        events: {
					        	'onReady':playVideo
					        }
				        });
				        function onPlayerStateChange(event) {
					        if (event.data == YT.PlayerState.PLAYING && !done) {
					          setTimeout(stopVideo, 6000);
					          done = true;
					      }
					    }
					    function stopVideo() {
					    	player.stopVideo();
					    }
					    function playVideo(event) {
					    	console.log(event);
					    	controls.toggleClass("show");
							social.toggleClass("show");
					    	event.target.playVideo()
					    }
					})
				})
			})
		}
	}
})

