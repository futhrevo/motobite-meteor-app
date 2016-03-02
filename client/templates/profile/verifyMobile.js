/* global toastr*/
Template.verifyMobile.helpers({
	number: function () {
		return Meteor.user().mobile[this.index].number;
	}
});

Template.verifyMobile.events({
	'click [data-action=send-smsotp-button]': function (event, template) { 
		Meteor.call('createSmsOtp', this.index, function (err, res) {
			if (err) {
				toastr[err.type](err.message);
			}
			if (res) {
				toastr[res.type](res.message);
				template.$('[data-action=send-smsotp-button]').fadeOut( "slow" );
			}
		});
	},
	'click [data-action=verify-smsotp-button]': function (event, template) { 
		const str = template.$('.verifyMobileClass input').val();
		if (str.length !== 6) {
			toastr.error("check code again");
			return false;
		}
		Meteor.call('verifySmsOtp', str, function (err, res) {
			if (err) {
				toastr[err.type](err.message);
			}
			if (res) {
				toastr[res.type](res.message);
				if (res.type === "success")
					Router.go('profileTemplate');
			}
		});
		// to prevent form reload when submitted
		return false;
	},
    'click [data-action=add-number-button]' : function(event, template){
        const str = template.$('.verifyMobileClass input').val();
        if(str.length !== 10){
            toastr.error("check number of digits again");
			return false;
        }
        if (Match.test(str, checkMobileString)) {
                Meteor.call("addNumber", str, function (err) {
                    if (err) {
                        toastr.error("Error Processing Request");
                    }
                })
        } else {
            toastr.error("check mobile number  again");            
        }
        return false;
    }
});

const checkMobileString = Match.Where(function(x){
    check(x, String);
    const regexp = /^[789]\d{9}$/;
    return regexp.test(x);
})