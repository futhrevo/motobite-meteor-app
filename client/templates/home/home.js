/* global gmap */
/* global Session */
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
        var lat = Session.get('lat');
        var lng = Session.get('lng');
        gmap.geocode(lat,lng);
        IonPopup.show({
            title: "Add a Safe House ?",
            subTitle: "A region where you are not tracked with GPS, hence better battery life. You can add your home, work or other areas where you spend most time",
            template: '<div class="list"><label class="item item-input">' +
                        '<input type="text" placeholder="Enter a name" name="prompt"></label>' +
                        '<div class="item range range-positive"><i>100m</i><input type="range" name="distance" min="100" max="250" value="150"><i>250m</i></div>' + 
                        '<output for="range" class="output"></output></div>',
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
                        var name = template.$("input[name='prompt']").val();
                        if (name === "") {
                            toastr.error("Please give a name to your safe House!");
                            return false;
                        }
                        var radius = template.$("input[name='distance']").val();
                        insertSafeHouseCircle(name, radius);
                        return true;
                    }
                }
            ]
        });
        $("input[name='distance']").on("change", function() {
            $('.output').html("A circle with <strong>radius "+this.value +" meters</strong> will be your Do Not Track area" );
        }).trigger("change");
    }
});

var insertSafeHouseCircle = function (name, radius) {
    var lat = Session.get('lat');
    var lng = Session.get('lng');
    var address = Session.get('address') || "";
    if (address !== "") {
        Session.set('address', "");
    }
    var post = {
        coordinates: [lng, lat],
        radius: parseInt(radius),
        name: name,
        address: address
    }
    Meteor.call('addSafeHouse', post, function (err, res) {
			if (err) {
                console.log(err);
			}
			if (res) {
				toastr[res.type](res.message);
			}
		})
}