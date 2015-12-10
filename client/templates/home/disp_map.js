/* global wpid */
/* global directionsDisplay */
/* global checkin */
/* global IonActionSheet */
/* global Router */
var vibrate = navigator.vibrate ? 'vibrate' : navigator.webkitVibrate ? 'webkitVibrate' : null;
Template.dispMap.helpers({
    marker: function() {
        if (Session.get('map'))
            return MarkerColl.find({
                valid: true
            });
        else
            return null;
    },
    mapState: function() {
        var currentRoute = Router.current();
        var route = currentRoute.lookupTemplate();
        if (route === "" || route ==="Index") {
            $('.mapState').show();
        } else {
            $('.mapState').hide("slow");
        }
    },
    validRide: function() {
        if (Session.get('mode') == 'ride')
            return true;
        else
            return false;
    }

});

Template.dispMap.events({
    //show action sheet when fab icon is pressed
    'click [data-action=showActionSheet]': function (event, template) {
        navigator[vibrate](10);
    IonActionSheet.show({
        titleText: 'Actions Menu',
        buttons: [{
            text: 'I am a rider &nbsp; <i class="icon ion-android-car"></i>'
        }, {
            text: 'I need a ride &nbsp; <i class="icon ion-android-walk"></i>'
        }, {
            text: 'Check-in &nbsp; <i class="icon ion-ios-timer-outline"></i>'
        }, {
            text: 'Record a route &nbsp; <i class="icon ion-ios-recording"></i>'
            
        }],
        destructiveText: 'Delete an appointment',
        cancelText: 'Cancel',
        cancelOnStateChange:false,
        cancel: function() {
            console.log('Cancelled!');
        },
        buttonClicked: function(index) {
            if (index === 0) {
                console.log('User is a rider!');
                Session.set('modeSel','rider');
                $('#inputFormOuterId').addClass("inpShowing").show(100);
            }
            if (index === 1) {
                console.log('User needs ride!');
                Session.set('modeSel','ride');
                $('#inputFormOuterId').addClass("inpShowing").show(100);
            }
            if (index === 2) {
                console.log('User needs to checkin');
                checkin();
            }
            if (index === 3){
                $('body').removeClass('mb-has-fab');
                Session.set('mode','record');
                console.log('User wants to record a route');
            }
            return true;
        },
        destructiveButtonClicked: function() {
            console.log('Destructive Action!');
            Router.go('/inflate/drivers');
            return true;
        }
    });
},
    'click [data-action=quitdirections]': function(event, template) {
        directionsDisplay.setMap(null);
        console.info('rider rejected the drive');
        $(".inputForm").show();
        $("#outputDirectionDiv").hide(50);
        Session.set('mode', null);
},

    'click [data-action=showInput]': function(event, template) {
        $(".inputForm").show();
        $("#outputDirectionDiv").hide(50);
        $('#inputFormOuterId').addClass("inpShowing").show(50);
    },

    'click [data-action=submitDriver]': function(event, template) {
        $(".inputForm").show();
        $("#outputDirectionDiv").hide(50);
        console.info('rider accepted the drive');
		gmap.parseRoute();
		console.log("TODO update overview polyline to collection");

    }
});

Template.dispMap.onDestroyed(function(){
    console.log("display map destroyed");
    if (typeof wpid !== "undefined") {
        navigator.geolocation.clearWatch(wpid);
    }
	//Session.set('map', false);
    if(Meteor.isCordova){
        // window.motobite.location.stop();
    }
    $('body').removeClass('mb-has-fab');
});

Template.dispMap.onCreated(function(){
    console.log("display map created");
    if (Meteor.isCordova) {
        window.motobite.location.configure();
        // window.motobite.location.start({background:false});
    }
    $('body').addClass('mb-has-fab');
});
