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
		console.info('user selected a ride');
		console.log("TODO update user status into collection");
	},
	'click .cancel':function(event){
		event.preventDefault();
		console.info('user unable to find ride');
		$('.inputForm').show();
		Session.set('mode', null);
	}
});