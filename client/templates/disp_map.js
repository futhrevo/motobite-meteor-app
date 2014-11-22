Template.dispMap.rendered = function(){
//	if(! Session.get('map'))
		gmap.initialize();

	var locs = Posts.find().fetch();
	for(var loc in locs){
		var objMarker = locs[loc];
		console.log(objMarker);
		//check if marker already exists
		if(! gmap.markerExists('id',objMarker.id))
			gmap.addMarker(objMarker);
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
		console.log(gmap.sphericalD(placesSrc[0].geometry.location, placesDest[0].geometry.location));
	}
});

Template.dispMap.destroyed = function(){
	Session.set('map', false);
}