/* global SafeHouseColl */
/* global IonPopup */
/* global google */
/* global Meteor */
/* global Template */
/* global gmap */
/* global Session */
/* global updateLocation */
/* global toastr */
/* global Messages */
/* global TransactColl */
var vibrate = navigator.vibrate ? 'vibrate' : navigator.webkitVibrate ? 'webkitVibrate' : null;
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
        navigator[vibrate](10);
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
        navigator[vibrate](10);
        updateLocation();
        var lat = Session.get('lat');
        var lng = Session.get('lng');
        gmap.geocode(lat,lng);
        IonPopup.show({
            title: "Add a Safe House ?",
            subTitle: "A region where you are not tracked with GPS, hence better battery life. You can add your home, work or other areas where you spend most time",
            template: '<div class="list"><label class="item item-input">' +
                        '<input type="text" placeholder="Enter a name" name="prompt"></label>' +
                        '<div class="item range range-positive"><i>500m</i><input type="range" name="distance" min="500" max="1000" value="750"><i>1000m</i></div>' + 
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
    var pointCheck = validateSafeHouse(lat, lng);
    if (pointCheck) {
        toastr.error("you alredy have a safe house named " + pointCheck + " here. Move out of circle and try again");
        return;
    }
    var address = Session.get('address') || "";
    if (address !== "") {
        Session.set('address', "");
    }
    var post = {
        coordinates: [lng, lat],
        radius: parseInt(radius),
        name: name,
        address: address
    };
    Meteor.call('addSafeHouse', post, function (err, res) {
			if (err) {
                console.log(err);
			}
			if (res) {
				toastr[res.type](res.message);
			}
		});
};
var validateSafeHouse = function (lat,lng) {
    var safehouses = SafeHouseColl.find().fetch();
    var checkPoint = { lat: lat, lng: lng };
    for (var index = 0; index < safehouses.length; index++) {
        var element = safehouses[index];
        var centerPoint = { lat: element.loc.coordinates[1], lng: element.loc.coordinates[0] };
        if (arePointsNear(checkPoint, centerPoint, element.radius)) {
            return element.name;
        }
    }
    return null;
};
var arePointsNear = function (checkPoint, centerPoint, m) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy)*1000 <= m;
}