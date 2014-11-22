//http://www.andrehonsberg.com/article/reactive-google-maps-markers-meteor-js
gmap = {
	//map object
	map: null,

	//searchbox
	searchBoxSrc: null,
	searchBoxDest: null,

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
		this.searchBoxSrc = new google.maps.places.SearchBox(document.getElementById("map-src-search"));
		this.searchBoxDest = new google.maps.places.SearchBox(document.getElementById("map-dest-search"));
		//global flag saying we initialized already
		Session.set('map', true);
	},

	//distance calculation using Haversine formula
	//http://andrew.hedges.name/experiments/haversine/
/*	dlon = lon2 - lon1 
	dlat = lat2 - lat1 
	a = (sin(dlat/2))^2 + cos(lat1) * cos(lat2) * (sin(dlon/2))^2 
	c = 2 * atan2( sqrt(a), sqrt(1-a) ) 
	d = R * c (where R is the radius of the Earth)*/
	haversine: function(src,dest,unit){
		if(unit == "km"){
			var R = 6373;
		}else{
			var R = 3961;
		}
		var dLat = (Math.PI/180) * (dest.lat() - src.lat());
		var dLon = (Math.PI/180) * (dest.lng() - src.lng());
		var lat1 = (Math.PI/180) * src.lat();
		var lat2 = (Math.PI/180) * dest.lat();

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) * Math.sin(dLon/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c; // Distance in km
		console.log(d);
		return(d);
	},

	sphericalD: function(src, dest){
		return google.maps.geometry.spherical.computeDistanceBetween(src,dest);
	}

}