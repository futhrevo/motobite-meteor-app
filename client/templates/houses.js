/* global SafeHouseColl, toastr, IonPopup*/
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
		const name = this.name;
		const _id = this._id;
		IonPopup.confirm({
			title: 'Are you sure?',
			template: 'Are you <strong>really</strong> sure to delete <strong>'+name+ '</strong>?',
			onOk: function() {
				Meteor.call('deleteSafeHouse',_id,function(err,res){
                        if(err){
                            console.log("Error in deleteRide method");
                        }else if(res){
                            toastr[res.type](res.message);
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
		const coordinates = this.loc.coordinates;
		const query = "lat=" + coordinates[1] + "&lng=" + coordinates[0];
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