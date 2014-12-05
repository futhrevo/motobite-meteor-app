Template.riderDiv.helpers({
	valid: function(){
		if(Session.get('mode') == 'rider')
			return true;
		else
			return false;
	},
	hideInput: function(){
		$('.inputForm').hide();
	},
	selected:function(){
		
		return "TODO final route confirmation : ";
	}
});

Template.riderDiv.events({
	'submit form':function(event){
		event.preventDefault();
		console.info('rider accepted the drive');
		var directions = directionsDisplay.getDirections();
		var choice = directionsDisplay.getRouteIndex();
		gmap.parseRoute(directions.routes[choice].overview_polyline);
		console.log("TODO update overview polyline to collection");
	},
	'click .cancel':function(event){
		event.preventDefault();
		console.info('rider rejected the drive');
		$('.inputForm').show();
		Session.set('mode', null);
	}
});

gmap.parseRoute = function(response){
	var coordinates = polyline.hashdecode(response,5);
	var hashinates = [];
	for(var coordinate in coordinates){
		var element = coordinates[coordinate];
		hashinates.push(geohash.encode(element[0],element[1],7)); //change the digit according to accuracy required
	}
	console.log(hashinates.length);
	hashinates = _.uniq(hashinates);
	console.log(hashinates.length);
	console.log("TODO advertise unique hashinates");

		
}