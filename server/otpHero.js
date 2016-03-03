/* global check,Meteor,EmailOtpColl,SmsOtpColl,Match, SendEmailOtp, SendSms */
/**
 * Created by Admin on 8/10/2015.
 */

// create emailotp for user
EmailOtpColl = new Meteor.Collection('emailotp');
// create smsotp for user
SmsOtpColl = new Meteor.Collection('smsotp');

Meteor.methods({

    createSmsOtp: function(index) {
        check(this.userId, String);
        check(index, Number);
        const user = this.userId;
        // check if user has already created a sms OTP
        SmsOtpColl.remove({ id: user });
        const post = {
            id: user,
            at: new Date(),
            counter: 0,
            index: index
        };
        // else create a document with TTL and check counter and send it to user's phone
        let docId = SmsOtpColl.insert(post, function(error, result) {
            const code = result.substring(1, 7);
            const text = "Your MotoBite app OTP for mobile verification is \"" + code + "\" valid for 30 Minutes";
            const query = { user: user, index: index };
            SendSms(text, query);
        });
        if (docId) {
            return { type: "success", message: "OTP sent" };
        } else {
            return { type: "error", message: "Server Error, Try again!" };
        }
    },

    createEmailOtp: function(cat, index) {
        check(this.userId, String);
        check(cat, String);
        check(index, Number);
        const user = this.userId;
        // check if user has already created a email OTP
        EmailOtpColl.remove({ id: user });
        const post = {
            id: user,
            at: new Date(),
            counter: 0
        };
        post[cat] = index;
        // else create a document with TTL and check counter send it to user
        let docId = EmailOtpColl.insert(post, function(error, result) {
            const code = result.substring(1, 9);
            const text = "Your MotoBite app OTP for Email verification is \"" + code + "\" valid for 60 Minutes";
            const query = { user: user, index: index, cat: cat };
            SendEmailOtp(text, query);

        });
        if (docId) {
            return { type: "success", message: "OTP sent" };
        } else {
            return { type: "error", message: "Server Error, Try again!" };
        }
    },

    // verify emailotp for user
    verifyEmailOtp: function(str) {
        check(this.userId, String);
        const NonEmptyString = Match.Where(function(x) {
            check(x, String);
            return x.length === 8;
        });
        check(str, NonEmptyString);
        const user = this.userId;
        // check for userId in the emailotp collection
        const codeEm = EmailOtpColl.findOne({ id: user }, { fields: { counter: 1, emails: 1, works: 1 } });
        // check counter value if exceeded ask to create OTP again
        if (codeEm.counter > 60) {
            Meteor.users.update({ _id: user }, { $set: { "services.resume.loginTokens": [] } });
            throw new Meteor.Error("logged-out", "The user must be logged in ");
        } else {
            if (codeEm._id.substring(1, 9) === str) {
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
                return { type: "success", message: "OTP Verified succesfully" };
            } else {
                EmailOtpColl.update({ id: user }, { $inc: { counter: 1 } });
                return { type: "error", message: "Wrong code, Try again!" };
            }
        }
    },

    // verify smsotp for user
    verifySmsOtp: function(str) {
        check(this.userId, String);
        const NonEmptyString = Match.Where(function(x) {
            check(x, String);
            return x.length === 6;
        });
        check(str, NonEmptyString);
        const user = this.userId;
        // check for userId in the smsotp collection
        const codeEm = SmsOtpColl.findOne({ id: user }, { fields: { counter: 1, index: 1 } });
        // check counter value if exceeded ask to create OTP again
        if (codeEm.counter > 60) {
            Meteor.users.update({ _id: user }, { $set: { "services.resume.loginTokens": [] } });
            throw new Meteor.Error("logged-out", "The user must be logged in ");
        } else {
            if (codeEm._id.substring(1, 7) === str) {
                // verify the sent code with the document _id
                // set the number as verified
                setMobileVerify(user, codeEm.index);
                SmsOtpColl.remove({ id: user });
                return { type: "success", message: "OTP Verified succesfully" };
            } else {
                SmsOtpColl.update({ id: user }, { $inc: { counter: 1 } });
                return { type: "error", message: "Wrong code, Try again!" };
            }

        }

    }
});

const setEmailVerify = function(user, cat, index) {
    let proj = "", set = {};
    if (cat === "works") {
        proj = "works.emails." + index + ".verified";
    } else if (cat === "emails") {
        proj = "emails." + index + ".verified";
    } else {
        return false;
    }
    set[proj] = true;
    Meteor.users.update({ _id: user }, { $set: set });
    return true;
};

const setMobileVerify = function(user, index) {
    let proj = "mobile." + index + ".verified",
        set = {};
    set[proj] = true;
    Meteor.users.update({ _id: user }, { $set: set });
    return true;
};