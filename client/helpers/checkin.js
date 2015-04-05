var query = TransactColl.find({
     $and: [{ status: true},
        {requester: Meteor.userId() }]
});

var handle = query.observeChanges({
    added: function(id, user) {
        console.log(user.requestee + " accepted " + moment.unix(user.accepted).calendar());
        checkinHeap.push(user);
    },
    removed: function(id) {
        console.log(id + " status changed");
    }
});

checkin = function(){
    //check if checkinHeap is empty
    if(checkinHeap.content.length === 0){
        toastr.info("Nothing scheduled to checkin","Info");
        return false;
    }

    //go to first element and draw circle around the checkin point
    if(! _.has(checkinHeap.content[0], 'circle')){
        drawCircle(0);
    }else{
        var src = checkinHeap.content[0].request.srcloc;
        var rKey = Object.keys(src);
        var center = new google.maps.LatLng(src[rKey[0]], src[rKey[1]]);
        gmap.map.setCenter(center);
        if(gmap.map.getZoom() < 18)
            gmap.map.setZoom(18);
    }

    //check time
    var timecheck = checkTime(0);
    if(timecheck > 10){
        toastr.info("you still have "+ timecheck+" minutes left to checkin !");
        return false;
    }else if(timecheck < -10){
        toastr.warning("you are more than 10 minutes late to arrive at your checkin point");
        //TODO check for current location of driver, if he is past the pickup location, then delete from checkinHeap
        //to let user know what is happening in background
        setTimeout(function() {
                //delete the entry from checkinHeap
                checkinHeap.content[0].circle.setMap(null);
                checkinHeap.pop();
                toastr.info("going to next checkin location");
                checkin();
            },
            1500);

        return false;
    }else{
        // check for distance
        var distance = checkDistance(0);
        if(distance > 100){
            toastr.warning("please come into the blue circle and try again");
            return false;
        }else{
            // Display a success toast, with a title
            toastr.success("Please be at yout pickup point as shown in map", "Success");
            return true;
        }
    }

};

var drawCircle = function(index){
    var src = checkinHeap.content[index].request.srcloc;
    var rKey = Object.keys(src);
    var center = new google.maps.LatLng(src[rKey[0]], src[rKey[1]]);
    //assuming distance near to pickup location
    var radius = 100;
    var circle = new google.maps.Circle({
        center: center,
        clickable: true,
        draggable: false,
        editable: false,
        fillColor: '#004de8',
        fillOpacity: 0.27,
        map: gmap.map,
        radius: radius,
        strokeColor: '#004de8',
        strokeOpacity: 0.62,
        strokeWeight: 1,
    });
    checkinHeap.content[index].circle = circle;
    gmap.map.setCenter(center);
    if(gmap.map.getZoom() < 18)
        gmap.map.setZoom(18);
};

var checkDistance = function(index){
    var src = checkinHeap.content[index].request.srcloc;
    var rKey = Object.keys(src);
    var center = [src[rKey[0]], src[rKey[1]]];
    var dest = [Session.get('lng'),Session.get('lat')];

    var distance = gmap.haversine(dest,center,'km','geo');
    //return in meters
    return distance * 1000;

};

var checkTime = function(index){
    var starts = Math.round(checkinHeap.content[index].request.starts);
    var now = moment().format('X');
    return Math.round((starts - now)/60);
};
