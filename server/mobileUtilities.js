/* global SendNotification */
/* global SendSms */
/* global SendEmailOtp */
/* global Push */
/**
 * Created by rakeshkalyankar on 16/07/15.
 */

SendNotification = function (title, text, query, payload) {
    check(title, String);
    check(text, String);
    check(query, Object);
    check(payload, Object);

    var notifications = true;

    if (query.userId) {
        notifications = Meteor.users.findOne({ _id: query.userId }, { fields: { _id: 0, "profile.notifications": 1 } }).profile.notifications;
    }

    if (notifications) {
        Push.debug = true;
        Push.send({
            from: 'Motobite',
            title: title,
            text: text,
            query: query,
            payload: payload
        });
    }
}

SendEmailOtp = function (text, query) {
    check(text, String);
    check(query, {
        user: String,
        index: Number,
        cat: String
    });
    var mmail = "";
    if (query.cat === "emails") {
        mmail = Meteor.users.findOne({ _id: query.user }, { fields: { _id: 0, "emails.address": 1 } }).emails[query.index].address;
    } else if (query.cat === "works") {
        mmail = Meteor.users.findOne({ _id: query.user }, { fields: { _id: 0, "works.emails.address": 1 } }).works.emails[query.index].address;
    } else {
        mmail = null;
    }

    console.log("TODO: send " + mmail + " - " + text);
    Email.send({
       from: "MotoBite Accounts <accounts@motobite.com>",
       to: mmail,
       subject: "MotoBite email verification",
       text: text + "\n\n MotoBite Team"
    });
}

SendSms = function (text, query) {
    check(text, String);
    check(query, {
        user: String,
        index: Number
    });
    var mNum = Meteor.users.findOne({ _id: query.user }, { fields: { _id: 0, "mobile.number": 1 } }).mobile[query.index].number;
    console.log("TODO: send " + mNum + " - " + text);

}