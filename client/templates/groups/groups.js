Template.groups.helpers({
	total: function(){
		return CommColl.find({owner:Meteor.userId()}).count();
	},
	comm:function(){
		return CommColl.find({owner:Meteor.userId()});
	}
});