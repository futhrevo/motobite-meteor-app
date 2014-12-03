Template.rideDiv.helpers({
	valid: function(){
		if(Session.get('mode') == 'ride')
			return true;
		else
			return false;
	},
	hideInput: function(){
		$('.inputForm').hide();
	}
});