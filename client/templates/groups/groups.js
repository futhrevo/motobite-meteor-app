Template.groups.helpers({
	total: function(){
		return CommColl.find({owner:Meteor.userId()}).count();
	},
	comm:function(){
		return CommColl.find({owner:Meteor.userId()});
	},
	totalJoin: function () {
		return CommColl.find({ owner: { $ne: Meteor.userId() } }).count();
	}
});

Template.groups.events({
	'click [data-action=open-group]': function (event) { 
		event.preventDefault();
		console.log("TODO: open group");
	}
});
