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

Template.dispMap.events({
	"keypress .form-control":function(event,template){
		if(event.which === 13){
			console.log(event);
			var searchBox = new google.maps.places.SearchBox(event.text);
		}
			
	}
});

Template.dispMap.destroyed = function(){
	Session.set('map', false);
}