/* global toastr*/
Template.verifyEmail.onCreated(function(){
	var template = this;
	const cat = FlowRouter.getParam('cat');
    const index = parseInt(FlowRouter.getParam('index'));
    template.catValue = new ReactiveVar();
    template.indexValue = new ReactiveVar();
    if (typeof (cat) === 'string' && typeof (index) === 'number' && Meteor.user()) {
    	let proj ;
            if (cat === "works") {
                if (Meteor.user().works.emails.length > index) {
                    proj = Meteor.user().works.emails[index].verified;
                }
            } else if (cat === "emails") {
                if (Meteor.user().emails.length > index) {
                    proj = Meteor.user().emails[index].verified;
                }
            } else {
                return Router.go('profileTemplate');
            }
            if (proj === false) {
            	template.catValue.set(cat);
            	template.indexValue.set(index)
                return ;
            } else {
                return Router.go('profileTemplate');
            }
    } else {
            console.log("not printed");
            return Router.go('profileTemplate');
        }
});
Template.verifyEmail.helpers({
	email: function () {
		if (Template.instance().catValue.get() === "emails") {
			return Meteor.user().emails[Template.instance().indexValue.get()].address;
		} else {
			return Meteor.user().works.emails[Template.instance().indexValue.get()].address;
		}
	}
});

Template.verifyEmail.events({
	'click [data-action=send-emailotp-button]': function (event, template) { 
		Meteor.call('createEmailOtp', template.catValue.get(), template.indexValue.get(), function (err, res) {
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
		const str = template.$('.verifyEmailClass input').val();
		if (str.length !== 8) {
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
	},
    'click [data-action=add-email-button]' : function(event, template){
        const str = template.$('.verifyEmailClass input').val();
        if(str.length < 2){
            toastr.error("check email again");
			return false;
        }
        Meteor.call('addEmail', template.catValue.get(), template.indexValue.get(), str, function(err){
        if (err) {
				toastr.error("Error Processing Request");
			}
        });
        // to prevent form reload when submitted
		return false;
    }
    
});