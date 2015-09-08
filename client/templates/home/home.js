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
    },
    "click [data-action=addSafeHouse]": function () {
        console.log("Add safe house");
        updateLocation();
        IonPopup.show({
            title: "Add a Safe House ?",
            subTitle: "A region where you are not tracked with GPS, hence better battery life. You can add your home, work or other areas where you spend most time",
            template: '<div class="item range range-positive"><i>100m</i><input type="range" name="distance" min="100" max="250" value="200"><i>250m</i></div>' + 
                        '<output for="range" class="output"></output>',
            buttons: [
                {
                    text: 'Cancel',
                    type: 'button-default',
                    onTap: function (event, template) {
                        console.log("user cancelled safe house adition!");
                        return true;
                    }
                },
                {
                    text: 'Add Safe house',
                    type: 'button-positive',
                    onTap: function (event, template) {
                        console.log("user add safe house");
                        return true;
                    }
                }
            ]
        });
    }
});
