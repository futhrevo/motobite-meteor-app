Template.rideDiv.destroyed = function(){
	console.log("rideDiv destroyed");
	clearPolylines();
	polyArray.clear();
}

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

		console.log("TODO update user status into collection");
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

	if($("#checkboxSrc").prop( "checked")){
		var fromCoord = [Session.get('lng'),Session.get('lat')];
	}else{
		var placesSrc = gmap.searchBoxSrc.getPlaces();
		var fromCoord = [placesSrc[0].geometry.location.lng(),placesSrc[0].geometry.location.lat()]
	}
	var placesDest = gmap.searchBoxDest.getPlaces();
	var toCoord = [placesDest[0].geometry.location.lng(),placesDest[0].geometry.location.lat()];
	var inputTime = $("#datetimepicker1").data("DateTimePicker").getDate().unix();
	console.log(inputTime);
	return [fromCoord,toCoord,inputTime];
}
