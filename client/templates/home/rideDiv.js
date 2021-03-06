/* global polyArray */
/* global directionsDisplay */
/* global Template */
/* global validateTime */
/* global bearingFinal */
/* global bearingInitial */
/* global asBounds */
/* global IonPopup */
Template.rideDiv.onCreated(function(){
	console.log("rideDiv Created");
	directionsDisplay.setMap(null);
});

Template.rideDiv.onDestroyed(function(){
	console.log("rideDiv destroyed");
	// TODO: No need to clear if going to schedule screen view
	clearPolylines();
	polyArray.clear();
});

Template.rideDiv.helpers({
	hideInput: function(){
		$('.inputForm').hide();
	},
	selected:function(){

	},
	names: function(){
		return polyArray.sort(compare).list();
	}

});

Template.rideDiv.events({
	'click [data-action=showdriveInput]': function(event, template) {
		$(".inputForm").show();
		Session.set('mode',null);
		$('#inputFormOuterId').addClass("inpShowing").show(50);
	},

	'click [data-action=showApplyScreen]': function(event, template) {
		var id = $('.ridelist a.active p').attr("_id");
		if(id === undefined){
			IonPopup.alert({
			    title: 'Alert',
			    template: 'You need to select an item!',
			    okText: 'Got It.'
			});
		}else{
			var obj = _.findWhere(polyArray,{_id:id});
			// var driver = _.omit(obj,'polydraw');
			// driver.driverAdvt = obj._id;
			obj.locs = { type: "LineString" };
			obj.locs.coordinates = [obj.srcloc, obj.dstloc];
			var subset = _.omit(obj, ["srcloc", "dstloc","polydraw"]);
			// console.log(subset);
			// var subset = _.pick(obj,'_id','srcloc','dstloc','startTime','overview');


			IonPopup.confirm({
			    title: 'Are you sure?',
			    template: popupApplyScreen(obj),
				okText: 'Ask Rider', // String (default: 'OK'). The text of the OK button.
			    onOk: function() {
			        console.log('Ask rider clicked');
					//function to let the other side alert about the drive
					Meteor.call('AskRider',subset,function(err,res){
						if(err){
							toastr.error("Server error", "Oops..!");
						}else if(res){
                            toastr[res.type](res.message);
                        }else{
							$(".inputForm").show();
							Session.set('mode', null);
							toastr.success("Request Sent", "Success");
						}
					});
			    },
			    onCancel: function() {
			        console.log('Cancelled');
			    }
			});
		}
	},

	'click [data-action=submitDrive]':function(event){
		event.preventDefault();
		submitDrive();
	},
	'click [data-action=quitdrives]':function(event){
		event.preventDefault();
		console.info('user unable to find ride');
		$('.inputForm').show();
		Session.set('mode', null);
	},
	'click .list-group-item': function(event) {
		event.preventDefault();
		clearPolylines();
    	$(event.currentTarget).addClass("active").siblings().removeClass('active');
    	this.polydraw.setVisible(true);
		gmap.map.fitBounds(asBounds(this.bounds));
  	}
});

function clearPolylines(){
	_.each(polyArray,function(poly){
		poly.polydraw.setVisible(false);
	});
}
//compare function to sort according to time
function compare(a,b) {
  if (a.startTime < b.startTime)
     return 1;
  if (a.startTime > b.startTime)
    return -1;
  return 0;
}

//function that returns div to be shown in popup for apply screen
function popupApplyScreen(obj){
	var myvar = '<div class="list card">'+
	''+
	'  <div class="item">'+
	'    <h2>'+obj.summary+'</h2>'+
	'    <p>'+ moment.unix(obj.startTime).calendar()+'</p>'+
	'  </div>'+
	''+
		'<div class="item item-icon-left">'+
	'     <i class="icon ion-android-walk"></i>'+
	'     pickup'+
	'     <span class="badge badge-positive">'+ Math.round(obj.srcDist)+'m' +'</span>'+
	'</div>'+
	''+
	'<div class="item item-icon-left">'+
	'     <i class="icon ion-model-s"></i>'+
	'     Travel'+
	'     <span class="badge badge-positive">'+ Math.round(obj.distance)+'m'+'</span>'+
	'</div>'+
	''+
	'<div class="item item-icon-left">'+
	'     <i class="icon ion-android-walk"></i>'+
	'     destination'+
	'     <span class="badge badge-positive">'+ Math.round(obj.dstDist)+'m'+'</span>'+
	'</div>'+


	''+
	'  <div class="item tabs tabs-secondary tabs-icon-left">'+
	'    <a class="tab-item" href="#">'+
	'      <i class="icon ion-thumbsup"></i>'+
	'      Like'+
	'    </a>'+
	'    <a class="tab-item" href="#">'+
	'      <i class="icon ion-chatbox"></i>'+
	'      Comment'+
	'    </a>'+
	'    <a class="tab-item" href="#">'+
	'      <i class="icon ion-share"></i>'+
	'      Share'+
	'    </a>'+
	'  </div>'+
	''+
	'</div>';
	return myvar;
}

//function to submit drive to collection
function submitDrive(){
	var search = getSearchBoxdata();

	console.info('user selected a ride from '+search.fromCoord+' to '+search.toCoord);
	var distance = gmap.haversine(search.fromCoord,search.toCoord,"km","geo");
	var duration = 15 + (distance * 6);
	search.duration = duration;
	var validTime = validateTime(search.time, duration);
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
	}

	//console.log("TODO update user status into collection");
}
getSearchBoxdata = function (){
	var fromCoord;
	if($("#polycheckboxSrc").prop( "checked")){
		fromCoord = [Session.get('lng'),Session.get('lat')];
	}else{
		var placesSrc = gmap.searchBoxSrc.getPlace();
		fromCoord = [placesSrc.geometry.location.lng(),placesSrc.geometry.location.lat()];
	}
	var placesDest = gmap.searchBoxDest.getPlace();
	var toCoord = [placesDest.geometry.location.lng(),placesDest.geometry.location.lat()];


	var selectedDate = $('#polyDateSel').val();
	var selectedTime = $('#timeInput').val();

	var inputTime = new Date();
	if(selectedDate == 'Tomorrow'){
		inputTime.setDate(inputTime.getDate()+1);
	}

	if(selectedTime !== ""){
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

	//return [fromCoord,toCoord,inputTime.getTime() / 1000,$('#polyMapSrcSearch').val().split(", "),$('#polyMapDesSearch').val().split(", "),fromHashObj,toHashObj,initialBearing,finalBearing];
	return {
		fromCoord:fromCoord,
		toCoord : toCoord,
		time: inputTime.getTime() / 1000,
		src : $('#polyMapSrcSearch').val().split(", "),
		dst : $('#polyMapDesSearch').val().split(", "),
		fromHashObj : fromHashObj,
		toHashObj : toHashObj,
		initialBearing : initialBearing,
		finalBearing : finalBearing
	};
};
