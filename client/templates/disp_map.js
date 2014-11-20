Template.dispMap.rendered = function(){
	if(! Session.get('map'))
		gmap.initialize();

	var locs = Posts.find().fetch();
	for(var loc in locs){
		var objMarker = locs[loc];
		console.log(objMarker);
		//check if marker already exists
		if(! gmap.markerExists('id',objMarker.id))
			gmap.addMarker(objMarker);
	}	
}
Template.dispMap.destroyed = function(){
	Session.set('map', false);
}