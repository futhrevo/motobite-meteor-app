import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { EmailOtpColl, SmsOtpColl } from './collections/collectionsInit';
import { SendSms, SendEmailOtp } from './mobileUtilities';

const setEmailVerify = function (user, cat, index) {
  let proj = '';
  const set = {};
  if (cat === 'works') {
    proj = `works.emails.${index}.verified`;
  } else if (cat === 'emails') {
    proj = `emails.${index}.verified`;
  } else {
    return false;
  }
  set[proj] = true;
  Meteor.users.update({ _id: user }, { $set: set });
  return true;
};

const setMobileVerify = function (user, index) {
  const proj = `mobile.${index}.verified`;
  const set = {};
  set[proj] = true;
  Meteor.users.update({ _id: user }, { $set: set });
  return true;
};

Meteor.methods({
  createSmsOtp(index) {
    check(this.userId, String);
    check(index, Number);
    const user = this.userId;
        // check if user has already created a sms OTP
    SmsOtpColl.remove({ id: user });
    const post = {
      id: user,
      at: new Date(),
      counter: 0,
      index,
    };
        // else create a document with TTL and check counter and send it to user's phone
    const docId = SmsOtpColl.insert(post, (error, result) => {
      const code = result.substring(1, 7);
      const text = `Your MotoBite app OTP for mobile verification is "${code}" valid for 30 Minutes`;
      const query = { user, index };
      SendSms(text, query);
    });
    if (docId) {
      return { type: 'success', message: 'OTP sent' };
    }
    return { type: 'error', message: 'Server Error, Try again!' };
  },

  createEmailOtp(cat, index) {
    check(this.userId, String);
    check(cat, String);
    check(index, Number);
    const user = this.userId;
        // check if user has already created a email OTP
    EmailOtpColl.remove({ id: user });
    const post = {
      id: user,
      at: new Date(),
      counter: 0,
    };
    post[cat] = index;
        // else create a document with TTL and check counter send it to user
    const docId = EmailOtpColl.insert(post, (error, result) => {
      const code = result.substring(1, 9);
      const text = `Your MotoBite app OTP for Email verification is "${code}" valid for 60 Minutes`;
      const query = { user, index, cat };
      SendEmailOtp(text, query);
    });
    if (docId) {
      return { type: 'success', message: 'OTP sent' };
    }
    return { type: 'error', message: 'Server Error, Try again!' };
  },

    // verify emailotp for user
  verifyEmailOtp(str) {
    check(this.userId, String);
    const NonEmptyString = Match.Where((x) => {
      check(x, String);
      return x.length === 8;
    });
    check(str, NonEmptyString);
    const user = this.userId;
        // check for userId in the emailotp collection
    const codeEm = EmailOtpColl.findOne({ id: user },
        { fields: { counter: 1, emails: 1, works: 1 } });
        // check counter value if exceeded ask to create OTP again
    if (codeEm.counter > 60) {
      Meteor.users.update({ _id: user }, { $set: { 'services.resume.loginTokens': [] } });
      throw new Meteor.Error('logged-out', 'The user must be logged in ');
    } else if (codeEm._id.substring(1, 9) === str) {
                // verify the sent code with the document _id
      if (Object.prototype.hasOwnProperty.call(codeEm, 'emails')) {
                    // set the email as verified
        setEmailVerify(user, 'emails', codeEm.emails);
      } else if (Object.prototype.hasOwnProperty.call(codeEm, 'works')) {
        setEmailVerify(user, 'works', codeEm.works);
      } else {
        console.log('Bug report');
      }
      EmailOtpColl.remove({ id: user });
      return { type: 'success', message: 'OTP Verified succesfully' };
    } else {
      EmailOtpColl.update({ id: user }, { $inc: { counter: 1 } });
      return { type: 'error', message: 'Wrong code, Try again!' };
    }
  },

    // verify smsotp for user
  verifySmsOtp(str) {
    check(this.userId, String);
    const NonEmptyString = Match.Where((x) => {
      check(x, String);
      return x.length === 6;
    });
    check(str, NonEmptyString);
    const user = this.userId;
        // check for userId in the smsotp collection
    const codeEm = SmsOtpColl.findOne({ id: user }, { fields: { counter: 1, index: 1 } });
        // check counter value if exceeded ask to create OTP again
    if (codeEm.counter > 60) {
      Meteor.users.update({ _id: user }, { $set: { 'services.resume.loginTokens': [] } });
      throw new Meteor.Error('logged-out', 'The user must be logged in ');
    } else if (codeEm._id.substring(1, 7) === str) {
                // verify the sent code with the document _id
                // set the number as verified
      setMobileVerify(user, codeEm.index);
      SmsOtpColl.remove({ id: user });
      return { type: 'success', message: 'OTP Verified succesfully' };
    } else {
      SmsOtpColl.update({ id: user }, { $inc: { counter: 1 } });
      return { type: 'error', message: 'Wrong code, Try again!' };
    }
  },
});

