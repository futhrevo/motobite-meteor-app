Template._myPopover.events({
    "click [data-action=sign-out]" : function(){
                Session.set('map',false);
        Session.set('lat',0);
        Session.set('lng',0);
        console.log("user wants to logout");
        Meteor.logout();
        if (typeof wpid !== "undefined") {
            navigator.geolocation.clearWatch(wpid);
        }
        gmap.markers = {};
        Router.go('/');
    },
});
