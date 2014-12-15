Template.riderDiv.helpers({
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
		gmap.parseRoute();
		console.log("TODO update overview polyline to collection");
	},
	'click .cancel':function(event){
		event.preventDefault();
		console.info('rider rejected the drive');
		$('.inputForm').show();
		Session.set('mode', null);
	}
});

gmap.parseRoute = function() {
    var directions = directionsDisplay.getDirections();
    var choice = directionsDisplay.getRouteIndex();
    var response = directions.routes[choice];
    var distance = 0;
    var duration = 0;
    var startTime = directionsDisplay.time;

    for (var i = 0; i < response.legs.length; i++) {
      distance += response.legs[i].distance.value;
      duration += response.legs[i].duration.value;
    }
    duration = 15 + (duration / 60);
    if (validateTime(startTime, duration)) {
      var coordinates = polyline.hashdecode(response.overview_polyline, 5);
      DriversAdvtColl.insert({
        overview: response.overview_polyline,
        summary: response.summary,
        bounds: response.bounds,
        distance: distance,
        duration: duration,
        startTime: startTime,
        destination: directions.lc.destination,
        locs: {
          type: "LineString",
          coordinates: coordinates
        }
      });
    } else {
      alert("You have a ride already scheduled during this time range. Choose a new time");
    }

	/*console.log(coordinates);
	var hashinates = [];
	for(var coordinate in coordinates){
		var element = coordinates[coordinate];
		hashinates.push(geohash.encode(element[0],element[1],7)); //change the digit according to accuracy required
	}
	console.log(hashinates.length);
	hashinates = _.uniq(hashinates);
	console.log(hashinates);
	console.log("TODO advertise unique hashinates");
*/
}
