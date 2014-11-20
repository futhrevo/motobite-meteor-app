//http://www.andrehonsberg.com/article/reactive-google-maps-markers-meteor-js
gmap = {
	//map object
	map: null,

	//google markers objects
	markers: [],

	//google lat lng objects
	latLngs: [],

	//formatted marker data objects
	markerData: [],

	//add a marker from the given marker object
	addMarker: function(marker) {
		var myLatlng = new google.maps.LatLng(marker.lat,marker.lng);
		// To add the marker to the map, use the 'map' property
		var mymarker = new google.maps.Marker({
		    position: myLatlng,
		    map: this.map,
		    title:marker.title,
		    animation: google.maps.Animation.DROP,
		    icon:'/taxi.png'
		});

		//keep track of markers and geo data
		this.latLngs.push(myLatlng);
		this.markers.push(mymarker);
		this.markerData.push(marker);

		return mymarker;
	},

	// calculate and move the bound box based on our markers
	calcBounds: function(){
		var bounds = new google.maps.LatLngBounds();
		for (var index in this.latLngs){
			bounds.extend(this.latLngs[index]);
		}
		this.map.fitBounds(bounds);
	},

	//check if marker already exists
	markerExists: function(key, val){
		_.each(this.markers, function(storedMarker){
			if(storedMarker[key] == val)
				return true;
		});
		return false;
	},

	//initialize the map
	initialize: function(){
		console.log("[+] Initializing Google Maps...");
		var mapOptions ={
			center: new google.maps.LatLng(12.9525812,77.7034538),
			zoom: 17
		};
		this.map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

		//global flag saying we initialized already
		Session.set('map', true);
	}
}