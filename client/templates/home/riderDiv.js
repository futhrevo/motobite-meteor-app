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

	//temp hack to get coordinates from directions renderer
	var resultKey = Object.keys(directions)[2];
	var resultCoord = directions[resultKey];

    for (var i = 0; i < response.legs.length; i++) {
      distance += response.legs[i].distance.value;
      duration += response.legs[i].duration.value;
    }
    duration = 15 + (duration / 60);
	var validTime = validateTime(startTime, duration);
	console.log(validTime);
    if (validTime[0]) {
      var coord = polyline.hashdecode(response.overview_polyline, 5);
	var coordinates = coord[0];
	DriversAdvtColl.insert({
        overview: response.overview_polyline,
        summary: response.summary,
        bounds: response.bounds,
        distance: distance,
        duration: duration,
        startTime: startTime,
		originCoord:resultCoord.origin,
        destinationCoord: resultCoord.destination,
		origin: response.legs[0].start_address.split(", "),
		destination: response.legs[0].end_address.split(", "),
		gh6 : coord[1],
        locs: {
          type: "LineString",
          coordinates: coordinates
        }
      });
    } else {
		var result;
		if(validTime[1] == "drives"){
			result = DrivesAdvtColl.find({_id:validTime[2]});
		}else{
			result = DriversAdvtColl.find({_id:validTime[2]});
		}
		$('.alert-danger').css('display','inline-block');
    }

};
