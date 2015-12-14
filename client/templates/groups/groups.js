Template.groups.helpers({
	total: function(){
		return CommColl.find({owner:Meteor.userId()}).count();
	},
	comm:function(){
		return CommColl.find({owner:Meteor.userId()});
	},
	totalJoin: function () {
		return CommColl.find({ owner: { $ne: Meteor.userId() } }).count();
	},
	commJoin: function () {
		return CommColl.find({ owner: { $ne: Meteor.userId() } });
	}
});

Template.groups.events({

});
