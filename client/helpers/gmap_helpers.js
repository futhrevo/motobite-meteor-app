//http://www.andrehonsberg.com/article/reactive-google-maps-markers-meteor-js

gmap = {
	//map object
	map: null,

	//searchbox
	searchBoxSrc: null,
	searchBoxDest: null,

	//google markers objects
	markers: {},

	//google lat lng objects
	latLngs: [],

	//formatted marker data objects
	markerData: [],

	//register serachbox divs
	regDivs:function(){
		//remove leftover pac containers
		$('.pac-container').remove();
		//remove leftover clockpickers
		$('.pickerPopover').remove();
		var searchBounds = new google.maps.LatLngBounds(asLatLng(5.5,66.5),asLatLng(37,97));
		this.searchBoxSrc = new google.maps.places.SearchBox(document.getElementById("polyMapSrcSearch"),{bounds:searchBounds});
		this.searchBoxDest = new google.maps.places.SearchBox(document.getElementById("polyMapDesSearch"),{bounds:searchBounds});
	},
	//add a marker from the given marker object
	addMarker: function(marker,type,objType) {
		var icon;
		var myLatlng;
		var title;
		if(type == "origin"){
			icon = '/marker.svg';
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
			//geocoder to get latlng object from address provided. Callbacks do not have this scope.so we need to expicitly call using gmap object
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
					console.log('Geocode was not successful for the following reason: '+ status);
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
		console.log('marker added at loc : '+marker.id+mymarker.toString());
		// var obj ={};
		// var key = marker.id;
		// obj[key] = mymarker;
		//keep track of markers and geo data
		this.latLngs.push(myLatlng);
		this.markers[marker.id] = mymarker;
		this.markerData.push(marker);

		return mymarker;
	},

	// calculate and move the bound box based on our markers
	calcBounds: function(){

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
		console.info("[+] Initializing Google Maps with center ("+Session.get('lat')+","+Session.get('lng')+")");
		var clat = Session.get('lat');
		var clng = Session.get('lng');
		var loc = new google.maps.LatLng(clat,clng);
		// Create a new StyledMapType object
		var mapType = new google.maps.StyledMapType(MAP_STYLE, styleOptions);
		var mapOptions ={
			center: loc,
			zoom: 16,
			disableDefaultUI: true
		};
		this.map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
		this.map.mapTypes.set("First Style", mapType);
		this.map.setMapTypeId("First Style");
		this.regDivs();
		bounds = new google.maps.LatLngBounds();
		bounds.extend(loc);
		// this.map.fitBounds(bounds);
		this.map.setCenter(loc);
		var rendererOptions = {
		  draggable: true
		};
		directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
		//global flag saying we initialized already
		Session.set('map', true);

		console.info('[+] map initialized');
		var chash = geohash.encode(clat,clng);
		var post = {
			gh:chash
		};
		Meteor.call('postLocation', post, function(error, result) {
		  // display the error to the user and abort
		  if (error)
		    return console.log(error.reason);

		});
		// ported insert into server
		google.maps.event.addDomListener(window, "resize", function() {
		  var center = gmap.map.getCenter();
		  google.maps.event.trigger(gmap.map, "resize");
		  gmap.map.setCenter(center);
		});

		//create MarkerManager object to control Markers
		markerManager = new MarkerManager(this.map);
		checkinTrackerInt();
		},

	//distance calculation using Haversine formula
	//http://andrew.hedges.name/experiments/haversine/
	/*	dlon = lon2 - lon1
		dlat = lat2 - lat1
		a = (sin(dlat/2))^2 + cos(lat1) * cos(lat2) * (sin(dlon/2))^2
		c = 2 * atan2( sqrt(a), sqrt(1-a) )
		d = R * c (where R is the radius of the Earth)*/
	haversine: function(src,dest,unit,type){
		var srclat,srclng,destlat,destlng,R;
		if(type == 'hash'){
			var srcMarker = geohash.decode(src);
			var destMarker = geohash.decode(dest);
			srclat = srcMarker[0];
			srclng = srcMarker[1];
			destlat = destMarker[0];
			destlng = destMarker[1];
		}else if(type == "geo"){
			srclat = src[1];
			srclng = src[0];
			destlat = dest[1];
			destlng = dest[0];
		}else{
			srclat = src.lat();
			srclng = src.lng();
			destlat = dest.lat();
			destlng = dest.lng();
		}
		if(unit == "km"){
			R = 6373;
		}else{
			R = 3961;
		}
		var dLat = (Math.PI/180) * (destlat - srclat);
		var dLon = (Math.PI/180) * (destlng - srclng);
		var lat1 = (Math.PI/180) * srclat;
		var lat2 = (Math.PI/180) * destlat;

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

	//directions service with panel display
	calcRoute : function () {
		// var directionsDisplay = new google.maps.DirectionsRenderer();
		// this.directionDisplay.setMap(null);
		var directionsService = new google.maps.DirectionsService();
		directionsDisplay.setMap(this.map);

		var outputDiv = document.getElementById('directions-select');
		outputDiv.innerHTML = '';
		directionsDisplay.setPanel(outputDiv);
		google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
		    console.log("route dragged ");
		  });
		var search = getSearchBoxdata();
		var origin1 = search[0];
		var destinationA = search[1];

		var request = {
			origin: asLatLng(origin1[1],origin1[0]),
			destination: asLatLng(destinationA[1],destinationA[0]),
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.METRIC,
			provideRouteAlternatives : true,
			avoidHighways: false,
			avoidTolls: false
		};

		directionsService.route(request, function(response, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		      directionsDisplay.setDirections(response);
			  directionsDisplay.time = search[2];
		    }
		  });
	}

};

//callback to get distance matrix response
function dMcallback(response, status) {
	if (status != google.maps.DistanceMatrixStatus.OK) {
		console.log('DistanceMatrix returned Error at: ' + status);
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
					outputDiv.innerHTML += origins[i] + ' to ' + destinations[j]+
					': ' + results[j].distance.text + ' in '+
					results[j].duration.text + '<br>';
			}
		}
	}
}

gmap.geocode = function(lat,lng){
	var latlng = new google.maps.LatLng(lat,lng);
	var geocoder= new google.maps.Geocoder();
	geocoder.geocode({'latLng': latlng}, function(results, status) {
		var result;
		if (status == google.maps.GeocoderStatus.OK) {
			result = results[1].formatted_address;
		}else{
			result = "Cannot determine address at this location";
		}
		$('#polyMapSrcSearch').val(result);
	});
};

//function to draw polyline on map
gmap.polyDraw = function(poly,post){
	var polyInfo = polyline.dissect(poly.overview,poly.gh6[poly.srcIndex],poly.gh6[poly.dstIndex],post[0],post[1]);
	poly.overview = polyInfo.overview;
	var path = google.maps.geometry.encoding.decodePath(poly.overview);
	var polydraw = new google.maps.Polyline({
		path:path,
		strokeColor : '#00acc1',
		strokeOpacity: 0.4,
		strokeWeight: 10,
		visible : false,
		map:this.map
	});
	var distance = Math.round(google.maps.geometry.spherical.computeLength(polydraw.getPath()));
	//lets say speed is 20kmph = 334m per min
	var duration =  Math.round(distance / 334);
	//considering user approaches with avg speed 50kmph and each grid size is 610m
	var startTime = poly.startTime + (poly.srcIndex * 610 / 14);
	var polyObject = {
		_id: poly._id,
		overview:poly.overview,
		summary:poly.summary,
		bounds:poly.bounds,
		distance:distance,
		startTime:startTime,
		duration:duration,
		polydraw:polydraw,
		srcDist:polyInfo.srcDistance,
		dstDist:polyInfo.destDistance,
		srcloc : post[0],
		dstloc : post[1]
	};
	polyArray.push(polyObject);
};

//function to draw markers on map
gmap.markDraw = function(mark){
	console.log(mark._id);
	var rideMarker = {
		lat:mark.nodes[0].locs.coordinates[1],
		lng:mark.nodes[0].locs.coordinates[0],
		id: mark._id
	};
	gmap.addMarker(rideMarker,"origin",'gmapMarker');
};


Template.dispMap.rendered = function(){
	console.log("display map rendered");
	function geo_success(position) {
		Session.set('lat', position.coords.latitude);
		Session.set('lng', position.coords.longitude);
		Session.set('accuracy', position.coords.accuracy);
		Session.set('speed', position.coords.speed);
		Session.set('atTime', position.timestamp);
		console.log("Got location");
		if(!Session.get('map')){
			drawCanvas();
		}else if ($('#map-canvas').html() === ""){
			console.log("replaced");
			$('#map-canvas').replaceWith(gmap.map.getDiv());
			gmap.regDivs();
		}
	}

	function geo_error(poserr) {
		console.log(poserr);
		if(poserr.code == 1){
			console.log("PERMISSION_DENIED - Please accept permission and try again");
		}else if(poserr.code == 2){
			console.log("POSITION_UNAVAILABLE - The acquisition of the geolocation failed because one or several internal source of position returned an internal error");
		}else if(poserr.code == 3){
			console.log("TIMEOUT - The time allowed to aquire the geolocation was reached before the information was obtained");
		}
		else{
			console.log("Position error");
		}
	}

	var geo_options = {
		enableHighAccuracy: true,
		maximumAge        : 0,
		timeout           : 27000
	};
	
	function onDeviceReady() {
		console.log("device is ready");
        // Now safe to use device APIs
		wpid = navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
    }
	
	if(Meteor.isCordova){
		console.log("Meteor is running as cordova");
		document.addEventListener("deviceready", onDeviceReady, false);
		
	}else{
		onDeviceReady();
	}
	
	function drawCanvas(){
		if($('#map-canvas').length){
			console.info("map-canvas added to the dom");
			$('#map-canvas').ready(gmap.initialize());
		}else
		{
			console.info("wait for map-canvas to be ready");
			setTimeout(drawCanvas, 500);
		}
	}
	// drawCanvas();
	// document.addEventListener('polymer-ready', function() {
	// 	var navicon = document.getElementById('navicon');
	// 	var drawerPanel = document.getElementById('drawerPanel');
	// 	navicon.addEventListener('click', function() {
	// 		drawerPanel.togglePanel();
	// 	});
	// });

};

asBounds = function (bound){
	var rKey = Object.keys(bound);
	return new google.maps.LatLngBounds(asLatLng(bound[rKey[0]].j,bound[rKey[1]].j),asLatLng(bound[rKey[0]].k,bound[rKey[1]].k));
};

function asLatLng(lat,lng){
	return new google.maps.LatLng(lat, lng);
}

var checkinTrackerInt = function(){
	var query = TransactColl.find({
		$and: [{ status: true},
			{requester: Meteor.userId() }]
	});

	var handle = query.observeChanges({
		added: function(id, user) {
			console.log(user.requestee + " accepted " + moment.unix(user.accepted).calendar());
			checkinHeap.push(user);
		},
		removed: function(id) {
			console.log(id + " status changed");
		}
	});
};

// Create an array of styles
//https://snazzymaps.com/style/42/apple-maps-esque
var MAP_STYLE = [
	{
		"featureType": "landscape.man_made",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#f7f1df"
			}
		]
	},
	{
		"featureType": "landscape.natural",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#d0e3b4"
			}
		]
	},
	{
		"featureType": "landscape.natural.terrain",
		"elementType": "geometry",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "labels",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "poi.business",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "poi.medical",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#fbd3da"
			}
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#bde6ab"
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "labels",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "#ffe15f"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"color": "#efd151"
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "#ffffff"
			}
		]
	},
	{
		"featureType": "road.local",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "black"
			}
		]
	},
	{
		"featureType": "transit.station.airport",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "#cfb2db"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#a2daf2"
			}
		]
	}
];
//the name to be displayed on the map type control
var styleOptions = {
	name: "First Style"
};