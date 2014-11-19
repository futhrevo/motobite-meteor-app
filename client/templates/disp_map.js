Template.dispMap.rendered = function(){
	// map initialization
	var mapOptions ={
		center: {lat:12.9525812, lng:77.7034538},
		zoom: 13
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
	console.log("Map helper Loaded");
}
