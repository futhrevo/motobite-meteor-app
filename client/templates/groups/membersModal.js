Template.membersModal.helpers({
	member: function () {
		var data = Template.instance().data;
		console.log(data);
		if (data.hasOwnProperty("ismembers")) {
			console.log("isMember");
			 var curs =  CommColl.findOne({ _id: data.id }, {
				transform: transformMembers});
			console.log(curs);
			 return curs;
			
		} else if (data.hasOwnProperty("ispending")) {
			console.log("isPending");
			return CommColl.find({ _id: data.id });
		} else {
			console.log("isblocked");
			return CommColl.find({ _id: data.id });
		}
	}
});


var transformMembers = function (message) {
    var members = _.map(message.members, function (_id) {
        var user = Meteor.users.findOne(_id);
        if (user) {
            return user.profile.name;
        } else {
            return null;
        }
    })
    message.members = members; 
    return message;
};