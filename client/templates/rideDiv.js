Template.rideDiv.destroyed = function(){
	console.log("rideDiv destroyed");
	clearPolylines();
	polyArray.clear();
};

Template.rideDiv.helpers({
	hideInput: function(){
		$('.inputForm').hide();
	},
	selected:function(){
		return "TODO final rider confirmation before notifying other end : ";
	},
	names: function(){
		return polyArray.list();
	}
});

Template.rideDiv.events({
	'submit form':function(event){
		event.preventDefault();
		var search = getSearchBoxdata();

		console.info('user selected a ride from '+search[0]+' to '+search[1]);
		var distance = gmap.haversine(search[0],search[1],"km","geo");
		var duration = 15 + (distance * 6);
		search.push(duration);
		var validTime = validateTime(search[2], duration);
		console.log(validTime);
		if(validTime[0]){
			Meteor.call('postDriveAdvt',search,function(error,result){
				// display the error to the user and abort
				if (error)
					return alert(error.reason);
				console.log(result);

				});
		}else{
			var result;
			if(validTime[1] == "drives"){
				result = DrivesAdvtColl.find({_id:validTime[2]});
			}else{
				result = DriversAdvtColl.find({_id:validTime[2]});
			}
			$('.alert').addClass("alert-danger").removeClass("alert-success");

		}

		//console.log("TODO update user status into collection");
	},
	'click .cancel':function(event){
		event.preventDefault();
		console.info('user unable to find ride');
		$('.inputForm').show();
		Session.set('mode', null);
	},
	'click .list-group-item': function(event) {
		event.preventDefault();
		clearPolylines();
    	$(event.target).addClass("active").siblings().removeClass('active');
    	this.polydraw.setVisible(true);
		gmap.map.fitBounds(asBounds(this.bounds));
  	}
});

function clearPolylines(){
	_.each(polyArray,function(poly){
		poly.polydraw.setVisible(false);
	});
}

getSearchBoxdata = function (){

	if($("#polycheckboxSrc").prop( "checked")){
		var fromCoord = [Session.get('lng'),Session.get('lat')];
	}else{
		var placesSrc = gmap.searchBoxSrc.getPlaces();
		var fromCoord = [placesSrc[0].geometry.location.lng(),placesSrc[0].geometry.location.lat()];
	}
	var placesDest = gmap.searchBoxDest.getPlaces();
	var toCoord = [placesDest[0].geometry.location.lng(),placesDest[0].geometry.location.lat()];

	var selectedDate = $('#polyDateSel').val();
	var selectedTime = $('#timeInput').val();

	var inputTime = new Date();
	if(selectedDate == 'Tomorrow'){
		inputTime.setDate(inputTime.getDate()+1);
	}

	if(selectedTime != ""){
		var parts = selectedTime.match(/(\d+):(\d+)/);
		inputTime.setHours(parseInt(parts[1],10));
		inputTime.setMinutes(parseInt(parts[2],10));

	}
	console.log(inputTime.getTime() / 1000);
	var fromHash = geohash.encode(fromCoord[1],fromCoord[0],6);
	var toHash = geohash.encode(toCoord[1],toCoord[0],6);
	var fromHashObj = geohash.neighbors(fromHash);
	var toHashObj = geohash.neighbors(toHash);

	//Bearing calculations
	var initialBearing = bearingInitial(fromCoord[1],fromCoord[0],toCoord[1],toCoord[0]);
	var finalBearing = bearingFinal(fromCoord[1],fromCoord[0],toCoord[1],toCoord[0]);

	return [fromCoord,toCoord,inputTime.getTime() / 1000,$('#polyMapSrcSearch').val().split(", "),$('#polyMapDesSearch').val().split(", "),fromHashObj,toHashObj,initialBearing,finalBearing];
}
