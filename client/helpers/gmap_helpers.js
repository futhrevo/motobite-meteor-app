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
	addMarker: function(marker,type,objType) {
		var icon;
		var myLatlng;
		var title;
		if(type == "origin"){
			icon = '/origin.png';
			title = 'Origin';
		}else if(type == "dest"){
			icon = '/destination.png';
			title = 'Destination';
		}else{
			icon = '/taxi.png';
			title = 'taxi';
		}

		if(objType == 'gmapMarker'){
			myLatlng = new google.maps.LatLng(marker.lat,marker.lng);
			title = marker.title;
		}else if(objType == 'latlng'){
			myLatlng = marker;
		}else if(objType == 'geoLatLng'){
			//geocoder to get latlng object from address provided
			var geocoder= new google.maps.Geocoder();
			geocoder.geocode({'address': marker}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					bounds.extend(results[0].geometry.location);
					gmap.map.fitBounds(bounds);
					console.log('Geocode calculated as : ' + results[0].geometry.location);
					myLatlng = results[0].geometry.location;
					//special case for async function 
					var mymarker = new google.maps.Marker({
					    position: myLatlng,
					    map: gmap.map,
					    title:title,
					    animation: google.maps.Animation.DROP,
					    icon: icon

					});
					console.log(myLatlng);
					gmap.latLngs.push(myLatlng);
					return myLatlng;
				} else{
					alert('Geocode was not successful for the following reason: '+ status);
					myLatlng = null;
				}
			});
		}

		
		// To add the marker to the map, use the 'map' property
		var mymarker = new google.maps.Marker({
		    position: myLatlng,
		    map: this.map,
		    title:title,
		    animation: google.maps.Animation.DROP,
		    icon: icon

		});
		console.log('marker added at loc : '+myLatlng);
		//keep track of markers and geo data
		this.latLngs.push(myLatlng);
		this.markers.push(mymarker);
		this.markerData.push(marker);

		return mymarker;
	},

	// calculate and move the bound box based on our markers
	calcBounds: function(){

		for (var index in this.latLngs){
			console.log(this.latLngs[index]);
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
		bounds = new google.maps.LatLngBounds();
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
		console.log("haversine distance in km : "+d);
		return(d);
	},

	sphericalD: function(src, dest){
		return google.maps.geometry.spherical.computeDistanceBetween(src,dest);
	},

	//Distance Matrix service - this has rate limitations need to reduce its use as much as possible
	//https://developers.google.com/maps/documentation/javascript/distancematrix
	distanceMatrix : function (origin1,destinationA) {
		var service = new google.maps.DistanceMatrixService();
		service.getDistanceMatrix(
		{
			origins: [origin1],
			destinations: [destinationA],
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC,
			avoidHighways: false,
			avoidTolls: false
		}, dMcallback);
	},

	

}

//callback to get distance matrix response
function dMcallback(response, status) {
	if (status != google.maps.DistanceMatrixStatus.OK) {
		alert('Error was: ' + status);
	} else {
		var origins = response.originAddresses;
		var destinations = response.destinationAddresses;
		var outputDiv = document.getElementById('outputDiv');
		outputDiv.innerHTML = '';
//			deleteOverlays();

		for (var i = 0; i < origins.length; i++) {
			var results = response.rows[i].elements;
			// console.log(origins[i]);
			gmap.addMarker(origins[i], "origin",'geoLatLng');
				for (var j = 0; j < results.length; j++) {
					gmap.addMarker(destinations[j], "dest",'geoLatLng');
					outputDiv.innerHTML += origins[i] + ' to ' + destinations[j]
					+ ': ' + results[j].distance.text + ' in '
				+ results[j].duration.text + '<br>';
			}
		}
	}
}