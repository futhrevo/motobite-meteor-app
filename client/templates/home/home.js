/* global updateLocation */
/* global toastr */
/* global Messages */
/* global TransactColl */
Template.home.helpers({
    countNotifications: function () {
        return TransactColl.find({$and: [{requestee: Meteor.userId()}, {status: null}]}).count();
    },
    newMessage: function () {
        return Messages.find({to: Meteor.userId(), state: 'new-msg'}).count();
    }
});

Template.home.onRendered(function () {
    $(".badgeNotif").click(function () {
        var val = this.dataset.val;
        if (val < 1) {
            // Display a success toast, with a title
            toastr.success("hooh no pending requests", "Hurray !");
        } else {
            //IonSideMenu.snapper.open('right');
        }
    });
});

Template.ionBody.events({
    "click [data-action=centerBounds]": function () {
        console.log("Center Map");
        var clat = Session.get('lat');
        var clng = Session.get('lng');
        var loc = new google.maps.LatLng(clat, clng);
        gmap.map.setCenter(loc);
        if (gmap.map.getZoom() < 16)
            gmap.map.setZoom(16);
        updateLocation();
    }
});
