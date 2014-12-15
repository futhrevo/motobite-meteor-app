Template.inflateDrives.helpers({
    drive: function(){
        return DrivesAdvtColl.find();
    }
});

validateTime = function(date,duration){
    //( start1 <= end2 and start2 <= end1 )
    var start1 = date;
    var end1 = date + duration;
    var drivers = DriversAdvtColl.find({},{fields: {"startTime":1,"duration":1}}).fetch();
    var drives = DrivesAdvtColl.find({},{fields: {"startTime":1,"duration":1}}).fetch();

    for(var i=0;i < drives.length;i++){
        var start2 = drives[i].startTime;
        var end2 = start2+drives[i].duration;
        console.log(start1 +"\t" + end1 +"\t" + start2 + "\t" + end2);
        if(start1 <= end2 && start2 <= end1)
            return false;
    }

    for(var i=0;i < drivers.length;i++){
        var start2 = drivers[i].startTime;
        var end2 = start2+drivers[i].duration;
        console.log(start1 +"\t" + end1 +"\t" + start2 + "\t" + end2);
        if(start1 <= end2 && start2 <= end1)
            return false;
        }
    return true;
}
