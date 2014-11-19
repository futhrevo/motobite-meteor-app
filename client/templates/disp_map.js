Template.dispMap.rendered = function(){
	if(! Session.get('map'))
		gmap.initialize();

	var objMarker = {
		id: 1,
		lat: 12.9525812,
		lng: 77.7034538,
		title: "Home"
	};

	//check if marker already exists
	if(! gmap.markerExists('id',objMarker.id))
		gmap.addMarker(objMarker);
}
Template.dispMap.destroyed = function(){
	Session.set('map', false);
}