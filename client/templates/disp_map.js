
Template.dispMap.rendered = function(){
	//session variable to check map initialization
	//stored a session variable map to store status
	//session variablessss
	if(! Session.get('map'))
		gmap.initialize();

	var locs = Posts.find().fetch();
	for(var loc in locs){
		var objMarker = locs[loc];
		console.log(typeof objMarker.lat);
		//check if marker already exists
		if(! gmap.markerExists('id',objMarker.id))
			gmap.addMarker(objMarker,"taxi",'gmapMarker');
	}
	gmap.calcBounds();	
}

Template.dispMap.events({
	'submit form':function(event){
		event.preventDefault();
		var placesSrc = gmap.searchBoxSrc.getPlaces();
		var placesDest = gmap.searchBoxDest.getPlaces();
		if (placesSrc.length == 0 || placesDest.length == 0) {
			console.log("null places");
			return;
		}
		console.log("SourceLat : "+placesSrc[0].geometry.location.lat());
		console.log("SourceLong : "+placesSrc[0].geometry.location.lng());

		console.log("DestinationLat : "+placesDest[0].geometry.location.lat());
		console.log("DestinationLong : "+placesDest[0].geometry.location.lng());
		gmap.haversine(placesSrc[0].geometry.location, placesDest[0].geometry.location, "km");
		console.log("google calculated without distancematrix : "+gmap.sphericalD(placesSrc[0].geometry.location, placesDest[0].geometry.location));
		gmap.distanceMatrix(placesSrc[0].geometry.location,placesDest[0].geometry.location);
		gmap.calcBounds();
	}
});

Template.dispMap.destroyed = function(){
	Session.set('map', false);
}