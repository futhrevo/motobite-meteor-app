Template.rideDiv.helpers({
	valid: function(){
		if(Session.get('mode') == 'ride')
			return true;
		else
			return false;
	},
	hideInput: function(){
		$('.inputForm').hide();
	},
	selected:function(){
		
		return "TODO final rider confirmation before notifying other end : ";
	}
});

Template.rideDiv.events({
	'submit form':function(event){
		event.preventDefault();
		var placesSrc = gmap.searchBoxSrc.getPlaces();
		if(!placesSrc){
			var fromCoord = [Session.get('lng'),Session.get('lat')];
		}else{
			var fromCoord = [placesSrc[0].geometry.location.lng(),placesSrc[0].geometry.location.lat()]
		}
		var placesDest = gmap.searchBoxDest.getPlaces();
		var toCoord = [placesDest[0].geometry.location.lng(),placesDest[0].geometry.location.lat()];

		console.info('user selected a ride from '+fromCoord+' to '+toCoord);
		DrivesAdvt.insert({
			nodes : [{
				addr:"from",
				locs:{
					type:"Point",
					coordinates:fromCoord
				}
			},{
				addr:"to",
				locs:{
					type:"Point",
					coordinates:toCoord
				}
			}]
		});
		console.log("TODO update user status into collection");
	},
	'click .cancel':function(event){
		event.preventDefault();
		console.info('user unable to find ride');
		$('.inputForm').show();
		Session.set('mode', null);
	}
});