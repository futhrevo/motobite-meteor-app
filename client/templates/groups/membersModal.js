Template.membersModal.onCreated(function () {
	this.editMode = new ReactiveVar(false);
});
Template.membersModal.events({
	'click [data-action=show-Done]': function (e, t) {
		e.preventDefault();
		var editMode=t.editMode.get();
    	t.editMode.set(!editMode);
	},
	'click [data-action=block-Member]': function (e, t) { 
		e.preventDefault();
		var post = {
			groupId: Template.instance().data.id,
			memId: this.user
		}
		Meteor.call('blockMember', post, function (err, result) {
				if (result) {
					toastr[result.type](result.message);
			}	
				if (err) {
					toastr.error(err.message);
				}		
			});
	},
	'click [data-action=unblock-Member]': function (e, t) { 
		e.preventDefault();
		var post = {
			groupId: Template.instance().data.id,
			memId: this.user
		}
		// console.log(post);
		Meteor.call('unblockMember', post, function (err, result) {
				if (result) {
					toastr[result.type](result.message);
			}
				if (err) {
					toastr.error(err.message);
				}			
			});
	},
	'click [data-action=accept-Pending]': function (e, t) { 
		e.preventDefault();
		var post = {
			groupId: Template.instance().data.id,
			memId: this.user
		}
		// console.log(post);
		Meteor.call('acceptPending', post, function (err, result) {
				if (result) {
					toastr[result.type](result.message);
			}
				if (err) {
					toastr.error(err.message);
				}			
			});
	},
	'click [data-action=reject-Pending]': function (e, t) { 
		e.preventDefault();
		var post = {
			groupId: Template.instance().data.id,
			memId: this.user
		}
		// console.log(post);
		Meteor.call('rejectPending', post, function (err, result) {
				if (result) {
					toastr[result.type](result.message);
			}
				if (err) {
					toastr.error(err.message);
				}			
			});
	},
});

Template.membersModal.helpers({
	member: function () {
		var data = Template.instance().data;
		if (data.hasOwnProperty("ismembers")) {
			 return CommColl.findOne({ _id: data.id }, {
				transform: transformMembers});
			
		} else if (data.hasOwnProperty("ispending")) {
			console.log("isPending");
			return CommColl.findOne({ _id: data.id }, {
				transform: transformPending});
		} else {
			// console.log("isblocked");
			return CommColl.findOne({ _id: data.id }, {
				transform: transformBlocked});
		}
	},
	editMode: function () {
		return Template.instance().editMode.get();
	},
	isMembers: function () {
		return Template.instance().data.ismembers;
	},
	isBlocked: function () {
		return Template.instance().data.isblocked;
	},
	isPending: function () {
		return Template.instance().data.ispending;
	}
});


var transformMembers = function (message) {
    var members = _.map(message.members, function (_id) {
		return _.extend(getUserDetails(_id), { type: 0 });
    })
    message.transformed = members; 
    return message;
};

var transformPending = function (message) {
	var pending = _.map(message.pending, function (_id) {
		return _.extend(getUserDetails(_id), { type: 1 });
    })
    message.transformed = pending; 
    return message;
}

var transformBlocked = function (message) {
	var blocked = _.map(message.blocked, function (_id) {
		return _.extend(getUserDetails(_id), { type: 2 });
    })
    message.transformed = blocked; 
    return message;
}

var getUserDetails = function (_id) {
	var user = Meteor.users.findOne(_id);
        if (user) {
            return {user: _id, name: user.profile.name, status:user.profile.status };
        } else {
            return null;
        }
}