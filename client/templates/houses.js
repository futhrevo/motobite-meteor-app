Template.houses.helpers({
	total:function(){
        return SafeHouseColl.find().count();
    },
	house: function () {
		return SafeHouseColl.find();
	}
});

Template.houses.events({
	'click .btnDel': function (event) { 
		event.preventDefault();
		var name = this.name;
		var _id = this._id;
		IonPopup.confirm({
			title: 'Are you sure?',
			template: 'Are you <strong>really</strong> sure to delete <strong>'+name+ '</strong>?',
			onOk: function() {
				Meteor.call('deleteSafeHouse',_id,function(err,res){
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
	'click .btnMap': function (event) { 
		event.preventDefault();
		var coordinates = this.loc.coordinates;
		var query = "lat=" + coordinates[1] + "&lng=" + coordinates[0];
		IonPopup.confirm({
			title: 'Show on Map?',
			onOk: function() {
				Router.go('index',{},{query:query});
			},
			onCancel: function() {
				console.log('Cancelled');
			}
		});
	}
});