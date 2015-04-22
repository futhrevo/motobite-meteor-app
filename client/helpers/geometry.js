/**
 * Created by Admin on 4/10/2015.
 */
//http://docs.openlayers.org/library/spherical_mercator.html

/*

 Subject 1.02: How do I find the distance from a point to a line?


 Let the point be C (Cx,Cy) and the line be AB (Ax,Ay) to (Bx,By).
 Let P be the point of perpendicular projection of C on AB.  The parameter
 r, which indicates P's position along AB, is computed by the dot product
 of AC and AB divided by the square of the length of AB:

 (1)     AC dot AB
 r = ---------
 ||AB||^2

 r has the following meaning:

 r=0      P = A
 r=1      P = B
 r<0      P is on the backward extension of AB
 r>1      P is on the forward extension of AB
 0<r<1    P is interior to AB

 The length of a line segment in d dimensions, AB is computed by:

 L = sqrt( (Bx-Ax)^2 + (By-Ay)^2 + ... + (Bd-Ad)^2)

 so in 2D:

 L = sqrt( (Bx-Ax)^2 + (By-Ay)^2 )

 and the dot product of two vectors in d dimensions, U dot V is computed:

 D = (Ux * Vx) + (Uy * Vy) + ... + (Ud * Vd)

 so in 2D:

 D = (Ux * Vx) + (Uy * Vy)

 So (1) expands to:

 (Cx-Ax)(Bx-Ax) + (Cy-Ay)(By-Ay)
 r = -------------------------------
 L^2

 The point P can then be found:

 Px = Ax + r(Bx-Ax)
 Py = Ay + r(By-Ay)

 And the distance from A to P = r*L.

 Use another parameter s to indicate the location along PC, with the
 following meaning:
 s<0      C is left of AB
 s>0      C is right of AB
 s=0      C is on AB

 Compute s as follows:

 (Ay-Cy)(Bx-Ax)-(Ax-Cx)(By-Ay)
 s = -----------------------------
 L^2


 Then the distance from C to P = |s|*L.

 */
var pole = 20037508.34;
//function to convert coordinates to cartesian system
function forwardMercator (xy) {
    xy.x = xy.x * pole / 180;
    var y = Math.log(Math.tan((90 + xy.y) * Math.PI / 360)) / Math.PI * pole;
    xy.y = Math.max(-20037508.34, Math.min(y, 20037508.34));
    return xy;
}


//function to convert Line string to Cartesian system line segments
function segmentedLine(str){
    var coordinates = polyline.decode(str);
    var output = [];
    for(var i=0;i < coordinates.length;i++){
        output.push(forwardMercator({x:coordinates[i][0],y:coordinates[i][1]}));
    }
    return output;
}

function segmentLineCoord(arr){
    var output =[];
    for(var i=0;i < arr.length;i++){
        output.push(forwardMercator({x:arr[i][0],y:arr[i][1]}));
    }
    return output;
}
//function to calculate distance and nearest point to the line Segments
distanceToLine = function(point,str){
    //check for input argument type for line and point type
    //if point is in lat and lng convert to xy and continue
    console.log(point);
    point = point.constructor === Array ? forwardMercator({x: point[1], y: point[0]}) : point;
    console.log(point);
    //if input is a string call segmentedLine
    if(typeof str === 'string'){
        var segment;
        segment = segmentedLine(str);
    }else if(typeof str === 'object'){
        //if input is an array call segmentLineCoord
        segment = segmentLineCoord(str);
    }else{
        return false;
    }
    var min = null;
    for(var i=0;i<segment.length -1;i++){
        var result = distanceToSegment(point,segment[i],segment[i+1]);
        if(min !== null){
            if(result.distance < min.distance){
                min = result;
                min.i = i;
            }
        }else{
            min = result;
            min.i = i;
        }
    }
    //calculate square root only when to display to optimise for performance
    min.distance = Math.ceil(Math.sqrt(min.distance));
    min = inverseMercator(min);
    return min;
}

//function to calculate distance and nearest point to the line Segment, returns square of the distance
function distanceToSegment(point,pointA,pointB){
    var x0 = point.x;
    var y0 = point.y;
    var x1 = pointA.x;
    var y1 = pointA.y;
    var x2 = pointB.x;
    var y2 = pointB.y;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var along = (dx == 0 && dy == 0) ? 0 : ((dx * (x0 - x1)) + (dy * (y0 - y1))) /
    (Math.pow(dx, 2) + Math.pow(dy, 2));
    var x, y;
    if(along <= 0.0) {
        x = x1;
        y = y1;
    } else if(along >= 1.0) {
        x = x2;
        y = y2;
    } else {
        x = x1 + along * dx;
        y = y1 + along * dy;
    }
    return {
        distance: Math.pow(x - x0, 2) + Math.pow(y - y0, 2),
        x: x, y: y
    };
}
//function to convert XYZ to lat lng
function inverseMercator(xy) {
    xy.x = 180 * xy.x / pole;
    xy.y = 180 / Math.PI * (2 * Math.atan(Math.exp((xy.y / pole) * Math.PI)) - Math.PI / 2);
    return xy;
}