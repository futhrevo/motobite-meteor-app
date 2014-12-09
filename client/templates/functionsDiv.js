Template.functionsDiv.helpers({
	validRide: function(){
		if(Session.get('mode') == 'ride')
			return true;
		else
			return false;
	},
	validRider: function(){
		if(Session.get('mode') == 'rider')
			return true;
		else
			return false;
	}
});