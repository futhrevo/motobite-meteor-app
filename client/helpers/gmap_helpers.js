//http://www.andrehonsberg.com/article/reactive-google-maps-markers-meteor-js

gmap = {
    //map object
    map: null,

    //searchbox
    searchBoxSrc: null,
    searchBoxDest: null,

    //google markers objects
    markers: {},

    //google lat lng objects
    latLngs: [],

    //formatted marker data objects
    markerData: [],

    //register serachbox divs
    regDivs: function () {
        //remove leftover pac containers
        $('.pac-container').remove();
        var searchBounds = new google.maps.LatLngBounds(asLatLng(12.6, 77.7), asLatLng(13.25, 78.02));
        var autoCompleteOptions = {
            bounds: searchBounds,
            componentRestrictions: {country: 'in'}
        };
        this.searchBoxSrc = new google.maps.places.Autocomplete(document.getElementById("polyMapSrcSearch"),autoCompleteOptions);
        this.searchBoxDest = new google.maps.places.Autocomplete(document.getElementById("polyMapDesSearch"), autoCompleteOptions);
    },
    //add a marker from the given marker object
    addMarker: function (marker, type, objType) {
        var icon;
        var myLatlng;
        var title;
        if (type == "origin") {
            icon = '/marker.svg';
            title = 'Origin';
        } else if (type == "dest") {
            icon = '/destination.png';
            title = 'Destination';
        } else {
            icon = '/taxi.png';
            title = 'taxi';
        }

        if (objType == 'gmapMarker') {
            myLatlng = new google.maps.LatLng(marker.lat, marker.lng);
            title = marker.title;
        } else if (objType == 'latlng') {
            myLatlng = marker;
        } else if (objType == 'geoLatLng') {
            //geocoder to get latlng object from address provided. Callbacks do not have this scope.so we need to expicitly call using gmap object
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address': marker}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    bounds.extend(results[0].geometry.location);
                    gmap.map.fitBounds(bounds);
                    console.log('Geocode calculated as : ' + results[0].geometry.location);
                    myLatlng = results[0].geometry.location;
                    //special case for async function
                    var mymarker = new google.maps.Marker({
                        position: myLatlng,
                        map: gmap.map,
                        title: title,
                        animation: google.maps.Animation.DROP,
                        icon: icon

                    });
                    console.log(myLatlng);
                    gmap.latLngs.push(myLatlng);
                    return myLatlng;
                } else {
                    console.log('Geocode was not successful for the following reason: ' + status);
                    myLatlng = null;
                }
            });
        }


        // To add the marker to the map, use the 'map' property
        var mymarker = new google.maps.Marker({
            position: myLatlng,
            map: this.map,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: icon

        });
        console.log('marker added at loc : ' + marker.id + mymarker.toString());
        // var obj ={};
        // var key = marker.id;
        // obj[key] = mymarker;
        //keep track of markers and geo data
        this.latLngs.push(myLatlng);
        this.markers[marker.id] = mymarker;
        this.markerData.push(marker);

        return mymarker;
    },

    // calculate and move the bound box based on our markers
    calcBounds: function () {

        for (var index in this.latLngs) {
            bounds.extend(this.latLngs[index]);
        }
        this.map.fitBounds(bounds);
    },

    //check if marker already exists
    markerExists: function (key, val) {
        _.each(this.markers, function (storedMarker) {
            if (storedMarker[key] == val)
                return true;
        });
        return false;
    },

    //initialize the map
    initialize: function () {
        console.info("[+] Initializing Google Maps with center (" + Session.get('lat') + "," + Session.get('lng') + ")");
        var clat = Session.get('lat');
        var clng = Session.get('lng');
        var loc = new google.maps.LatLng(clat, clng);
        // Create a new StyledMapType object
        var mapType = new google.maps.StyledMapType(MAP_STYLE, styleOptions);
        var mapOptions = {
            center: loc,
            zoom: 16,
            disableDefaultUI: true
        };
        this.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        this.map.mapTypes.set("First Style", mapType);
        this.map.setMapTypeId("First Style");
        this.regDivs();
        bounds = new google.maps.LatLngBounds();
        bounds.extend(loc);
        // this.map.fitBounds(bounds);
        this.map.setCenter(loc);
        var rendererOptions = {
            draggable: true
        };
        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        //global flag saying we initialized already
        Session.set('map', true);

        console.info('[+] map initialized');
        updateLocation();

        // ported insert into server
        google.maps.event.addDomListener(window, "resize", function () {
            var center = gmap.map.getCenter();
            google.maps.event.trigger(gmap.map, "resize");
            gmap.map.setCenter(center);
        });

        //create MarkerManager object to control Markers
        markerManager = new MarkerManager(this.map);
        checkinTrackerInt();
    },

    //distance calculation using Haversine formula
    //http://andrew.hedges.name/experiments/haversine/
    /*	dlon = lon2 - lon1
     dlat = lat2 - lat1
     a = (sin(dlat/2))^2 + cos(lat1) * cos(lat2) * (sin(dlon/2))^2
     c = 2 * atan2( sqrt(a), sqrt(1-a) )
     d = R * c (where R is the radius of the Earth)*/
    haversine: function (src, dest, unit, type) {
        var srclat, srclng, destlat, destlng, R;
        if (type == 'hash') {
            var srcMarker = geohash.decode(src);
            var destMarker = geohash.decode(dest);
            srclat = srcMarker[0];
            srclng = srcMarker[1];
            destlat = destMarker[0];
            destlng = destMarker[1];
        } else if (type == "geo") {
            srclat = src[1];
            srclng = src[0];
            destlat = dest[1];
            destlng = dest[0];
        } else {
            srclat = src.lat();
            srclng = src.lng();
            destlat = dest.lat();
            destlng = dest.lng();
        }
        if (unit == "km") {
            R = 6373;
        } else {
            R = 3961;
        }
        var dLat = (Math.PI / 180) * (destlat - srclat);
        var dLon = (Math.PI / 180) * (destlng - srclng);
        var lat1 = (Math.PI / 180) * srclat;
        var lat2 = (Math.PI / 180) * destlat;

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        console.log("haversine distance in km : " + d);
        return (d);
    },

    sphericalD: function (src, dest) {
        return google.maps.geometry.spherical.computeDistanceBetween(src, dest);
    },

    //Distance Matrix service - this has rate limitations need to reduce its use as much as possible
    //https://developers.google.com/maps/documentation/javascript/distancematrix
    distanceMatrix: function (origin1, destinationA) {
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [origin1],
                destinations: [destinationA],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false
            }, dMcallback);
    },

    //directions service with panel display
    calcRoute: function () {
        // var directionsDisplay = new google.maps.DirectionsRenderer();
        // this.directionDisplay.setMap(null);
        var directionsService = new google.maps.DirectionsService();
        directionsDisplay.setMap(this.map);

        var outputDiv = document.getElementById('directions-select');
        outputDiv.innerHTML = '';
        directionsDisplay.setPanel(outputDiv);
        google.maps.event.addListener(directionsDisplay, 'directions_changed', function () {
            console.log("route dragged ");
        });
        var search = getSearchBoxdata();
        var origin1 = search.fromCoord;
        var destinationA = search.toCoord;

        var request = {
            origin: asLatLng(origin1[1], origin1[0]),
            destination: asLatLng(destinationA[1], destinationA[0]),
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            provideRouteAlternatives: true,
            avoidHighways: false,
            avoidTolls: false
        };

        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.time = search.time;
            }
        });
    }

};

//callback to get distance matrix response
function dMcallback(response, status) {
    if (status != google.maps.DistanceMatrixStatus.OK) {
        console.log('DistanceMatrix returned Error at: ' + status);
    } else {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
        var outputDiv = document.getElementById('outputDiv');
        outputDiv.innerHTML = '';

        //			deleteOverlays();

        for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            // console.log(origins[i]);
            gmap.addMarker(origins[i], "origin", 'geoLatLng');
            for (var j = 0; j < results.length; j++) {
                gmap.addMarker(destinations[j], "dest", 'geoLatLng');
                outputDiv.innerHTML += origins[i] + ' to ' + destinations[j] +
                    ': ' + results[j].distance.text + ' in ' +
                    results[j].duration.text + '<br>';
            }
        }
    }
}

gmap.parseRoute = function() {
    var directions = directionsDisplay.getDirections();
    var choice = directionsDisplay.getRouteIndex();
    var response = directions.routes[choice];
    var distance = 0;
    var duration = 0;
    var startTime = directionsDisplay.time;

    //temp hack to get coordinates from directions renderer
    var resultKey = Object.keys(directions)[2];
    var resultCoord = directions[resultKey];

    for (var i = 0; i < response.legs.length; i++) {
        distance += response.legs[i].distance.value;
        duration += response.legs[i].duration.value;
    }
    duration = 15 + (duration / 60);
    var validTime = validateTime(startTime, duration);
    console.log(validTime);
    if (validTime[0]) {
        var coord = polyline.hashdecode(response.overview_polyline, 5);
        var coordinates = coord[0];
        DriversAdvtColl.insert({
            overview: response.overview_polyline,
            summary: response.summary,
            bounds: response.bounds,
            distance: distance,
            duration: duration,
            startTime: startTime,
            originCoord:resultCoord.origin,
            destinationCoord: resultCoord.destination,
            origin: response.legs[0].start_address.split(", "),
            destination: response.legs[0].end_address.split(", "),
            gh6 : coord[1],
            locs: {
                type: "LineString",
                coordinates: coordinates
            }
        });
    } else {
        var result;
        if(validTime[1] == "drives"){
            result = DrivesAdvtColl.find({_id:validTime[2]});
        }else{
            result = DriversAdvtColl.find({_id:validTime[2]});
        }
        $('.alert-danger').css('display','inline-block');
    }

};

gmap.geocode = function (lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': latlng}, function (results, status) {
        var result;
        if (status == google.maps.GeocoderStatus.OK) {
            result = results[1].formatted_address;
        } else {
            result = "Cannot determine address at this location";
        }
        $('#polyMapSrcSearch').val(result);
    });
};

//function to draw polyline on map
gmap.polyDraw = function (poly, post) {
    var polyInfo = polyline.dissect(poly.overview, poly.gh6[poly.srcIndex], poly.gh6[poly.dstIndex], post.fromCoord, post.toCoord);
    poly.overview = polyInfo.overview;
    var path = google.maps.geometry.encoding.decodePath(poly.overview);
    console.log("before polylinw");
    var polydraw = new google.maps.Polyline({
        path: path,
        strokeColor: '#00acc1',
        strokeOpacity: 0.4,
        strokeWeight: 10,
        visible: false,
        map: this.map
    });
    console.log("after polylinw");
    var distance = Math.round(google.maps.geometry.spherical.computeLength(polydraw.getPath()));
    //lets say speed is 20kmph = 334m per min
    var duration = Math.round(distance / 334);
    //considering user approaches with avg speed 50kmph and each grid size is 610m
    var startTime = poly.startTime + (poly.srcIndex * 610 / 14);
    var polyObject = {
        _id: poly._id,
        overview: poly.overview,
        summary: poly.summary,
        bounds: poly.bounds,
        distance: distance,
        startTime: startTime,
        duration: duration,
        polydraw: polydraw,
        srcDist: polyInfo.srcDistance,
        dstDist: polyInfo.destDistance,
        srcloc: post.fromCoord,
        dstloc: post.toCoord
    };
    polyArray.push(polyObject);
};

//function to draw markers on map
gmap.markDraw = function (mark) {
    console.log(mark._id);
    var rideMarker = {
        lat: mark.nodes[0].locs.coordinates[1],
        lng: mark.nodes[0].locs.coordinates[0],
        id: mark._id
    };
    gmap.addMarker(rideMarker, "origin", 'gmapMarker');
};


Template.dispMap.rendered = function () {
    console.log("display map rendered");
    //if map is initialized and map dom is empty then replace the dom with map divs
    if (Session.get('map') && $('#map-canvas').html() === "") {
        console.log("replaced");
        $('#map-canvas').replaceWith(gmap.map.getDiv());
        //gmap.regDivs();
    }

    // preload lat and lng from server if get location fails
    var oldHash = MarkerColl.findOne({_id:Meteor.userId()}).gh;
    if(oldHash){
        var oldCoords = geohash.decode(oldHash);
        Session.set('lat', oldCoords[0]);
        Session.set('lng', oldCoords[1]);
    }

    function waitForGPS() {
        CheckGPS.check(function () {
                //GPS is enabled!
                onDeviceReady();

            },
            function () {
                //GPS is disabled!
                setTimeout(waitForGPS, 250);
                console.log("waiting");

            });
    }

    if (Meteor.isCordova) {
        console.log("Meteor is running as cordova");
        console.log("TODO : checkGPS only works on Android, need to figure for iOS");
        CheckGPS.check(function () {
                //GPS is enabled!
                console.log("GPS enabled");
                onDeviceReady();
            },
            function () {
                //GPS is disabled!
                console.log("GPS disabled");

                IonPopup.confirm({
                    title: 'Enable Location',
                    template: 'This app requires access to your <strong>location</strong>. Do you want to <strong>enable</strong> it?',
                    okText: 'Enable GPS',
                    onOk: function () {
                        console.log('Confirmed');
                        //open GPS settings page
                        window.plugins.webintent.startActivity({action: 'android.settings.LOCATION_SOURCE_SETTINGS'},
                            function () {
                                console.log("GPS settings screen showing now");
                                waitForGPS();
                            },
                            function () {
                                console.log("Unable to show GPS settings screen")
                            });
                    },
                    onCancel: function () {
                        console.log('Cancelled by user');
                    }
                });


            });

    } else {
        onDeviceReady();
    }


};

asBounds = function (bound) {
    var rKey = Object.keys(bound);
    var lKey = Object.keys(bound[rKey[0]]);
    return new google.maps.LatLngBounds(asLatLng(bound[rKey[0]][lKey[0]], bound[rKey[1]][lKey[1]]), asLatLng(bound[rKey[0]][lKey[1]], bound[rKey[1]][lKey[0]]));
};

function asLatLng(lat, lng) {
    console.log(lat, lng);
    return new google.maps.LatLng(lat, lng);
}

var checkinTrackerInt = function () {
    var query = TransactColl.find({
        $and: [{status: true},
            {requester: Meteor.userId()}]
    });

    var handle = query.observeChanges({
        added: function (id, user) {
            console.log(user.requestee + " accepted " + moment.unix(user.accepted).calendar());
            checkinHeap.push(user);
        },
        removed: function (id) {
            console.log(id + " status changed");
        }
    });
};


function onDeviceReady() {
    console.log("device is ready");
    getPosition(mapDom);
}

function getPosition(funct) {
    console.log("-->  get position");
    var actionfunct;
    if (funct !== undefined && typeof funct === 'function') {
        actionfunct = funct;
    } else {
        actionfunct = function () {
        };
    }
    //success callback for geolocation
    function geo_success(position) {
        Session.set('lat', position.coords.latitude);
        Session.set('lng', position.coords.longitude);
        Session.set('accuracy', position.coords.accuracy);
        Session.set('speed', position.coords.speed);
        Session.set('atTime', position.timestamp);
        console.log("Got location  <--");
        actionfunct();
    }

    //failure callback for geolocation
    function geo_error(poserr) {
        console.log(poserr);
        if (poserr.code == 1) {
            console.log(poserr.message + " - Please accept permission and try again");
        } else if (poserr.code == 2) {
            console.log(poserr.message + " - The acquisition of the geolocation failed because one or several internal source of position returned an internal error");
        } else if (poserr.code == 3) {
            console.log(poserr.message + " - The time allowed to aquire the geolocation was reached before the information was obtained");
        }
        else {
            console.log("Position error");
        }
        // initialize map with cached location
        console.log("using cached location");
        actionfunct();
    }

    //options for geolocation
    var geo_options = {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 10 * 1000
    };
    // Now safe to use device APIs
    wpid = navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
}

//function to update map dom
function mapDom() {
    console.log("map Dom is getting fixed");
    if (!Session.get('map')) {
        drawCanvas();
    } else if ($('#map-canvas').html() === "") {
        updateLocation();
    }
}

function drawCanvas() {
    if ($('#map-canvas').length) {
        console.info("map-canvas added to the dom");
        $('#map-canvas').ready(gmap.initialize());
    } else {
        console.info("wait for map-canvas to be ready");
        setTimeout(drawCanvas, 500);
    }
}


//sample callback hell to get heading, location and then post it to mongo
updateLocation = function () {
    console.log("updating user location");
    getPosition(beforePostLoc);
    getHeading();

};

//calculate heading and save it to session variable
function getHeading(funct) {
    console.log("get Heading");
    var actionfunct;
    if (funct !== undefined && typeof funct === 'function') {
        actionfunct = funct;
    } else {
        actionfunct = function () {
        };
    }
    if (Meteor.isCordova) {
        function onSuccess(heading) {
            console.log('Heading: ' + heading.magneticHeading);
            Session.set('heading', heading.magneticHeading);
            actionfunct();
        }

        function onError(error) {
            console.log('CompassError: ' + error.code);
        }

        navigator.compass.getCurrentHeading(onSuccess, onError);
    } else {
        console.log("Meteor is not cordova");
        Session.set('heading', null);
        actionfunct();
    }
}

function beforePostLoc(){
    var clat = Session.get('lat');
    var clng = Session.get('lng');
    var heading = Session.get('heading');
    var chash = geohash.encode(clat, clng);
    var post = {
        gh: chash,
        heading: heading || null
    };
    console.log("posting updates to mongo ");
    Meteor.call('postLocation', post, function (error, result) {
        // display the error to the user and abort
        if (error)
            return console.log("Cannot update user location to collection due to " + error.reason);

    });
}

// Create an array of styles
//https://snazzymaps.com/style/42/apple-maps-esque
var MAP_STYLE = [
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f7f1df"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#d0e3b4"
            }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fbd3da"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#bde6ab"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffe15f"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#efd151"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "black"
            }
        ]
    },
    {
        "featureType": "transit.station.airport",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#cfb2db"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#a2daf2"
            }
        ]
    }
];
//the name to be displayed on the map type control
var styleOptions = {
    name: "First Style"
};
// Add Gurgaon, Mysore, Noida
var cities = [{"city":"Bangalore","center":{"lat":12.971599,"lng":77.594563},"bounds":{"sw":{"lat":12.69,"lng":77.18},"ne":{"lat":13.26,"lng":77.97}}},
    {"city":"hyderabad","center":{"lat":17.385044,"lng":78.486671},"bounds":{"sw":{"lat":17.16,"lng":78.04},"ne":{"lat":17.71,"lng":78.9}}},
    {"city":"Chennai","center":{"lat":13.08268,"lng":80.270718},"bounds":{"sw":{"lat":12.9,"lng":80.01},"ne":{"lat":13.2,"lng":80.4}}},
    {"city":"Delhi","center":{"lat":28.613939,"lng":77.209021},"bounds":{"sw":{"lat":28.07,"lng":76.44},"ne":{"lat":29.15,"lng":77.97}}},
    {"city":"Mumbai","center":{"lat":19.075984,"lng":72.877656},"bounds":{"sw":{"lat":18.8,"lng":72.59},"ne":{"lat":19.02,"lng":73.36}}},
    {"city":"Pune","center":{"lat":18.52043,"lng":73.856744},"bounds":{"sw":{"lat":18.4,"lng":73.67},"ne":{"lat":18.69,"lng":74.05}}},
    {"city":"Thiruvananthapuram","center":{"lat":8.524139,"lng":76.936638},"bounds":{"sw":{"lat":8.39,"lng":76.75},"ne":{"lat":8.69,"lng":77.13}}},
    {"city":"APCR","center":{"lat":16.572983,"lng":80.357513},"bounds":{"sw":{"lat":16.4,"lng":80.78},"ne":{"lat":16.77,"lng":80.8}}},
    {"city":"Bhubaneshwar","center":{"lat":20.296059,"lng":85.82454},"bounds":{"sw":{"lat":20.2,"lng":86.07},"ne":{"lat":20.58,"lng":86.2}}},
    {"city":"Kolkata","center":{"lat":22.572646,"lng":88.363895},"bounds":{"sw":{"lat":22.24,"lng":87.94},"ne":{"lat":22.8,"lng":88.7}}},
    {"city":"Ahmedabad","center":{"lat":23.022505,"lng":72.571362},"bounds":{"sw":{"lat":22.75,"lng":72.18},"ne":{"lat":23.3,"lng":72.95}}}]
