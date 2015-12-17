/* global polyArray */
/* global wrangleDataDriver */
/* global DriversAdvtColl */
/* global DrivesAdvtColl */
/* global validateTime */
/* global getSearchBoxdata */
/* global moment */
$(document).on({
    'DOMNodeInserted': function () {
        $('.pac-item, .pac-item span', this).addClass('needsclick');
    }
}, '.pac-container');

Template.inpForm.onRendered(function () {
    $('.clockpicker').clockpicker({
        'default': 'now'
    });
    gmap.regDivs();
    console.log("inpform rendered");
    //http://weareoutman.github.io/clockpicker/

});
Template.inpForm.onDestroyed(function () {
    console.log("inpform destroyed");
    //remove leftover clockpickers
    $('.pickerPopover').remove();
    //remove leftover pac containers
    $('.pac-container').remove();
});

Template.inpForm.helpers({
    modeSelect: function () {
        var sel = Session.get('modeSel');
        if (sel == "rider")
            return "I am Riding at around ";
        else
            return "I need a ride at around ";
    }
});

Template.inpForm.events({
    'blur #polyMapDesSearch': function (event,template) {
        console.log(template.find('#polyMapDesSearch').value);

    },
    'blur #timeInput': function (event,template) {
        checkTimeInp(template);
    },
    'click [data-action=clearFields]': function (event) {
        event.preventDefault();
        Session.set('mode', null);
        clearFields();

    },
    'click #fabInpCancel': function (event) {
        event.preventDefault();
        $('#inputFormOuterId').removeClass("inpShowing").hide(200);
        Session.set('mode', null);
        directionsDisplay.setMap(null);
    },

    'click .inputCloseBtn': function (event) {
        event.preventDefault();
        $('#inputFormOuterId').removeClass("inpShowing").hide(200);
        Session.set('mode', null);
        directionsDisplay.setMap(null);
    },

    'change #polycheckboxSrc': function (event) {
        event.preventDefault();
        if (event.target.checked) {
            $('#polyMapSrcSearch').val("").attr("disabled", true);
            gmap.geocode(Session.get('lat'), Session.get('lng'));
        } else {
            $('#polyMapSrcSearch').attr("disabled", false).val("");
        }
    },

    // 'submit form':function(event,template){
    'click #fabInpSubmit': function (event, template) {
        event.preventDefault();
            
        var selectedOption = Session.get('modeSel');
        //http://diveintohtml5.info/storage.html
        //using local storage to store more permanently
        //TODO: add interface to clear/delete local storage data from above link

        localStorage.checked = selectedOption;

        //check value of src input
        if(gmap.searchBoxSrc.getPlace() === undefined && template.find('#polycheckboxSrc').checked === false){
            toastr.warning("source location is not understood");
            return false;
        }
        //check value of destination
        if(gmap.searchBoxDest.getPlace() === undefined && template.find('#polyMapDesSearch').value === ""){
            toastr.warning("destination location is not understood");
            return false;
        }
        
        //check if time is valid
        if(! checkTimeInp(template)){
            return false;
        }
        console.info("selected element is : " + selectedOption);

        var search = getSearchBoxdata();
        //close for once submitted

        var distance = gmap.haversine(search.fromCoord, search.toCoord, "km", "geo");
        console.log(distance);
        if (distance < 0.1) {
            // Display an error toast, with a title
            toastr.error("Please select a farther destination", "Input Error");
            return;
        }
        var duration = 15 + (distance * 6);
        var validTime = validateTime(search.time, duration);
        if (validTime[0]) {
            $('#inputFormOuterId').removeClass("inpShowing").hide(200);
            var post = getSearchBoxdata();
            if (selectedOption == 'rider') {
                Session.set('mode', 'rider');
                if (!$('#directions-panel').length) {
                     $("#outputDirectionDiv").show(50);
                }
                // gmap.calcRoute(placesSrc[0].geometry.location,placesDest[0].geometry.location);
                gmap.calcRoute();
                Meteor.call('riderQuery', post, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {

                        console.log(data);
                        _.each(data, function (mark) {
                            gmap.markDraw(mark);
                        });
                    }
                });
                console.log('TODO show markers of rides from surrounding areas to destination');

            } else {
                Session.set('mode', 'ride');
                polyArray.clear();
                Meteor.call('rideQuery', post, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else if (data === null) {
                        console.log("no data to return");
                    } else {
                        data = wrangleDataDriver(data);
                        console.log(data);
                        _.each(data, function (poly) {
                            gmap.polyDraw(poly, post);
                        });
                    }
                    // gmap.polyDraw(data[0].overview);
                });
                console.log('TODO show markers of riders from surrounding areas to destination');
            }
        } else {
            var result;
            if (validTime[1] == "drives") {
                result = DrivesAdvtColl.find({_id: validTime[2]});
            } else {
                result = DriversAdvtColl.find({_id: validTime[2]});
            }
            IonPopup.confirm({
                title: 'Are you sure?',
                template: "Duplicate ride already exists. Do you want to cancel it?",
                onOk: function() {
                    console.log("TODO go to edit page for the conflict ride");
                },
                onCancel: function() {
                    console.log('Cancelled');
                }
			});

        }

    }


});

//adding aggregation distance and other info to output array of objects
wrangleDataDriver = function (data) {
    //combining objects from two arrays for each user
    var data0 = data[0];
    var data1 = data[1];

    for (var i = 0; i < data1.length; i++) {
        var id = data1[i]._id;
        for (var j = 0; j < data0.length; j++) {
            if (id == data0[j]._id) {
                _.extend(data1[i], data0[j]);
                data0.splice(j, 1);
                break;
            }
        }
    }
    //removing empty array
    return data1;
};

var clearFields = function () {
    document.getElementById('polycheckboxSrc').checked = false;
    $('#polyMapSrcSearch').attr("disabled", false).val("");
    $('#polyMapDesSearch').attr("disabled", false).val("");
    $('#polyDateSel').val('Today');
    $('#timeInput').val('');
};

var checkTimeInp = function(template){
        var time = template.find('#timeInput').value;
        var day = template.find('#polyDateSel').value;
        // check if input is empty
        if(day === "Today" && time === ""){
            return true;
        }
        if(day === "Tomorrow" && time ===""){
            toastr.warning("please enter a time for tomorrow");
            return false;
        }
        var correction = day === "Today" ? 0 : 1;
        //check if unix time is less than current time
        var utime = moment(time,"HH:mm").add(correction,'day').unix();
        var now = moment().unix();
        
        if(utime < now){
            console.log('past time entered');
            toastr.warning("please enter a future time");
            template.$('#timeInput').val('');
            return false;
        }else{
            console.log('future time entered');
            return true;
        }
}