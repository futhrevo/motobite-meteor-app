Template.groupView.onCreated(function(){
	var template = this;
	template.autorun(function(){
		template.subscribe('members', FlowRouter.getParam('_id'));
	});
});

Template.groupView.helpers({
	ready: function(){
		return Template.instance().subscriptionsReady();
	},
	groupInfo: function(){
		let group = CommColl.findOne({ _id: _id });
        let isOwner = false;
        if (group && group.owner === Meteor.userId()) {
            isOwner = true;
        }
        return {group: group , isowner:isOwner};
	},

});
Template.groupView.events({
	'click [data-action=unjoin-group]': function (event) { 
		event.preventDefault();
		var post = {
			groupId: this.group._id,
			memId: Meteor.userId()
		}
		 IonPopup.confirm({
            title: 'Are you sure?',
            template: 'Are you really sure to unjoin this group?',
            okText: 'Yes!',
            okType: 'button-assertive',
            onOk: function() {
                Meteor.call('unjoinGroup', post, function (err, result) {
				if (result) {
					toastr[result.type](result.message);
					if (result.type == "success") {
						Router.go('/groups');
					 }					
			}	
				if (err) {
					toastr.error(err.message);
				}		
			});
            },
            onCancel: function() {

            }
        });
				
	}
});
// buttons in the header will be pushed to layout template
Template.layout.events({
	'click [data-action=disband-group]': function (event) { 
		console.log("user wants to delete group");
		var groupId = this.group._id;
		var msg = "";
		if (!this.isowner) {
			toastr.error("You cannot perform this action");
			return;
		} else {
			if (CommColl.findOne({ _id: groupId }).members.length > 0) {
				msg = 'You have members in your group, contact us to change ownership of group. If you still want to continue press YES';
			} else {
				msg = 'Are you really sure to delete this group?'
			}
		}
		IonPopup.confirm({
            title: 'Are you sure?',
            template: msg,
            okText: 'Yes!',
            okType: 'button-assertive',
            onOk: function() {
                Meteor.call('deleteGroup', groupId, function (err, result) {
				if (result) {
					toastr[result.type](result.message);
					if (result.type == "success") {
						Router.go('/groups');
					 }					
			}	
				if (err) {
					toastr.error(err.message);
				}		
			});
            },
            onCancel: function() {

            }
        });
	}
});

