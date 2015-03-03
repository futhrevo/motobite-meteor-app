Template.dispMap.helpers({
  marker: function() {
    if (Session.get('map'))
      return MarkerColl.find({ valid: true });
    else
      return null;
  },
  mapState: function(){
	var currentRoute = Router.current();
	var route = currentRoute.lookupTemplate();
	if(route ===""){
		$('.mapState').show();
	}else{
		$('.mapState').hide("slow");
	}
  }
});

Template.dispMap.events({
    //show action sheet when fab icon is pressed
    'click [data-action=showActionSheet]': function(event, template) {
    IonActionSheet.show({
        titleText: 'Actions Menu',
        buttons: [{
            text: 'I am a rider &nbsp; <i class="icon ion-android-car"></i>'
        }, {
            text: 'I need a ride &nbsp; <i class="icon ion-android-walk"></i>'
        }, ],
        destructiveText: 'Delete an appointment',
        cancelText: 'Cancel',
        cancel: function() {
            console.log('Cancelled!');
        },
        buttonClicked: function(index) {
            if (index === 0) {
                console.log('User is a rider!');
                Session.set('modeSel','rider');
                $('#inputFormOuterId').show(200);
            }
            if (index === 1) {
                console.log('User needs ride!');
                Session.set('modeSel','ride');
                $('#inputFormOuterId').show(200);
            }
            return true;
        },
        destructiveButtonClicked: function() {
            console.log('Destructive Action!');
            return true;
        }
    });
},


});

Template.dispMap.destroyed = function(){
    console.log("display map destroyed");
	Session.set('map', false);
};

Template.dispMap.created = function(){
    console.log("display map created");
};
