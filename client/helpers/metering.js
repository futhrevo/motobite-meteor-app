/* global MeterOn */
//get the path travelled using continuous integration

MeterOn = function (){
    this.loc=[];
    this.total = '';
    this.distance = 0;
    this.status = null;
};

MeterOn.prototype = {
    push:function(lat,lng){
        //only run if the meter already started
        if(this.status === true){
            this.loc.push([lat,lng]);
            if(this.loc.length >1){
                //need to do run length polyline coding to store the coordinates as string
                // b contains old and a contains new coordinates, this.loc length is maintained at length of 2
                var a = this.loc[1], b= this.loc[0], factor = Math.pow(10, 5);
                this.total += encode(a[0] - b[0], factor);
                this.total += encode(a[1] - b[1], factor);
                this.distance += gmap.haversine(b.reverse(),a.reverse(),"km","geo");
                //reverse the reversing done for distance
                a.reverse();
                this.loc.shift();
            }
        }
    },

    start:function(){
        if(this.status === null){
            var factor = Math.pow(10, 5);
            this.total = encode(Session.get('lat'), factor) + encode(Session.get('lng'), factor);
            this.loc.push([Session.get('lat'),Session.get('lng')]);
            this.status = true;
        }else{
            console.error("error event already started");
        }
    },
    stop:function(){
        this.status = false;
        return [this.total,this.distance];
    }
};

//function to convert coordinates to polyline
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
