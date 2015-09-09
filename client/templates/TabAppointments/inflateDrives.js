/* global DriversAdvtColl */
/* global DrivesAdvtColl */
/* global Template */
/* global validateTime */
Template.inflateDrives.helpers({
    total: function(){
        return DrivesAdvtColl.find().count();
    },
    drive: function(){
        return DrivesAdvtColl.find({},{sort: {startTime: 1}});
    },
    start:function(){
        var date  = new Date(this.startTime * 1000);
        return date.toLocaleString();
    }
});

Template.inflateDrives.events({
    'click .btnDel':function(event){
        event.preventDefault();
        IonPopup.confirm({
                title: 'Are you sure?',
                template: 'Are you <strong>really</strong> sure to delete ?',
                onOk: function() {
                    DrivesAdvtColl.remove(this._id);
                },
                onCancel: function() {
                    console.log('Cancelled');
                }
		});
    },
    'click .btnInfo':function(event){
        event.preventDefault();
        console.log("TODO get info of the current entry to edit");
    }

});
validateTime = function(date,duration){
    //( start1 <= end2 and start2 <= end1 )
    var start1 = date;
    var end1 = date + duration*60;
    var drivers = DriversAdvtColl.find({},{fields: {"startTime":1,"duration":1}}).fetch();
    var drives = DrivesAdvtColl.find({},{fields: {"startTime":1,"duration":1}}).fetch();

    for(var i=0;i < drives.length;i++){
        var start2 = drives[i].startTime;
        var end2 = start2+drives[i].duration*60;
        console.log("drives "+start1 +"\t" + end1 +"\t" + start2 + "\t" + end2);
        if(start1 <= end2 && start2 <= end1)
            return [false,"drives",drives[i]._id];
    }

    for(var i=0;i < drivers.length;i++){
        var start2 = drivers[i].startTime;
        var end2 = start2+drivers[i].duration*60;
        console.log("drivers "+start1 +"\t" + end1 +"\t" + start2 + "\t" + end2);
        if(start1 <= end2 && start2 <= end1)
            return [false,"drivers",drivers[i]._id];
        }
    return [true];
};
