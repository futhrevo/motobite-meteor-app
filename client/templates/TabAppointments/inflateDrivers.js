Template.inflateDrivers.helpers({
    total:function(){
        return DriversAdvtColl.find().count();
    },
    driver: function(){
        return DriversAdvtColl.find({},{sort: {startTime: 1}});
    },
    start:function(){
        var date  = new Date(this.startTime * 1000);
        return date.toLocaleString();
    },
    tripOrigin: function(){
        var org = this.origin.length;

        return this.origin[org-4];
    },
    tripDest: function(){
        var dest = this.destination.length;
        return this.destination[dest-4];
    }
});

Template.inflateDrivers.events({
    'click .btnDel':function(event){
        event.preventDefault();
        	IonPopup.confirm({
                title: 'Are you sure?',
                template: 'Are you <strong>really</strong> sure to delete ?',
                onOk: function() {
                    var post = { _id: this._id };
                    Meteor.call('deleteRide',post,function(err,res){
                        if(err){
                            console.log("Error in deleteRide method");
                        }else if(res){
                            toastr[res.type](res.message);
                        }else{
        
                        }
                    });
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
