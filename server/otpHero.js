/* global check,Meteor,EmailOtpColl,SmsOtpColl,Match */
/**
 * Created by Admin on 8/10/2015.
 */
 
// create emailotp for user
EmailOtpColl = new Meteor.Collection('emailotp');
// create smsotp for user
SmsOtpColl = new Meteor.Collection('smsotp');

Meteor.methods({
	
	createSmsOtp: function (index) {
		check(this.userId, String);
		check(index, Number);
		var user = this.userId;
		// check if user has already created a sms OTP
		SmsOtpColl.remove({ id: user });
		var post = {
			id: user,
			at: new Date(),
			counter: 0,
			index:index
		}
		// else create a document with TTL and check counter and send it to user's phone
		SmsOtpColl.insert(post, function (error, result) {
			if (error) {
				return "Server Error, Try again!"
			}
			var code = result.substring(1, 7);
			var text = "Your MotoBite app OTP for mobile verification is \"" + code + "\" valid for 30 Minutes";
			var query = { user: user, index: index };
			SendSms(text, query);
		})
	},
	
	createEmailOtp: function (cat,index) {
		check(this.userId, String);
		check(cat, String);
		check(index, Number);
		var user = this.userId;
		// check if user has already created a email OTP
		EmailOtpColl.remove({ id: user });
		var post = {
			id: user,
			at: new Date(),
			counter: 0,
		}
		post[cat] = index;
		// else create a document with TTL and check counter send it to user
		EmailOtpColl.insert(post, function (error, result) {
			if (error) {
				return "Server Error, Try again!"
			}
			var code = result.substring(1,9);
			var text = "Your MotoBite app OTP for Email verification is \"" + code + "\" valid for 60 Minutes";
			var query = { user: user, index: index, cat: cat };
			SendEmailOtp(text, query);
			// Meteor.call('SendEmailOtp', text, query);
		})
		
	},
	
	// verify emailotp for user
	verifyEmailOtp: function (str) {
		check(this.userId, String);
		var NonEmptyString = Match.Where(function (x) {
		  check(x, String);
		  return x.length == 8;
		});
		check(str, NonEmptyString);
		var user = this.userId;
		// check for userId in the emailotp collection
		var codeEm = EmailOtpColl.findOne({ id: user },{fields:{counter:1,emails:1,works:1}});
		// check counter value if exceeded ask to create OTP again
		if (codeEm.counter > 60) {
			Meteor.users.update({ _id: user }, { $set: { "services.resume.loginTokens": [] } });
			throw new Meteor.Error("logged-out",  "The user must be logged in ");
		} else {
			if (codeEm._id.substring(1, 9) == str) {
				// verify the sent code with the document _id
				if (codeEm.hasOwnProperty("emails")) {
					// set the email as verified
					setEmailVerify(user, "emails", codeEm.emails);
				} else if (codeEm.hasOwnProperty("works")) {
					setEmailVerify(user, "works", codeEm.works);
				} else {
					console.log("Bug report");
				}
				EmailOtpColl.remove({ id: user });
			} else {
				EmailOtpColl.update({ id: user }, { $inc: { counter: 1 } });
			}
		}
	},
	
	// verify smsotp for user
	verifySmsOtp: function (str) {
		check(this.userId, String);
		var NonEmptyString = Match.Where(function (x) {
		  check(x, String);
		  return x.length == 6;
		});
		check(str, NonEmptyString);
		var user = this.userId;
		// check for userId in the smsotp collection
		var codeEm = SmsOtpColl.findOne({ id: user },{fields:{counter:1,index:1}});
		// check counter value if exceeded ask to create OTP again
		if (codeEm.counter > 60) { 
			Meteor.users.update({ _id: user }, { $set: { "services.resume.loginTokens": [] } });
			throw new Meteor.Error("logged-out",  "The user must be logged in ");
		} else {
			if (codeEm._id.substring(1, 7) == str) {
				// verify the sent code with the document _id
				// set the number as verified
				setMobileVerify(user, codeEm.index);
				SmsOtpColl.remove({ id: user });
			 } else {
				SmsOtpColl.update({ id: user }, { $inc: { counter: 1 } });
			}
			
		}
		
	}
});

var setEmailVerify = function (user, cat, index) {
	var proj = "", set = {};
	if (cat === "works") {
		proj = "works.emails." + index + ".verified";
	} else if (cat === "emails") {
		proj = "emails."+index+".verified";
	} else {
		return false;
	}
	set[proj] = true;
	Meteor.users.update({ _id: user }, { $set: set });
	return true;
}

var setMobileVerify = function (user, index) {
	var proj = "mobile."+ index + ".verified",
		set = {};
	set[proj] = true;
	Meteor.users.update({ _id: user }, { $set: set });
	return true;
}