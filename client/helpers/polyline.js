/*
decimal
places   degrees          distance
-------  -------          --------
0        1                111  km
1        0.1              11.1 km
2        0.01             1.11 km
3        0.001            111  m
4        0.0001           11.1 m
5        0.00001          1.11 m
6        0.000001         11.1 cm
7        0.0000001        1.11 cm
8        0.00000001       1.11 mm
9        0.000000001      111  μm
10       0.0000000001     11.1 μm
11       0.00000000001    1.11 μm
12       0.000000000001   111  nm
13       0.0000000000001  11.1 nm

Precision, Distance of Adjacent Cell in Meters
1, 			5003530
2, 			625441
3, 			123264
4, 			19545
5, 			3803
6, 			610
7, 			118
8, 			19
9, 			3.71
10, 		0.6
*/
polyline = {};

// Based off of [the offical Google document](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
//
// Some parts from [this implementation](http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/PolylineEncoder.js)
// by [Mark McClure](http://facstaff.unca.edu/mcmcclur/)

function encode(coordinate, factor) {
    coordinate = Math.round(coordinate * factor);
    coordinate <<= 1;
    if (coordinate < 0) {
        coordinate = ~coordinate;
    }
    var output = '';
    while (coordinate >= 0x20) {
        output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
        coordinate >>= 5;
    }
    output += String.fromCharCode(coordinate + 63);
    return output;
}

// This is adapted from the implementation in Project-OSRM
// https://github.com/DennisOSRM/Project-OSRM-Web/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
polyline.decode = function(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
        console.log(latitude_change,longitude_change);
        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};

polyline.encode = function(coordinates, precision) {
    if (!coordinates.length) return '';

    var factor = Math.pow(10, precision || 5),
        output = encode(coordinates[0][0], factor) + encode(coordinates[0][1], factor);

    for (var i = 1; i < coordinates.length; i++) {
        var a = coordinates[i], b = coordinates[i - 1];
        output += encode(a[0] - b[0], factor);
        output += encode(a[1] - b[1], factor);
    }

    return output;
};

polyline.hashdecode = function(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        gh6 = [],
        dup = "",
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
        // interpolating lat and long if distance between two points is more than 100m
        if((lat != 0 && lng != 0 )&& (latitude_change > 100 || longitude_change > 100)){
            var latfactor = 1;
            var lngfactor = 1;
            if(longitude_change > 100){
                lngfactor = Math.round(longitude_change/100);
            }
            if(latitude_change > 100){
                latfactor = Math.round(latitude_change/100);
            }

            var interp = (latfactor > lngfactor)? latfactor : lngfactor;
            console.log(interp);

            for (var i = 0; i < interp; i++) {
                lat += latitude_change/interp;
                lng += longitude_change/interp;
                //coordinates.push([lat / factor, lng / factor]);
                coordinates.push([lng / factor , lat / factor]);
                var temp = geohash.encode(lat / factor,lng / factor,6);
                if(dup != temp){
                    dup = temp;
                    gh6.push(temp);
                }
            };


        }else{
            lat += latitude_change;
            lng += longitude_change;
            coordinates.push([lng / factor , lat / factor]);
            //coordinates.push([lat / factor, lng / factor]);
            var temp = geohash.encode(lat / factor,lng / factor,6);
            if(dup != temp){
                dup = temp;
                gh6.push(temp);
            }
        }

    }

    return [coordinates,gh6];
};
