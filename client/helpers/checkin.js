/* global moment */
/* global distanceToLine */
/* global markerManager */
/* global checkin */
checkin = function(){
    //check if checkinHeap is empty
    if(checkinHeap.content.length === 0){
        toastr.info("Nothing scheduled to checkin","Info");
        return false;
    }

    var loc = getLocObject();

    //go to first element and draw circle around the checkin point
    if(! _.has(checkinHeap.content[0], 'circle')){
        drawCircle(0);
    }else{
        var center = new google.maps.LatLng(loc.lat, loc.lng);
        gmap.map.panTo(center);
        if(gmap.map.getZoom() < 18)
            gmap.map.setZoom(18);
    }

    //check time
    var timecheck = checkTime(0);
    if(timecheck > 10){
        //alert that it is too early to checkin, alert the user to come back after some time
        toastr.info("you still have "+ timecheck+" minutes left to checkin !");
        return false;
    }else if(timecheck < -10){
        //user is late to arrive at the checkin location
        toastr.warning("you are more than 10 minutes late to arrive at your checkin point");
        //TODO check for current location of driver, if he is past the pickup location, then delete from checkinHeap
        //to let user know what is happening in background
        setTimeout(function() {
                //delete the entry from checkinHeap
                checkinHeap.content[0].circle.setMap(null);
                if (checkinHeap.content[0].hasOwnProperty("marker")) {
                    checkinHeap.content[0].marker.setMap(null);
                }
                checkinHeap.pop();
                console.log("popped first entry and going to next checkin location");
                toastr.info("going to next checkin location");
                checkin();
            },
            1500);

        return false;
    }else{
        //user is allowed to checkin if he is near to pickup point
        // check for distance
        var distance = checkDistance(0);
        if(distance > 100){
            //user is away from pickup point
            toastr.warning("please come into the blue circle and try again");
            return false;
        }else{
            //add a marker at the extraction point
            var options = {type:"checkin",markerIcon:'/splice.png'};
            var marker = markerManager.addMarker(loc,options);
            checkinHeap.content[0].marker = marker;
            checkinHeap.content[0].circle.setMap(null);
            // Display a success toast, with a title
            toastr.success("Please be at yout pickup point as shown in map", "Success");
            return true;
        }
    }

};

var drawCircle = function(index){
    var src = checkinHeap.content[index].request.srcloc;
    var rKey = Object.keys(src);
    var center = new google.maps.LatLng(src[rKey[1]], src[rKey[0]]);
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
        strokeWeight: 1
    });
    checkinHeap.content[index].circle = circle;
    gmap.map.panTo(center);
    if(gmap.map.getZoom() < 18)
        gmap.map.setZoom(18);
};

var checkDistance = function(index){
    var overview = checkinHeap.content[index].request.overview;
    //var rKey = Object.keys(src);
    //var center = [src[rKey[1]],src[rKey[0]]];
    var dest = [Session.get('lat'),Session.get('lng')];

    var distance = distanceToLine(dest,overview);
    console.log("you are still "+distance+" away");

    //return in meters
    return distance ;

};

var checkTime = function(index){
    var starts = Math.round(checkinHeap.content[index].request.starts);
    var now = moment().format('X');
    return Math.round((starts - now)/60);
};

var getLocObject = function(){
    //get the source location and construct loc object
    var src = checkinHeap.content[0].request.srcloc;
    var rKey = Object.keys(src);
    var id = checkinHeap.content[0].advtRequest;
    var title = "Checkin";
    var loc = {lat:src[rKey[0]], lng:src[rKey[1]],id:id,title:title};


    return loc;
};
