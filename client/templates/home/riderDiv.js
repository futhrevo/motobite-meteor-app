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


