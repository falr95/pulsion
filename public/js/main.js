var app = angular.module("myApp",[]);

app.directive("toggler",function(){
	return{
		link:function($scope, element, attrs){
			console.log(attrs);
			element.on("click",function(){
				console.log("clicked",attrs.target,attrs.toggler);
				var target = document.querySelectorAll(attrs.target)[0]
				angular.element(target).toggleClass(attrs.toggler);
			})
		}
	}
})