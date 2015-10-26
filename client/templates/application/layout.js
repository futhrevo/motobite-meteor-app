/* global IonSideMenu */
Template.layout.onCreated(function () {

});
Template.layout.onRendered(function () {
    if(typeof IonSideMenu.snapper !== 'undefined'){
        IonSideMenu.snapper.disable();
        IonSideMenu.snapper.settings({
            tapToClose: true, // If true, tapping an open pane will close it
            flickThreshold: 300, // Number of pixels the user needs to swiftly travel to activate a "flick" open
            hyperextensible: true
        });
        // $('#navheader').css('background-image', 'url(profile.jpg)');
        IonSideMenu.snapper.on('open', menuOpenBody);
        IonSideMenu.snapper.on('close', menuCloseBody);
    }
});

Template.layout.events({
    "click [data-action=sign-out]" : function(){
        console.log("user wants to logout");
        Session.set('map',false);
        Session.set('lat',0);
        Session.set('lng',0);
        Meteor.logout();
        if (typeof wpid !== "undefined") {
            navigator.geolocation.clearWatch(wpid);
        }
        gmap.markers = {};
        Router.go('/');
    },

    "click .snap-drawer-left" : function(){
        menuClose();
    },

    "click .sidePic" : function(event){
        event.preventDefault();
        Router.go('/profile');
    }
});

Template.layout.helpers({
    countNotifications: function () {
        return TransactColl.find({$and: [{requestee: Meteor.userId()}, {status: null}]}).count();
    },
});

function menuOpenBody() {
    console.log("Side Menu Open");
    $(document.body).on("click", menuClose);
    
}

function menuCloseBody() {
    console.log("Side Menu closed");
     $(document.body).off("click", menuClose);
}

function menuClose() {
    IonSideMenu.snapper.close();
}