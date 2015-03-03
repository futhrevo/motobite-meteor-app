Template._myPopover.events({
    "click [data-action=sign-out]" : function(){
        Meteor.logout();
        navigator.geolocation.clearWatch(wpid);
        gmap.markers = {};
        Router.go('/');
    },
});
