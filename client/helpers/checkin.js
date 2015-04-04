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
        if(gmap.map.getZoom() < 19)
            gmap.map.setZoom(19);
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
    if(gmap.map.getZoom() < 19)
        gmap.map.setZoom(19);
};
