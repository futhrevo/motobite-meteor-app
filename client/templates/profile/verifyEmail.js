Template.verifyEmail.helpers({
	email: function () {
		if (this.cat === "emails") {
			return Meteor.user().emails[this.index].address;
		} else {
			return Meteor.user().works.emails[this.index].address;
		}
	}
});

Template.verifyEmail.events({
	'click [data-action=send-emailotp-button]': function (event, template) { 
		Meteor.call('createEmailOtp', this.cat, this.index, function (err, res) {
			if (err) {
				toastr[err.type](err.message);
			}
			if (res) {
				toastr[res.type](res.message);
				template.$('[data-action=send-emailotp-button]').fadeOut( "slow" );
			}
		});
	},
	'click [data-action=verify-emailotp-button]': function (event, template) { 
		var str = template.$('.verifyEmailClass input').val();
		if (str.length != 8) {
			toastr.error("check code again");
			return false;
		}
		Meteor.call('verifyEmailOtp', str, function (err, res) {
			if (err) {
				toastr[err.type](err.message);
			}
			if (res) {
				toastr[res.type](res.message);
				if (res.type === "success")
					Router.go('profileTemplate');
			}
		})
		// to prevent form reload when submitted
		return false;
	}
});